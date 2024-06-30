// Initialization of scores and user-related variables
let playerScore = 0;
let computerScore = 0;
const maxScore = 10;  // Define the max score to determine when the game ends
let currentUser = null;  // Store the logged in user information

// DOM elements selection for game functionality
const choices = document.querySelectorAll('.choice');
const resultDisplay = document.getElementById('result');
const authContainer = document.getElementById('auth-container');
const gameContainer = document.getElementById('container');
const playGameBtn = document.getElementById('playGameBtn');

// Create and style the restart game button
const restartGameBtn = document.createElement('button');
restartGameBtn.innerText = 'Restart Game';
restartGameBtn.style.display = 'none';
gameContainer.appendChild(restartGameBtn);
restartGameBtn.style.margin = '20px auto'; 
restartGameBtn.style.textAlign = 'center';

// Event listener to reset game on restart button click
restartGameBtn.addEventListener('click', function() {
    playerScore = 0;
    computerScore = 0;
    resultDisplay.innerText = '';
    document.getElementById('score').innerText = `Player: 0 | Computer: 0`;
    enableChoices();
    restartGameBtn.style.display = 'none'; 
});

// Function to show or hide authentication container
function toggleAuthContainer(show) {
    authContainer.style.display = show ? 'block' : 'none';
}

// Check if a user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Event listener to begin the game or show login screen based on user's authentication status
playGameBtn.addEventListener('click', function() {
    if (isLoggedIn()) {
        document.getElementById('game').style.display = 'block';
        playGameBtn.style.display = 'none';
    } else {
        toggleAuthContainer(true);
    }
});

// Fetch user credentials from an external file
function fetchUsersFromFile() {
    return fetch('users.txt')
        .then(response => response.text())
        .then(text => {
            const users = {};
            text.split('\n').forEach(line => {
                const [username, password] = line.split(',');
                users[username] = password;
            });
            return users;
        });
}

// Login function using fetched users
function login() {
    const loginUsername = document.getElementById('login-username').value;
    const loginPassword = document.getElementById('login-password').value;
    const loginMessage = document.getElementById('login-message');
  
    fetchUsersFromFile().then(users => {
        if (users[loginUsername] && users[loginUsername] === loginPassword) {
            currentUser = { username: loginUsername };
            resultDisplay.innerHTML = `Welcome back, ${currentUser.username}!`;
            toggleAuthContainer(false);
            document.getElementById('game').style.display = 'block';
            playGameBtn.style.display = 'none';
        } else if (users[loginUsername]) {
            loginMessage.innerText = 'Wrong password!';
        } else {
            loginMessage.innerText = 'You need to make an account first!';
        }
    });
}

// Signup function
function signup() {
    const signupUsername = document.getElementById('signup-username').value;
    const signupPassword = document.getElementById('signup-password').value;
    const signupMessage = document.getElementById('signup-message');

    fetchUsersFromFile().then(users => {
        if (users[signupUsername]) {
            signupMessage.innerText = 'Account already exists!';
        } else {
            currentUser = { username: signupUsername };
            toggleAuthContainer(false);
            document.getElementById('game').style.display = 'block';
            playGameBtn.style.display = 'none';
        }
    });
}

// Game functionality: listening to user's choice and processing the game round
choices.forEach(choice => {
    choice.addEventListener('click', () => {
        const userChoice = choice.alt.toLowerCase();
        const computer = computerChoice();
        const result = getResult(userChoice, computer);
        resultDisplay.innerHTML = `You chose ${userChoice}. Computer chose ${computer}. Result: ${result}`;
        updateScore(result);
    });
});

// Computer's choice function
function computerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

// Enable player's choices
function enableChoices() {
    choices.forEach(choice => {
        choice.style.pointerEvents = 'auto';
    });
}

function updateScore(result) {
    if (result === 'You win!') {
        playerScore++;
    } else if (result === 'Computer wins!') {
        computerScore++;
    }

    const scoreDisplay = document.getElementById('score');
    // Displaying the username instead of the generic term 'Player'
    scoreDisplay.innerHTML = `${currentUser.username}: ${playerScore} | Computer: ${computerScore}`;

    if (playerScore === maxScore) {
        resultDisplay.innerHTML = `Congratulations ${currentUser.username}! You win the game!`;
        disableChoices();
        restartGameBtn.style.display = 'block';
    } else if (computerScore === maxScore) {
        resultDisplay.innerHTML = 'Computer wins the game!';
        disableChoices();
        restartGameBtn.style.display = 'block';
    }
}
// Disable player's choices
function disableChoices() {
    choices.forEach(choice => {
        choice.style.pointerEvents = 'none';
    });
}

// Determine the result based on the choices of the player and the computer
function getResult(user, computer) {
    user = user.toLowerCase();
    if (user === computer) return "It's a tie!";
    if (user === 'rock') return computer === 'scissors' ? 'You win!' : 'Computer wins!';
    if (user === 'paper') return computer === 'rock' ? 'You win!' : 'Computer wins!';
    if (user === 'scissors') return computer === 'paper' ? 'You win!' : 'Computer wins!';
}
