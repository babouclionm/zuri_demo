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

const categoryImages = {
  Food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  Coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  Nightlife: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  Culture: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
  Tours: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "Outdoor/Nature": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
  Shopping: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
  Hotels: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  Transportation: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80",
  Wellness: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
  Events: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
  "Family Friendly": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=900&q=80",
  "Date Night": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "Ask ZURI": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
};

const cityImages = {
  Omaha: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Omaha_skyline_2010.jpg/960px-Omaha_skyline_2010.jpg",
  Lincoln: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Skyline_of_Downtown_Lincoln,_Nebraska,_USA_(2024).jpg?width=900",
  Kigali: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Kigali_skyline.jpg/900px-Kigali_skyline.jpg",
  Rwamagana: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lake_muhazi.jpg?width=900"
};

const locationOverrides = {
  "old-market-walk": { label: "Old Market, Omaha", query: "Old Market Omaha NE" },
  "block-16-lunch": { label: "Block 16, Omaha", query: "Block 16 Omaha NE" },
  "archetype-blackstone": { label: "Archetype Coffee Blackstone, Omaha", query: "Archetype Coffee Blackstone Omaha NE" },
  "mula-blackstone": { label: "Mula Mexican Kitchen & Tequileria, Omaha", query: "Mula Omaha Blackstone NE" },
  "benson-night-out": { label: "Benson Creative District, Omaha", query: "Benson Creative District Omaha NE" },
  "joslyn-arts": { label: "Joslyn Art Museum, Omaha", query: "Joslyn Art Museum Omaha NE" },
  "durham-museum": { label: "The Durham Museum, Omaha", query: "The Durham Museum Omaha NE" },
  "gene-leahy-mall": { label: "Gene Leahy Mall, Omaha", query: "Gene Leahy Mall Omaha NE" },
  "lauritzen-gardens": { label: "Lauritzen Gardens, Omaha", query: "Lauritzen Gardens Omaha NE" },
  "hollywood-candy": { label: "Hollywood Candy, Omaha", query: "Hollywood Candy Omaha NE" },
  "fontenelle-forest": { label: "Fontenelle Forest, Bellevue", query: "Fontenelle Forest Bellevue NE" },
  "salt-and-spa": { label: "Midtown Omaha wellness area", query: "Midtown Omaha wellness spa" },
  "kimpton-cottonwood": { label: "Kimpton Cottonwood Hotel, Omaha", query: "Kimpton Cottonwood Hotel Omaha NE" },
  "orbt-downtown": { label: "ORBT Downtown Omaha stop area", query: "ORBT Downtown Omaha NE" },
  "steelhouse-show": { label: "Steelhouse Omaha", query: "Steelhouse Omaha NE" },
  "zoo-family-day": { label: "Omaha Henry Doorly Zoo and Aquarium", query: "Omaha Henry Doorly Zoo and Aquarium" },
  "via-farinas-date": { label: "Via Farina, Omaha", query: "Via Farina Omaha NE" },
  "inner-rail-aksarben": { label: "Inner Rail Food Hall, Omaha", query: "Inner Rail Food Hall Omaha NE" },
  "dundee-shopping": { label: "Dundee neighborhood, Omaha", query: "Dundee Omaha NE" },
  "ask-zuri-custom": { label: "Downtown Omaha", query: "Downtown Omaha NE" },
  "kigali-city-first-timer": { label: "Kigali city center", query: "Kigali city center Rwanda" },
  "kimironko-market-browse": { label: "Kimironko Market, Kigali", query: "Kimironko Market Kigali Rwanda" },
  "kigali-genocide-memorial": { label: "Kigali Genocide Memorial", query: "Kigali Genocide Memorial Rwanda" },
  "nyamirambo-walk": { label: "Nyamirambo, Kigali", query: "Nyamirambo Kigali Rwanda" },
  "question-coffee-stop": { label: "Question Coffee, Kigali", query: "Question Coffee Kigali Rwanda" },
  "inema-arts-center": { label: "Inema Arts Center, Kigali", query: "Inema Arts Center Kigali Rwanda" },
  "lake-muhazi-easy-day-plan": { label: "Lake Muhazi, Rwanda", query: "Lake Muhazi Rwanda" },
  "akagera-gateway-transport-support": { label: "Akagera National Park gateway route", query: "Akagera National Park Rwanda" }
};

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

function getListingImage(listing) {
  return listing.imageUrl || categoryImages[listing.category] || cityImages[listing.city] || categoryImages.Tours;
}

