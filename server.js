const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
})

app.post('/', function (req, res) {
  res.render('index');
  console.log(req.body.article);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})