const crypto = require('crypto');

class clath {
  constructor(dbAdd, dbSet, dbGet) {
    this.dbAdd = dbAdd;
    this.dbSet = dbSet;
    this.dbGet = dbGet;
  }

  async create(username, password) {
    let user = await this.dbGet("username", username);
    if (user) return {res: null, err: "User already exists"}

    let salt = getSalt();
    let hash = getHash(password + salt);
    let token = await this.createToken(salt);
    await this.dbAdd({
      username: username,
      password: hash,
      salt: salt,
      tokens: [token.hashed]
    });
    return {res: token.token, err: null};
  }

  async login(username, password) {
    let user = await this.dbGet("username", username);
    let valid = (await this.validate(username, password)).res;

    if (!valid) return {res: null, err: "Incorrect password"};

    let token = await this.createToken(user.salt);
    await this.dbSet("username", username, "tokens", [...user.tokens, token.hashed]);


    return {res: token.token, err: null};
  }


  async validate(username, password) {
    let user = await this.dbGet("username", username);
    if (!user) return {res: false, err: "User does not exist"}

    let salt = user.salt;
    let hash = getHash(password + salt);

    if (user.password != hash) return {res: false, err: "Incorrect password"};

    return {res: true, err: null};
  }

  async validateToken(username, token) {
    let user = await this.dbGet("username", username);
    if (!user) return {res: false, err: "User does not exist"}
    let hashedToken = getHash(token + user.salt);

    if (!user.tokens.find(elem => (elem == hashedToken))) return {res: false, err: null}
    return {res: true, err: null};
  }


  async clearTokens(username) {
    await this.dbSet("username", username, "tokens", []);
    return {res: true, err: null}
  }

  async changePassword(username, password) {
    let user = await this.dbGet("username", username);
    if (!user) return {res: null, err: "User does not exist"};

    let hash = getHash(password + user.salt);

    await this.dbSet("username", username, "password", hash);
    return {res: null, err: null}
  }


  async createToken(salt) {
    let token = getToken();
    let hashed = getHash(token + salt);

    return {token: token, hashed: hashed};
  }
}
function getToken() {
  return crypto.randomBytes(32).toString('base64');
}
function getSalt() {
  return crypto.randomBytes(32).toString('base64');
}
function getHash(input) {
  return crypto.createHash('sha256').update(input).digest('base64');
}







module.exports = clath;