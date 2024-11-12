document.addEventListener("DOMContentLoaded", () => {
  const scoresContainer = document.getElementById("scores-container");
  const standingsContainer = document.getElementById("standings-container");
  let currentSportDisplayed = "soccer";

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

  function loadStandings(sport) {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", `api/standings/${sport}`);

    xhr.onload = () => {
      if (xhr.status === 200) {
        standingsContainer.innerHTML = "";
        standingsContainer.innerHTML = xhr.responseText;

        const data = xhr.responseText;
      } else {
        console.error("Failed to load standings:", xhr.status);
        standingsContainer.innerHTML = "<p>Couldn't load standings data.</p>";
      }
    };
    xhr.onerror = () => {
      console.error("Network error");
      standingsContainer.innerHTML =
        "<p>Network error while loading standings.</p>";
    };

    xhr.send();
  }

  function setupSportSelectors() {
    const sports = Array.from(document.getElementsByClassName("nav2btn"));

    // Add 'active' class to the default sport button
    document.getElementById(currentSportDisplayed).classList.add("active");

    sports.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove "active" class from all buttons
        sports.forEach((btn) => btn.classList.remove("active"));

        // Set "active "class for the clicked button
        button.classList.add("active");

        // Load scores for the selected sport if not the current one
        if (button.id != currentSportDisplayed) {
          currentSportDisplayed = button.id;
          loadScores(currentSportDisplayed);
          loadStandings(currentSportDisplayed);
        }
      });
    });
  }

  loadScores(currentSportDisplayed);
  loadStandings(currentSportDisplayed);
  setupSportSelectors();
});
