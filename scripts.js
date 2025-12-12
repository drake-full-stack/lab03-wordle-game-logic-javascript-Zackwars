// ===== GAME STATE VARIABLES =====
const TARGET_WORD = "WORDS";  // Our secret word for testing
let currentRow = 0;           // Which row we're filling (0-5)
let currentTile = 0;          // Which tile in the row (0-4)
let gameOver = false;         // Is the game finished?

// DOM element references (set up on page load)
let gameBoard, rows, debugOutput;

// ===== HELPER FUNCTIONS (PROVIDED) =====

// Debug/Testing Functions
function logDebug(message, type = 'info') {
    // Log to browser console
    console.log(message);
    
    // Also log to visual testing area
    if (!debugOutput) {
        debugOutput = document.getElementById('debug-output');
    }
    
    if (debugOutput) {
        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;
        entry.innerHTML = `
            <span style="color: #666; font-size: 12px;">${new Date().toLocaleTimeString()}</span> - 
            ${message}
        `;
        
        // Add to top of debug output
        debugOutput.insertBefore(entry, debugOutput.firstChild);
        
        // Keep only last 20 entries for performance
        const entries = debugOutput.querySelectorAll('.debug-entry');
        if (entries.length > 20) {
            entries[entries.length - 1].remove();
        }
    }
}

function clearDebug() {
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        debugOutput.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">Debug output cleared - ready for new messages...</p>';
    }
}

// Helper function to get current word being typed
function getCurrentWord() {
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let word = '';
    tiles.forEach(tile => word += tile.textContent);
    return word;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    gameBoard = document.querySelector('.game-board');
    rows = document.querySelectorAll('.row');
    debugOutput = document.getElementById('debug-output');
    
    logDebug("🎮 Game initialized successfully!", 'success');
    logDebug(`🎯 Target word: ${TARGET_WORD}`, 'info');
    logDebug("💡 Try typing letters, pressing Backspace, or Enter", 'info');
});

// ===== YOUR CHALLENGE: IMPLEMENT THESE FUNCTIONS =====

document.addEventListener("keydown", (event) => {
    if (gameOver) return;
    
    const key = event.key.toUpperCase();
    
    if (event.key === "Backspace") {
        deleteLetter();
        return;
    }
    
    if (event.key === "Enter") {
        submitGuess();
        return;
    }

    if (key.length === 1 && key >= 'A' && key <= 'Z') {
        addLetter(key);
    }
});


// TODO: Implement addLetter function
function addLetter(letter) {
    logDebug(`addLetter("${letter}") called`, 'info');
    
    //check full
    if (currentTile >= 5) {
        logDebug(`Row is full, cannot add more letters`, 'error');
        return;
    }
    //get current row
    const row = rows[currentRow];
    //get all tiles in that row
    const tiles = row.querySelectorAll('.tile');
    //get working tile
    const tile = tiles[currentTile];
    //input data
    tile.textContent = letter;
    //add the 'filled' CSS class to the tile
    tile.classList.add('filled');
    //move to next tile
    currentTile++;
    
    // extra error hadnling and testing
    logDebug(`Letter "${letter}" added at position ${currentTile - 1}`, 'success');
    logDebug(`Current word: "${getCurrentWord()}"`, 'info');
}

// TODO: Implement deleteLetter function  
function deleteLetter() {
    logDebug(`deleteLetter() called`, 'info');
    
    //check if nothing to delete
    if (currentTile <= 0) {
        logDebug(`No letters to delete`, 'error');
        return;
    }

    currentTile--;
    
    const row = rows[currentRow];
    const tiles = row.querySelectorAll('.tile');
    //get tile to delete
    const tile = tiles[currentTile];
    
    //clear
    tile.textContent = '';
    
    // remove the 'filled' CSS class
    tile.classList.remove('filled');
}
//TODO: Implement submitGuess function
function submitGuess() {

    if (currentTile < 5) {
        return;
    }
    
    //get the current guess
    const guess = getCurrentWord();
    const row = rows[currentRow];
    const tiles = row.querySelectorAll('.tile');
    const result = checkGuess(guess, tiles);
    
    //hardcoded taget word due to failure to make it a glbal variable 
    if (guess === "HELLO") {
        logDebug(`Correct! You won!`, 'success');
        gameOver = true;
        return;
    }
    currentRow++;
    currentTile = 0;

    if (currentRow >= 5) {
        logDebug(`Game over! The word was: ${targetWord}`, 'error');
        gameOver = true;
        return;
    }
    
    logDebug(`Moving to row ${currentRow}`, 'info');
}
//TODO Impliment checkGuess function
function checkGuess(guess, tiles) {
    logDebug(`checkGuess("${guess}") called`, 'info');
    
    const result = [];
    //I wasn't sure how to get targetword to be a global variable so its made twice this is bad code design but It works
    const targetWord = 'HELLO';
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');
    
    //track which letters in target have been matched
    const used = new Array(5).fill(false);
    
    // pass through and check correct (duplicate correct letters cause error)
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = 'correct';
            tiles[i].classList.add('correct');
            used[i] = true;
        }
    }
    //second pass to get yellow and gray
    for (let i = 0; i < 5; i++) {
        if (result[i] === 'correct') {
            continue; // Already marked as correct
        }
        //set a variable to check for correct words in wrong position
        let foundIndex = -1;
        for (let j = 0; j < 5; j++) {
            if (!used[j] && guessLetters[i] === targetLetters[j]) {
                foundIndex = j;
                break;
            }
        }
        
        if (foundIndex !== -1) {
            result[i] = 'present';
            tiles[i].classList.add('present');
            used[foundIndex] = true;
        } else {
            result[i] = 'absent';
            tiles[i].classList.add('absent');
        }
    }
    
    return result;
}