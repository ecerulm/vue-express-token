# What is this project? 

This is just an example for my own reference, based on API in Action by Neil Madden, Chapter 5. Modern Token-Based Authentication.


There are two differnent projects

## Backend API

Implemented in [express](https://expressjs.com). 

The API has the following endpoint

* `/api/login`
* `/api/userinfo`
* `/api/increaseCounter`


The backend uses MongoDB for storing username/password and the token to username mappings 

### Token generation
The `/api/login` check that the username/password matches and generates a token

The token is composed has the following format `randomToken.hmacTag`
* a random 16 bytes encoded as base64url 
* an hmacTag, the HMAC is SHA-256 and uses the environment variable `SECRET` (or can be put on `.env` too)
* the random part and the HMAC tag are separated by a dot `.`

Then it stores the token in MongoDB but without the hmacTag part. 
* This prevents that someone with access to MongoDB could inject 
fake tokens
* The attacker would still wouldn't know to create the hmacTag without the secret key


### Bearer Authentication

The rest of the API checks that there is `Authorization: Bearer XXX` header. 

Then it takes the token out the `Authorization`  and checks 


### CORS

Since the frontend (client) and the backend (API) are in different domains the browser will perform a CORS preflight requests before allowing the actual API request. 

There is express middleware to handle this. It checks the `Origin` header in the preflight request is `http://localhost:3000` (the frontend), and only send the `Access-Control-Allow-Origin` header for that origin. 





## Frontend

The UI that communicates with the API. 
This runs in a different domain than the backend. 

The frontend will call the `/api/login` endpoint and get a token back if the username/password matches 
* it uses the Fetch API fetch() to make the call
* the `token` is stored using the `localStorage.setItem()`
  * Check in the browser > Developer Tools > Storage > Local Storage > localhost > authToken

Then the vue app will use that token stored in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) for
the API requests `/api/userinfo` and `/api/increaseCounter`. 

Most of the interesting code is at [apiclient.js](src/apiclient.js)

The token is put in the http header `Authorization: Bearer xxxx`

# How to run 

You need MongoDB, [Install MongoDB Community Edition on macOS](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)

```
brew install mongodb-community@5.0
mongod --config /opt/homebrew/etc/mongod.conf
```


In another shell run the backend 

``` 
cd backend-express
npm install 
# create a .env file with SECRET="anylongstring"
npm run dev
```

When the backend start it connects to MongoDB `test` database and
deletes the collections `users` and `tokens`.


Then run the frontend in yet another shell

```
cd frontend-vue
npm install
npm run dev 
```



Then 
* Open http://localhost:3000
* Click on the Login button
* Login as username `aaa` and password `bbb`
* click on `increaseCounter`


#  TODO 

* Create Vue NavBar with LoginItem
* Create vue main page with the button for increaseCounter
* return WWW-Authenticate on 401 





# References
* [API Security in Action](https://www.manning.com/books/api-security-in-action) by Neil Madden. Manning Publications
