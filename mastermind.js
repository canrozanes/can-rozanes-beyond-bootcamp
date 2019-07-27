const mastermind = {};

//all the possible colors in the game
mastermind.colors = ["red", "blue", "yellow", "green", "pink", "white"];
mastermind.rightAnswer = [];
mastermind.gameStarted = false;
mastermind.attemptNumber = -1;

//Selectors
mastermind._pinButtons;
mastermind._guessHolders;
mastermind._clueHolders;
mastermind._checkButton;
mastermind._startResetButton;
mastermind._rulesButton;
mastermind._closeRulesButton;
mastermind._rulesPage;
mastermind._answerHolders;
mastermind._answerCover;

mastermind.userSelectedPin;
mastermind.board = [
  [null,null,null,null],
  [null,null,null,null],
  [null,null,null,null],
  [null,null,null,null],
  [null,null,null,null],
  [null,null,null,null],
  [null,null,null,null],
  [null,null,null,null]];

mastermind.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random()*(max-min)) + min;
}
//generate the answer combination and store it in mastermind.rightAnswer
mastermind.generateRightAnswer = (colors) => {
  mastermind.rightAnswer = [];
  for(let i=0; i<4; i++){
    mastermind.rightAnswer.push(
      colors[mastermind.getRandomInt(0, 6)]
    );
  }
}

mastermind.revealRightAnswer = () => {
  mastermind._answerHolders = [...document.querySelectorAll(".answer-holder .guess-holder")];
  for(let i=0; i<mastermind._answerHolders.length; i++){
    mastermind._answerHolders[i].classList.add("pin", mastermind.rightAnswer[i])
  }
  mastermind._answerCover = document.querySelector(".answer-cover");
  mastermind._answerCover.classList.add("reveal")
}

mastermind.generateClue = (userPattern, rightAnswer) => {
  let blackPegCount = 0;
  let whitePegCount = 0;
  copyUserPattern = [...userPattern];
  copyRightAnswer = [...rightAnswer];
  for (let i = 0; i < userPattern.length; i++) {
    if (copyUserPattern[i] === copyRightAnswer[i]) {
      blackPegCount++;
      copyUserPattern[i] = NaN;
      copyRightAnswer[i] = NaN;
    }
  }
  for (let i = 0; i < userPattern.length; i++) {
    for (let j = 0; j < rightAnswer.length; j++) {
      if (copyRightAnswer[i] === copyUserPattern[j]) {
        whitePegCount++;
        copyUserPattern[j] = NaN;
        copyRightAnswer[i] = NaN;
      }
    }
  }
  return { blackPegCount: blackPegCount, whitePegCount: whitePegCount };
}
mastermind.holeClickHandler = (e) => {
  let currentHole = e.target;

  //first remove all the existing color classes
  currentHole.classList.remove("pin",...mastermind.colors)
  //extract index information from class name

  let indexOfHole = [...currentHole.classList][1].slice(-1);

  //make sure the current hole position is null
  mastermind.board[mastermind.attemptNumber][indexOfHole] = null;

  if (mastermind.userSelectedPin) {
    //add color string to the class of the currentHole
    currentHole.classList.add("pin", mastermind.userSelectedPin);
    //update the board with the color
    mastermind.board[mastermind.attemptNumber][indexOfHole] =
      mastermind.userSelectedPin;
  }
}
mastermind.checkButtonClickHandler = () => {
  let userPattern = mastermind.board[mastermind.attemptNumber];

  if (userPattern.includes(null)) {
    window.alert("please fill all the pin holes");
  } else {
    let pegs = mastermind.generateClue(userPattern, mastermind.rightAnswer);
    let blackPegs = pegs.blackPegCount;
    let whitePegs = pegs.whitePegCount;
    for (let i = 0; i < blackPegs; i++) {
      mastermind._clueHolders[i].classList.add("peg", "black");
    }
    for (let i = 0; i < whitePegs; i++) {
      mastermind._clueHolders[i + blackPegs].classList.add("peg", "white");
    }
    if (blackPegs === 4){
      mastermind._checkButton.classList.remove("showButton");
      mastermind.revealRightAnswer();
      setTimeout(()=>{
        window.alert("Congratulations you won!")
      }, 1000);
    }
    else if(mastermind.attemptNumber===7){
      mastermind.revealRightAnswer();
      window.alert("Sorry you lost");
    }
    else{
      //hide current levels check button
      mastermind._checkButton.classList.remove("showButton");
      //remove the event listener from the current levels holes
      for (let i = 0; i < mastermind._guessHolders.length; i++) {
        mastermind._guessHolders[i].removeEventListener("click",mastermind.holeClickHandler);
      }
      //go to next attempt.
      mastermind.nextAttempt();
    }
  }
}
mastermind.rulesButtonClickHandler = (e) => {
  mastermind._rulesPage.style.display = "flex";
}
mastermind.closeRulesButtonClickHandler = (e) => {
  mastermind._rulesPage.style.display = "none";
}

