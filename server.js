require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWSAPI_KEY);
const algoliasearch = require("algoliasearch");
const algoliaClient = algoliasearch(process.env.APPLICATIONID, process.env.ALGOLIA_API_KEY);
// const indexer = require('./algolia-index.js');

let index = algoliaClient.initIndex('articles');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
})

app.post('/', function (req, res) {

  let searchItem = req.body.article;
  var todayDate = new Date().toISOString().slice(0,10);
  // buildIndex(pingNewsApi(searchItem, todayDate));
  pingNewsApi(searchItem, todayDate);
  sleep(3000);
  search();
  // console.log(search(searchItem));
  // request(function(err, response, body) {
  //   if(err) {
  //     res.render('index', {article: null, error: "Hmmm, try that again please."})
  //   } else {
  //     let results = JSON.parse(body)
  //   }
  // })
  res.render('index');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

 function pingNewsApi(searchItem, todayDate) {
  newsapi.v2.everything({
    q: searchItem,
    from: '2018-11-15', //Change this date to at most 30 days in the past
    to: todayDate,
    language: 'en',
    sortBy: 'relevancy',
    page: 5
  }).then(response => {
    console.log("DONE PINGING!!!!");
    // console.log(response);
    // indexer.buildIndex(response);
    buildIndex(response)
  });
}


  function search(searchItem, todayDate){
    // var newsApiResponse = pingNewsApi(searchItem, todayDate)
    // var index = buildIndex(newsApiResponse);
    index.search({
      query: 'Adele Peters',
      attributesToRetrieve: ['title', 'url', 'author']
    }, 
    function searchDone(err, content) {
      if (err) {
        console.log('error');
        throw err;
      }
      console.log('no error')
      console.log(content);
    }
  );
}
function buildIndex(response) {  
  //initialize our index of articles
  // let index = algoliaClient.initIndex("articles");

  //config index
  index.setSettings(
    {
      searchableAttributes: ["title",
                              "url",
                              "author"]
    },
    function(err, content) {
      if (err) {
        console.log(err);
      } else {
        console.log(content);
      }
    }
  );

  index.clearIndex(function(err, content) {
    if (err) {
      throw err;
    } else {
      console.log(content);
    }
  });

  index.addObject(response, function(err, content) {
    if (err) {
      console.log(err)
    } else {
      console.log(content);
    }
  })
  
  return index;
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}