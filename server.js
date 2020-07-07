require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const data = require('./data.js');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {

  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'unauthorized request'});
  }

  next();
})

app.get('/movie', (req, res) => {
  const { genre, country, avg_vote } = req.query;
  let movies = [...data];

  if(genre) {
    const genreLower = genre.toLowerCase();
    movies = movies.filter(movie => movie.genre.toLowerCase().includes(genreLower));
  }

  if(country) {
    const countryLower = country.toLowerCase();
    movies = movies.filter(movie => movie.country.toLowerCase().includes(countryLower));
  }

  if(avg_vote) {
    movies = movies.filter(movie => movie.avg_vote >= parseFloat(avg_vote))
  }

  res.json(movies);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log('server @ 8000');
});