mastermind.enableDisablePinSelectButtons = (isEnabled) => {

}

mastermind.startResetClickHandler = (e) => {
  console.log(e.target)
  if (e.target.innerHTML === "Reset") {
    window.location.reload();
  }
  if(e.target.innerHTML==="Start"){
    mastermind._startResetButton.innerText = "Reset";
    
    //enable the radio buttons
    mastermind._pinButtons.forEach(pinButton => {
      pinButton.disabled = false;
    });
    mastermind.nextAttempt();
  }
};

mastermind.nextAttempt = () => {
  mastermind.attemptNumber++;
  console.log(mastermind.attemptNumber);
    //only select current levels guessHolders and clueHolders by selecting row$
  mastermind._guessHolders = [...document.querySelectorAll(`.row${mastermind.attemptNumber} .guess-holder`)];
  mastermind._clueHolders = [...document.querySelectorAll(`.row${mastermind.attemptNumber} .clue-holder`)];

    //only make current levels check button visible using the showButton class.
  mastermind._checkButton = document.querySelector(`.row button.check${mastermind.attemptNumber}`);
  mastermind._checkButton.classList.add("showButton");
  
  //add event listener to current rows guessHolder divs.
  for (let i = 0; i < mastermind._guessHolders.length; i++) {
    mastermind._guessHolders[i].addEventListener("click", mastermind.holeClickHandler);
  }
  //add event listener to current levels check button.
  mastermind._checkButton.addEventListener("click", mastermind.checkButtonClickHandler);
}
mastermind.pinSelectHandleChange = (e) => {
  mastermind.userSelectedPin = e.target.value;
  console.log(mastermind.userSelectedPin);
}

mastermind.init = () => {
  mastermind._startResetButton = document.querySelector(".start-reset");
  mastermind._rulesButton = document.querySelector(".rules-button");
  mastermind._rulesPage = document.querySelector('.rules-page');
  mastermind._closeRulesButton = document.querySelector(".close-rules-button");

  //add event listener for the star-reset button
  mastermind._startResetButton.addEventListener("click",mastermind.startResetClickHandler);

  mastermind._rulesButton.addEventListener("click", mastermind.rulesButtonClickHandler);
  mastermind._closeRulesButton.addEventListener("click", mastermind.closeRulesButtonClickHandler)

    //generate the unique answer for the round
  mastermind.generateRightAnswer(mastermind.colors);
  mastermind._pinButtons = document.querySelectorAll("input[name=pin]");

  //add event listener for radio buttons and if user clicks a radio button, store the color in a global variable
  mastermind._pinButtons.forEach(pinButton =>
    pinButton.addEventListener("change", mastermind.pinSelectHandleChange)
  );
  mastermind._pinButtons.forEach(pinButton => {
    pinButton.disabled = true;
    pinButton.checked = false;
  });
};

//when page loads, start the game.
document.addEventListener("DOMContentLoaded", function() {
  mastermind.init();
  console.log(mastermind.rightAnswer);
});


