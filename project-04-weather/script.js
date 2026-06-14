// Weather App JavaScript

// Free API Key (OpenWeatherMap)
// Sign up at https://openweathermap.org/api for your own free key
const API_KEY = '4d8fb5b93d4af21d66a2948710284366';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

let recentSearches = [];

// Load recent searches from localStorage
function loadRecent() {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
        recentSearches = JSON.parse(saved);
        displayRecent();
    }
}

// Save recent searches
function saveRecent() {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

// Add to recent searches
function addRecent(city) {
    // Remove if already exists
    recentSearches = recentSearches.filter(c => c.toLowerCase() !== city.toLowerCase());
    
    // Add to beginning
    recentSearches.unshift(city);
    
    // Keep only last 5
    if (recentSearches.length > 5) {
        recentSearches = recentSearches.slice(0, 5);
    }
    
    saveRecent();
    displayRecent();
}

// Display recent searches
function displayRecent() {
    const recentDiv = document.getElementById('recent');
    const recentList = document.getElementById('recent-list');
    
    if (recentSearches.length === 0) {
        recentDiv.classList.add('hidden');
        return;
    }
    
    recentDiv.classList.remove('hidden');
    recentList.innerHTML = recentSearches.map(city => `
        <span class="recent-item" onclick="searchCity('${city}')">${city}</span>
    `).join('');
}

// Search city from recent
function searchCity(city) {
    document.getElementById('city-input').value = city;
    getWeather();
}

// Get weather data
async function getWeather() {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    
    if (city === '') {
        alert('Please enter a city name!');
        return;
    }
    
    // Show loading
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('weather-result').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
    
    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        displayWeather(data);
        addRecent(data.name);
        
    } catch (error) {
        document.getElementById('error').classList.remove('hidden');
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

// Display weather data
function displayWeather(data) {
    const weatherResult = document.getElementById('weather-result');
    
    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = `${data.wind.speed} km/h`;
    document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // Weather icon
    const iconCode = data.weather[0].icon;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    weatherResult.classList.remove('hidden');
}

// Allow Enter key to search
document.addEventListener('DOMContentLoaded', function() {
    loadRecent();
    
    document.getElementById('city-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });
});