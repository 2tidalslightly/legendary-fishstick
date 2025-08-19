### MovieMatch

My capstone project is MovieMatch, a movie watchlist and recommendation application. Users can register for an account, login, track movies they liked, disliked, or want to watch, and receive recommendations for other movies they may want to watch based on that data.

I was motivated to pursue this project after using other movie watchlist and book reading list applications that I found were simple to use but were often either limited in functionality beyond tracking watched movies or tracking read books or contained advertisements that made the application too inconvenient to use.

I took inspiration from similar swipe or button scrolling applications such as TikTok or Pinterest and wanted to combine the engaging content recommendation functions of those applications with a system that allowed users to track what movies they have seen and receive recommendations for movies they may want to watch.

I wanted to design something that was free to use and open-source, as I prefer using applications authored by the open-source community. I also wanted to design something that could easily be hosted as a personal instance.

### Installation procedure:

1. Clone the repository from GitHub.  
2. Change directories to the cloned directory.  
3. Database setup:  
    - a. Locate “dbsetup.sql” file in root project directory.  
    - b. Install and open the latest version of MySQL and MySQL Workbench.  
    - c. During the installation process, please note the root user and password created, as these will be used to connect to the database.  
    - d. Connect to the MySQL server in MySQL Workbench.  
    - e. Select “File” and choose “Open SQL Script” from the drop-down menu, selecting and opening the “dbsetup.sql” file.  
    - f. Select the lightning button to run the SQL script to create the database.  
4. Environment variables setup:  
    - a. Register for a TMDB API key at: https://www.themoviedb.org/settings/api  
    - b. Generate a JWT secret key at: https://jwtsecrets.com/  
    - c. Modify the “.env.example” file in the backend folder to contain your TMDB API key, JWT secret key, and adjust any environment variables from default if necessary for your database credentials or application location i.e. localhost, remote, port, etc.  
    - d. Rename the “.env.example” file in the backend folder to “.env”.  
    - e. Modify the “.env.example” file in the frontend folder, adjusting any environment variables from default if necessary for your application location i.e. localhost, remote, port, etc.  
    - f. Rename the “.env.example” file in the frontend folder to “.env”.  
5. Backend setup:  
    - a. Change directories to the “./backend” folder.  
    - b. Run the “npm install axios bcrypt dotenv express jsonwebtoken mysql2” command to install necessary dependencies.  
    - c. Start the server using the “node server.js” command.  
6. Frontend setup:  
    - a. Change directories to the “./frontend” folder.  
    - b. Run the “npm install axios bootstrap react react-router-dom” command to install necessary dependencies.  
    - c. Start the frontend using the “npm start” command.
