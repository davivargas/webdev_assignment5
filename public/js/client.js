document.addEventListener("DOMContentLoaded", () => {
  const scoresContainer = document.getElementById("scores-container");
  const standingsContainer = document.getElementById("standings-container");

  function loadScores(sport) {
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
          data[sport].forEach((match) => {
            // Create card element
            const card = document.createElement("div");
            card.className = "match-card";

            // Populate card content
            card.innerHTML = `
              <div><img src="/img/${sport}-icons/${match.teamA}" class="team-icon"/>
              <span class="team-score">${match.scoreA}</span>
               <strong>vs</strong><span class="team-score">${match.scoreB}</span>
               <img src="/img/${sport}-icons/${match.teamB}" class="team-icon"/></div>
              <p>${match.date}</p>
              <p>${match.location}</p>
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

  function setupSportSelectors() {
    const sportButtons = Array.from(document.getElementsByClassName("nav2btn"));

    // Add 'active' class to the default sport button
    document.getElementById("soccer").classList.add("active");

    sportButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Restore background color from all buttons
        sportButtons.forEach((btn) => btn.classList.remove("active"));

        // Set active background color for the clicked button
        button.classList.add("active");

        // Load scores for the selected sport
        loadScores(button.id);
      });
    });
  }

  loadScores("soccer");
  loadStandings();
  setupSportSelectors();
});
