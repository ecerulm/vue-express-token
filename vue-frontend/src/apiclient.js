

export function login(username, password, cb) {
    // TODO use Fetch API to call the API at http://localhost:6000

    const data = { username, password };

    fetch('http://localhost:4000/api/login', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'omit',
        method: 'POST',
        cache: 'no-store',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.log("can't login");
            console.error('Error:', error);
        });

}