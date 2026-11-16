const homeScreen = document.getElementById("home-screen");
const gameScreen = document.getElementById("game-screen");
const endingScreen = document.getElementById("ending-screen");

const usernameInput = document.getElementById("username");
const startButton = document.getElementById("start-button");
const errorMessage = document.getElementById("error-message");

const playerWelcome = document.getElementById("player-welcome");
const timerDisplay = document.getElementById("timer");
const timerCard = document.querySelector(".timer-card");
const progressDisplay = document.getElementById("progress");
const digitsFoundDisplay = document.getElementById("digits-found");
const fileLabel = document.getElementById("file-label");
const puzzleArea = document.getElementById("puzzle-area");

const endingRecord = document.getElementById("ending-record");
const endingKicker = document.getElementById("ending-kicker");
const endingSeal = document.getElementById("ending-seal");
const endingTitle = document.getElementById("ending-title");
const endingMessage = document.getElementById("ending-message");
const endingDetails = document.getElementById("ending-details");
const restartButton = document.getElementById("restart-button");

const GAME_TIME = 20 * 60;
let timeLeft = GAME_TIME;
let timerInterval = null;
let currentPuzzle = 0;
let recoveredDigits = [];
let gameStarted = false;
let hintsUsed = 0;
let puzzles = [];

startButton.addEventListener("click", function() {
    const username = usernameInput.value.trim();

    if (username === "") {
        errorMessage.textContent = "Please enter an investigator codename.";
        usernameInput.focus();
        return;
    }

    localStorage.setItem("museumHeistUsername", username);
    playerWelcome.textContent = "Investigator: " + username;

    homeScreen.hidden = true;
    endingScreen.hidden = true;
    gameScreen.hidden = false;

    resetGameValues();
    renderPuzzle();
    startTimer();
});
function resetGameValues() {
    clearInterval(timerInterval);
    timeLeft = GAME_TIME;
    currentPuzzle = 0;
    recoveredDigits = [];
    hintsUsed = 0;
    gameStarted = true;

    puzzles = createPuzzleSet();

    timerDisplay.textContent = "20:00";
    timerCard.classList.remove("timer-warning");
    updateProgress();
}

function startTimer() {
    timerInterval = setInterval(function() {
        if (!gameStarted) {
            return;
        }

        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            finishGame(false);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

    timerDisplay.textContent = formattedTime;

    if (timeLeft <= 60) {
        timerCard.classList.add("timer-warning");
    }
}

function updateProgress() {
    progressDisplay.textContent = recoveredDigits.length + " / 5";
    digitsFoundDisplay.textContent = recoveredDigits.length + " / 5";
}

function renderPuzzle() {
    const puzzle = puzzles[currentPuzzle];
    fileLabel.textContent = "INVESTIGATION FILE 0" + (currentPuzzle + 1);

    puzzleArea.innerHTML = `
        <h2 class="puzzle-title">${puzzle.title}</h2>
        <p class="puzzle-intro">${puzzle.intro}</p>
        ${puzzle.content}
        <div class="answer-section">
            <label for="puzzle-answer">${puzzle.prompt}</label>
            <input type="text" id="puzzle-answer" placeholder="${puzzle.placeholder}" autocomplete="off">
            <button type="button" id="submit-answer">SUBMIT EVIDENCE</button>
            <p id="answer-feedback" class="feedback" role="status" aria-live="polite"></p>
        </div>
        <div class="puzzle-actions">
            <button type="button" class="secondary-button" id="hint-button">REQUEST A HINT</button>
        </div>
        <p id="hint-box" class="hint-box" hidden></p>
    `;

    const answerInput = document.getElementById("puzzle-answer");
    const submitButton = document.getElementById("submit-answer");
    const hintButton = document.getElementById("hint-button");
    const feedback = document.getElementById("answer-feedback");
    const hintBox = document.getElementById("hint-box");

    submitButton.addEventListener("click", checkAnswer);

    answerInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    hintButton.addEventListener("click", function() {
        hintBox.textContent = puzzle.hint;
        hintBox.hidden = false;
        hintButton.disabled = true;
        hintButton.textContent = "HINT VIEWED";
        hintsUsed++;
    });

    answerInput.focus();
}

function checkAnswer() {
    const puzzle = puzzles[currentPuzzle];
    const answerInput = document.getElementById("puzzle-answer");
    const feedback = document.getElementById("answer-feedback");
    const submitButton = document.getElementById("submit-answer");
    const playerAnswer = answerInput.value.trim().toUpperCase().replace(/\s+/g, " ");

    if (playerAnswer === "") {
        feedback.textContent = "Enter an answer before submitting the evidence.";
        feedback.className = "feedback feedback-incorrect";
        answerInput.focus();
        return;
    }

    if (puzzle.answers.includes(playerAnswer)) {
        recoveredDigits.push(puzzle.digit);
        updateProgress();
        answerInput.disabled = true;
        submitButton.disabled = true;

        const actions = document.querySelector(".puzzle-actions");
        const continueButton = document.createElement("button");
        continueButton.type = "button";
        continueButton.id = "continue-button";
        continueButton.textContent = currentPuzzle === puzzles.length - 1 ? "PROCEED TO THE VAULT" : "OPEN NEXT EVIDENCE FILE";
        actions.appendChild(continueButton);

        feedback.textContent = "Correct. Evidence accepted.";
        feedback.className = "feedback feedback-correct";

        const explanation = document.createElement("p");
        explanation.className = "explanation-box";
        explanation.textContent = puzzle.explanation;
        puzzleArea.appendChild(explanation);

        continueButton.addEventListener("click", function() {
            if (currentPuzzle < puzzles.length - 1) {
                currentPuzzle++;
                renderPuzzle();
            } else {
                showVault();
            }
        });
    } else {
        feedback.textContent = "That answer does not match the evidence. Review the clue and try again.";
        feedback.className = "feedback feedback-incorrect";
        answerInput.select();
    }
}

function showVault() {
    fileLabel.textContent = "FINAL SECURITY CHECK";
    puzzleArea.innerHTML = `
        <div class="vault-section">
            <div class="vault-mark" aria-hidden="true">✧</div>
            <p class="document-label">RESTRICTED ACCESS / CASE 0214</p>
            <h2>The Masterpiece Vault</h2>
            <p>All five evidence files have been solved. Enter the five digits in the order you recovered them to unlock the vault.</p>
            <label for="vault-code">FIVE-DIGIT ACCESS CODE</label>
            <input type="text" id="vault-code" inputmode="numeric" maxlength="5" placeholder="_ _ _ _ _" autocomplete="off">
            <button type="button" id="unlock-vault">UNLOCK THE VAULT</button>
            <p id="vault-feedback" class="feedback" role="status" aria-live="polite"></p>
        </div>
    `;

    const vaultInput = document.getElementById("vault-code");
    const unlockButton = document.getElementById("unlock-vault");

    unlockButton.addEventListener("click", checkVaultCode);
    vaultInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            checkVaultCode();
        }
    });
    vaultInput.focus();
}

