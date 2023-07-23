const prompt = require('prompt-sync')();
const ansi = require('ansi-colors');
const fs = require('fs');

const scoreFilePath = "./highscore.json";

class Player {
    name;
    score;

    constructor(name="Player", score) {
        this.name = name;
        this.score = score;
    }

    printScore() {
        console.log(ansi.yellow(`${this.name}'s current score is ${this.score}`));
    }
}

let highscore = [];
let limit = 10;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function merge(arr, l, m, r) {
    var n1 = m - l + 1;
    var n2 = r - m;
 
    // Create temp arrays
    var L = new Array(n1);
    var R = new Array(n2);
 
    // Copy data to temp arrays L[] and R[]
    for (var i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (var j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];

    var i = 0;
    var j = 0;
    var k = l;

    while (i < n1 && j < n2) {
        if (L[i].score >= R[j].score) {
            arr[k] = L[i];
            i++;
        }
        else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
 
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
 
    
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

function mergeSort(arr, l, r) {
    if(l >= r){
        return;
    }
    let m = l + parseInt((r - l) / 2);
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}

function updateHighscore(player) { 
    if (highscore.length == 0) {
        highscore.push(player);
        viewHighscore(0);
        return;
    }
    
    let hIndex = -1;
    let tempArray = [];

    // Check placement in highscore array
    for (let i = 0; i <= highscore.length; i++) {
        if (i == highscore.length) {
            hIndex = highscore.length;
            break;
        }

        if (player.score > highscore[i].score) {
            hIndex = i;
            break;
        }
    }

    if (hIndex < 10 && hIndex != -1) {
        highscore.push(player);
    }
    
    // console.log("Index: " + hIndex);

    // Top 10
    // if (hIndex < 10 && hIndex != -1) {
    //     for (let i = 0; i <= highscore.length; i++) {
    //         console.log("HIndex: " + hIndex);
    //         console.log("Index: " + i);
    //         console.log(player);
    //         if (i < hIndex) {
    //             tempArray.push(highscore[i]);
    //         }
    //         if (i > hIndex) {
    //             tempArray.push(highscore[i + 1]);
    //         }
    //         if (i == hIndex) {

    //             tempArray.push(player);
    //         }
    //     }
    // }

    mergeSort(highscore, 0, highscore.length - 1);

    // highscore = tempArray;
    //mergeSort(highscore, 0, highscore.length);

    if (highscore.length >= limit) {
        highscore.splice(limit, highscore.length - limit);
    }

    viewHighscore(hIndex);

}

function saveHighscoreToFile() {
    let jsonData = JSON.stringify(highscore);
    try {
        fs.writeFileSync(scoreFilePath, jsonData, 'utf8', function writeFileCallback(err) {
            if (err) throw ansi.redBright(err);
            // console.log(ansi.yellowBright(`Your Highscores has been saved!`));
        });
    }
    catch (err) {
        console.log(err);
    }
    
}

function readHighscoreFromFile() {
    let data = fs.readFileSync(scoreFilePath);
    let parsedData = JSON.parse(data);
    highscore = parsedData;
}

function saveHighscore(player) {
    let playerName = prompt(`Please enter a ${ansi.green(`Name`)}: `);
    player.name = playerName;

    updateHighscore(player);
    saveHighscoreToFile();
}

function checkIsHighscore(score) {
    if ((highscore.length == 0 || highscore.length < 10) && score > 0) return true;
    for (let i = 0; i < highscore.length; i++) {
        if (score > highscore[i].score) return true;
    }
    return false;
}

function viewHighscore(index = -1) {
    console.log("");
    console.log(ansi.yellowBright.bold("RPS - Highscore"));
    console.log(ansi.yellowBright.bold(`Player | Score`));
    
    if(highscore.length == 0) {
        console.log(`Empty`);
        console.log();
        return;
    }

    for (let i = 0; i < highscore.length; i++) {
        if (index != -1) {
            if (i == index) {
                console.log(ansi.greenBright(`${highscore[i].name}        ${highscore[i].score}`));
            }
            else {
                console.log(`${highscore[i].name}        ${highscore[i].score}`);
            }
        }
        else {
            console.log(`${highscore[i].name}        ${highscore[i].score}`);
        }
        
    }
    console.log();
}

function inputFullName(input) {
    switch(input) {
        case "r":
            return ansi.grey.bold("Rock");
        break;
        case "p":
            return ansi.white.bold("Paper");
        break;
        case "s":
            return ansi.blue.bold("Scissors");
        break;
        default:
            return ansi.red.bold("Invalid");
        break;
    }
}

function checkValidEndGameInput(input) {
    switch(input) {
        case "y":
            return true;
        break;
        case "n":
            return true;
        break;
        default:
            return false;
        break;
    }
}

function checkValidMenuInput(input) {
    switch(input) {
        case "1":
            return true;
        break;
        case "2":
            return true;
        break;
        case "3":
            return true;
        break;
        default:
            return false;
        break;
    }
}

function checkValidGameInput(input) {
    try {
        input = input.toLowerCase();
    }
    catch (error) {
        return false;
    }

    switch(input) {
        case "r":
            return true;
        break;
        case "p":
            return true;
        break;
        case "s":
            return true;
        break;
        default:
            return false;
        break;
    }
}

function selectMenu(input) {
    switch(input) {
        case "1":
            playTheGame();
        break;
        case "2":
            viewHighscore();
        break;
        case "3":
            process.exit(1);
        break;
        default:
            
        break;
    }
}

function compareChoices(p, c, player, computer) {
    let compString = "";
    p = p.toLowerCase();

    switch(c) {
        case 0:
            compString = "r";
        break;
        case 1:
            compString = "p";
        break;
        case 2:
            compString = "s";
        break;
    }
    
    console.log();

    // Draws
    if (p == compString) {
        console.log(ansi.yellow("Draw! Everyone loses!"));
        console.log(` ${ansi.yellow('Player')} chose ` + inputFullName(p));
        console.log(` ${ansi.yellow('Computer')} chose ` + inputFullName(compString));
        return;
    }
    
    // Lose
    if ((p == "r" && compString == "p") || (p == "p" && compString == "s") || (p == "s" && compString == "r")) {
        console.log(ansi.red("You Lose! Better Luck next Time"));
        console.log(` ${ansi.yellow('Player')} chose ` + inputFullName(p));
        console.log(` ${ansi.yellow('Computer')} chose ` + inputFullName(compString));
        computer.score++;
        return;
    }

    // Win
    if ((p == "r" && compString == "s") || (p == "p" && compString == "r") || (p == "s" && compString == "p")) {
        console.log(ansi.greenBright("You Win! You sure showed him"));
        console.log(` ${ansi.yellow('Player')} chose ` + inputFullName(p));
        console.log(` ${ansi.yellow('Computer')} chose ` + inputFullName(compString));
        player.score++;
        return;
    }
}

function playTheGame() {
    let player = new Player("Player", 0);
    let computer = new Player("Computer", 0);

    let skipLogic;

    console.log("");
    console.log(ansi.yellowBright("RPS - The Game"));
    while(true) {
        skipLogic = false;
        
        console.log(` Enter ${ansi.cyanBright.bold('R')} or ${ansi.cyanBright.bold('r')} for ${ansi.grey.bold('Rock')}\n` +
            ` Enter ${ansi.cyanBright.bold('P')} or ${ansi.cyanBright.bold('p')} for ${ansi.white.bold('Paper')}\n` + 
            ` Enter ${ansi.cyanBright.bold('S')} or ${ansi.cyanBright.bold('s')} for ${ansi.blue.bold('Scissors')}\n`);
        
        console.log(`${ansi.yellowBright(`Or`)} Enter ${ansi.cyanBright(`c`)} to view current ${ansi.cyanBright.bold('Score')} or ${ansi.cyanBright(`q`)} to ${ansi.cyanBright.bold('Quit')}\n`);

        let playerChoice = prompt(`Please enter a correct input: `);

        while(checkValidGameInput(playerChoice) == false) {
            console.log();

            if (playerChoice == "c" || playerChoice == "q") {
                if (playerChoice == "c") {
                    player.printScore();
                    console.log();
                }
                if (playerChoice == "q") {
                    skipLogic = true;
                    break;
                }
            }
            else {
                console.log(ansi.red(`Invalid Input`));
            }

            console.log(` Enter ${ansi.cyanBright.bold('R')} or ${ansi.cyanBright.bold('r')} for ${ansi.grey.bold('Rock')}\n` +
                ` Enter ${ansi.cyanBright.bold('P')} or ${ansi.cyanBright.bold('p')} for ${ansi.white.bold('Paper')}\n` + 
                ` Enter ${ansi.cyanBright.bold('S')} or ${ansi.cyanBright.bold('s')} for ${ansi.blue.bold('Scissors')}\n`);

                console.log(`${ansi.yellowBright(`Or`)} Enter ${ansi.cyanBright(`c`)} to view current ${ansi.cyanBright.bold('Score')} or ${ansi.cyanBright(`q`)} to ${ansi.cyanBright.bold('Quit')}\n`);
            
            playerChoice = prompt(`Please enter a correct input: `);
        }

        if (!skipLogic) {
            let computerChoice = getRandomNumber(0, 2);
        
            compareChoices(playerChoice, computerChoice, player, computer);
            console.log();
        }

        let compScoreString, playerScoreString = "";

        if (computer.score > player.score) {
            compScoreString = ansi.green(computer.score);
            playerScoreString = ansi.red(player.score);
        }
        else if (player.score > computer.score) {
            compScoreString = ansi.red(computer.score);
            playerScoreString = ansi.green(player.score);
        }
        else {
            compScoreString = ansi.yellow(computer.score);
            playerScoreString = ansi.yellow(player.score);
        }

        console.log(` ${ansi.yellow(`Player's`)} score is ` + playerScoreString);
        console.log(` ${ansi.yellow(`Computer's`)} score is ` + compScoreString);

        console.log();

        let playAgain = prompt(`Would you like to play again? ${ansi.cyanBright.italic(`y`)} or ${ansi.cyanBright.italic(`n`)}: `);

        while(checkValidEndGameInput(playAgain) == false) {
            console.log(ansi.red(`Invalid Input`));

            playAgain = prompt(`Would you like to play again? ${ansi.cyanBright.italic(`y`)} or ${ansi.cyanBright.italic(`n`)}: `);
        }
        
        console.log();
        if (playAgain == "n") {
            break;
        }
    }
    
    if (checkIsHighscore(player.score)) {
        console.log(`${ansi.green.bold(`New Highscore!`)}\n `);
        let saveScore = prompt(`Would you like to Save your Score? ${ansi.cyanBright.italic(`y`)} or ${ansi.cyanBright.italic(`n`)}: `);

        while(checkValidEndGameInput(saveScore) == false) {
            console.log(ansi.red(`Invalid Input`));

            saveScore = prompt(`Would you like to Save your Score? ${ansi.cyanBright.italic(`y`)} or ${ansi.cyanBright.italic(`n`)}: `);
        }

        console.log();

        if (saveScore == "y") {
            saveHighscore(player);
        }
    }
    
        
}

function run() {
    if (fs.existsSync(scoreFilePath)) {
        readHighscoreFromFile();
    }
    else {
         fs.writeFile(scoreFilePath, JSON.stringify(highscore), { flag: 'wx' }, function (err) {
            throw err;
         });
    }

    try {
        while(true) {
            console.log(`${ansi.yellow.bold(`Welcome to Rock, Paper, Scissors!`)}\n ` +
                (`Enter ${ansi.cyanBright.bold('1')} to ${ansi.cyanBright.italic(`Play the Game`)} \n `) +
                `Enter ${ansi.cyanBright.bold('2')} to ${ansi.cyanBright.italic(`View the Highscore`)} \n ` + 
                `Enter ${ansi.cyanBright.bold('3')} to ${ansi.cyanBright.italic(`Exit`)} \n`);
            
            let menuOption = prompt(`Please enter ${ansi.cyanBright.bold(`1`)}, ${ansi.cyanBright.bold(`2`)} or ${ansi.cyanBright.bold(`3`)}: `);
            while(checkValidMenuInput(menuOption) == false) {
                console.log(ansi.red(`Invalid Input`));
                console.log(`${ansi.yellow.bold(`Welcome to Rock, Paper, Scissors!`)}\n ` +
                    (`Enter ${ansi.cyanBright.bold('1')} to ${ansi.cyanBright.italic(`Play the Game`)} \n `) +
                    `Enter ${ansi.cyanBright.bold('2')} to ${ansi.cyanBright.italic(`View the Highscore`)} \n ` + 
                    `Enter ${ansi.cyanBright.bold('3')} to ${ansi.cyanBright.italic(`Exit`)} \n`);
                    
                menuOption = prompt(`Please enter ${ansi.cyanBright.bold(`1`)}, ${ansi.cyanBright.bold(`2`)} or ${ansi.cyanBright.bold(`3`)}: `);
            }
        
            selectMenu(menuOption);
        }
    }
    catch (error) {
        repeat = false;
         console.log(error);
    }
}

run();