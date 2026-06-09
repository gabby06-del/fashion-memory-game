// FASHION MEMORY GAME - JavaScript logic//
// organized in sections/functions for readability
//1. Card generation and shuffling
//2. Game state management (flipped cards, matched pairs)
//3. Start/reset game logic
//4. Flip card logic and match checking
//5. timer logic
//6. Win condition and message display

//1. Card generation and shuffling
const CARDS = [
    { emoji: "👗", name: "dress" },
    { emoji: "👠", name: "heels" },
    { emoji: "👜", name: "handbag" },
    { emoji: "👚", name: "top" },
    { emoji: "👖", name: "pants" },
    { emoji: "👔", name: "suit" },
    { emoji: "👢", name: "boots" },
    { emoji: "👕", name: "shirt" }
];

const TOTAL_PAIRS = CARDS.length; 

//2. Game state management
let flippedCards = [];// holds the 1 or 2 cards currently face-up
let matchedPairs = 0;//pairs found
let moves = 0;//number of moves taken
let locked = false;//prevents flipping more than 2 cards at once
let gameStarted = false;//tracks if game has started for timer

//3. Start/reset game logic
function startGame() {
    //reset state
    clearInterval(timerInterval);
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    locked = false;
    gameStarted = false;
  
    //update UI Reset 
    document.getElementById("moves").textContent = 0;
    document.getElementById("timer").textContent = "0s";
    document.getElementById("matchedPairs").textContent = `0 / ${TOTAL_PAIRS}`;
    document.getElementById("win-banner").classList.remove("visible");

    const pairs = shuffle ([...CARDS, ...CARDS]);
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
     pairs.forEach((card) => {
    const el = createCardElement(card);
    grid.appendChild(el);
  });
}
function createCardElement(card) {
  const el = document.createElement('div');
  el.className = 'card';
  el.setAttribute('role', 'gridcell');
  el.setAttribute('aria-label', 'Hidden card');
  el.setAttribute('tabindex', '0');
  el.dataset.name = card.name;
 
  el.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-back" aria-hidden="true">💗</div>
      <div class="card-face card-front" aria-hidden="true">
        <span>${card.emoji}</span>
        <span class="card-name">${card.name}</span>
      </div>
    </div>
  `;

  el.addEventListener('click', () => flipCard(el));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flipCard(el);
    }
  });
 
  return el;
}

//4. Flip card logic and match checking
function flipCard(card) {
    if (locked) return;
    if (card.classList.contains("flipped")) return;
    if (card.classList.contains("matched")) return;
    if (flippedCards.length === 2) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    card.classList.add('flipped');
    card.setAttribute('aria-label', card.dataset.name);
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
         document.getElementById('moves').textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  locked = true;
  const [cardA, cardB] = flippedCards;
  const isMatch = cardA.dataset.name === cardB.dataset.name;
 
  if (isMatch) {
    cardA.classList.add('matched');
    cardB.classList.add('matched');
    cardA.setAttribute('aria-label', `${cardA.dataset.name} — matched`);
    cardB.setAttribute('aria-label', `${cardB.dataset.name} — matched`);
 
    matchedPairs++;
    document.getElementById('matchedPairs').textContent = `${matchedPairs} / ${TOTAL_PAIRS}`;
 
    flippedCards = [];
    locked = false;
 
    // Check if the whole board is done
    if (matchedPairs === TOTAL_PAIRS) {
      clearInterval(timerInterval);
      setTimeout(showWin, 300);
    }
 
  } else {
    setTimeout(() => {
      cardA.classList.remove('flipped');
      cardB.classList.remove('flipped');
      cardA.setAttribute('aria-label', 'Hidden card');
      cardB.setAttribute('aria-label', 'Hidden card');
      flippedCards = [];
      locked = false;
    }, 900);
  }
}

//5. Timer logic
let timerInterval;
let seconds = 0;
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById("timer").textContent = `${seconds}s`;
    }, 1000);
}

//6. Win condition and message display
function showWin() {
  const banner = document.getElementById('win-banner');
  banner.classList.add('visible');
 
  let message;
  if (moves <= 12) {
    message = `Perfect memory! ${moves} moves in ${seconds}s. The fashionistas are impressed.`;
  } else if (moves <= 20) {
    message = `${moves} moves in ${seconds}s. Not bad! The fashionistas nod in approval.`;
  } else {
    message = `${moves} moves in ${seconds}s. Good outfit choices, but the fashionistas think you can do better!`;
  }
 
  document.getElementById('win-message').textContent = message;
}

// Utility function to shuffle an array
function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]; 
  }
  return a;
}
startGame();