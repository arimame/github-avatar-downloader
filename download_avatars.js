var request = require("request");
var token = require("./secrets.js");
var fs = require('fs');
var repoOwner = process.argv[2]
var repoName = process.argv[3]

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      "User-Agent": "request",
      "Authorization": token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var data = JSON.parse(body);
     cb(err, data);
  });
}


function downloadImageByURL(url, filePath) {
  request.get(url)
    .on("erorr", function (err) {
    throw err;
    })
    .on("response", function (response) {
      console.log('Downloading image...');
    })


     .on("end", function () {
      console.log('Download complete.');

  })

    .pipe(fs.createWriteStream(filePath))

}



getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err);
  //console.log("Result:", result);
  for (var i = 0; i < result.length; i++) {
    console.log("Avatar URL: ", result[i].avatar_url);
    downloadImageByURL(result[i].avatar_url, __dirname + "/avatar/" + result[i].login + ".jpeg")
  }

});


