//Recommendation system routing

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

//Get movies of specified status from DB function
async function getMoviesByStatus(userID, status)
{
    const DB = await connectDB();                                                                           //Connect to database
    const SQL = `
        SELECT Movies.TMDBID
        FROM Movies
        INNER JOIN WatchList ON WatchList.movieID = Movies.TMDBID
        WHERE WatchList.accountID = ? AND WatchList.status = ?
    `;
    const [statusMovies] = await DB.query(SQL, [userID, status]);                                           //Run query using parameters
    await DB.end();                                                                                         //Terminate DB connection
    return statusMovies;
}

//Get recommendations from liked movies list function
async function recommendFromList(likedMovies)
{
    const recommendations = [];                                                                             //Recommended movies array                                  
    const uniqueRecommendations = [];                                                                       //Unique recommended movies array

    //Add list of similar movies to records in user's liked movies using TMDB API similar endpoint
    for (const movie of likedMovies) {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.TMDBID}/similar?api_key=${process.env.TMDB_API_KEY}`);
        recommendations.push(...response.data.results);
    }

    //Filter list of similar movies to remove duplicates
    for (const movie of recommendations) {
        if (!uniqueRecommendations.find((index) => index.id === movie.id)) {
            uniqueRecommendations.push(movie);
        }
    }

    return uniqueRecommendations;
}

//Generate recommendations from TMDB popular movies list function
async function recommendFromPopular()
{
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`);
    return response.data.results;
}

//Get endpoint
router.get("/", async (request, response) =>
{
    try {
        const session = JWTAccessConfirm(request);                                                          //Check that JWT token exists
        if (!session) {
            return response.status(401).json({ success: false, message: "Unauthorized session" });          //401 status determines that session is not authenticated
        }

        let recommendations = [];                                                                           //Mutable recommended movies array
        const likedMovies = await getMoviesByStatus(session.userID, "liked");                               //Get liked movies list for user
        const dislikedMovies = await getMoviesByStatus(session.userID, "disliked");                         //Get disliked movies list for user
        const dislikedMoviesIDs = [];                                                                       //Disliked movie TMDB IDs for user
        const filteredRecommendations = [];                                                                 //Filtered recommended movies array to omit disliked movies

        //Filter list of disliked movies by TMDB ID
        for (const movie of dislikedMovies) {
            dislikedMoviesIDs.push(movie.TMDBID);
        }

        //Get recommendations from TMDB popular list if user has no liked movies
        if (likedMovies.length === 0) {
            recommendations = await recommendFromPopular();
        } 
        //Get recommendations from liked movies in user's watchlist
        else {
            recommendations = await recommendFromList(likedMovies);
        }

        //Filter out disliked movies from recommendations
        for (const movie of recommendations) {
            if (!dislikedMoviesIDs.find((index) => index.id === movie.id)) {
                filteredRecommendations.push(movie);
            }
        }

        return response.status(200).json({ recommendations: filteredRecommendations });                     //200 status determines that get request has been processed
    } 
    catch (error) 
    {
        console.error(error.message);
        return response.status(500).send("Unauthorized session or recommendation error.");                  //500 status determines that server encountered an error
    }
});

module.exports = router;                                                                                    //Export route definitions