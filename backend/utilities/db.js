//Database handler
//IMPORTANT: Database needs to be created in mySQL CLI or in mySQL Workbench
//IMPORTANT: Database credentials need to be stored in DB_NAME, DB_PASSWORD, DB_USER environment variables in .env file

const mysql = require("mysql2/promise");                                    //Import mySQL for database updates

//Database access
//Database was migrated to a promise-based setup for async/await access, from callbacks, due to JWT token receipt issue at JWT checking step
async function connectDB()
{
    try
    {
        const DB = await mysql.createConnection({
        host: process.env.APP_HOSTNAME,                                     //Define database hostname/location
        user: process.env.DB_USER,                                          //Define mySQL database username
        password: process.env.DB_PASSWORD,                                  //Define mySQL database password
        database: process.env.DB_NAME                                       //Define database name in mySQL
        });

        console.log("Successfully queried database.");                      //Send console log when database is accessed
        return DB;
    }
    catch(error)                                                            //Catch error if database connection unsuccessful
    {
        console.error("Unable to connect to database:", error.message);
    }
}

module.exports = connectDB;                                                 //Export to provide access to DB connection for other components