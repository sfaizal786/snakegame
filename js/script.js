const board = document.getElementById("board");
const hiscoreBox = document.getElementById("hiscore");
const scoreBox = document.getElementById("score");

const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

let inputDir = { x: 0, y: 1 }; // ✅ start moving
let snakePosition = [{ x: 13, y: 15 }];
let foodPosition = { x: 6, y: 7 };

let lastPaintTime = 0;
let speed = 5;;
let score = 0;


// MAIN LOOP
function main(ctime) {
    window.requestAnimationFrame(main);
    if(score >5){
       speed = 8;
    } else if(score > 10){
        speed = 10;
    } else if(score > 20){
        speed = 16;
    }else if(score > 50){
        speed = 25;
    }else if(score > 100){
        speed = 40;
    }

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;

    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >18 || snake[0].x < 0 || snake[0].y >18 || snake[0].y < 0) {
        return true;
    }
    return false;

}

// GAME ENGINE
function gameEngine() {

    //collision 
    if(isCollide(snakePosition)){
        gameOverSound.play();
        musicSound.pause();
        inputDir =  {x: 0, y: 0}; 
        alert("Game Over. Press any key to play again!");
        snakePosition = [{x: 13, y: 15}];
        musicSound.play();
        score = 0; 
    }
    //food eat
    if (snakePosition[0].x === foodPosition.x && snakePosition[0].y === foodPosition.y) {
        score += 1;
        scoreBox.innerHTML = "Score: " + score;
        if(score > hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        foodSound.play();
        a = 1,
        b = 18,
        foodPosition = {
          
            x:  Math.round(a + (b-a)* Math.random()),
            y:  Math.round(a + (b-a)* Math.random())
        };
         snakePosition.unshift({x: snakePosition[0].x + inputDir.x, y: snakePosition[0].y + inputDir.y});
    }

    // clear board
    board.innerHTML = "";

    // move snake
    for (let i = snakePosition.length - 1; i > 0; i--) {
        snakePosition[i] = { ...snakePosition[i - 1] };
    }

    snakePosition[0].x += inputDir.x;
    snakePosition[0].y += inputDir.y;

    // draw snake
    snakePosition.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
       
        if (index === 0 ){
             snakeElement.classList.add("head");
        }
        else{
                snakeElement.classList.add("snake");
        }
        board.appendChild(snakeElement);

    });

    // draw food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = foodPosition.y;
    foodElement.style.gridColumnStart = foodPosition.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}


// START GAME
window.requestAnimationFrame(main);

// CONTROLS
window.addEventListener("keydown", (e) => {
    musicSound.play();
    console.log("Key:", e.key);

    switch (e.key) {
        case "ArrowUp":
            inputDir = { x: 0, y: -1 };
            break;

        case "ArrowDown":
            inputDir = { x: 0, y: 1 };
            break;

        case "ArrowLeft":
            inputDir = { x: -1, y: 0 };
            break;

        case "ArrowRight":
            inputDir = { x: 1, y: 0 };
            break;
    }
});