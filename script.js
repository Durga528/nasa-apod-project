// Mee personal API key ikkada unchandi
const apiKey = "LCc8yC3V8qH2zpKDNlqx2G9jEKIw2kwPOhuNCX2a"; // Mee key ledha problem statement lo unna key

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const currentImageContainer = document.getElementById("current-image-container");
const searchHistoryList = document.getElementById("search-history");

// Page load ayinappudu
window.addEventListener("DOMContentLoaded", () => {
  getCurrentImageOfTheDay();
  addSearchToHistory();
});

// 1. Current Image Fetch Function
async function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`;

  try {
    currentImageContainer.innerHTML = "<p>Loading picture of the day...</p>";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Current image data:", data);
    renderMedia(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    currentImageContainer.innerHTML = `<p style="color: red;">Failed to load current image. Please check API key.</p>`;
  }
}

// 2. Selected Date Image Fetch Function
async function getImageOfTheDay(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  try {
    currentImageContainer.innerHTML = `<p>Loading data for ${date}...</p>`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Selected date data:", data);

    renderMedia(data);
    saveSearch(date);
    addSearchToHistory();
  } catch (error) {
    console.error("Fetch Error:", error);
    currentImageContainer.innerHTML = `<p style="color: red;">Error fetching data for ${date}.</p>`;
  }
}

// 3. Save Search Function (Array in LocalStorage)
function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

// 4. Add Search to History Function
function addSearchToHistory() {
  searchHistoryList.innerHTML = "";
  const searches = JSON.parse(localStorage.getItem("searches")) || [];

  searches.forEach((date) => {
    const li = document.createElement("li");
    li.textContent = date;
    li.style.cursor = "pointer";

    // History item click chesthe malli ah date data display avvali
    li.addEventListener("click", () => {
      fetchDateOnly(date);
    });

    searchHistoryList.appendChild(li);
  });
}

// History item click helper
async function fetchDateOnly(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;
  try {
    currentImageContainer.innerHTML = `<p>Loading data for ${date}...</p>`;
    const response = await fetch(url);
    const data = await response.json();
    renderMedia(data);
  } catch (error) {
    console.error(error);
  }
}
function renderMedia(data) {
  let mediaHtml = "";

  if (data.media_type === "image") {
    // NASA update valla hdurl direct image link ga untundi
    const imageSrc = data.hdurl || data.url;
    mediaHtml = `<img src="${imageSrc}" alt="${data.title}" style="width: 100%; max-height: 520px; object-fit: contain; border-radius: 8px; margin: 15px 0;">`;
  } else if (data.media_type === "video") {
    mediaHtml = `<iframe src="${data.url}" width="100%" height="400" frameborder="0" allowfullscreen style="margin: 15px 0; border-radius: 8px;"></iframe>`;
  }

  currentImageContainer.innerHTML = `
    <h2>${data.title}</h2>
    <p style="color: #8b949e; margin: 6px 0;"><strong>Date:</strong> ${data.date}</p>
    ${mediaHtml}
    <p style="line-height: 1.6; margin-top: 12px;">${data.explanation}</p>
  `;
}

// MOST IMPORTANT: Form Submit Event Handler
searchForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Idi lekapothe page refresh aypoyi malli purva photo ke pothundi!
  
  const selectedDate = searchInput.value;
  console.log("Selected Date from input:", selectedDate);
  
  if (selectedDate) {
    getImageOfTheDay(selectedDate);
  }
});