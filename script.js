const state = {
  city: document.body.dataset.city || "Omaha",
  area: "",
  category: "",
  mood: "",
  search: ""
};

const elements = {
  cityFilter: document.querySelector("#city-filter"),
  areaFilter: document.querySelector("#area-filter"),
  categoryFilter: document.querySelector("#category-filter"),
  moodFilter: document.querySelector("#mood-filter"),
  searchInput: document.querySelector("#search-input"),
  clearFilters: document.querySelector("#clear-filters"),
  resultCount: document.querySelector("#result-count"),
  activeFilters: document.querySelector("#active-filters"),
  categoryChips: document.querySelector("#category-chips"),
  listingGrid: document.querySelector("#listing-grid"),
  emptyState: document.querySelector("#empty-state"),
  detailPanel: document.querySelector("#detail-panel"),
  detailMeta: document.querySelector("#detail-meta"),
  detailTitle: document.querySelector("#detail-title"),
  detailDescription: document.querySelector("#detail-description"),
  detailBestFor: document.querySelector("#detail-best-for"),
  detailDuration: document.querySelector("#detail-duration"),
  detailPrice: document.querySelector("#detail-price"),
  detailTrust: document.querySelector("#detail-trust"),
  detailTags: document.querySelector("#detail-tags"),
  detailWhy: document.querySelector("#detail-why"),
  detailCta: document.querySelector("#detail-cta"),
  plannerForm: document.querySelector("#planner-form"),
  plannerMood: document.querySelector("#planner-mood"),
  plannerBudget: document.querySelector("#planner-budget"),
  plannerTime: document.querySelector("#planner-time"),
  plannerTransport: document.querySelector("#planner-transport"),
  plannerArea: document.querySelector("#planner-area"),
  plannerNote: document.querySelector("#planner-note"),
  itineraryOutput: document.querySelector("#itinerary-output"),
  partnerForm: document.querySelector("#partner-form"),
  partnerSuccess: document.querySelector("#partner-success")
};

const experienceCategories = [
  "Food",
  "Coffee",
  "Nightlife",
  "Culture",
  "Tours",
  "Outdoor/Nature",
  "Shopping",
  "Hotels",
  "Transportation",
  "Wellness",
  "Events",
  "Family Friendly",
  "Date Night"
];

function currentCityName() {
  return state.city || document.body.dataset.city || "Omaha";
}

function cityListings(city = currentCityName()) {
  if (typeof ZURI_DATA === "undefined") {
    return [];
  }

  return ZURI_DATA.listings.filter((listing) => listing.city === city);
}

function categoriesForCity(city = currentCityName()) {
  const listingCategories = new Set(
    cityListings(city)
      .filter((listing) => listing.category !== "Ask ZURI")
      .map((listing) => listing.category)
  );

  return experienceCategories.filter((category) => listingCategories.has(category));
}

function areasForCity(city = currentCityName()) {
  return [...new Set(
    cityListings(city)
      .filter((listing) => listing.category !== "Ask ZURI")
      .map((listing) => listing.area)
  )].sort();
}

function addOptions(select, options, placeholder, selectedValue = "") {
  if (!select) {
    return;
  }

  select.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholder;
  select.append(defaultOption);

  options.forEach((option) => {
    const node = document.createElement("option");
    const label = typeof option === "string" ? option : option.name;
    node.value = label;
    node.textContent = label;
    if (label === selectedValue) {
      node.selected = true;
    }
    select.append(node);
  });
}

function listingMatches(listing) {
  const searchText = [
    listing.title,
    listing.area,
    listing.category,
    listing.shortDescription,
    listing.longDescription,
    ...listing.tags
  ].join(" ").toLowerCase();

  const searchMatches = !state.search || searchText.includes(state.search.toLowerCase());
  const cityMatches = listing.city === state.city;
  const areaMatches = !state.area || listing.area === state.area;
  const categoryMatches = !state.category || listing.category === state.category;
  const moodMatches = !state.mood || listing.mood.includes(state.mood);

  return cityMatches && areaMatches && categoryMatches && moodMatches && searchMatches;
}

