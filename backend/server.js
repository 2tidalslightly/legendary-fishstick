//Server driver
//npm install express cors dotenv mysql2 bcrypt jsonwebtoken axios bootstrap
//IMPORTANT: Verify .gitignore file is added in backend folder, with .env file added to file, to prevent uploading gitignore data to GitHub
//IMPORTANT: Follow .env configuration instructions in utilities/jwt.js and db.js files

const express = require("express");                                                                         //Import Express for backend
const cors = require("cors");                                                                               //Import Cors for react requests
const dotenv = require("dotenv");                                                                           //Import Dotenv for environment variables to keep passwords and keys separate from source code
dotenv.config();

const app = express();                                                                                      //Establish server
app.use(express.json());                                                                                    //Parse incoming requests
app.use(cors());                                                                                            //Interaction with react
app.use("/recommendation", require("./routes/recommendation"));                                             //Configure path to recommendation route definitions
app.use("/user", require("./routes/user"));                                                                 //Configure path to user route definitions
app.use("/watchlist", require("./routes/watchlist"));                                                       //Configure path to watchlist route definitions


const port = process.env.APP_PORT;                                                                          //Get port from .env file
//Try-catch block for handling server running or failing to run
try
{         
    console.log(`Attempting to run server on port ${port}...`);                                                 
    app.listen(port,() => {console.log(`Successfully running server on port ${port}.`)});                   //Try listening for server running on .env port  
}
catch(error){
    console.error("Unable to run server:",error.message);                                                   //Catch error if issue occurs when starting server
    process.exit(1);                                                                                        //Terminate process
};