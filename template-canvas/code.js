// ordballong - mall 

/* setup
------------------------ */
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");



/* klasser för att skapa objekt
------------------------ */

class Ballon {
    constructor(word) {
        this.word = word;
        this.radius = this.word.length * 10;
        this.x = getRandomBetween(100, canvas.width - 100);
        this.y = canvas.height + this.radius;
        this.vy = -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
    displayText() {
        ctx.font = "20px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.word, this.x, this.y, this.radius * 2);
    }
    move() {
        this.y += this.vy;
        this.draw();
        this.displayText();
    }

}



/* initiera, globala variabler
------------------------ */
let ballons = [];

// ord i spelet
let words = ["citron", "morot", "kiwi", "ananas", "selleri", "banan", "spenat", "apelsin", "lök", "päron",
    "mandel", "aprikos", "tomat", "björnbär", "körsbär", "kastanj", "vinbär", "vitlök", "gurka", "potatis"
];

// slumpa ordföljden
shuffleArray(words);

let word = words.pop();

// unikt id för varje frame i animationen
let frameId;

// text som skrivs
let text = "";

// godkända tecken
let chars = "abcdefghijklmnopqrstuvwxyzåäöABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";

let score = 0;




/* händelselyssnare
------------------------ */
startButton.addEventListener("click", function () {

    // starta spel
    nextFrame();

    // inaktivera knapp
    startButton.setAttribute("disabled", true);

    spawnBallon();

})

stopButton.addEventListener("click", function () {

    // pausa spel
    cancelAnimationFrame(frameId);

    // aktivera åter startknappen
    startButton.removeAttribute("disabled");
})

document.addEventListener("keydown", getKeyDown, false);



/* funktioner
------------------------ */

drawWelcomeScreen();

// animering, game loop
function nextFrame() {

    frameId = requestAnimationFrame(nextFrame);

    // radera innehåll från föregående frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // anropa metoder och funktioner:

    drawScore();

    renderBallons();

    if (frameId % 240 === 0) {
        spawnBallon();
    }

    renderText();

    if (ballons.length && words.length === 0) {
        drawGameResult();
    }

}

// slumpa ett tal mellan två värden
function getRandomBetween(min, max) {

    // returnera heltal
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Durstenfeld shuffle algoritm
 * https://en.wikipedia.org/wiki/Fisher-Yates_shuffle#The_modern_algorithm
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function spawnBallon() {
    if (words.length > 0) {
        let word = words.pop();
        let ballon = new Ballon(word);
        ballons.push(ballon);
    }
}

function renderBallons() {
    ballons.forEach(ballon => {
        ballon.move();
    })
}

function getKeyDown(event) {
    console.log(event);
    if (chars.indexOf(event.key) >= 0) {
        text += event.key;
    }
    if (event.code === "Backspace") {
        //radera sista tecknet i variabeln text
        raderaSistaTecknet();
    }
    if (event.code === "Enter") {
        
        // kontollera om det finns text 
        if (text.length > 0) {
        // anropa en funktion som kontrollera om texten finns i en ordballong
        checkBallonMatch(text);
        text = "";

        }
        
    }

}

function renderText() {
    ctx.font = "50px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "navy";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width);
}

function checkBallonMatch(text) {
    ballons.forEach(ballon => {
        if (ballon.word === text) {

            ballon.word = "";

            score = score + 10;
            ballon.radius = 0;

        }
    })
}

function drawScore() {
    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 700, 40);
}

function drawWelcomeScreen() {
    ctx.font = "25px Comic Sans MS";
    ctx.fillStyle = "green";
    ctx.fillText("Hallå! Gissa orden i ballongerna (frukt och grönt).", 110, 140);
    ctx.fillText("Skriv och tryck enter!", 110, 195);
    ctx.fillText("Lycka till!", 110, 250);
}


function drawGameResult() {
    ctx.font = "35px Arial";
    ctx.fillStyle = "darkred";
    ctx.fillText("Game over! Din score är: " + score, 250, 250);

}

function raderaSistaTecknet() {
    text = text.substring(0, text.length - 1);
}