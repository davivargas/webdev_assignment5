document.addEventListener("DOMContentLoaded", () => {
  const scoresContainer = document.getElementById("scores-container");
  const standingsContainer = document.getElementById("standings-container");
  const bannerContainer = document.getElementById("banner-fig");
  const sports = ["soccer", "hockey", "football", "basketball"];
  let currentSportIndex = sports.indexOf("soccer");
  let currentSportDisplayed = sports[currentSportIndex];

  function loadBannerImage(sport) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/json-banners");

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          data[sport].forEach((banner) => {
            bannerContainer.innerHTML = "";
            bannerContainer.innerHTML = `
                      <img alt="news-banner img" src="/img/banners/${sport}.jpg" />
                      <figcaption id="banner-figcap">
                          <p id="b-figcap1">${banner.figcaption1}</p>
                          <p id="b-figcap2">
                              ${banner.figcaption2}
                          </p>
                      </figcaption>`;
          });
        } catch (error) {
          console.error("Couldn't load banner image.");
        }
      } else {
        console.error("Failed to load banner images:", xhr.status);
      }
    };

    xhr.onerror = () => {
      console.error("Network error while loading banners.");
    };
    xhr.send();
  }

  function loadScores(sport) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/json-scores", true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);

          scoresContainer.innerHTML = "";

          data[sport].forEach((match) => {
            const card = document.createElement("div");
            card.className = "match-card";

            card.innerHTML = `
              <div><img src="/img/${sport}-icons/${match.teamA}" class="team-icon"/>
              <span class="team-score">${match.scoreA}</span>
               <strong>vs</strong><span class="team-score">${match.scoreB}</span>
               <img src="/img/${sport}-icons/${match.teamB}" class="team-icon"/></div>
              <p>${match.date}</p>
              <p>${match.location}</p>
            `;

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

  function updateSportDisplay() {
    currentSportDisplayed = sports[currentSportIndex];
    loadBannerImage(currentSportDisplayed);
    loadScores(currentSportDisplayed);
    loadStandings(currentSportDisplayed);

    const activeButton = document.getElementById(currentSportDisplayed);
    document
      .querySelectorAll(".nav2btn")
      .forEach((button) => button.classList.remove("active"));
    if (activeButton) activeButton.classList.add("active");
  }

  let touchStartX = 0;
  let touchEndX = 0;

  bannerContainer.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  bannerContainer.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipeGesture();
  });

  function handleSwipeGesture() {
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > 50) {
      currentSportIndex =
        (currentSportIndex - 1 + sports.length) % sports.length;
      updateSportDisplay();
    } else if (swipeDistance < -50) {
      currentSportIndex = (currentSportIndex + 1) % sports.length;
      updateSportDisplay();
    }
  }

  function setupSportSelectors() {
    const sportsButtons = Array.from(
      document.getElementsByClassName("nav2btn")
    );

    document.getElementById(currentSportDisplayed).classList.add("active");

    sportsButtons.forEach((button) => {
      button.addEventListener("click", () => {
        sportsButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        currentSportDisplayed = button.id;
        currentSportIndex = sports.indexOf(currentSportDisplayed);
        updateSportDisplay();
      });
    });
  }

  updateSportDisplay();
  setupSportSelectors();
});
