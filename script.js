// import {shuffle} from './shuffle.js';
// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount =0;
let equationsArray = [];
let PlayerGuessArray=[];
let bestScoreArray=[];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed =0;
let baseTime=0;
let penaltyTime=0;
let finalTime=0;
let finalTimeDisplay='0.0';



// Scroll
let valueY=0;

// Refresh Splash Page Best Scores
function bestScoresToDOM(){
  bestScores.forEach((bestScore,index)=>{
    const bestScoreEl=bestScore;
    bestScoreEl.textContent=`${bestScoreArray[index].bestScore}s`;

  });

}

// check Local Storage for Best scores,set bestScoreArray
function getSavedBestScores(){
  if(localStorage.getItem('bestScores')){
    bestScoreArray=JSON.parse(localStorage.bestScores);
  }else{
    bestScoreArray=[
      {question:10,bestScore:finalTimeDisplay},
      {question:25,bestScore:finalTimeDisplay},
      {question:50,bestScore:finalTimeDisplay},
      {question:99,bestScore:finalTimeDisplay},

    ];
    localStorage.setItem('bestScores',JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();

}

// Update Best Score Array
function updateBestScore(){
  bestScoreArray.forEach((score,index)=>{
    // Select correct Best Score to update
    if(questionAmount== score.question){
      
      // Return Best score as number with one decimal
      const savedBestScore =parseInt(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
     
      if(savedBestScore ===0 || savedBestScore > finalTime){
       
        bestScoreArray[index].bestScore=finalTimeDisplay;
      }

    }

  });
  // Update Splash Page
  bestScoresToDOM();
  // Save to Local Storage
  localStorage.setItem('bestScores',JSON.stringify(bestScoreArray));
}

// Reset Game
function playAgain(){
  gamePage.addEventListener('click',startTimer);
  scorePage.hidden=true;
  splashPage.hidden=false;
  equationsArray=[];
  PlayerGuessArray=[];
  valueY=0;
  playAgainBtn.hidden=true;
}

// Show Score Page
function showScorePage(){
  // Show Play Again button after 1 second
  setTimeout(()=>{
    playAgainBtn.hidden=false;

  },1000);
  gamePage.hidden=true;
  scorePage.hidden=false;
}

// Format & Display Time in DOM
function scoresToDOM(){
  finalTimeDisplay=finalTime.toFixed(1);
  baseTime=timePlayed.toFixed(1);
  penaltyTime=penaltyTime.toFixed(1);
  baseTimeEl.textContent=`Base time :${baseTime}s`;
  penaltyTimeEl.textContent=`Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent=`${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to Top, go to Score Page
  itemContainer.scrollTo({top:0,behavior:'instant'});
  showScorePage();
} 

// Stop Timer,Process Results,go to Score Page
function checkTime(){
  
  if (PlayerGuessArray.length== questionAmount){
   
    clearInterval(timer);
    // check for wrong guesses,add penalty time
    equationsArray.forEach((equation,index)=>{
      if(equation.evaluated=== PlayerGuessArray[index]){
        // Correct Guess,No penalty
      }else{
        // InCorrect Guess,No penalty
        penaltyTime+=0.5;

      }

    });
    finalTime=timePlayed+penaltyTime;
    
    scoresToDOM();
  }
}


// Add a tenth of a second to timePlayed
function addTime(){
  timePlayed+=0.1;
  checkTime();
}

// Start timer when game page is clicked
function startTimer(){
  // Reset times
  timePlayed=0;
  penaltyTime=0;
  finalTime=0;
  timer=setInterval(addTime,100);
  gamePage.removeEventListener('click',startTimer);
}

// Scroll,Store user selection in playerGuessArray
function select(guessedTrue){

  // Scroll 80 pixels at a time 
  valueY+=80;
  itemContainer.scroll(0,valueY);
  // Add player guess to array
  return guessedTrue ? PlayerGuessArray.push('true'):PlayerGuessArray.push('false');

}


// Displays Game Page
function showGamePage(){
  gamePage.hidden=false;
  countdownPage.hidden=true;
}

// Get Random Number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
 
  // Set amount of wrong equations
  const wrongEquations = questionAmount-correctEquations;

  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
 
  // equationsToDOM();
}

// Add Equations to DOM
function equationsToDOM(){
  equationsArray.forEach((equation)=>{
    // Item
    const item =document.createElement('div');
    item.classList.add('item');
    // Equations Text
    const equationText =document.createElement('h1');
    equationText.textContent=equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);


  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}


//Displays 3 2 1 Go1
function countdownStart(){
  countdown.textContent='3';
  setTimeout(()=>{
    countdown.textContent='2';
  },1000);
  setTimeout(()=>{
    countdown.textContent='1';
  },2000);
  setTimeout(()=>{
    countdown.textContent='Go!';
  },3000);


}

// Navigate from Splash Page to Countdown Page
function showCountdown(){
  countdownPage.hidden=false;
  splashPage.hidden=true;
  countdownStart();
  // createEquations();
  populateGamePage();
  setTimeout(showGamePage,4000);
}

// Get the value from selected radio button
function getRadioValue(){
  let radioValue;
  radioInputs.forEach((radioInput)=>{
    if(radioInput.checked){
      radioValue=radioInput.value;
    
    }

  });
  return radioValue;
}



// Form that decides amount of questions
function selectQuestionAmount(e){
  e.preventDefault();
  questionAmount=getRadioValue();

 
  if(questionAmount){
    showCountdown();

  }
}


startForm.addEventListener('click',()=>{
 radioContainers.forEach((radioEl)=>{
  //  Remove Selected label Stlying
  radioEl.classList.remove('selected-label');
  // Add it back if radio input is checked
  if(radioEl.children[1].checked){
    radioEl.classList.add('selected-label');
  }

 });
});

//Event Listeners
startForm.addEventListener('submit',selectQuestionAmount);
gamePage.addEventListener('click',startTimer);

// On Load
getSavedBestScores();