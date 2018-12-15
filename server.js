require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWSAPI_KEY);
const algoliasearch = require("algoliasearch");
const algoliaClient = algoliasearch(process.env.APPLICATIONID, process.env.ALGOLIA_API_KEY);

const TAGS = [ 'technology', 'business' ];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
})

app.post('/', function (req, res) {
  const tag = "business";
  const searchItem = req.body.article;
  const index = algoliaClient.initIndex(tag);

  index.search({
    query: searchItem,
    attributesToRetrieve: ['title', 'url', 'author', 'content']
  }).then( (content) => {
    res.render('index', { articles: content });
  });
})

let clearIndexes = () => {
  return Promise.all(TAGS.map( (tag) => {
    const index = algoliaClient.initIndex(tag);
    return index.clearIndex();
  }));
};

let buildIndexes = () => {
  return Promise.all(TAGS.map( (tag) => {
    const index = algoliaClient.initIndex(tag);

    return newsapi.v2.topHeadlines({ category: tag, language: 'en', country: 'us', pageSize: 100 })
      .then( (response) => { return index.addObjects(response.articles); })
  }));
};

clearIndexes()
  .then( (response) => { return buildIndexes(); } )
  .then( (response) => {
    app.listen(3000, function () {
      console.log('Example app listening on port 3000!')
    })
  })
