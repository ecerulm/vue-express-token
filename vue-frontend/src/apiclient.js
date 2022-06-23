
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API


import {reactive,ref} from 'vue';

export const loggedInStatus = ref(false);
export const counter = ref(0);


export function login(username, password, cb) {
    // TODO use Fetch API to call the API at http://localhost:6000

    const data = { username, password };

    console.log("login() with x-requested-with");

    fetch('http://localhost:4000/api/login', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': "fetch",
        },
        body: JSON.stringify(data),
        credentials: 'omit',
        method: 'POST',
        cache: 'no-store',
    })
        .then(response => response.json())
        .then(data => {
            console.log('login response:', data);
            localStorage.removeItem('authToken')
            if (data.token) {
               localStorage.setItem('authToken', data.token) // we store the token in local storage other api calls will read it
               console.log("authToken set in localStorage to ", localStorage.getItem('authToken'))
            } 
            updateLoggedInStatus()
        })
        .catch((error) => {
            console.log("can't login / clear localStorage");
            console.error('Error:', error);
            localStorage.clear()
        });
}

export function updateLoggedInStatus() {
    console.log('checkLoginStatus')

    const authToken = localStorage.getItem('authToken')
    const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': "fetch",
    }

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
    }

    console.log(headers, headers)

    fetch('http://localhost:4000/api/userinfo',{
        method: 'GET',
        headers,
    })
        .then(response => response.json())
        .then(data => {
            console.log("userinfo response", data);
            loggedInStatus.value = Boolean(data.loggedInStatus)
            counter.value = data.counter;
            console.log('updateLoggerInStatus', loggedInStatus.value)
        })
        .catch(error => {
            console.log("The request to check if the user is logged in or not didn't go through")
        })

}

export function increaseCounter() {
    console.log('increaseCounter')
    const authToken = localStorage.getItem('authToken')
    const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': "fetch",
    }

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
    }

    console.log(headers, headers)

    fetch('http://localhost:4000/api/increaseCounter',{
        method: 'POST',
        headers,
    })
        .then(response => response.json())
        .then(data => {
            console.log("increaseCounter response", data);
            counter.value = data.counter
        })
        .catch(error => {
            console.log("the increaseCounter api call failed")
        })
     
}