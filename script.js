// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const tempValue = document.getElementById('temp-value');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');

// API Configuration
const API_KEY = 'Your_API_Key'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Initialize the app
const init = () => {
    updateDate();
    fetchWeather('London'); // Default city
    
    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    locationBtn.addEventListener('click', handleLocation);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
};

// Update current date display
const updateDate = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
};

// Handle city search
const handleSearch = () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        cityInput.value = '';
    } else {
        alert('Please enter a city name');
    }
};

// Handle location button click
const handleLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please enter a city manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
};

// Fetch weather by city name
const fetchWeather = async (city) => {
    try {
        setLoadingState(true);
        const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data. Please try again.');
    } finally {
        setLoadingState(false);
    }
};

// Fetch weather by coordinates
const fetchWeatherByCoords = async (lat, lon) => {
    try {
        setLoadingState(true);
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Location not found');
        }
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data for your location. Please try again.');
    } finally {
        setLoadingState(false);
    }
};

// Update UI with weather data (USING FONT AWESOME ICONS)
const updateUI = (data) => {
    const { name, sys, main, weather, wind } = data;
    
    // Update city name
    cityName.textContent = `${name}, ${sys.country}`;
    
    // Update temperature
    tempValue.textContent = Math.round(main.temp);
    
    // Update weather description and icon
    const weatherInfo = weather[0];
    weatherDescription.textContent = weatherInfo.description;
    
    // Set Font Awesome icon based on weather condition
    weatherIcon.className = `fas ${getWeatherIconClass(weatherInfo.id)}`;
    
    // Update details
    feelsLike.textContent = `${Math.round(main.feels_like)}°C`;
    humidity.textContent = `${main.humidity}%`;
    windSpeed.textContent = `${Math.round(wind.speed * 3.6)} km/h`;
    pressure.textContent = `${main.pressure} hPa`;
};

// Get Font Awesome icon class based on weather ID
const getWeatherIconClass = (weatherId) => {
    // Thunderstorm (200-232)
    if (weatherId >= 200 && weatherId <= 232) return 'fa-bolt';
    
    // Drizzle (300-321)
    else if (weatherId >= 300 && weatherId <= 321) return 'fa-cloud-rain';
    
    // Rain (500-531)
    else if (weatherId >= 500 && weatherId <= 531) return 'fa-umbrella';
    
    // Snow (600-622)
    else if (weatherId >= 600 && weatherId <= 622) return 'fa-snowflake';
    
    // Fog/Mist (701-781)
    else if (weatherId >= 701 && weatherId <= 781) return 'fa-smog';
    
    // Clear (800)
    else if (weatherId === 800) return 'fa-sun';
    
    // Clouds (801-804)
    else if (weatherId >= 801 && weatherId <= 804) return 'fa-cloud';
    
    // Default (unknown)
    else return 'fa-question';
};

// Set loading state
const setLoadingState = (isLoading) => {
    const elements = [searchBtn, locationBtn, cityInput];
    
    if (isLoading) {
        document.body.classList.add('loading');
        elements.forEach(el => el.setAttribute('disabled', 'true'));
    } else {
        document.body.classList.remove('loading');
        elements.forEach(el => el.removeAttribute('disabled'));
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