function getFilteredListings() {
  if (typeof ZURI_DATA === "undefined") {
    return [];
  }

  return ZURI_DATA.listings.filter(listingMatches);
}

function renderActiveFilters() {
  if (!elements.activeFilters) {
    return;
  }

  const filters = [
    ["City", state.city],
    ["Area", state.area],
    ["Category", state.category],
    ["Mood", state.mood],
    ["Search", state.search]
  ].filter((filter) => filter[1]);

  elements.activeFilters.innerHTML = "";
  filters.forEach(([label, value]) => {
    const pill = document.createElement("span");
    pill.className = "filter-pill";
    pill.textContent = `${label}: ${value}`;
    elements.activeFilters.append(pill);
  });
}

function renderCategoryChips() {
  if (!elements.categoryChips) {
    return;
  }

  elements.categoryChips.innerHTML = "";
  categoriesForCity().forEach((category) => {
    const chip = document.createElement("button");
    chip.className = `category-chip${state.category === category ? " is-active" : ""}`;
    chip.type = "button";
    chip.textContent = category;
    chip.addEventListener("click", () => {
      state.category = state.category === category ? "" : category;
      if (elements.categoryFilter) {
        elements.categoryFilter.value = state.category;
      }
      renderListings();
      elements.listingGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    elements.categoryChips.append(chip);
  });
}

function renderListings() {
  if (!elements.resultCount || !elements.emptyState || !elements.listingGrid) {
    return;
  }

  const listings = getFilteredListings();
  elements.resultCount.textContent = `${listings.length} ${listings.length === 1 ? "result" : "results"}`;
  elements.emptyState.hidden = listings.length > 0;
  elements.listingGrid.innerHTML = "";

  listings.forEach((listing) => {
    const card = document.createElement("button");
    card.className = "listing-card";
    card.type = "button";
    card.innerHTML = `
      <span class="card-topline">${listing.category} / ${listing.area}</span>
      <h3>${listing.title}</h3>
      <p>${listing.shortDescription}</p>
      <span class="card-footer">
        <span>${listing.priceLevel}</span>
        <span>${listing.estimatedDuration}</span>
      </span>
      <span class="card-cta">
        <span>${listing.ctaLabel || "View experience"}</span>
        <span aria-hidden="true">View details</span>
      </span>
    `;
    card.addEventListener("click", () => openDetail(listing.id));
    elements.listingGrid.append(card);
  });

  renderActiveFilters();
  renderCategoryChips();
}

function openDetail(listingId) {
  if (typeof ZURI_DATA === "undefined" || !elements.detailPanel) {
    return;
  }

  const listing = ZURI_DATA.listings.find((item) => item.id === listingId);
  if (!listing) {
    return;
  }

  elements.detailMeta.textContent = `${listing.category} / ${listing.area}`;
  elements.detailTitle.textContent = listing.title;
  elements.detailDescription.textContent = listing.longDescription;
  elements.detailBestFor.textContent = listing.bestFor;
  elements.detailDuration.textContent = listing.estimatedDuration;
  elements.detailPrice.textContent = listing.priceLevel;
  elements.detailTrust.textContent = listing.trustSignal;
  elements.detailWhy.textContent = listing.whyZuriRecommendsIt;
  elements.detailCta.textContent = listing.ctaLabel || "Ask ZURI";

  elements.detailTags.innerHTML = "";
  listing.tags.forEach((tag) => {
    const node = document.createElement("span");
    node.className = "tag";
    node.textContent = tag;
    elements.detailTags.append(node);
  });

  elements.detailPanel.classList.add("is-open");
  elements.detailPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  if (!elements.detailPanel) {
    return;
  }

  elements.detailPanel.classList.remove("is-open");
  elements.detailPanel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function clearFilters() {
  state.area = "";
  state.category = "";
  state.mood = "";
  state.search = "";
  if (elements.areaFilter) elements.areaFilter.value = "";
  if (elements.categoryFilter) elements.categoryFilter.value = "";
  if (elements.moodFilter) elements.moodFilter.value = "";
  if (elements.searchInput) elements.searchInput.value = "";
  renderListings();
}

function uniqueByCategory(listings) {
  const chosen = [];
  const categories = new Set();

  listings.forEach((listing) => {
    if (chosen.length < 3 && !categories.has(listing.category)) {
      chosen.push(listing);
      categories.add(listing.category);
    }
  });

  listings.forEach((listing) => {
    if (chosen.length < 3 && !chosen.includes(listing)) {
      chosen.push(listing);
    }
  });

  return chosen;
}

function scoreListing(listing, preferences) {
  let score = 0;

  if (listing.mood.includes(preferences.mood)) score += 4;
  if (preferences.area && listing.area === preferences.area) score += 3;
  if (listing.priceLevel === preferences.budget) score += 2;
  if (preferences.note && searchableText(listing).includes(preferences.note.toLowerCase())) score += 2;
  if (["Food", "Coffee", "Outdoor/Nature", "Culture", "Date Night", "Events"].includes(listing.category)) score += 1;
  if (listing.category === "Ask ZURI") score -= 4;

  return score;
}

function searchableText(listing) {
  return [
    listing.title,
    listing.area,
    listing.category,
    listing.shortDescription,
    listing.longDescription,
    listing.bestFor,
    ...listing.tags
  ].join(" ").toLowerCase();
}

function buildItinerary(preferences) {
  if (typeof ZURI_DATA === "undefined") {
    return { stops: [], usedFallback: true };
  }

  const currentListings = ZURI_DATA.listings.filter((listing) => {
    return listing.city === currentCityName() && listing.category !== "Ask ZURI";
  });

  const exactMatches = currentListings.filter((listing) => {
    const moodMatch = listing.mood.includes(preferences.mood);
    const areaMatch = !preferences.area || listing.area === preferences.area;
    const budgetMatch = listing.priceLevel === preferences.budget;
    return moodMatch && areaMatch && budgetMatch;
  });

  const rankedMatches = [...currentListings].sort((first, second) => {
    return scoreListing(second, preferences) - scoreListing(first, preferences);
  });

  const combined = [...exactMatches, ...rankedMatches].filter((listing, index, array) => {
    return array.findIndex((item) => item.id === listing.id) === index;
  });

  return {
    stops: uniqueByCategory(combined),
    usedFallback: exactMatches.length < 3
  };
}

function movementNote(transport, area) {
  const areaPhrase = area ? ` near ${area}` : " around the selected stops";
  const notes = currentCityName() === "Kigali"
    ? {
        walking: `This is planned as a tight route${areaPhrase}. Kigali is hilly, so use driver support if a stop sits outside a comfortable walk.`,
        rideshare: "Use short rideshares or trusted driver support between neighborhoods so the plan stays relaxed and weather-proof.",
        transit: "Check live local transport options before committing; the prototype does not read Kigali schedules or availability.",
        driving: "Driving or private driver support gives the most flexible Kigali version. Build in time for hills, traffic, and pickup coordination."
      }
    : {
        walking: `This is planned as a tight route${areaPhrase}. If a stop sits outside a comfortable walk, swap in a nearby card or use a short rideshare.`,
        rideshare: "Use short rideshares between neighborhoods so the plan stays relaxed and weather-proof.",
        transit: "Check live ORBT or bus timing before you commit; the prototype favors stops that can be connected simply but does not read live schedules.",
        driving: "Driving gives you the most flexible version of this plan. Build in a few minutes for parking, especially downtown or during events."
      };
  return notes[transport] || notes.rideshare;
}

function budgetNote(budget, usedFallback) {
  const labels = {
    "$": "This keeps the day light: free or lower-cost anchors first, with spending mostly on food, coffee, or transit.",
    "$$": "This is a comfortable Omaha plan: expect a mix of casual paid stops and flexible food or drink spending.",
    "$$$": "This leans premium: reservations, tickets, wellness, hotel, or polished dinner stops may raise the total."
  };
  const fallback = usedFallback ? " A few picks are close matches because the exact filter set had fewer than three options." : "";
  return `${labels[budget]}${fallback}`;
}

function renderItinerary(event) {
  event.preventDefault();

  if (!elements.itineraryOutput) {
    return;
  }

  const preferences = {
    mood: elements.plannerMood.value,
    budget: elements.plannerBudget.value,
    time: elements.plannerTime.value,
    transport: elements.plannerTransport.value,
    area: elements.plannerArea.value,
    note: elements.plannerNote.value.trim()
  };

  const itinerary = buildItinerary(preferences);
  const stopMarkup = itinerary.stops.map((stop, index) => {
    return `
      <li class="itinerary-stop">
        <strong>${index + 1}. ${stop.title}</strong>
        <span>${stop.area} / ${stop.category} / ${stop.estimatedDuration}</span>
        <p>${stop.shortDescription}</p>
      </li>
    `;
  }).join("");

  const noteSentence = preferences.note
    ? ` It also considers your note: "${preferences.note}".`
    : "";

  elements.itineraryOutput.innerHTML = `
    <span class="section-kicker">Your ZURI plan</span>
    <h3>${preferences.time} in ${currentCityName()}: ${preferences.mood.toLowerCase()} and easy to follow.</h3>
    <ol class="itinerary-list">${stopMarkup}</ol>
    <div class="itinerary-notes">
      <div class="note-box">
        <strong>Movement note</strong>
        <span>${movementNote(preferences.transport, preferences.area)}</span>
      </div>
      <div class="note-box">
        <strong>Budget note</strong>
        <span>${budgetNote(preferences.budget, itinerary.usedFallback)}</span>
      </div>
      <div class="note-box">
        <strong>Why it fits</strong>
        <span>ZURI prioritized ${preferences.mood.toLowerCase()} energy, ${preferences.budget} budget fit, and ${preferences.area || `${currentCityName()}-wide`} options from the curated prototype set.${noteSentence}</span>
      </div>
      <div class="note-box">
        <strong>Live concierge disclaimer</strong>
        <span>This prototype does not check live hours, reservations, traffic, weather, or event availability. A live ZURI concierge would verify those details before you go.</span>
      </div>
    </div>
  `;
}

function bindEvents() {
  if (elements.cityFilter) elements.cityFilter.addEventListener("change", (event) => {
    state.city = event.target.value || document.body.dataset.city || "Omaha";
    state.area = "";
    if (elements.areaFilter) addOptions(elements.areaFilter, areasForCity(), "All areas");
    if (elements.plannerArea) addOptions(elements.plannerArea, areasForCity(), "Any area");
    renderListings();
  });

  if (elements.areaFilter) elements.areaFilter.addEventListener("change", (event) => {
    state.area = event.target.value;
    renderListings();
  });

  if (elements.categoryFilter) elements.categoryFilter.addEventListener("change", (event) => {
    state.category = event.target.value;
    renderListings();
  });

  if (elements.moodFilter) elements.moodFilter.addEventListener("change", (event) => {
    state.mood = event.target.value;
    renderListings();
  });

  if (elements.searchInput) elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    renderListings();
  });

  if (elements.clearFilters) elements.clearFilters.addEventListener("click", clearFilters);
  if (elements.plannerForm) elements.plannerForm.addEventListener("submit", renderItinerary);

  document.querySelectorAll("[data-close-detail]").forEach((node) => {
    node.addEventListener("click", closeDetail);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDetail();
    }
  });
}

function bindPartnerForm() {
  if (!elements.partnerForm || !elements.partnerSuccess) {
    return;
  }

  elements.partnerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    elements.partnerSuccess.hidden = false;
    elements.partnerForm.reset();
  });
}

function init() {
  bindPartnerForm();
  bindEvents();

  if (typeof ZURI_DATA === "undefined" || !elements.cityFilter || !elements.listingGrid) {
    return;
  }

  const activeCities = ZURI_DATA.cities.filter((city) => city.isActive);
  addOptions(elements.cityFilter, activeCities, "Choose a city", currentCityName());
  addOptions(elements.areaFilter, areasForCity(), "All areas");
  addOptions(elements.categoryFilter, ZURI_DATA.categories, "All categories");
  addOptions(elements.moodFilter, ZURI_DATA.moods, "All moods");
  addOptions(elements.plannerMood, ZURI_DATA.moods, "Choose a mood", "Easy");
  addOptions(elements.plannerArea, areasForCity(), "Any area");
  renderListings();
}

init();