function checkVaultCode() {
    const vaultInput = document.getElementById("vault-code");
    const feedback = document.getElementById("vault-feedback");
    const enteredCode = vaultInput.value.trim();
    const collectedCode = recoveredDigits.join("");

    if (!/^\d{5}$/.test(enteredCode)) {
        feedback.textContent = "Enter all five digits.";
        feedback.className = "feedback feedback-incorrect";
        vaultInput.focus();
        return;
    }

    if (enteredCode === collectedCode) {
        finishGame(true);
    } else {
        feedback.textContent = "The vault did not open. Check the order of your recovered digits.";
        feedback.className = "feedback feedback-incorrect";
        vaultInput.select();
    }
}

function finishGame(won) {
    if (!gameStarted) {
        return;
    }

    gameStarted = false;
    clearInterval(timerInterval);
    gameScreen.hidden = true;
    endingScreen.hidden = false;

    const minutesUsed = Math.floor((GAME_TIME - timeLeft) / 60);
    const secondsUsed = (GAME_TIME - timeLeft) % 60;
    const timeUsed = String(minutesUsed).padStart(2, "0") + ":" + String(secondsUsed).padStart(2, "0");
    const username = localStorage.getItem("museumHeistUsername") || "Investigator";

    if (won) {
        endingRecord.classList.remove("failed-record");
        endingKicker.textContent = "CASE FILE 0214 / SUCCESSFUL RECOVERY";
        endingSeal.textContent = "✓";
        endingTitle.textContent = "The Masterpiece Is Recovered";
        endingMessage.textContent = "The vault door opens. Inside, Georges Seurat's A Sunday on La Grande Jatte — 1884 has been secured. Museum security has been notified, and the painting is ready to return to its gallery wall. Excellent work, Investigator " + username + ".";
        endingDetails.innerHTML = "VAULT CODE: <strong>" + recoveredDigits.join("") + "</strong><br>FILES SOLVED: 5 OF 5<br>TIME USED: " + timeUsed + "<br>HINTS USED: " + hintsUsed;
    } else {
        endingRecord.classList.add("failed-record");
        endingKicker.textContent = "CASE FILE 0214 / LOCKDOWN REPORT";
        endingSeal.textContent = "!";
        endingTitle.textContent = "The Vault Has Locked";
        endingMessage.textContent = "The museum's security system has completed its lockdown. A Sunday on La Grande Jatte — 1884 remains inside the sealed vault. The investigation can be attempted again.";
        endingDetails.innerHTML = "FILES SOLVED: " + recoveredDigits.length + " OF 5<br>TIME USED: 20:00<br>CASE STATUS: UNRESOLVED";
    }
}

restartButton.addEventListener("click", function() {
    clearInterval(timerInterval);
    gameStarted = false;
    endingScreen.hidden = true;
    gameScreen.hidden = true;
    homeScreen.hidden = false;
    usernameInput.value = localStorage.getItem("museumHeistUsername") || "";
    errorMessage.textContent = "";
    window.scrollTo(0, 0);
});

