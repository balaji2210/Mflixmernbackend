const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const app = express();

const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");
const bannerRoutes = require("./routes/banner");

app.use(express.json({ limit: "50mb" }));
app.use(morgan("tiny"));
app.use(cors());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1", userRoutes);
app.use("/api/v1", movieRoutes);
app.use("/api/v1", bannerRoutes);

module.exports = app;
