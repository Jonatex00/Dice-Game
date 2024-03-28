import selectors from './selectors.js';
//  Tell users to enter their names
let user1 = '';
let user2 = '';

const startGame = () => {
  selectors.user0El.textContent = user1;
  loadScoresFromLocalStorage();
  init();
};

const checkAndStartGame = event => {
  event.preventDefault();
  user1 = selectors.firstUserInput.value;

  const containNonSpaceChar = /\S/.test(user1);
  if (user1 !== '' && containNonSpaceChar && isNaN(user1)) {
    startGame();
    setTimeout(() => {
      selectors.startPlayingHeader.style.display = 'none';
    }, 2000);
  } else {
    alert('Please enter players names to start the game.');
  }
};
selectors.startButton.addEventListener('click', checkAndStartGame);

//===== Timer starts here =========
let totalTimeInSeconds = 60;
let timeInterval;
const startTimer = function () {
  timeInterval = setInterval(updateTimer, 1000);
};

const endGame = function () {
  clearInterval(timeInterval);
  saveScoresToLocalStorage();
};

const updateTimer = function () {
  if (totalTimeInSeconds > 0) {
    totalTimeInSeconds--;
    selectors.timer.textContent = `Time: ${totalTimeInSeconds} sec`;
    if (totalTimeInSeconds < 11) {
      selectors.warning.play();
      selectors.timer.style.color = 'red';
    } else {
      selectors.timer.style.color = 'white';
    }
  }
  if (totalTimeInSeconds === 0) {
    selectors.gameOver.classList.remove('hidden');
    // selectors.diceEl.classList.remove('hidden');
    selectors.diceEl.classList.add('hidden');
    selectors.gameOverSound.play();
    endGame();
    document.body.style.backgroundImage =
      'linear-gradient(to top left, #ff2600 0%, #ff0008 100%)';
    playing = false;
  }
};

//==== Display winner =====
let user1Score = 0;
let user2Score = 0;

const declareWinner = function (winner) {
  if (activePlayer === 0 && totalTimeInSeconds > 0) {
    winner = user1;
  } else if (activePlayer === 1) {
    winner = user2;
  } else {
    winner = 'No one';
  }
  selectors.winnerDisplay.textContent = `Winner: ${winner}🥇`;

  if (winner === user1) {
    user1Score++;
  } else {
    user2Score++;
  }
  updateScoresDisplay();
};
// Display updated scores
const updateScoresDisplay = function () {
  selectors.user1ScoreDisplay.textContent = `${user1Score}`;
  selectors.user2ScoreDisplay.textContent = `${user2Score}`;
  updateScoresAndSaveToLocalStorage();
};

window.addEventListener('load', function () {
  loadScoresFromLocalStorage();
});

selectors.form.classList.remove('hidden');
let scores, currentScore, activePlayer, playing;
playing = false;

//Starting conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;
  totalTimeInSeconds = 60;
  selectors.score0El.textContent = 0;
  selectors.score1El.textContent = 0;
  selectors.current0El.textContent = 0;
  selectors.current1El.textContent = 0;
  selectors.user1ScoreDisplay.textContent = `${user1Score}`;
  selectors.user2ScoreDisplay.textContent = `${user2Score}`;
  selectors.form.classList.add('hidden');
  selectors.startPlayingHeader.classList.remove('hidden');
  selectors.diceEl.classList.add('hidden');
  selectors.winner.classList.add('hidden');
  selectors.winnerSound.classList.add('hidden');
  selectors.diceSound.classList.add('hidden');
  selectors.gameOver.classList.add('hidden');
  selectors.player0El.classList.remove('player--winner');
  selectors.player1El.classList.remove('player--winner');
  selectors.player0El.classList.add('player--active');
  selectors.player1El.classList.remove('player--active');
  startTimer();
  updateScoresDisplay();
};
// ====== Active Player ======
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  selectors.holdSound.play();
  currentScore = 0;
  selectors.player0El.classList.toggle('player--active');
  selectors.player1El.classList.toggle('player--active');
};
// ==== Rolling dice functionality ====
selectors.btnRoll.addEventListener('click', function () {
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    selectors.diceEl.classList.remove('hidden');
    selectors.diceEl.src = `dice-${dice}.png`;
    selectors.diceSound.play();

    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
      computerLogic();
    }
  }
});

