const express = require('express');
const apiRoute = express();

apiRoute.use("/user", require("./userRoute"));

module.exports = apiRoute;
