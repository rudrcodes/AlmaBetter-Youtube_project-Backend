const express = require("express");
const app = require("./app.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const port = 4000;

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "http://localhost:3000/youtube-frontend",
      "https://youtube-project.onrender.com",
      "https://youtube-project-4rkt.onrender.com",
    ],
  })
);

// Connect to DATABASE
//Create a db in your mongodb account

//Enter the mongodb DB connection string here
dotenv.config();

const db_URI = process.env.DbUri;

mongoose.connect(db_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Connected to database  ....."));

// Start Server
app.listen(port, () => console.log(`App listening on port ${port}!`));
