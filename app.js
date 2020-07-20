// Middlewares and config
const express = require("express");
const configEnv = require("./config/configEnv");
const logger = require("./helpers/logger");
const cors = require("cors");
const morgan = require('morgan');
const compression = require('compression');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('./socket').init(server);
const mqttInitializer = require('./helpers/mqttController');

app.use(compression());
app.use(cors());
app.use(express.json({ extended: true }));
app.use(morgan('combined'));

// Initialize mqtt connection with broker and sensors
mqttInitializer(io);

// app.use(config.api.prefix, require('./api/routes/index'));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// Error handling purpose
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.statusCode || 500).json({ status: "error", errors: err.data });
});

server.listen(configEnv.port, () => {
  logger.debug(`Server running on port ${configEnv.port}`);
  io.on('connection', () => {
    logger.debug("A user has connected to the socket");
  });
});

