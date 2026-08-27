/* =========================================
   JOGO DA FORCA
   10 NÍVEIS
========================================= */


/* =========================================
   PALAVRAS DOS NÍVEIS
========================================= */

const levels = [

    {
        category: "Animais",
        word: "ELEFANTE"
    },

    {
        category: "Frutas",
        word: "ABACAXI"
    },

    {
        category: "Países",
        word: "BRASIL"
    },

    {
        category: "Profissões",
        word: "PROFESSOR"
    },

    {
        category: "Tecnologia",
        word: "COMPUTADOR"
    },

    {
        category: "Esportes",
        word: "FUTEBOL"
    },

    {
        category: "Natureza",
        word: "CACHOEIRA"
    },

    {
        category: "Comidas",
        word: "CHOCOLATE"
    },

    {
        category: "Espaço",
        word: "ASTRONAUTA"
    },

    {
        category: "Objetos",
        word: "TELEFONE"
    }

];


/* =========================================
   CONFIGURAÇÕES
========================================= */

const MAX_ERRORS = 6;


/* =========================================
   VARIÁVEIS DO JOGO
========================================= */

let currentLevel = 0;

let currentWord = "";

let guessedLetters = [];

let errors = 0;

let score = 0;

let levelFinished = false;


/* =========================================
   ELEMENTOS HTML
========================================= */

const levelElement =
    document.getElementById("level");

const scoreElement =
    document.getElementById("score");

const errorsElement =
    document.getElementById("errors");

const categoryElement =
    document.getElementById("category");

const wordElement =
    document.getElementById("word");

const messageElement =
    document.getElementById("message");

const keyboardElement =
    document.getElementById("keyboard");

const nextButton =
    document.getElementById("nextButton");

const progressElement =
    document.getElementById("progress");

const gameElement =
    document.getElementById("game");

const endScreen =
    document.getElementById("endScreen");

const finalScoreElement =
    document.getElementById("finalScore");

const restartButton =
    document.getElementById("restartButton");


/* =========================================
   INICIAR NÍVEL
========================================= */

function startLevel() {

    const level = levels[currentLevel];

    currentWord =
        level.word.toUpperCase();

    guessedLetters = [];

    errors = 0;

    levelFinished = false;

    categoryElement.textContent =
        level.category;

    levelElement.textContent =
        `${currentLevel + 1}/${levels.length}`;

    errorsElement.textContent =
        `0/${MAX_ERRORS}`;

    messageElement.textContent =
        "Escolha uma letra!";

    messageElement.style.color =
        "white";

    nextButton.classList.add("hidden");

    nextButton.textContent =
        "Próximo nível ➡️";

    updateProgress();

    drawWord();

    createKeyboard();

    resetHangman();

}


/* =========================================
   DESENHAR PALAVRA
========================================= */

function drawWord() {

    wordElement.innerHTML = "";

    for (const letter of currentWord) {

        const element =
            document.createElement("div");

        element.classList.add("letter");

        if (guessedLetters.includes(letter)) {

            element.textContent = letter;

        } else {

            element.textContent = "";

        }

        wordElement.appendChild(element);

    }

}


/* =========================================
   CRIAR TECLADO
========================================= */

function createKeyboard() {

    keyboardElement.innerHTML = "";

    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (const letter of alphabet) {

        const button =
            document.createElement("button");

        button.className = "key";

        button.textContent = letter;

        button.addEventListener(
            "click",
            () => guessLetter(letter, button)
        );

        keyboardElement.appendChild(button);

    }

}


/* =========================================
   ESCOLHER LETRA
========================================= */

function guessLetter(letter, button) {

    if (
        levelFinished ||
        guessedLetters.includes(letter)
    ) {
        return;
    }

    button.disabled = true;

    /* LETRA CORRETA */

    if (currentWord.includes(letter)) {

        guessedLetters.push(letter);

        button.classList.add("correct");

        messageElement.textContent =
            "✅ Boa! Você acertou uma letra.";

        messageElement.style.color =
            "#00e676";

        drawWord();

        checkWin();

    }

    /* LETRA ERRADA */

    else {

        errors++;

        button.classList.add("wrong");

        errorsElement.textContent =
            `${errors}/${MAX_ERRORS}`;

        showHangmanPart(errors);

        messageElement.textContent =
            "❌ Essa letra não está na palavra.";

        messageElement.style.color =
            "#ff5252";

        if (errors >= MAX_ERRORS) {

            gameOver();

        }

    }

}