const computerLogic = function () {
  if (playing && activePlayer === 1) {
    const thresholds = [7, 12, 9, 15, 10, 22, 8];
    const randomIndex = Math.floor(Math.random() * thresholds.length);
    const threshold = thresholds[randomIndex];
    setTimeout(() => {
      const dice = Math.trunc(Math.random() * 6) + 1;
      selectors.diceEl.classList.remove('hidden');
      selectors.diceEl.src = `dice-${dice}.png`;
      selectors.diceSound.play();

      if (dice !== 1) {
        currentScore += dice;
        document.getElementById(`current--${activePlayer}`).textContent =
          currentScore;
        if (currentScore < threshold) {
          computerLogic(); // Continue rolling if below threshold
        } else {
          // Hold the current score
          scores[activePlayer] += currentScore;
          document.getElementById(`score--${activePlayer}`).textContent =
            scores[activePlayer];
          if (scores[activePlayer] >= 50) {
            playing = false; // End the game
            selectors.diceEl.classList.add('hidden');
            selectors.winnerSound.play();
            document
              .querySelector(`.player--${activePlayer}`)
              .classList.add('player--winner');
            selectors.winner.classList.remove('hidden');
            declareWinner(); // Display winner
            endGame();
          } else {
            switchPlayer(); // Switch to the next player
          }
        }
      } else {
        switchPlayer();
      }
    }, 1000);
  }
};

selectors.btnHold.addEventListener('click', function () {
  if (playing && activePlayer === 0) {
    // 1. Add current score to Active player's score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    //2. Check if player's score is >= 20
    if (scores[activePlayer] >= 50) {
      // Finish the game
      playing = false;
      selectors.diceEl.classList.add('hidden');
      selectors.winnerSound.play();

      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');

      selectors.winner.classList.remove('hidden');
      selectors.winnerSound.classList.remove('hidden');
      declareWinner();
      endGame();
    } else {
      //Switch to the next player
      switchPlayer();
      // Execute computer logic after human player's turn
      computerLogic();
    }
  }
});

selectors.btnNew.addEventListener('click', function () {
  if (user1 !== '') {
    document.body.style.backgroundImage =
      'linear-gradient(to top left, #753682 0%, #bf2e34 100%)';
    init();
  } else {
    alert('Please enter players names to start the game.');
  }
});

// Function to save scores to local storage
const saveScoresToLocalStorage = function () {
  localStorage.setItem('user1Score', JSON.stringify(user1Score));
  localStorage.setItem('user2Score', JSON.stringify(user2Score));
};

// Function to load scores from local storage
const loadScoresFromLocalStorage = function () {
  const storedUser1Score = JSON.parse(localStorage.getItem('user1Score'));
  const storedUser2Score = JSON.parse(localStorage.getItem('user2Score'));
  if (storedUser1Score !== null) user1Score = storedUser1Score;
  if (storedUser2Score !== null) user2Score = storedUser2Score;
  if (storedUser1Score !== null || storedUser2Score !== null) {
    updateScoresDisplay();
  }
};
const updateScoresAndSaveToLocalStorage = function () {
  saveScoresToLocalStorage();
};

const clearLocalStorage = function () {
  localStorage.removeItem('user1Score');
  localStorage.removeItem('user2Score');
  user1Score = 0;
  user2Score = 0;
  selectors.user1ScoreDisplay.textContent = '0';
  selectors.user2ScoreDisplay.textContent = '0';
};
selectors.resetScore.addEventListener('click', function () {
  clearLocalStorage();
});
