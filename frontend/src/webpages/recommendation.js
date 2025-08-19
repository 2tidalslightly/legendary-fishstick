//Recommendation system webpage

import {useEffect, useState} from "react";                              //Import useEffect hook for effects without affecting rendering, and useState React hook for maintaining state between page renders
import axios from "axios";                                              //Import Axios for frontend communication with backend

function Recommendation(){
    const [movies,setMovies] = useState([]);                            //Setter for movies object
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);      //Setter for current movie index, for transitioning to next movie in recommendation list
    const [recStatus,setRecStatus] = useState("");                      //Setter for displaying recommendation status

    //Recommendation display function
    const displayRecommendation = async() =>
    {
        const JWT = sessionStorage.getItem("JWT");                      //Retrieve JWT token for use by request
        //console.log(JWT);                                             //Test case for confirming JWT token is defined
        try
        {                                                                                                                                  
            const response = await axios.get                            //Send recommendation request, using JWT token as bearer token
            (
                `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/recommendation`, 
                {headers: {Authorization : `Bearer ${JWT}`}}
            );                                                                                                                                          
            setCurrentMovieIndex(0);
            setMovies(response.data.recommendations);                   //Set movie recommendation list to data returned by response
            setRecStatus("");
        }
        catch(error)                                                    //Catch error if issue occurs with backend call
        {
            console.error("Unable to display recommendation:",error);
            setRecStatus("ERROR: Internal error, unable to display recommendation.");
        }
    };

    //Function at render
    useEffect(() => {
        document.title = "Recommendation";                              //Set tab title
        displayRecommendation();                                        //Call to display movies
    }, []);                                                             //Empty array makes sure function only runs once

    //Function on user input
    //Button handler function
    const buttonHandler = async (status) =>                          
    {
        const JWT = sessionStorage.getItem("JWT");                      //Retrieve JWT token for use by request 
        const movie = movies[currentMovieIndex];                        //Current movie, retrived from movie list at current index
        try {
            await axios.post(                                           //Payload passed to watchlist route contains movieID and status of movie in user's watchlist
                `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/watchlist`,
                {
                    movieID: movie.id,                                  //TMDB ID
                    status: status,                                     //Status type
                },
                {headers: {Authorization: `Bearer ${JWT}`,},}           //Exact "Bearer " syntax followed by JWT is required for headers
            );
        }
        catch (error)                                                   //Catch error if issue occurs with backend call
        {
            console.error("Error updating watchlist:", error);
        }

        if(currentMovieIndex+1 < movies.length)                         //For each button call, iterate movie index if index+1 is less than the size of movie list
        {
            setCurrentMovieIndex(currentMovieIndex+1);
        }
        else
        {
            setRecStatus("Loading movie recommendations...")
            await displayRecommendation();
        }
    }
    const movie = movies[currentMovieIndex];
    if (movies.length === 0) {                                          //Display different status if there is no currently selected movie
        return <p className="text-dark">{recStatus || "Loading recommendations..."}</p>;
    }
    if (currentMovieIndex >= movies.length) {
        return <p className="text-dark">Out of movie recommendations.</p>;
    }

    //HTML
    //Movie data and variable names are being fetched from TMDB
    //Snake case is required by TMDB API
    //Movie release date is sliced at index 10 to prevent inclusion of time in release date
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Recommendation</h2>
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-8 col-sm-8 mb-4">
                    <div className="card h-100">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}}`}
                            alt={movie.title}
                            style={{ objectFit: "cover", maxHeight: "400px" }}
                        />
                        <h3 className="card-title">{movie.title}</h3>
                        <p className="card-title text-dark">Release Date: {movie.release_date?.slice(0, 10) || "N/A"}</p>
                        <p className="card-title text-dark">{movie.overview}</p>
                        <p><a 
                            href={`https://www.themoviedb.org/movie/${movie.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="card-title text-dark"
                            style={{textDecoration:"underline"}}
                        >View on TMDB</a></p>
                        <div className="d-flex flex-wrap justify-content-center">
                            <button
                                className="btn btn-md btn-outline-primary mx-2"
                                onClick={() => buttonHandler("liked")}
                                title="Mark as liked"
                                style={{fontSize:"1rem"}}
                            >👍</button>
                            <button
                                className="btn btn-md btn-outline-primary mx-2"
                                onClick={() => buttonHandler("disliked")}
                                title="Mark as disliked"
                                style={{fontSize:"1rem"}}
                            >👎</button>
                            <button
                                className="btn btn-md btn-outline-primary mx-2"
                                onClick={() => buttonHandler("want to watch")}
                                title="Mark as want to watch"
                                style={{fontSize:"1rem"}}
                            >👀</button>
                            <button
                                className="btn btn-md btn-outline-primary mx-2"
                                onClick={() => setCurrentMovieIndex(currentMovieIndex + 1)}
                                title="Skip to next movie"
                                style={{fontSize:"1rem"}}
                            >➡</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommendation;                                          //Export recommendation component