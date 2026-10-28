// People & Locations view.
import { state } from "../core/state.js";
import { countEvidenceForPerson } from "../core/lookup.js";
import { navigateTo } from "../app/nav.js";

type PeopleTab = "people" | "locations";

export function handlePeopleTabClick(event: MouseEvent): void {
  const tab = (event.currentTarget as HTMLElement).dataset.peopleTab as PeopleTab | undefined;
  if (tab) switchPeopleTab(tab);
}

function switchPeopleTab(tab: PeopleTab): void {
  const peoplePanel = document.getElementById("peoplePanel")!;
  const locationsPanel = document.getElementById("locationsPanel")!;
  const peopleTabBtn = document.getElementById("tabPeopleBtn")!;
  const locationsTabBtn = document.getElementById("tabLocationsBtn")!;

  if (tab === "people") {
    peoplePanel.classList.remove("hidden");
    locationsPanel.classList.add("hidden");
    peopleTabBtn.classList.add("active");
    locationsTabBtn.classList.remove("active");
  } else {
    peoplePanel.classList.add("hidden");
    locationsPanel.classList.remove("hidden");
    peopleTabBtn.classList.remove("active");
    locationsTabBtn.classList.add("active");
  }
}

export function renderPeople(): void {
  const container = document.getElementById("peoplePanel")!;
  let html = "";
  for (const person of state.allPeople) {
    const count = countEvidenceForPerson(person);

    html += '<div class="person-card">';
    html += '<div class="person-card-header">';
    html +=
      '<img class="person-avatar" src="' +
      person.avatar +
      '" alt="Portrait of ' +
      person.name +
      '">';
    html +=
      "<div><h3>" + person.name + '</h3><div class="person-role">' + person.role + "</div></div>";
    html += "</div>";
    html += "<p><strong>Speciality:</strong> " + person.speciality + "</p>";
    html += "<ul>";
    for (const responsibility of person.responsibilities) {
      html += "<li>" + responsibility + "</li>";
    }
    html += "</ul>";
    html += '<div class="person-statement">&ldquo;' + person.statement + "&rdquo;</div>";
    html += "<p>" + count + " related evidence item" + (count === 1 ? "" : "s") + " &mdash; ";
    html +=
      '<button type="button" class="evidence-count-link" data-person-id="' +
      person.id +
      '">view</button></p>';
    html += "</div>";
  }
  container.innerHTML = html;

  container.querySelectorAll<HTMLElement>(".evidence-count-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const personId = (event.target as HTMLElement).getAttribute("data-person-id");
      (document.getElementById("filterPerson") as HTMLSelectElement).value = personId ?? "";
      navigateTo("evidence");
    });
  });
}

export function renderLocations(): void {
  const container = document.getElementById("locationsPanel")!;
  let html = "";
  for (const loc of state.allLocations) {
    html += '<div class="location-card">';
    html += "<h3>" + loc.id + " &mdash; " + loc.name + "</h3>";
    html += "<p>" + loc.description + "</p>";
    html += "<p><strong>Contains:</strong></p><ul>";
    for (const item of loc.contains) {
      html += "<li>" + item + "</li>";
    }
    html += "</ul></div>";
  }
  container.innerHTML = html;
}
