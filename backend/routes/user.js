//Registration and login system routing

const express = require("express");                                                                         //Import express for backend
const router = express.Router();                                                                            //Import express router as created router object
const bcrypt = require("bcrypt");                                                                           //Import bcrypt for password hashing and salting
const connectDB = require("../utilities/db");                                                               //Import database handler function
const {makeJWT} = require("../utilities/jwt");                                                              //Import JWT utility function to generate JWT

//Registration function
router.post("/register", async (request, response) => 
{
    const { email, password } = request.body;
    if (!email || !password) return response.status(400).send("Invalid email or password.");                //400 status determines that request is missing required fields

    try                                                                                                     //Handler for successful or unsuccessful password hashing
    {
        const salt = await bcrypt.genSalt(10);                                                              //Generate 10 salting rounds
        const hashedPassword = await bcrypt.hash(password, salt);                                           //Attempt to hash password using salt variable
        const DB = await connectDB();                                                                       //Connect to database
        const SQL = "INSERT INTO Users (email, passwordHash) VALUES (?, ?)";                                //Generate SQL query to insert user into users table
        await DB.query(SQL, [email, hashedPassword]);                                                       //Run query using parameters
        await DB.end();                                                                                     //Terminate DB connection
        console.log(`${email} successfully registered an account.`);
        return response.status(200).json({ success: true, message: "Registration successful." });           //200 status determines that post request has been processed
    }
    catch (error) 
    {
        await DB.end();                                                                                     //Terminate DB connection
        console.error("Unable to register user:", error.message);
        return response.status(500).json({ success: false, message: "Internal server error." });            //500 status determines that server encountered an error
    }
});

//Login function
router.post("/login", async (request, response) => 
{
    const email = request.body.email;                                                                       //E-mail and password from request
    const password = request.body.password;

    try                                                                                                     //Handler for successful or unsuccessful query reading from table
    {
        const DB = await connectDB();                                                                       //Connect to database
        const SQL = "SELECT * FROM Users WHERE email = ?";                                                  //Generate SQL query to locate user account
        const [record] = await DB.query(SQL, [email]);                                                      //Run query using parameters
        await DB.end();                                                                                     //Terminate DB connection

        if (record.length === 0)                                                                            //Account not found error
        {
            console.error("Unable to locate user in database.");
            return response.status(401).json({success: false, message: "Error locating account." });        //401 status determines that session is not authenticated
        }

        const user = record[0];
        const validPassword = await bcrypt.compare(password, user.passwordHash);                            //Handler for successful or unsuccessful password entry

        if (!validPassword)                                                                                 //Invalid password error
        {
            console.error(`Unable to log in account ${email}: incorrect password provided.`);
            return response.status(401).json({success: false, message: "Incorrect password provided." });   //401 status determines that session is not authenticated
        }

        console.log(`${email} successfully logged in.`);
        const JWT = makeJWT(user.userID, user.email);                                                       //Valid password creates JWT token
        //console.log("Generated JWT token:", JWT);                                                         //Test case for confirming JWT token creation
        return response.status(200).json({ success: true, JWT });                                           //200 status determines that post request has been processed
    }
    catch (error)
    {
        await DB.end();                                                                                     //Terminate DB connection
        console.error("Unable to login:", error.message);
        return response.status(500).json({success: false, message: "Login database error." });              //500 status determines that server encountered an error
    }
});

module.exports = router;                                                                                    //Export route definitions
