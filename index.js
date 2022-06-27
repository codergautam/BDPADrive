const express = require('express')
const app = express()
const port = 3000

require("dotenv").config();
const Api = require('./api')
var bodyParser = require('body-parser')

const api = new Api(process.env.key);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/", express.static(__dirname + "/public"));

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  api.createUser(username, email, password).then(function(data) {
    if(data.success) {
      res.send("success")
    } else {
      res.send(data.error)
    }
  });
});

app.post('/check', async (req, res) => {
  const { username } = req.body;

  api.getUser(username).then(function(data) {
    if(data.success) {
      res.send(JSON.stringify(data))
    } else {
      res.send(data.error)
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});