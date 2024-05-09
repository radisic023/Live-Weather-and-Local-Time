function fetchWeather() {
    const city = document.getElementById("cityInput").value;
    const apiKey = ''; // Replace YOUR_API_KEY with your actual OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => {
            console.log(error);
            const weatherDataDiv = document.getElementById("weatherData");
            weatherDataDiv.innerHTML = `
                <div class='alert' id="alertBox">
                    <p class="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="20" height="20">
                            <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
                        </svg>
                        Error fetching data!
                    </p>
                </div>`;
            document.querySelector('.box').style.display = 'none'; // Hide the .box if there's an error
        
            // Set a timeout to hide the alert box after 4 seconds
            setTimeout(() => {
                const alertBox = document.getElementById("alertBox");
                if (alertBox) {
                    alertBox.style.display = 'none';
                }
            }, 4000); // 4000 milliseconds = 4 seconds
        });
        
        
}
        
function displayWeather(data) {
    const tempCelsius = data.main.temp;
    const tempFahrenheit = (tempCelsius * 9/5) + 32;
    const weatherCondition = data.weather[0].main;
    const humidity = data.main.humidity;
    const windSpeed = (data.wind.speed * 3.6).toFixed(2); // Convert m/s to km/h
    const precipitation = data.rain ? data.rain['1h'] : 0;
    const cityCountry = `${data.name}, ${data.sys.country}`;

    chooseSvg(weatherCondition); // Update the SVG based on the weather condition

    // Display the .box div now that we have the data
    document.querySelector('.box').style.display = 'block'; // or 'flex' if it's a flexbox

    updateDateTime(data.timezone); // Initial time and date update

    // If there's already a timer running, clear it before starting a new one
    if (window.timeUpdateTimer) {
        clearInterval(window.timeUpdateTimer);
    }
    
    // Update the time every minute
    window.timeUpdateTimer = setInterval(() => updateDateTime(data.timezone), 60000);

    document.querySelector('h2').textContent = cityCountry;
    document.querySelector('.temp').textContent = `${tempCelsius.toFixed(1)} °C / ${tempFahrenheit.toFixed(1)} °F`;
    document.querySelector('.humidity').textContent = `${humidity}%`;
    document.querySelector('.wind').textContent = `${windSpeed} km/h`;
    document.querySelector('.precipitation').textContent = `${precipitation}%`;
}
        
function updateDateTime(timezoneOffsetInSeconds) {
    const now = new Date();  // Current local time
    const localTimeOffset = now.getTimezoneOffset() * 60000; // Local timezone offset in milliseconds
    const utcTime = now.getTime() + localTimeOffset; // Convert local time to UTC time

    // Calculate the target city's local time by applying its timezone offset
    const targetCityTime = new Date(utcTime + timezoneOffsetInSeconds * 1000);

    const formattedDate = targetCityTime.toLocaleDateString();
    const formattedTime = targetCityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    document.querySelector('.date').textContent = formattedDate;
    document.querySelector('.time').textContent = formattedTime;
}
           
function chooseSvg(weatherCondition) {
    const iconDiv = document.querySelector('.weather-icon');
    const descriptionDiv = document.querySelector('.weather-description'); // Select the description div

    // Clear previous icon and description
    iconDiv.innerHTML = '';
    descriptionDiv.textContent = ''; // Clear any previous text

    // Hide all icons initially
    document.querySelectorAll('.element').forEach(element => element.style.display = 'none');

    let icon;
    switch (weatherCondition) {
        case 'Clear':
            icon = document.querySelector('.sunny');
            descriptionDiv.textContent = 'Sunny'; // Add the description text
            break;
        case 'Clouds':
            icon = document.querySelector('.cloudy');
            descriptionDiv.textContent = 'Cloudy'; // Add the description text
            break;
        case 'Rain':
        case 'Drizzle':
            icon = document.querySelector('.rainy');
            descriptionDiv.textContent = 'Rainy'; // Add the description text
            break;
        case 'Thunderstorm':
            icon = document.querySelector('.cloudy-with-lightning');
            descriptionDiv.textContent = 'Thunderstorms'; // Add the description text
            break;
        case 'Snow':
            icon = document.querySelector('.snowy');
            descriptionDiv.textContent = 'Snowy'; // Add the description text
            break;
        default:
            icon = document.querySelector('.default-condition'); // Handle unknown conditions
            descriptionDiv.textContent = 'Unspecified'; // Default text for unknown conditions
            break;
    }
    if (icon) {
        const clone = icon.cloneNode(true); // Clone the SVG element
        clone.style.display = 'block'; // Make sure it's visible
        iconDiv.appendChild(clone); // Append cloned icon to the .weather-icon div
    }
}      
