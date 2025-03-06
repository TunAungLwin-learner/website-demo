const username = document.getElementById("username");
const saveScorebtn = document.getElementById("saveScorebtn");
const finalScore = document.getElementById("finalScore");

// Load the score from localStorage or default to 0
document.addEventListener("DOMContentLoaded", () => {
    const score = localStorage.getItem("mostRecentScore");
    console.log("Retrieved Score:", score); // Debugging log
    finalScore.innerText = score ? score : "0";
});

// Enable Save button when user types a name
username.addEventListener("input", () => {
    saveScorebtn.disabled = !username.value.trim();
});

// Save high score function
function saveHighScore(event) {
    event.preventDefault(); // Prevent form submission

    const scoreValue = parseInt(finalScore.innerText) || 0;
    const userNameValue = username.value.trim();

    if (!userNameValue) {
        alert("Please enter a username.");
        return;
    }

    // Create a score object
    const score = {
        score: scoreValue,
        name: userNameValue
    };

    // Get existing high scores from localStorage
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    // Add new score to the high scores array
    highScores.push(score);

    // Sort high scores in descending order (highest first)
    highScores.sort((a, b) => b.score - a.score);

    // Keep only top 5 scores
    highScores.splice(5);

    // Save updated high scores
    localStorage.setItem("highScores", JSON.stringify(highScores));

    // Redirect to home page after saving
    window.location.href = "/";
}
