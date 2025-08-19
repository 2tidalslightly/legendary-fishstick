//Watchlist system webpage

import {useEffect, useState} from "react";                              //Import useEffect hook for effects without affecting rendering, and useState React hook for maintaining state between page renders
import axios from "axios";                                              //Import Axios for frontend communication with backend

function Watchlist() {
    const [movies, setMovies] = useState([]);                           //Setter for movies object
    const [filterStatus, setFilterStatus] = useState("");               //Setter for current filter status
    const [watchStatus, setWatchStatus] = useState("");                 //Setter for displaying watchlist status

    //Watchlist display function
    const displayWatchlist = async (status = "") =>
    {
        const JWT = sessionStorage.getItem("JWT");                      //Retrieve JWT token for use by request
        //console.log(JWT);                                             //Test case for confirming JWT token is defined
        try
        {
            const endpoint = status                                     //Retrieve filtered watchlist if status is defined, else full watchlist if status is undefined
                ? `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/watchlist/${status}`
                : `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/watchlist`;

            const response = await axios.get                            //Send watchlist request, using JWT token as bearer token
            (
                endpoint,
                {headers: {Authorization: `Bearer ${JWT}`}}
            );
            setMovies(response.data.watchList || response.data);        //Set current watchlist to data returned by response
            setWatchStatus("");
        }
        catch(error)                                                    //Catch error if issue occurs with backend call
        {
            console.error("Unable to display watchlist:", error);
            setWatchStatus("ERROR: Internal error, unable to display watchlist.");
        }
    };

    //Function at render
    useEffect(() => {
        document.title = "Watchlist";                                   //Set tab title
        displayWatchlist();                                             //Call to display movies
    }, []);                                                             //Empty array makes sure function only runs once

    //Function on user input
    //Button handler function
    const buttonHandler = async (movieID, status) =>
    {
        const JWT = sessionStorage.getItem("JWT");                      //Retrieve JWT token for use by request
        try
        {
            if (status === "removed")                                   //If status is "removed", send delete request to backend to delete movie from watchlist
            {
                await axios.delete(
                    `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/watchlist/${movieID}`,
                    {headers: {Authorization: `Bearer ${JWT}`}}
                );
            }
            else                                                        //If status any other status than delete, send post request to backend to modify movie in watchlist
            {
                await axios.post(
                    `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/watchlist`,
                    {
                        movieID: movieID,                               //TMDB ID
                        status: status,                                 //Status type
                    },
                    {headers: {Authorization: `Bearer ${JWT}`}}
                );
            }
            await displayWatchlist(filterStatus);                       //Refresh watchlist after update
        }
        catch(error)                                                    //Catch error if issue occurs with backend call
        {
            console.error("Error updating watchlist:", error);
        }
    };

    //Filter button handler function
    const filterHandler = async (status) =>
    {
        setFilterStatus(status);                                        //Set filter status
        await displayWatchlist(status);                                 //Display watchlist filtered fo r status
    };

    //HTML
    //Movie data and variable names are being fetched from Watchlist endpoint from SQL database Movies table
    //Camel case is required by Watchlist endpoint
    //Movie release date is sliced at index 10 to prevent inclusion of time in release date
    //Show all movies button submits blank string to endpoint, retrieving entire watchlist, other buttons submits status strings to endpoint, retriving filtered watchlists
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Watchlist</h2>
            <div className = "d-flex flex-wrap mb-4 justify-content-center">
                <button 
                    className = "btn btn-outline-primary mx-2" 
                    style={{width:"auto"}}onClick={() => filterHandler("")} 
                    title="Show all movies"
                >Show All {filterStatus === "" && "(selected)"}</button>
                <button 
                    className = "btn btn-outline-primary mx-2" 
                    onClick={() => filterHandler("liked")} 
                    title="Show liked movies"
                >Show Liked {filterStatus === "liked" && "(selected)"}</button>
                <button 
                    className = "btn btn-outline-primary mx-2" 
                    onClick={() => filterHandler("disliked")}
                    title="Show disliked movies"
                >Show Disliked {filterStatus === "disliked" && "(selected)"}</button>
                <button 
                    className = "btn btn-outline-primary mx-2" 
                    onClick={() => filterHandler("want to watch")} 
                    title="Show want to watch movies"
                >Show Want to Watch {filterStatus === "want to watch" && "(selected)"}</button>
            </div>
            {movies.length === 0 ? (<div className="container mt-3">{watchStatus || "You do not have any movies assigned to this status filter."}</div>)
            :(<div className ="row">
                {movies.map((movie, index) => (
                    <div className="col-lg-4 col-md-4 col-sm-6 mb-4" key={index}>
                        <div className = "card h-100">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.imgURL}`} alt={movie.title} style={{objectFit:"cover", maxHeight:"400px"}}/>
                            <h3 className="card-title">{movie.title}</h3>
                            <p className="card-title text-dark">Release Date: {movie.releaseDate?.slice(0, 10) || "N/A"}</p>
                            <p className="card-title text-dark">Status: {movie.status}</p>
                            <p><a 
                                href={`https://www.themoviedb.org/movie/${movie.movieID}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="card-title text-dark"
                                style={{textDecoration:"underline"}}
                            >View on TMDB</a></p>
                            <div className="d-flex flex-wrap justify-content-center">
                                <button 
                                    className = "btn btn-md btn-outline-primary mx-2" 
                                    onClick={() => buttonHandler(movie.movieID, "liked")} 
                                    title="Mark as liked" 
                                    style={{fontSize:"1rem"}}
                                >👍</button>
                                <button 
                                    className = "btn btn-md btn-outline-primary mx-2" 
                                    onClick={() => buttonHandler(movie.movieID, "disliked")} 
                                    title="Mark as disliked" 
                                    style={{fontSize:"1rem"}}
                                >👎</button>
                                <button 
                                    className = "btn btn-md btn-outline-primary mx-2" 
                                    onClick={() => buttonHandler(movie.movieID, "want to watch")} 
                                    title="Mark as want to watch" 
                                    style={{fontSize:"1rem"}}
                                >👀</button>
                                <button 
                                    className = "btn btn-md btn-outline-primary mx-2" 
                                    onClick={() => buttonHandler(movie.movieID, "removed")} 
                                    title="Remove from watchlist" 
                                    style={{fontSize:"1rem"}}
                                >❌</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default Watchlist;                                               //Export watchlist component