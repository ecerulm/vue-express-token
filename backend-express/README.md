

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


# TODO



