const express = require('express')
const app = express()
const port = 3000

require("dotenv").config();
const Api = require('./api')
var bodyParser = require('body-parser');
const passwordUtils = require('./utils/password');

const api = new Api(process.env.key);

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/", express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.get('/login', async(req, res) => {
  res.render("login")
})

app.get('/signup', async(req, res) => {
  res.redirect('/');
});

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
        return false;
      }
    });
    if(data) {
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
      res.cookie("cookieData", userData);
    
      res.render("dashboard", userData);
    } else {
      res.redirect("/")
    }
  }
});

app.get('/fileSystem', async (req, res) => {
  let userData = cookieDataToObject(req);
  (userData.files) ? console.log(userData.files) : console.log("No Files Exist");
  res.render('fileSystem', userData);
});

app.post('/deleteFile', async (req, res) => {
  console.log("Deleting File");
  let userData = cookieDataToObject(req);
  let username = userData.username;
  let { fileId } = req.body;
  console.log(fileId);
  await api.sendRequest("/filesystem/" + username + "/" + fileId, "DELETE");
  let files = await api.getUserFiles(username);
  userData.files = files.nodes;
  userData.personalFileCount--;
  res.cookie("cookieData", userData);
  res.redirect("/fileSystem");
})
app.post('/createFile', async (req, res) => {
  let userData = cookieDataToObject(req);
  const { fileName, textContent } = req.body;
  let username = userData.username;
  let data = await api.createFile(username, fileName, textContent);
  let fileData = await api.getUserFiles(username);
  userData.files = fileData.nodes;
  userData.personalFileCount = (userData.files) ? userData.files.length : 0;
  res.cookie('cookieData', userData);
  res.redirect('./dashboard');
});

app.get('/delete', async (req, res) => {
  let userData = cookieDataToObject(req);
  api.deleteUser(userData.username);
  res.redirect('/');
})

app.get('/dashboard', async (req, res) => {
  let userData = cookieDataToObject(req);
  res.render('dashboard', userData);
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
      console.log(data);
      return data;
    } else {
      return false;
    }
  });
  if(data) {
    let everyUser = await api.sendRequest('/users', 'GET');
    let totalUsers = everyUser.users.length;

    let userData = data.user;
    let files = await api.getUserFiles(username);
    let nodes = files.nodes;
    let personalFileCount = (nodes) ? nodes.length : 0;

    
    console.log(`You are one of ${totalUsers} users, with ${personalFileCount} files`);
    api.loginUser(correctUsername, password, userData).then(function(data) {
      if(data.success) {
        console.log("Succesful Login");
        userData.totalUsers = totalUsers;
        userData.personalFileCount = personalFileCount;
        userData.password = password;
        let cookieData = userData;
        cookieData.password = "";
        cookieData.salt = "";
        res.cookie("cookieData", cookieData);
        // console.log(req.cookies);
        // console.log(cookieDataToObject(req));
        res.redirect('/dashboard');
      } else {
        console.log("Failure");
      }
    });
  } else {
    res.redirect("/") //This is where the error screen would pop up
  }
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


function cookieDataToObject(req) {
  let formattedData = JSON.parse(JSON.stringify(req.cookies.cookieData));
  return formattedData;
}