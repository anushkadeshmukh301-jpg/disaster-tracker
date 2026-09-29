let reports = JSON.parse(
    localStorage.getItem("disasterReports") || "[]"
);

function displayReports() {
    const box = document.getElementById("reports");
    box.innerHTML = "";

    reports.forEach(function(report, index) {
        const card = document.createElement("div");
        card.className = "card";

        const details = document.createElement("p");
        details.textContent =
            report.type + " - " + report.location;

        const remove = document.createElement("button");
        remove.textContent = "Delete";
        remove.addEventListener("click", function() {
            reports.splice(index, 1);
            saveReports();
        });

        card.appendChild(details);
        card.appendChild(remove);
        box.appendChild(card);
    });
}

function saveReports() {
    localStorage.setItem(
        "disasterReports",
        JSON.stringify(reports)
    );
    displayReports();
}

document.getElementById("reportForm")
.addEventListener("submit", function(event) {
    event.preventDefault();

    const location =
        document.getElementById("location").value.trim();

    const type =
        document.getElementById("type").value;

    if (!location) return;

    reports.push({ location: location, type: type });
    saveReports();

    document.getElementById("result").textContent =
        "Report saved successfully!";

    document.getElementById("reportForm").reset();
});

displayReports();
const feedURL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

async function loadEarthquakes() {
  const status = document.getElementById("apiStatus");
  const box = document.getElementById("liveAlerts");

  status.textContent = "Loading live earthquake data...";
  box.replaceChildren();

  try {
    const response = await fetch(feedURL);

    if (!response.ok) {
      throw new Error("Could not load earthquake data");
    }

    const data = await response.json();

    status.textContent =
      "Earthquakes recorded in the past 24 hours: " +
      data.features.length;

    if (data.features.length === 0) {
      box.textContent = "No earthquakes found in this feed.";
      return;
    }

    data.features.slice(0, 20).forEach(function(item) {
      const p = item.properties;

      const card = document.createElement("div");
      card.className = "card";

      const title = document.createElement("h3");
      title.textContent = "Magnitude: " + p.mag;

      const place = document.createElement("p");
      place.textContent = "Location: " + p.place;

      const time = document.createElement("p");
      time.textContent =
        "Time: " + new Date(p.time).toLocaleString();

      const link = document.createElement("a");
      link.href = p.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "View USGS details";

      card.append(title, place, time, link);
      box.appendChild(card);
    });

  } catch (error) {
    status.textContent =
      "Unable to load data. Check your internet connection and try again.";
  }
}

document.getElementById("refreshAlerts")
  .addEventListener("click", loadEarthquakes);

loadEarthquakes();

// Refresh data every 5 minutes
setInterval(loadEarthquakes, 5 * 60 * 1000);