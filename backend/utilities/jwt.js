//JSON web token handler
//IMPORTANT: JWT secret key needs to be generated and stored in JWT_SECRET_KEY environment variable in .env file
//IMPORTANT: JWT secret key can be generated at https://jwtsecrets.com/

const jwt = require("jsonwebtoken");                                                                        //Import Jsonwebtoken for token creation and checking

//Generate JWT function
//Function receives user data as argument, and returns a signed JWT token string using the JWT_SECRET_KEY environment variable
const makeJWT = (userID, email) =>
{
    const JWT = jwt.sign({userID:userID, email:email}, process.env.JWT_SECRET_KEY, {expiresIn:"3d"});       //JWT token expires in 3 days
    return JWT;
};

//Check JWT function
//Function receives token as argument, and returns decoded JWT token string
const checkJWT = (JWT) =>
{
    try
    {
        const decoded = jwt.verify(JWT, process.env.JWT_SECRET_KEY);                                        //Verify JWT token using secret key
        return decoded;                                                                                     //Return decoded token
    }
    catch(error)                                                                                            //Catch error if JWT authentication unsuccessful
    {
        console.error("Unable to authenticate JWT:", error.message);
        return null;
    }
};

module.exports = {makeJWT, checkJWT};                                                                       //Export to provide access to JWT for other components
