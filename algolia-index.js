const algoliasearch = require("algoliasearch");
const algoliaClient = algoliasearch(process.env.APPLICATIONID, process.env.ALGOLIA_API_KEY);
const bodyParser = require('body-parser');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWSAPI_KEY);


// function pingNewsApi(searchItem, todayDate) {
//     newsapi.v2.everything({
//       q: searchItem,
//       from: '2018-11-14', //Change this date to at most 30 days in the 
//       to: todayDate,
//       language: 'en',
//       sortBy: 'relevancy',
//       page: 5
//     }).then(response => {
//       console.log("DONE PINGING!!!!");
//       // console.log(response);
//     });
//   }


 function buildIndex(searchItem, todayDate) {
    let articles = pingNewsApi(searchItem, todayDate);
  
    //initialize our index of articles
    let index = algoliaClient.initIndex("articles");
  
    //config index
    index.setSettings(
      {
        searchableAttributes: ["title"]
      },
      function(err, content) {
        if (err) {
          console.log(err);
        } else {
          console.log(content);
        }
      }
    );
  
    index.addObject(articles, function(err, content) {
      if (err) {
        console.log(err)
      } else {
        console.log(content);
      }
    })
    
    return index;
  }

  function search_algolia(searchParams) {

  }

module.exports = {
    buildIndex
  };