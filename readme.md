# Initializing

```js
const clath = require("clath");

let auth = new clath(addFn, setFn, getFn);
```


# Functions
Either do something like this for temporary storage or hook it up to a database
```js
let db = [];

//Called when something is to be added to the database
function addFn(val) { 
  //Gets an object to be added to the database
  db.push(val);
  return;
}

//Called when something is to be changed to the database
function setFn(field, value, nField, nValue) {  
  //Sets field nField of object where (field has value value) to nValue
  //ex. setFn("username", "bob", "salt", "sageeshrhrehr");
  db[index(field, value)][nField] = nValue;
  return;
}

//Called when something is to be fetched from the database
function getFn(field, value) {
  //Gets user where field is value
  //ex. getFn("username", "bob");
  return db[index(field, value)];
}


//Helper to get index of accounts
function index(field, value) {
  return db.indexOf(db.find(elem => (elem[field] == value)));
}
```


# Usage
```js
//Create an account, returns a token
let token = (await auth.create("bob", "123")).res;

//Log into an account, returns a token
let token = (await auth.login("bob", "123")).res;

//Check if credentials are valid, returns a bool
let valid = (await auth.validate("bob", "123")).res;

//Check if token is valid, returns a bool
let valid = (await auth.validateToken("bob", "agewhrehjrt")).res;

//Clears all tokens
await auth.clearTokens("bob");

//Changes password, returns token
let token = (await auth.changePassword("bob", "321")).res;
```