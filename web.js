const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.post('/', function (req, res) {
  console.log(req.body.arena.state);

  const moves = ['F', 'T', 'L', 'R'];
  res.send(moves[1]);
});

app.listen(process.env.PORT || 8080);
