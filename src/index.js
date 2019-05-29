import express from 'express';

import React from 'react';
import {renderToStringAsync} from 'react-async-ssr';

import {movieDetails, movieReviews} from './data';

import 'isomorphic-fetch';

import createApp from './App2';

const app = express();

app.use(express.static('public'));

const openDocumentHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/index.css">
</head>
<body>
`;

const closeDocumentHTML = `
</body>
</html>
`;

app.use((req, res, next) => {
  const delayMsParam = req.query.delay_ms;
  if (delayMsParam !== undefined) {
    const delayMs = Number(delayMsParam);
    setTimeout(next, delayMs);
  } else {
    next();
  }
});

app.get('/', async (req, res) => {
  res.write(openDocumentHTML);
  const App = createApp(req.query);
  const html = await renderToStringAsync(<App />);
  res.write(html);
  res.write(closeDocumentHTML);
  res.end();
});

app.get('/movies/:id', (req, res) => {
  const id = req.params.id;
  const movie = movieDetails[id];
  if (movie === undefined) {
    res.status(404).json({msg: 'Movie not found.'});
    return;
  }
  res.json(movie);
});

app.get('/movies/:id/reviews', (req, res) => {
  const id = req.params.id;
  const reviews = movieReviews[id];
  if (reviews === undefined) {
    res.status(404).json({msg: 'Movie not found.'});
    return;
  }
  res.json(reviews);
});

app.listen(3000);
