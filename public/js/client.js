document.addEventListener("DOMContentLoaded", () => {
  const scoresContainer = document.getElementById("scores-container");
  const standingsContainer = document.getElementById("standings-container");

  function loadScores() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/json-scores", true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          console.log("Parsed JSON data:", data);
          // Clear the container
          scoresContainer.innerHTML = "";

          // Create a card for each match
          data.matches.forEach((match) => {
            // Create card element
            const card = document.createElement("div");
            card.className = "match-card";

            // Populate card content
            card.innerHTML = `
              <h3>${match.teamA} vs ${match.teamB}</h3>
              <p><strong>Score:</strong> ${match.scoreA} - ${match.scoreB}</p>
              <p><strong>Date:</strong> ${match.date}</p>
              <p><strong>Location:</strong> ${match.location}</p>
            `;

            // Add card to container
            scoresContainer.appendChild(card);
          });
        } catch (error) {
          console.error("Error parsing JSON:", error);
          scoresContainer.innerHTML = "<p>Couldn't parse scores data</p>";
        }
      } else {
        console.error("Failed to load JSON scores:", xhr.status);
        scoresContainer.innerHTML = "<p>Couldn't load scores data</p>";
      }
    };

    xhr.onerror = () => {
      console.error("Network error occurred while loading scores");
      scoresContainer.innerHTML =
        "<p>Network error occurred while loading scores</p>";
    };
    console.log("opened request");
    xhr.send();
  }

  function loadStandings() {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "api/html-standings");
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = xhr.responseText;
      } else {
        console.error("Failed to load standings:", xhr.status);
      }
    };
    xhr.onerror = () => {
      console.error("Network error");
    };

    xhr.send();
  }

  console.log("scores loaded");
  loadScores();
  loadStandings();
});
