class TriviaGame {
  constructor() {
      this.API_URL = 'https://opentdb.com/api.php?amount=5&type=multiple';
      this.currentQuestionIndex = 0;
      this.countdownDuration = 30;
      this.countdown = null;
      this.questions = [];

      this.fetchData = this.fetchData.bind(this);
      this.displayQuestion = this.displayQuestion.bind(this);
      this.shuffleAnswers = this.shuffleAnswers.bind(this);
      this.checkAnswer = this.checkAnswer.bind(this);
      this.nextQuestion = this.nextQuestion.bind(this);
      this.startCountdown = this.startCountdown.bind(this);
      this.startGame = this.startGame.bind(this);
      this.gameOver = this.gameOver.bind(this);

      // Start the game
      this.startGame();
  }

  async fetchData() {
      try {
          const response = await fetch(this.API_URL);

          if (response.status === 429) {
              console.error('API Rate Limit Exceeded. Waiting for 5 seconds before making another request.');
              await new Promise(resolve => setTimeout(resolve, 5000));
              return this.fetchData();
          }

          const data = await response.json();
          return data.results;
      } catch (error) {
          console.error('Error fetching data:', error);
          return [];
      }
  }

  displayQuestion(question) {
      const questionElement = document.getElementById('question');
      const answersElement = document.getElementById('answers');

      questionElement.textContent = question.question;
      answersElement.innerHTML = '';

      question.incorrect_answers.forEach(answer => {
          answersElement.innerHTML += `<li onclick="triviaGame.checkAnswer(this)">${answer}</li>`;
      });

      const correctAnswerIndex = Math.floor(Math.random() * (question.incorrect_answers.length + 1));
      answersElement.innerHTML += `<li onclick="triviaGame.checkAnswer(this)">${question.correct_answer}</li>`;

      this.shuffleAnswers(answersElement.children);
  }

  shuffleAnswers(answers) {
      const answersArray = Array.from(answers);

      for (let i = answersArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answersArray[i], answersArray[j]] = [answersArray[j], answersArray[i]];
      }

      answersArray.forEach(answer => {
          document.getElementById('answers').appendChild(answer);
      });
  }

  checkAnswer(selectedAnswer) {
    clearInterval(this.countdown);
    const resultContainer = document.getElementById('result-container');
    const resultElement = document.getElementById('result');
    const nextButton = document.getElementById('next-btn');

    if (this.questions[this.currentQuestionIndex]) {
        const correctAnswer = this.questions[this.currentQuestionIndex].correct_answer;

        if (selectedAnswer.textContent === correctAnswer) {
            resultElement.textContent = 'Correct!';
            resultElement.className = 'result correct';
        } else {
            resultElement.textContent = 'Wrong!';
            resultElement.className = 'result wrong';
        }
    } else {
        console.error('No valid question found.');
    }

    resultContainer.style.display = 'block';
    nextButton.style.display = 'block';
}

  nextQuestion() {
      const resultContainer = document.getElementById('result-container');
      const nextButton = document.getElementById('next-btn');
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < this.questions.length) {
          resultContainer.style.display = 'none';
          nextButton.style.display = 'none';
          this.displayQuestion(this.questions[this.currentQuestionIndex]);
          this.startCountdown();
      } else {
          this.gameOver();
      }
  }

  startCountdown() {
      let seconds = this.countdownDuration;
      const timerElement = document.getElementById('timer');
      this.countdown = setInterval(() => {
          timerElement.textContent = `Time Left: ${seconds} seconds`;
          if (seconds <= 0) {
              clearInterval(this.countdown);
              this.checkAnswer();
          }
          seconds--;
      }, 1000);
  }

  startGame() {
      this.fetchData().then(data => {
          if (data.length > 0) {
              this.questions = data;
              this.displayQuestion(this.questions[this.currentQuestionIndex]);
              this.startCountdown();
          } else {
              console.error('No valid questions received.');
          }
      });
  }

  gameOver() {
      alert('Game Over! You completed all questions.');
  }
}

// Instantiate the game and make it accessible
window.triviaGame = new TriviaGame();
