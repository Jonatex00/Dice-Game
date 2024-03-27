import selectors from './selectors.js';
//  Tell users to enter their names
let user1 = '';
let user2 = '';

const startGame = () => {
  selectors.user0El.textContent = user1;
  selectors.user1El.textContent = user2;
  init();
};

const checkAndStartGame = event => {
  event.preventDefault();
  user1 = selectors.firstUserInput.value;
  user2 = selectors.secondUserInput.value;

  const containNonSpaceChar = /\S/.test(user1) && /\S/.test(user2);
  if (
    user1 !== '' &&
    user2 !== '' &&
    containNonSpaceChar &&
    isNaN(user1) &&
    isNaN(user2)
  ) {
    startGame();
    setTimeout(() => {
      selectors.startPlayingHeader.style.display = 'none';
    }, 2000);
  } else {
    alert("Please enter both players' names to start the game.");
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

  // Display updated scores
  selectors.user1ScoreDisplay.textContent = `${user1Score}:`;
  selectors.user2ScoreDisplay.textContent = `${user2Score}`;
};
selectors.form.classList.remove('hidden');
let scores, currentScore, activePlayer, playing;
playing = false;
selectors.main.classList.add('d-hidden');
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
    }
  }
});

selectors.btnHold.addEventListener('click', function () {
  if (playing) {
    selectors.holdSound.play();
    // 1. Add current score to Active player's score
    scores[activePlayer] += currentScore;
    // scores[1] = scores[1] + currentScore

    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    //2. Check if player's score is >= 100
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
    }
  }
});

selectors.btnNew.addEventListener('click', function () {
  if (user1 !== '' && user2 !== '') {
    document.body.style.backgroundImage =
      'linear-gradient(to top left, #753682 0%, #bf2e34 100%)';
    init();
  } else {
    alert("Please enter both players' names to start the game.");
  }
});