function getLocationInfo(listing) {
  const override = locationOverrides[listing.id];
  const label = override?.label || `${listing.area}, ${listing.city}`;
  const query = override?.query || `${listing.title} ${listing.area} ${listing.city} ${listing.country}`;
  const encodedQuery = encodeURIComponent(query);

  return {
    label,
    googleUrl: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
    appleUrl: `https://maps.apple.com/?q=${encodedQuery}`
  };
}

function openMap(event) {
  event.stopPropagation();
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
    getLocationInfo(listing).label,
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
    const location = getLocationInfo(listing);
    const card = document.createElement("article");
    card.className = "listing-card";
    card.innerHTML = `
      <button class="listing-card-main" type="button" aria-label="View ${listing.title} details">
        <img class="listing-photo" src="${getListingImage(listing)}" alt="${listing.category} experience preview for ${listing.title}">
        <span class="card-body">
          <span class="card-topline">${listing.category} / ${listing.area}</span>
          <h3>${listing.title}</h3>
          <span class="card-location">Map anchor: ${location.label}</span>
          <p>${listing.shortDescription}</p>
          <span class="card-footer">
            <span>${listing.priceLevel}</span>
            <span>${listing.estimatedDuration}</span>
          </span>
          <span class="card-cta">
            <span>${listing.ctaLabel || "View experience"}</span>
            <span aria-hidden="true">View details</span>
          </span>
        </span>
      </button>
      <span class="map-actions" aria-label="Open ${location.label} in maps">
        <a href="${location.googleUrl}" target="_blank" rel="noopener" aria-label="Open ${location.label} in Google Maps">Google Maps</a>
        <a href="${location.appleUrl}" target="_blank" rel="noopener" aria-label="Open ${location.label} in Apple Maps">Apple Maps</a>
      </span>
    `;
    card.querySelector(".listing-card-main").addEventListener("click", () => openDetail(listing.id));
    card.querySelectorAll(".map-actions a").forEach((link) => link.addEventListener("click", openMap));
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

  const location = getLocationInfo(listing);
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

  const existingLocation = elements.detailPanel.querySelector(".detail-location");
  if (existingLocation) {
    existingLocation.remove();
  }

  const locationBlock = document.createElement("div");
  locationBlock.className = "detail-location";
  locationBlock.innerHTML = `
    <strong>Location</strong>
    <span>${location.label}</span>
    <div class="map-actions">
      <a href="${location.googleUrl}" target="_blank" rel="noopener">Open in Google Maps</a>
      <a href="${location.appleUrl}" target="_blank" rel="noopener">Open in Apple Maps</a>
    </div>
    <small>Prototype note: routes and concierge concepts use a map anchor, while named venues use their real-world place search.</small>
  `;
  elements.detailTags.before(locationBlock);

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
  const city = currentCityName();
  const rwandaCities = ["Kigali", "Rwamagana"];
  const notes = {
    walking: `This is planned as a tight route${areaPhrase}. If a stop sits outside a comfortable walk, swap in a nearby card or use a short ride.`,
    rideshare: "Use short rides or trusted driver support between neighborhoods so the plan stays relaxed and weather-proof.",
    transit: "Check live local transit or shared transport options before committing; the prototype does not read schedules or availability.",
    driving: "Driving gives you the most flexible version of this plan. Build in a few minutes for parking, pickup coordination, and event traffic."
  };

  if (city === "Omaha") {
    notes.transit = "Check live ORBT or bus timing before you commit; the prototype favors stops that can be connected simply but does not read live schedules.";
  }

  if (city === "Lincoln") {
    notes.rideshare = "Use short rideshares between Haymarket, downtown, campus, and outdoor stops so the plan stays relaxed and weather-proof.";
    notes.transit = "Check live Lincoln transit timing before you commit; the prototype does not read bus schedules or event detours.";
    notes.driving = "Driving gives you the most flexible Lincoln version. Build in a few minutes for parking near downtown, campus, or event areas.";
  }

  if (rwandaCities.includes(city)) {
    notes.walking = `This is planned as a tight route${areaPhrase}. ${city} can involve hills, heat, or spread-out stops, so use trusted driver support when needed.`;
    notes.rideshare = "Use short rides or trusted driver support between areas so the plan stays relaxed and weather-proof.";
    notes.transit = `Check live local transport options before committing; the prototype does not read ${city} schedules or availability.`;
    notes.driving = `Driving or private driver support gives the most flexible ${city} version. Build in time for roads, traffic, and pickup coordination.`;
  }

  return notes[transport] || notes.rideshare;
}

function budgetNote(budget, usedFallback) {
  const labels = {
    "$": "This keeps the day light: free or lower-cost anchors first, with spending mostly on food, coffee, or transit.",
    "$$": `This is a comfortable ${currentCityName()} plan: expect a mix of casual paid stops and flexible food or drink spending.`,
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
