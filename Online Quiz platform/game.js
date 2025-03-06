document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded!");

    // Select elements
    const question = document.getElementById("question");
    const choices = Array.from(document.getElementsByClassName("choice-text"));
    const progressText = document.getElementById("progressText");
    const scoreText = document.getElementById("score");
    const progressBarFull = document.getElementById("progressBarFull");
    const loader = document.getElementById("loader");
    const game = document.getElementById("game");

    // Check if all elements exist
    if (!question || !choices.length || !progressText || !scoreText || !progressBarFull || !loader || !game) {
        console.error("One or more DOM elements not found!");
        return;
    }

    // Game variables
    let currentQuestion = {};
    let acceptingAnswers = false;
    let score = 0;
    let questionCounter = 0;
    let availableQuestions = [];

    const CORRECT_BONUS = 10;
    const MAX_QUESTIONS = 3;

    // Hide the game initially, show the loader
    game.classList.add("hidden");
    loader.classList.remove("hidden");

    // Fetch questions from JSON
    fetch("music.json")
        .then(res => res.json())
        .then(loadedQuestions => {
            console.log("Loaded Questions:", loadedQuestions);

            availableQuestions = loadedQuestions.results.map(loadedQuestion => {
                const formattedQuestion = {
                    question: decodeHTMLEntities(loadedQuestion.question)
                };

                const answerChoices = [...loadedQuestion.incorrect_answers];
                formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;

                // Insert correct answer at the random index
                answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

                // Assign choices to formattedQuestion
                answerChoices.forEach((choice, index) => {
                    formattedQuestion["choice" + (index + 1)] = decodeHTMLEntities(choice);
                });

                return formattedQuestion;
            });

            console.log("Formatted Questions:", availableQuestions);
            startGame();
        })
        .catch(err => {
            console.error("Error fetching questions:", err);
            loader.innerText = "Failed to load questions. Please try again.";
        });

    function startGame() {
        console.log("Game started!");
        questionCounter = 0;
        score = 0;
        getNewQuestion();

        // Hide loader and show the game
        loader.classList.add("hidden");
        game.classList.remove("hidden");
    }

    function getNewQuestion() {
        if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
            localStorage.setItem("mostRecentScore", score);
            return window.location.assign("/end.html");
        }

        questionCounter++;
        progressText.innerText = `Question ${questionCounter} / ${MAX_QUESTIONS}`;
        progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

        const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[questionIndex];
        question.innerText = currentQuestion.question;

        choices.forEach(choice => {
            const number = choice.dataset["number"];
            choice.innerText = currentQuestion["choice" + number];
        });

        availableQuestions.splice(questionIndex, 1);
        acceptingAnswers = true;
    }

    choices.forEach(choice => {
        choice.addEventListener("click", e => {
            if (!acceptingAnswers) return;

            acceptingAnswers = false;
            const selectedChoice = e.target;
            const selectedAnswer = selectedChoice.dataset["number"];
            const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

            if (classToApply === "correct") {
                incrementScore(CORRECT_BONUS);
            }

            selectedChoice.parentElement.classList.add(classToApply);

            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestion();
            }, 1000);
        });
    });

    function incrementScore(num) {
        score += num;
        scoreText.innerText = score;
    }

    // Helper function to decode HTML entities
    function decodeHTMLEntities(text) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    }
});
