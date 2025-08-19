//Login system webpage

import {useEffect, useState} from "react";                              //Import useEffect hook for effects without affecting rendering, and useState React hook for maintaining state between page renders
import {Link, useNavigate} from "react-router-dom";                     //Import useNavigate React-router hook for page redirection
import axios from "axios";                                              //Import Axios for frontend communication with backend

function Login() {
    const [email, setEmail] = useState("");                             //Setter for e-mail
    const [password, setPassword] = useState("");                       //Setter for password
    const [loginStatus, setLoginStatus] = useState("");                 //Setter for displaying login status
    const navigate = useNavigate();                                     //Declare navigate component

    //Button handler function
    const loginHandler = async (event) => {
        event.preventDefault();                                         //Prevent page refresh when submitting
        try {
            setLoginStatus("");                                         //Set login status to empty string
            const response = await axios.post                           //Send login request with email and password
            (
                `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/user/login`,
                {email, password}
            );
            if (response.status === 200)                                //200 status determines that post request has been processed
            {
                sessionStorage.setItem("JWT", response.data.JWT);       //Store JWT token in session storage
                console.log(`${email} successfully logged in.`);
                setLoginStatus("You have successfully logged in.");
                navigate("/recommendation");                            //Redirect to recommendation webpage on successful login attempt
                //console.log("Login response:", response.data);        //Test case for confirming JWT token creation
            }
        }
        catch(error)                                                    //Catch error if issue occurs with backend call
        {
            console.error("Unable to login:", error.message);
            setLoginStatus("ERROR: Your e-mail address or password are invalid.");
        }
    };

    //Function at render
    useEffect(() => {
        document.title = "Login";                                       //Set tab title
    }, []);                                                             //Empty array makes sure function only runs once

    //HTML
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Login</h2>
            <form onSubmit={loginHandler} className="d-flex flex-column align-items-center">
                <div className="mb-3" style={{ width: "100%", maxWidth: "400px" }}>
                    <input
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="E-mail"
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>
                <div className="mb-3" style={{ width: "100%", maxWidth: "400px" }}>
                    <input
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                <div className="d-flex flex-wrap justify-content-center mb-3">
                    <button
                        name="submit"
                        type="submit"
                        className="btn btn-outline-primary mx-2"
                        title="Submit login"
                        style={{ width: "auto" }}
                    >Log In</button>
                </div>
                {loginStatus && (
                    <p className="text-center text-dark">{loginStatus}</p>
                )}
            </form>
            <p className="text-center mt-3 text-dark">
                Not registered? <Link to="/register" style={{textDecoration:"underline"}}>Sign up</Link>
            </p>
        </div>
    );
};

export default Login;                                                   //Export login component