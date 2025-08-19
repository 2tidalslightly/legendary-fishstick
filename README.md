Installation procedure:
  1.	Clone the repository from GitHub.
  2.	Change directories to the cloned directory.
3.	Database setup:
  a.	Locate “dbsetup.sql” file in root project directory.
  b.	Install and open the latest version of MySQL and MySQL Workbench.
  c.	During the installation process, please note the root user and password created, as these will be used to connect to the database.
  d.	Connect to the MySQL server in MySQL Workbench.
  e.	Select “File” and choose “Open SQL Script” from the drop-down menu, selecting and opening the “dbsetup.sql” file.
  f.	Select the lightning button to run the SQL script to create the database.
4.	Environment variables setup:
  a.	Register for a TMDB API key at: https://www.themoviedb.org/settings/api
  b.	Generate a JWT secret key at: https://jwtsecrets.com/
  c.	Modify the “.env.example” file in the backend folder to contain your TMDB API key, JWT secret key, and adjust any environment variables from default if necessary for your database credentials or application location i.e. localhost, remote, port, etc.
  d.	Rename the “.env.example” file in the backend folder to “.env”.
  e.	Modify the “.env.example” file in the frontend folder, adjusting any environment variables from default if necessary for your application location i.e. localhost, remote, port, etc.
  f.	Rename the “.env.example” file in the frontend folder to “.env”.
5.	Backend setup:
  a.	Change directories to the “./backend” folder.
  b.	Run the “npm install axios bcrypt dotenv express jsonwebtoken mysql2” command to install necessary dependencies.
  c.	Start the server using the “node server.js” command.
6.	Frontend setup:
  a.	Change directories to the “./frontend” folder.
  b.	Run the “npm install axios bootstrap react react-router-dom” command to install necessary dependencies.
  c.	Start the frontend using the “npm start” command.
