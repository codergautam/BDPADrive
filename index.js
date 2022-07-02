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


  let successful;
  
  await api.createUser(username, email, password).then(function(data) {
    successful = data.success;
    if(data.success) {
      console.log("Successfully created")
    } else {
      console.log("Error...");
      res.send(data.error)
    }
  });
  
  if(successful) {
    let data = await api.getUser(username).then(function(data) {
      if(data.success) {
        return data;
      } else {
        return;
      }
    });

    let userData = data.user;
    console.log("Successs!");
    
    let everyUser = await api.sendRequest('/users', 'GET');
    let totalUsers = everyUser.users.length;
  
    let files = await api.getUserFiles();
    let nodes = files.nodes;
    let personalFileCount = (nodes) ? nodes.length : 0;
  
    console.log("Success!")
  
    userData.totalUsers = totalUsers;
    userData.personalFileCount = personalFileCount;
    userData.password = password;
  
    res.render("dashboard", userData);
  }
});

app.get('/delete', async (req, res) => {
  const { username } = req.body;
  api.deleteUser(username);
  res.redirect('/');
})

app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  // console.log(`Username: ${username}, Password: ${password}`);
  if(username.includes("@")) {
    correctUsername = await api.findUsernameFromEmail(username);
  } else {
    correctUsername = username;
  }
  
  console.log(correctUsername);

  let data = await api.getUser(correctUsername).then(function(data) {
    if(data.success) {
      return data;
    } else {
      return;
    }
  });
  
  let everyUser = await api.sendRequest('/users', 'GET');
  let totalUsers = everyUser.users.length;

  let userData = data.user;
  let files = await api.getUserFiles;
  let nodes = files.nodes;
  let personalFileCount = (nodes) ? nodes.length : 0;

  
  console.log(`You are one of ${totalUsers} users, with ${personalFileCount} files`);
  api.loginUser(correctUsername, password, userData).then(function(data) {
    if(data.success) {
      console.log("Succesful Login");
      userData.totalUsers = totalUsers;
      userData.personalFileCount = personalFileCount;
      userData.password = password;
      res.render("dashboard", userData);
    } else {
      console.log("Failure");
    }
  });
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
