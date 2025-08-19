//Registration system webpage

import {useEffect, useState} from "react";                                                                  //Import useEffect hook for effects without affecting rendering, and useState React hook for maintaining state between page renders
import {Link, useNavigate} from "react-router-dom";                                                         //Import useNavigate React-router hook for page redirection
import axios from "axios";                                                                                  //Import Axios for frontend communication with backend

function Register() 
{
    const [email, setEmail] = useState("");                                                                 //Setter for e-mail
    const [password, setPassword] = useState("");                                                           //Setter for password
    const [regStatus, setRegStatus] = useState("");                                                         //Setter for displaying registration status
    const navigate = useNavigate();                                                                         //Declare navigate component

    //Registration handler function
    const registerHandler = async (event) =>
    {
        event.preventDefault();                                                                             //Prevent page refresh when submitting
        try {
            setRegStatus("");                                                                               //Set registration status to empty string
            const response = await axios.post(                                                              //Send registration request with email and password
                `http://${process.env.REACT_APP_HOSTNAME}:${process.env.REACT_APP_PORT}/user/register`,
                { email, password }
            );
            if (response.status === 200)                                                                    //200 status determines that post request has been processed
            {
                console.log(`${email} successfully registered an account.`);
                setRegStatus("You have successfully registered.");                                          //Set success message
                navigate("/login");                                                                         //Redirect to login webpage on successful registration attempt
            }
        }
        catch (error)                                                                                       //Catch error if issue occurs with backend call
        {
            console.error("Unable to register user:", error);
            setRegStatus("ERROR: Your e-mail address or password are invalid, or your e-mail address is already in use.");
        }
    };

    //Function at render
    useEffect(() => {
        document.title = "Register";                                                                        //Set tab title
    }, []);                                                                                                 //Empty array makes sure function only runs once

    //HTML
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Register</h2>
            <form onSubmit={registerHandler} className="d-flex flex-column align-items-center">
                <div className="mb-3" style={{ width: "100%", maxWidth: "400px" }}>
                    <input
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="E-mail"
                        required
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="mb-3" style={{ width: "100%", maxWidth: "400px" }}>
                    <input
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        required
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <div className="d-flex flex-wrap justify-content-center mb-3">
                    <button
                        name="submit"
                        type="submit"
                        className="btn btn-outline-primary mx-2"
                        title="Submit registration"
                        style={{ width: "auto" }}
                    >Sign Up</button>
                </div>
                {regStatus && (
                    <p className="text-center text-dark">{regStatus}</p>
                )}
            </form>
            <p className="text-center mt-3 text-dark">
                Already registered? <Link to="/login" style={{textDecoration:"underline"}}>Log in</Link>
            </p>
        </div>
    );
}

export default Register;                                                                                    //Export registration component
