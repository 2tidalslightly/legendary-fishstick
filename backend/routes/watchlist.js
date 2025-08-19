//Watchlist system routing

const axios = require("axios");                                                                             //Import axios for TMDB API communication
const express = require("express");                                                                         //Import express for backend
const router = express.Router();                                                                            //Import express router as created router object
const connectDB = require("../utilities/db");                                                               //Import database handler
const {checkJWT} = require("../utilities/jwt");                                                             //Import JWT utility function to check JWT

//JWT token check function
function JWTAccessConfirm(request)
{
    try {
        const authString = request.headers.authorization;                                                   //Get authorization string from header
        const JWT = authString.split(" ")[1];                                                               //Get JWT token string from authorization string
        return checkJWT(JWT);                                                                               //Run JWT utility function to check JWT
    } 
    catch (error)                                                                                           //Handler for unsuccessful JWT extraction
    {
        console.error("Unable to find JWT token:", error.message);
        return null;
    }
}

//Get filtered watchlist by status function
async function getWatchlistByStatus(userID, status)
{
    const DB = await connectDB();                                                                           //Connect to database
    const SQL = `
        SELECT WatchList.movieID, Movies.title, Movies.releaseDate, Movies.imgURL, WatchList.status
        FROM WatchList
        INNER JOIN Movies ON Movies.TMDBID = WatchList.movieID
        WHERE WatchList.accountID = ? AND WatchList.status = ?
    `;
    const [filteredList] = await DB.query(SQL, [userID, status]);                                           //Run query using parameters
    await DB.end();                                                                                         //Terminate DB connection
    return filteredList;
}

//Get full watchlist details function
async function getWatchlist(userID)
{
    const DB = await connectDB();                                                                           //Connect to database
    const SQL = `
        SELECT WatchList.movieID, Movies.title, Movies.releaseDate, Movies.imgURL, WatchList.status
        FROM WatchList
        INNER JOIN Movies ON Movies.TMDBID = WatchList.movieID
        WHERE WatchList.accountID = ?
    `;
    const [watchlist] = await DB.query(SQL, [userID]);                                                      //Run query using parameters
    await DB.end();                                                                                         //Terminate DB connection
    return watchlist;
}

