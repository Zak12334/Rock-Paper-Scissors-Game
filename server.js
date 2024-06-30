const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// For parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Signup route to save user details
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Read users.txt and check if user already exists
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) throw err;

        const users = {};
        data.split('\n').forEach(line => {
            const [uname, pwd] = line.split(',');
            users[uname] = pwd;
        });

        if (users[username]) {
            res.status(400).send('Account already exists!');
        } else {
            // Append new user details to users.txt
            fs.appendFile('users.txt', `${username},${password}\n`, (err) => {
                if (err) throw err;
                res.status(200).send('Account created successfully!');
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
