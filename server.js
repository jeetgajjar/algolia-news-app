require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
})

app.post('/', function (req, res) {
  console.log(req.body.search);
  res.render('index');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})