//Check if movie exists or insert from TMDB
async function checkMovieInDB(movieID)
{
    const DB = await connectDB();                                                                           //Connect to database
    const SQL = "SELECT * FROM Movies WHERE TMDBID = ?";                                                    //Generate SQL query to locate movie
    const [movie] = await DB.query(SQL, [movieID]);                                                         //Run query using parameters

    if (movie.length === 0)                                                                                 //Insert movie if not found
    {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${process.env.TMDB_API_KEY}`);
        const { title, release_date, poster_path } = response.data;

        const SQL = `
            INSERT INTO Movies (TMDBID, title, releaseDate, imgURL)
            VALUES (?, ?, ?, ?)
        `;
        await DB.query(SQL, [movieID, title, release_date, poster_path]);                                   //Run query using parameters
    }

    await DB.end();                                                                                         //Terminate DB connection
}

//Remove watchlist entry function
async function removeFromWatchlist(userID, movieID)
{
    const DB = await connectDB();                                                                           //Connect to database
    const SQL = "DELETE FROM WatchList WHERE accountID = ? AND movieID = ?";                                //Generate SQL query to delete entry
    await DB.query(SQL, [userID, movieID]);                                                                 //Run query using parameters
    await DB.end();                                                                                         //Terminate DB connection
}

//Add or update watchlist entry function
async function updateWatchlist(userID, movieID, status)
{ 
    const DB = await connectDB();                                                                           //Connect to database
    const SQL = "SELECT * FROM WatchList WHERE accountID = ? AND movieID = ?";                              //Generate SQL query to locate entry
    const [existing] = await DB.query(SQL, [userID, movieID]);                                              //Run query using parameters

    if (existing.length > 0)                                                                                //Update entry if found
    {
        const SQL = "UPDATE WatchList SET status = ? WHERE accountID = ? AND movieID = ?";
        await DB.query(SQL, [status, userID, movieID]);                                                     //Run query using parameters
    } 
    else                                                                                                    //Insert entry if not found
    {
        const SQL = "INSERT INTO WatchList (accountID, movieID, status) VALUES (?, ?, ?)";
        await DB.query(SQL, [userID, movieID, status]);                                                     //Run query using parameters
    }
    await DB.end();                                                                                         //Terminate DB connection
}

//Delete watchlist record endpoint
router.delete("/:movieID", async (request, response) =>
{
    try {
        const session = JWTAccessConfirm(request);                                                          //Check that JWT token exists
        if (!session) {
            return response.status(401).send("Unauthorized session.");                                      //401 status determines that session is not authenticated
        }

        const { movieID } = request.params;                                                                 //Get movieID from request
        if (!movieID) {
            return response.status(400).send("Missing movieID.");                                           //400 status determines that request is missing required fields
        }
        await removeFromWatchlist(session.userID, movieID);                                                 //Remove entry from watchlist
        return response.status(200).send("Watchlist entry removed.");                                       //200 status determines that delete request has been processed
    } 
    catch (error) 
    {
        console.error(error.message);
        return response.status(500).send("Internal server error.");                                         //500 status determines that server encountered an error
    }
});

//Get full watchlist endpoint
router.get("/", async (request, response) =>
{
    try {
        const session = JWTAccessConfirm(request);                                                          //Check that JWT token exists
        if (!session) {
            return response.status(401).send("Unauthorized session.");                                      //401 status determines that session is not authenticated
        }

        const watchList = await getWatchlist(session.userID);                                               //Get full watchlist for user
        watchList.sort((x, y) => x.title.localeCompare(y.title));                                           //Sort watchlist alphabetically
        return response.status(200).json(watchList);                                                        //200 status determines that get request has been processed
    } 
    catch (error) 
    {
        console.error(error.message);
        return response.status(500).send("Watchlist retrieval error.");                                     //500 status determines that server encountered an error
    }
});

//Get filtered watchlist by status endpoint
router.get("/:status", async (request, response) =>
{
    try {
        const session = JWTAccessConfirm(request);                                                          //Check that JWT token exists
        if (!session) {
            return response.status(401).send("Unauthorized session.");                                      //401 status determines that session is not authenticated
        }

        let watchList = [];                                                                                 //Mutable filtered watchlist array
        const { status } = request.params;                                                                  //Get status from request

        //Get filtered watchlist based on status type
        if (["liked", "disliked", "want to watch"].includes(status)) {
            watchList = await getWatchlistByStatus(session.userID, status);
        } 
        else {
            return response.status(400).send(`Invalid status type: ${status}`);                             //400 status determines that request is missing required fields
        }

        watchList.sort((x, y) => x.title.localeCompare(y.title));                                           //Sort watchlist alphabetically
        return response.status(200).json({ status, watchList });                                            //200 status determines that get request has been processed
    } 
    catch (error) 
    {
        console.error(error.message);
        return response.status(500).send("Unauthorized session or watchlist retrieval error.");             //500 status determines that server encountered an error
    }
});

//Post endpoint to update watchlist
router.post("/", async (request, response) =>
{
    try {
        const session = JWTAccessConfirm(request);                                                          //Check that JWT token exists
        if (!session) {
            return response.status(401).send("Unauthorized session.");                                      //401 status determines that session is not authenticated
        }

        const { movieID, status } = request.body;                                                           //Get movieID and status from request
        if (!movieID || !status) {
            return response.status(400).send("Missing movieID or status.");                                 //400 status determines that request is missing required fields
        }

        await checkMovieInDB(movieID);                                                                      //Ensure movie exists or add it
        await updateWatchlist(session.userID, movieID, status);                                             //Update or insert watchlist entry
        return response.status(200).send("Watchlist updated.");                                             //200 status determines that post request has been processed
    } 
    catch (error) 
    {
        console.error(error.message);
        return response.status(500).send("Internal server error.");                                         //500 status determines that server encountered an error
    }
});

module.exports = router;                                                                                    //Export route definitions