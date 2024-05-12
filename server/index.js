require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookiesParser = require("cookie-parser");
const { app, server } = require("./socket")

const connectDB = require('./config/connect-db');
const router = require("./routes");

//const app = express(); // express app is created from socket/index.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookiesParser());

app.get('/', (req, res) => {
  res.json({
    message: `Server running at ${PORT}`
  })
});

app.use('/api', router)

connectDB().then(() => {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
});
