const mastermind = {};

mastermind.colors = ["red", "blue", "yellow", "green", "pink", "white"];
mastermind.rightAnswer = [];

mastermind.attemptNumber = 0;

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
  for(let i=0; i<4; i++){
    mastermind.rightAnswer.push(
      colors[mastermind.getRandomInt(0, 6)]
    );
  }
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

mastermind.nextAttempt = () => {

}

document.addEventListener("DOMContentLoaded", function() {
  //generate the unique answer for the round
  mastermind.generateRightAnswer(mastermind.colors);

  let _pinButtons = document.querySelectorAll(".pin input[name=pin]");

  //add event listener for radio buttons and if user clicks a radio button, store the color in a global variable
  _pinButtons.forEach(pinButton =>
    pinButton.addEventListener("change", function(e) {
      mastermind.userSelectedPin = e.target.value;
      console.log(mastermind.userSelectedPin);
    })
  );
  //only select current levels guessHolders by selecting row$
  let _guessHolders = document.querySelectorAll(
    `.row${mastermind.attemptNumber} .guess-holder`
  );
  let _clueHolders = [...document.querySelectorAll(
    `.row${mastermind.attemptNumber} .clue-holder`
  )];
  console.log(_clueHolders)
  //only make current levels check button visible using the showButton class.
  let _checkButton = document.querySelector(`.row button.check${mastermind.attemptNumber}`);
  _checkButton.classList.add("showButton");
  

  //add event listener to current rows guessHolder divs.
  _guessHolders.forEach((guessHolder) => {
    guessHolder.addEventListener("click", function() {
      guessHolder.classList.remove(...mastermind.colors);

      //extract index information from class name
      let indexOfGuess = [...guessHolder.classList][1].slice(-1);
      //make sure the board selection is null
      mastermind.board[mastermind.attemptNumber][indexOfGuess] = null;

      if (mastermind.userSelectedPin) {
        guessHolder.classList.add(mastermind.userSelectedPin);
        mastermind.board[mastermind.attemptNumber][indexOfGuess] =
          mastermind.userSelectedPin;
        // console.log(mastermind.board);
      }
    })})
  
  _checkButton.addEventListener("click", function(){
    let userPattern = mastermind.board[mastermind.attemptNumber];
    
    if (userPattern.includes(null)){
      window.alert("please fill all the pin holes")
    }
    else{
      let pegs = mastermind.generateClue(userPattern, mastermind.rightAnswer);
      let blackPegs = pegs.blackPegCount;
      let whitePegs = pegs.whitePegCount;
      for(let i=0; i<blackPegs; i++){
        _clueHolders[i].classList.add("black")
      }
      for (let i = 0; i < whitePegs; i++) {
        _clueHolders[i+blackPegs].classList.add("white");
      }
      mastermind.attemptNumber++;
      _guessHolders.forEach(guessHolder =>
        guessHolder.removeEventListener("click", mastermind.fillGuessHole)
      );
    }
    
  })

  console.log(mastermind.rightAnswer);
  // console.log(mastermind.generateClue([1,2,3,4],[4,3,2,1]))
});


