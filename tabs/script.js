// script.js

//constin
const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const greetingElement = document.getElementById('greeting');

function greeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
        greetingElement.textContent = "Good morning ";
    } else if (hour < 18) {
        greetingElement.textContent = "Good afternoon, enjoy your day! ";
    } else {
        greetingElement.textContent = "Good evening, time to relax and unwind! ";
    }
}

// Clock update function
function updateClock() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    clockElement.textContent = `${hours}:${minutes}`;
}

// Date update function
function updateDate() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dayNumber = now.getDate();

    dateElement.textContent = `${dayName}, ${monthName} ${dayNumber}`;
}


// Function to get weather data 
function getWeather() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            
            // Weather Data API
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,apparent_temperature`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const temp = Math.round(data.current.temperature_2m);
                    const feelsLike = Math.round(data.current.apparent_temperature);
                    
                    document.getElementById('temperature').textContent = `${temp}°C`;
                    document.getElementById('feels-like').textContent = `Feels: ${feelsLike}°C`;
                })
                .catch(error => console.error('Weather API error:', error));

            // Location data 
            const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

            fetch(geoUrl)
                .then(response => response.json())
                .then(geoData => {
                    const city = geoData.address.city
                        || geoData.address.town
                        || geoData.address.village
                        || geoData.address.municipality
                        || geoData.address.county
                        || 'Unknown';
                    document.getElementById('location').textContent = city;
                })
                .catch(error => console.error('Geocoding error:', error));
        },
        (error) => {
            console.error('Geolocation error:', error);
            document.getElementById('location').textContent = 'Location unavailable';
        }
    );
}

document.getElementById("settings-btn").addEventListener("click", () => {
    window.location.href = "/options/settings.html";
});

//typing sound
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const soundURL = chrome.runtime.getURL('Resources/audio/ButtonPres.wav');

  searchInput.addEventListener('keydown', (e) => {
    console.log(e.repeat);
    if (e.repeat) return;
    if (e.key.length === 1 || e.key === 'Backspace') {
      const sound = new Audio(soundURL);
      sound.volume = 0.05;
 
      sound.play().catch(() => {});
    }
  });
});

chrome.storage.sync.get(['shortcuts'], (result) => {
  const shortcuts = result.shortcuts || [];
  const container = document.getElementById('shortcuts-container');

  shortcuts.forEach((s) => {
    if (!s || !s.url) return;

    // Favicon Service
    const faviconUrl = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`);
    faviconUrl.searchParams.set('pageUrl', s.url);
    faviconUrl.searchParams.set('size', '128');

    // Make the shortcut element
    const a = document.createElement('a');
    a.classList.add('shortcut');
    a.href = s.url;

    const img = document.createElement('img');
    img.src = faviconUrl.href;
    img.alt = s.name || s.url;

    const span = document.createElement('span');
    span.textContent = s.name || s.url;

    a.appendChild(img);
    a.appendChild(span);
    container.appendChild(a);
  });
});

updateClock();
setInterval(updateClock, 1000);
updateDate();
//https://is.gd/UeKo1F
setInterval(updateDate, 1000);
greeting();
getWeather();
