require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWSAPI_KEY);
const algoliasearch = require("algoliasearch");
const algoliaClient = algoliasearch(process.env.APPLICATIONID, process.env.ALGOLIA_API_KEY);

const index = algoliaClient.initIndex('articles');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
})

app.post('/', function (req, res) {
  let searchItem = req.body.article;
  let todayDate = new Date().toISOString().slice(0,10);

  index.search({
    query: searchItem,
    attributesToRetrieve: ['title', 'url', 'author']
  }, (err, content) => {
    console.log(content);

    res.render('index');
  });
})

newsapi.v2.topHeadlines({ language: 'en', country: 'us' })
  .then( (response) => { return index.addObjects(response.articles); })
  .then( (response) => {
    app.listen(3000, function () {
      console.log('Example app listening on port 3000!')
    })
  })
