var express = require("express");
var router = express.Router();
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://jonahtaylor-national-park-service-v1.p.rapidapi.com/people",
  headers: {
    "X-Api-Key": "undefined",
    "X-RapidAPI-Key": "fc5ddf5126msh1d48379b21e9d23p19d5aajsn82e9df5dbeec",
    "X-RapidAPI-Host": "jonahtaylor-national-park-service-v1.p.rapidapi.com",
  },
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });

module.exports = router;
