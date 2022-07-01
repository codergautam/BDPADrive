const express = require('express')
const app = express()
const port = 3000

require("dotenv").config();
const Api = require('./api')
var bodyParser = require('body-parser');
const passwordUtils = require('./utils/password');

const api = new Api(process.env.key);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get('/login', async(req, res) => {
  res.render("login")
})

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  api.createUser(username, email, password).then(function(data) {
    if(data.success) {
      let userData = data.user;
      console.log(userData);
      console.log("Successs!");
      res.render("dashboard", userData);
    } else {
      console.log("Error...");
      res.send(data.error)
    }
  });
});

app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  // console.log(`Username: ${username}, Password: ${password}`);
  let data = await api.getUser(username).then(function(data) {
    if(data.success) {
      return data;
    } else {
      return;
    }
  });
  let userData = data.user;
  api.loginUser(username, password, userData).then(function(data) {
    if(data.success) {
      console.log("Succesful Login");
      userData.password = password;
      res.render("dashboard", userData);
    } else {
      console.log("Failure");
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

