require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

//CORS Policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

//Initializing Passport
app.use(passport.initialize());
//passport template
require("./config/passport");

//Routes
app.use("/auth", userRoutes);

//Setting up database and backend Server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MongoDB Connected and Connection started at ${PORT}`);
      console.log(`Local -> http://localhost:${PORT}`);
      console.log(`Client Origin -> ${process.env.CLIENT_ORIGIN}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
