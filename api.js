const fetch = require('node-fetch');
const passwordUtils = require('./utils/password');

class Api {
  constructor(key) {
    this.baseUrl = 'https://drive.api.hscc.bdpa.org/v1'
    this.key = key
  }
   async sendRequest(endpoint, method, data) {
    try {
    var req = await fetch(this.baseUrl+endpoint, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer '+this.key
      }
    })
    var text= await req.text()
    return JSON.parse(text)
  } catch (error) {
    // TODO: handle error
    console.log(error)
  }
  }
  async createUser(username, email, password) {
    // POST to /users with username, email, login key and salt

    // First generate a salt and login key
    const { keyString, saltString } = await passwordUtils.deriveKeyFromPassword(password);

    // Then send the request
    return this.sendRequest('/users', 'POST', {
      username: username,
      email: email,
      key: keyString,
      salt: saltString
    });
  }
}

module.exports = Api;