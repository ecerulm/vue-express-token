# API endpoints

* POST /api/reset
  * Create the users in the MongoDB. 
  * This wouldn't exist in a real app
* POST /api/login
  * get the username / password in the JSON body
  * return the token in JSON payload
  * the client should store the returned token in localStorage/sessioStorage
* /api/status
* /api/userinfo
  * accesible with and without `Authorization: Bearer xxxx` 
  * tells the client if it's authenticated or not 
* /api/increaseCounter
  * 


# Generate a secret and put it in .env 
```
cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9$./,:' | fold -w 32 | head -n 1
xxxdhydyfsdfsdfs

cat .env
SECRET="xxxdhydyfsdfsdfs"
```


#Test the API

```

curl -s -X POST http://localhost:6000/api/reset
{
  "message": "users created"
}


cat test.json | jq . 
{
  "username": "aaa",
  "password": "bbb"
}


curl -s -X POST -H 'Content-Type: application/json' -d @test.json http://localhost:6000/api/login|jq -r .token
xxxxxxxx:zzzz

curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer xxxxxxxx:zzzz' http://localhost:6000/api/userinfo|jq . 
{
  "loggedInStatus": true,
  "username": "aaa"
}

curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer xxxxxxxx:zzzz' http://localhost:6000/api/increaseCounter|jq . 
{
  "counter": 6
}

```


# Notes

* `X-Requested-With` is required to prevent cross-origin requests 
* 

# TODO

* CORS 
 * allow from origin localhost:3000 only
* Check X-Requested-With is present ()