/* =========================================
   VERIFICAR VITÓRIA
========================================= */

function checkWin() {

    const won =
        [...currentWord].every(
            letter =>
                guessedLetters.includes(letter)
        );

    if (!won) {
        return;
    }

    levelFinished = true;

    /*
     * Pontuação:
     * 100 pontos pela palavra
     * + 25 por cada erro evitado
     */

    const points =
        100 +
        ((MAX_ERRORS - errors) * 25);

    score += points;

    scoreElement.textContent =
        score;

    messageElement.textContent =
        `🎉 Palavra descoberta! +${points} pontos!`;

    messageElement.style.color =
        "#00e676";

    disableKeyboard();

    if (currentLevel < levels.length - 1) {

        nextButton.textContent =
            "Próximo nível ➡️";

        nextButton.classList.remove("hidden");

    } else {

        setTimeout(
            showEndScreen,
            1000
        );

    }

}


/* =========================================
   GAME OVER
========================================= */

function gameOver() {

    levelFinished = true;

    messageElement.innerHTML =
        `💀 Você perdeu! A palavra era:
        <strong>${currentWord}</strong>.`;

    messageElement.style.color =
        "#ff5252";

    disableKeyboard();

    nextButton.textContent =
        "Tentar novamente 🔄";

    nextButton.classList.remove("hidden");

    nextButton.onclick =
        retryLevel;

}


/* =========================================
   PRÓXIMO NÍVEL
========================================= */

nextButton.addEventListener(
    "click",
    nextLevel
);


function nextLevel() {

    if (
        currentLevel >=
        levels.length - 1
    ) {
        return;
    }

    currentLevel++;

    nextButton.onclick = null;

    startLevel();

}


/* =========================================
   TENTAR NOVAMENTE
========================================= */

function retryLevel() {

    nextButton.onclick = null;

    startLevel();

}


/* =========================================
   DESABILITAR TECLADO
========================================= */

function disableKeyboard() {

    const buttons =
        document.querySelectorAll(".key");

    buttons.forEach(button => {

        button.disabled = true;

    });

}


/* =========================================
   DESENHAR PARTE DA FORCA
========================================= */

function showHangmanPart(number) {

    const part =
        document.getElementById(
            `part${number}`
        );

    if (part) {

        part.style.display =
            "block";

    }

}


/* =========================================
   RESETAR FORCA
========================================= */

function resetHangman() {

    for (
        let i = 1;
        i <= MAX_ERRORS;
        i++
    ) {

        const part =
            document.getElementById(
                `part${i}`
            );

        if (part) {

            part.style.display =
                "none";

        }

    }

}


/* =========================================
   ATUALIZAR PROGRESSO
========================================= */

function updateProgress() {

    const percentage =
        ((currentLevel + 1) /
        levels.length) * 100;

    progressElement.style.width =
        `${percentage}%`;

}


/* =========================================
   TELA FINAL
========================================= */

function showEndScreen() {

    gameElement.classList.add("hidden");

    endScreen.classList.remove("hidden");

    finalScoreElement.textContent =
        `Pontuação final: ${score} pontos`;

}


/* =========================================
   REINICIAR JOGO
========================================= */

restartButton.addEventListener(
    "click",
    restartGame
);


function restartGame() {

    currentLevel = 0;

    score = 0;

    scoreElement.textContent = "0";

    endScreen.classList.add("hidden");

    gameElement.classList.remove("hidden");

    startLevel();

}


/* =========================================
   TECLADO DO COMPUTADOR
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        const letter =
            event.key.toUpperCase();

        /*
         * Aceita somente letras
         */

        if (!/^[A-Z]$/.test(letter)) {
            return;
        }

        const buttons =
            document.querySelectorAll(".key");

        buttons.forEach(button => {

            if (
                button.textContent === letter &&
                !button.disabled
            ) {

                guessLetter(
                    letter,
                    button
                );

            }

        });

    }
);


/* =========================================
   INICIAR O JOGO
========================================= */

startLevel();
