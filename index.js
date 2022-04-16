const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongooseClient = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const multer = require("multer");
const upload = require("./utils/multer");

const app = express();
dotenv.config();

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

mongooseClient.connect(process.env.MONGODB_URL, () => {
  console.log("CONNECTED TO MONGO DB");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(upload.array("image"));

//ROUTES
app.use("/v1/3dview/auth", authRoute);
app.use("/v1/3dview/post", postRoute);

// Catch 404 Errors and forward them to error handler
// app.use((req, res, next) => {
//   const err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// // Error handler function
// app.use((err, req, res, next) => {
//   const error = app.get("env") === "development" ? err : {};
//   const status = err.status || 500;

//   // response to client
//   return res.status(status).json({
//     error: {
//       message: error.message,
//     },
//   });
// });

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
