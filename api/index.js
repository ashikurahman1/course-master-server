const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;

// midleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.get('/', (req, res) => {
      res.send({ message: 'The data is loading...' });
    });

    app.listen(port, () => {
      console.log(`Course Master is Running on port ${port}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
