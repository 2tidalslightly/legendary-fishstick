//Navigation bar frontend

import {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";                                                //Import link functions

//Navigation bar function
function Navigation() 
{
    const location = useLocation();                                                                             //Get current route function
    const navigate = useNavigate();                                                                             //Get navigation function
    const JWT = sessionStorage.getItem("JWT");                                                                  //Get JWT token from session storage
    const [menuState, changeMenuState] = useState(false);                                                       //Menu state change
    let hamburgerMenu;                                                                                          //Hamburger menu element

    //Logout handler function
    function logoutHandler() 
    {
        sessionStorage.removeItem("JWT");                                                                       //Remove JWT token from session storage
        navigate("/login");                                                                                     //Navigate to login page
    }

    //Change menu visibility function
    function openCloseMenu(){
        changeMenuState(!menuState);                                                                            //Change menu state
    }

    //Render hamburger menu if menu is open
    if (menuState){
        //Session menu options
        if (JWT){
            hamburgerMenu=(
                <div className="d-flex flex-column align-items-end position-absolute mt-3" style={{top:"100%", right:"0%", zIndex: 1000 }}>
                    <Link to="/watchlist" className="btn btn-sm btn-outline-primary mb-2" onClick={() => {
                        if (location.pathname === "/watchlist") {
                            window.location.reload();                                                           //Refresh if already on page
                        }
                        changeMenuState(false);                                                                 //Close menu
                    }}>Watchlist</Link>

                    <Link to="/recommendation" className="btn btn-sm btn-outline-primary mb-2 me-0" onClick={() => {
                        if (location.pathname === "/recommendation") {
                            window.location.reload();                                                           //Refresh if already on page
                        }
                        changeMenuState(false);                                                                 //Close menu
                    }}>Recommendation</Link>

                    <button className="btn btn-sm btn-outline-primary mb-2 me-0" onClick={() => {
                        logoutHandler();                                                                        //Run logout handler
                        changeMenuState(false);                                                                 //Close menu
                    }}>Logout</button>
                </div>
            );
        } 
        //No session menu options
        else{
            hamburgerMenu=(
                <div className="d-flex flex-column align-items-end text-end position-absolute mt-3" style={{top:"100%", right:"0%", zIndex: 1000 }}>
                    <Link to="/register" className="btn btn-sm btn-outline-primary mb-2 me-0" onClick={() => {
                        if (location.pathname === "/register") {
                            window.location.reload();                                                           //Refresh if already on page
                        }
                        changeMenuState(false);                                                                 //Close menu
                    }}>Register</Link>

                    <Link to="/login" className="btn btn-sm btn-outline-primary mb-2 me-0" onClick={() => {
                        if (location.pathname === "/login") {
                            window.location.reload();                                                           //Refresh if already on page
                        }
                        changeMenuState(false);                                                                 //Close menu
                    }}>Login</Link>
                </div>
            );
        }
    }
    return(
        <div className="container mt-4 position-relative">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4 className="mb-0">🎥MovieMatch</h4>
                </div>
                <div className="position-relative">
                    <nav>
                        <button className="btn btn-outline-primary" onClick={openCloseMenu}>☰</button>                                                                                                                                      
                    </nav>
                    {hamburgerMenu}  
                </div>
            </div>
        </div>
    );
}

export default Navigation;                                                                                      //Export navigation bar
