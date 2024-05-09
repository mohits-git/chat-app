require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require('./config/connect-db');

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.get('/', (req, res) => {
  res.json({
    message: `Server running at ${PORT}`
  })
});

connectDB().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
});
