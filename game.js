
document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('game-grid');
    const scoreElement = document.getElementById('score');
    const newGameButton = document.getElementById('new-game-btn');
    const resultPage = document.getElementById('result-page');
    const resultMessage = document.getElementById('result-message');
    const restartGameButton = document.getElementById('restart-game-btn');

    const tileValues = ['🍎', '🍌', '🍓', '🍇', '🍒', '🍊', '🍋', '🍍', '🍎', '🍌', '🍓', '🍇', '🍒', '🍊', '🍋', '🍍'];
    let tiles = [];
    let score = 0;
    let firstTile = null;
    let secondTile = null;
    let lockBoard = false; // Prevent clicks during tile matching

    // Function to initialize the game
    function initializeGame() {
        gameGrid.innerHTML = '';
        score = 0;
        scoreElement.innerText = score;
        tiles = [];

        // Shuffle the tile values
        const shuffledValues = shuffleArray(tileValues);

        // Create the grid of tiles
        shuffledValues.forEach((value, index) => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.index = index;
            tile.dataset.value = value;
            tile.addEventListener('click', handleTileClick);
            gameGrid.appendChild(tile);
            tiles.push(tile);
        });

        // Hide the result page and show the game
        resultPage.style.display = 'none';
        gameGrid.style.display = 'grid';
    }

    // Shuffle the array of tile values
    function shuffleArray(arr) {
        let shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Handle tile click
    function handleTileClick(event) {
        if (lockBoard || event.target.classList.contains('revealed') || event.target.classList.contains('matched')) {
            return; // Prevent clicking on already revealed or matched tiles
        }

        const clickedTile = event.target;

        // Reveal the tile
        clickedTile.classList.add('revealed');
        clickedTile.innerText = clickedTile.dataset.value;

        // If it's the first tile clicked, store it
        if (!firstTile) {
            firstTile = clickedTile;
        } else {
            secondTile = clickedTile;
            lockBoard = true;

            // Check for a match
            if (firstTile.dataset.value === secondTile.dataset.value) {
                handleMatch();
            } else {
                handleNoMatch();
            }
        }
    }

    // Handle a match (both tiles are the same)
    function handleMatch() {
        firstTile.classList.add('matched');
        secondTile.classList.add('matched');
        score += 10;
        scoreElement.innerText = score;

        // Reset the tiles
        firstTile = null;
        secondTile = null;
        lockBoard = false;

        // Check for game over (all tiles matched)
        if (document.querySelectorAll('.matched').length === tiles.length) {
            showResult('You win!');
        }
    }

    // Handle no match (tiles are different)
    function handleNoMatch() {
        setTimeout(() => {
            firstTile.classList.remove('revealed');
            secondTile.classList.remove('revealed');
            firstTile.innerText = '';
            secondTile.innerText = '';
            firstTile = null;
            secondTile = null;
            lockBoard = false;
        }, 1000); // Hide the tiles after 1 second
    }

    // Show the result (win or draw)
    function showResult(message) {
        gameGrid.style.display = 'none'; // Hide the game grid
        resultPage.style.display = 'block'; // Show the result page
        resultMessage.innerText = message;
    }

    // Start a new game
    newGameButton.addEventListener('click', initializeGame);

    // Restart the game from the result page
    restartGameButton.addEventListener('click', () => {
        resultPage.style.display = 'none'; // Hide result page
        initializeGame(); // Start a new game
    });

    // Initialize the game when the page loads
    initializeGame();
});
