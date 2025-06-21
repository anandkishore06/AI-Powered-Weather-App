import React, { useState, useEffect } from 'react';
import { HourlyForecastDisplay, ClothingRecommendationAI, ExtremeWeatherAlertAI, AISummaryDisplay } from "../utils/ai-features"
import { NavBar } from './NavBar';
import { SearchBar } from './SearchBar';
import { UnitToggle } from './UnitToggle';
import { CurrentWeatherDisplay } from './CurrentWeatherDisplay';
import { ForecastDisplay } from './ForecastDisplay';
import { AirQualityDisplay } from './AirQualityDisplay';
import { AnimatedCloud } from './AnimatedCloud';
// Helper function to format Unix timestamp to a readable time
const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date(timestamp * 1000);
    const localTimeMs = date.getTime() + (timezoneOffset * 1000);
    const localDate = new Date(localTimeMs);
    return localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

// Function to get AQI text description
const getAqiDescription = (aqi) => {
    switch (aqi) {
        case 1: return "Good";
        case 2: return "Fair";
        case 3: return "Moderate";
        case 4: return "Poor";
        case 5: return "Very Poor";
        default: return "N/A";
    }
};

// SearchHistoryDisplay Component
const SearchHistoryDisplay = ({ searchHistory, handleHistoryClick, theme }) => (
    searchHistory.length > 0 && (
        <div className="mb-6">
            <h4 className={`text-center font-semibold mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Recent Searches:</h4>
            <div className="flex flex-wrap justify-center gap-2">
                {searchHistory.map((histCity, index) => (
                    <button
                        key={index}
                        onClick={() => handleHistoryClick(histCity)}
                        className={`py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105
                            ${theme === 'light' ? 'bg-blue-200 text-blue-900 hover:bg-blue-300' : 'bg-blue-800 text-blue-200 hover:bg-blue-700'}`}
                    >
                        {histCity}
                    </button>
                ))}
            </div>
        </div>
    )
);


// LoadingAndErrorMessages Component
const LoadingAndErrorMessages = ({ loading, geolocationLoading, error, theme }) => (
    <>
        {(geolocationLoading || loading) && (
            <div className={`text-center font-semibold text-lg animate-pulse mb-6 ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                {geolocationLoading ? "Attempting to get your current location..." : "Fetching weather data..."}
            </div>
        )}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        )}
    </>
);



// MapDisplay Component
const MapDisplay = ({ mapUrl, theme, showMap }) => (
    showMap && mapUrl && (
        <div className={`w-full h-96 rounded-xl overflow-hidden shadow-2xl mt-8 mb-8 border-3
            ${theme === 'light' ? 'border-indigo-400' : 'border-gray-600'}`}>
            <iframe
                title="Weather Location Map"
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    )
);

// Main WeatherApp Component
const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [dailyForecastData, setDailyForecastData] = useState(null);
    const [fullHourlyForecastData, setFullHourlyForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapUrl, setMapUrl] = useState('');
    const [geolocationLoading, setGeolocationLoading] = useState(true);
    const [unit, setUnit] = useState('metric');
    const [aiSummary, setAiSummary] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [hourlyRecommendations, setHourlyRecommendations] = useState('');
    const [loadingHourlyAI, setLoadingHourlyAI] = useState(false);
    const [extremeWeatherAlert, setExtremeWeatherAlert] = useState('');
    const [loadingAlertAI, setLoadingAlertAI] = useState(false);
    const [aqiData, setAqiData] = useState(null);
    const [loadingAqi, setLoadingAqi] = useState(false);
    const [aqiError, setAqiError] = useState(null);
    const [clothingRecommendation, setClothingRecommendation] = useState('');
    const [loadingClothingAI, setLoadingClothingAI] = useState(false);

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('weatherAppTheme') || 'light';
    });
    const [searchHistory, setSearchHistory] = useState(() => {
        try {
            const storedHistory = localStorage.getItem('weatherAppSearchHistory');
            return storedHistory ? JSON.parse(storedHistory) : [];
        } catch (e) {
            console.error("Failed to parse search history from localStorage:", e);
            return [];
        }
    });
    const [showMap, setShowMap] = useState(true);
    const [localTime, setLocalTime] = useState('');

    const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;


    useEffect(() => {
        localStorage.setItem('weatherAppTheme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('weatherAppSearchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);


    const fetchWeather = async (query, isCoords = false, currentUnit = unit) => {
        setLoading(true);
        setLoadingAI(true);
        setLoadingHourlyAI(true);
        setLoadingAlertAI(true);
        setLoadingAqi(true);
        setLoadingClothingAI(true);
        setError(null);
        setAqiError(null);
        setWeatherData(null);
        setDailyForecastData(null);
        setFullHourlyForecastData(null);
        setMapUrl('');
        setAiSummary('');
        setHourlyRecommendations('');
        setExtremeWeatherAlert('');
        setAqiData(null);
        setClothingRecommendation('');
        setLocalTime('');

        // Handle empty query gracefully if not an initial geolocation attempt
        if (!query && !isCoords) {
            setError("Please enter a city name to search.");
            setLoading(false);
            setLoadingAI(false);
            setLoadingHourlyAI(false);
            setLoadingAlertAI(false);
            setLoadingAqi(false);
            setLoadingClothingAI(false);
            return;
        }

        if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
            setError("Please ensure a valid OpenWeatherMap API key is provided in the code.");
            setLoading(false);
            setLoadingAI(false);
            setLoadingHourlyAI(false);
            setLoadingAlertAI(false);
            setLoadingAqi(false);
            setLoadingClothingAI(false);
            return;
        }

        let latitudeToUse; // Declare without initializing to allow assignment from geo or API
        let longitudeToUse; // Declare without initializing

        let currentApiUrl;
        let forecastApiUrl;

        if (isCoords) {
            [latitudeToUse, longitudeToUse] = query.split(',');
            currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitudeToUse}&lon=${longitudeToUse}&appid=${API_KEY}&units=${currentUnit}`;
            forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitudeToUse}&lon=${longitudeToUse}&appid=${API_KEY}&units=${currentUnit}`;
        } else {
            currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=${currentUnit}`;
            // forecastApiUrl will be set after currentData is fetched to get lat/lon
        }

        try {
            const currentResponse = await fetch(currentApiUrl);
            if (!currentResponse.ok) {
                let errorData;
                try {
                    errorData = await currentResponse.json();
                } catch (jsonErr) {
                    const rawText = await currentResponse.text();
                    console.error("Failed to parse current weather error JSON, raw response:", rawText);
                    throw new Error(`Current Weather API error: ${currentResponse.status} ${currentResponse.statusText}. Raw: ${rawText.substring(0, 200)}`);
                }
                throw new Error(errorData.message || `Could not fetch current weather data. Status: ${currentResponse.status} ${currentResponse.statusText}`);
            }
            const currentData = await currentResponse.json();
            setWeatherData(currentData);

            // Update latitudeToUse and longitudeToUse from currentData.coord after successful fetch
            latitudeToUse = currentData.coord.lat;
            longitudeToUse = currentData.coord.lon;

            // If it was a city search, ensure forecastApiUrl is now built with correct lat/lon
            if (!isCoords) {
                forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitudeToUse}&lon=${longitudeToUse}&appid=${API_KEY}&units=${currentUnit}`;
            }

            setLocalTime(formatTime(currentData.dt, currentData.timezone));

            // Always update city input with the resolved city name from API
            if (currentData.name) {
                setCity(currentData.name);
            }
            // Add to search history if the resolved city name is not already in history
            if (currentData.name && !searchHistory.includes(currentData.name)) {
                setSearchHistory(prevHistory => {
                    const newHistory = [currentData.name, ...prevHistory.filter(c => c !== currentData.name)].slice(0, 5);
                    return newHistory;
                });
            }


            // Fetch AQI data using the definitively set latitudeToUse and longitudeToUse
            const aqiApiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitudeToUse}&lon=${longitudeToUse}&appid=${API_KEY}`;
            const aqiResponse = await fetch(aqiApiUrl);
            if (!aqiResponse.ok) {
                let errorData;
                try {
                    errorData = await aqiResponse.json();
                } catch (jsonErr) {
                    const rawText = await aqiResponse.text();
                    console.error("Failed to parse AQI error JSON, raw response:", rawText);
                    throw new Error(`AQI API error: ${aqiResponse.status} ${aqiResponse.statusText}. Raw: ${rawText.substring(0, 200)}`);
                }
                throw new Error(errorData.message || 'Could not fetch air quality data.');
            }
            const aqiRawData = await aqiResponse.json();
            if (aqiRawData.list && aqiRawData.list.length > 0) {
                setAqiData(aqiRawData.list[0]);
            } else {
                setAqiError("Air quality data not available for this location.");
            }
            setLoadingAqi(false);


            // Ensure forecastApiUrl is defined before fetching (it will be from above logic)
            const forecastResponse = await fetch(forecastApiUrl);
            if (!forecastResponse.ok) {
                let errorData;
                try {
                    errorData = await forecastResponse.json();
                } catch (jsonErr) {
                    const rawText = await forecastResponse.text();
                    console.error("Failed to parse forecast error JSON, raw response:", rawText);
                    throw new Error(`Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText}. Raw: ${rawText.substring(0, 200)}`);
                }
                throw new Error(errorData.message || 'Could not fetch forecast data.');
            }
            const fullForecastRaw = await forecastResponse.json();
            setFullHourlyForecastData(fullForecastRaw.list);

            const dailyForecasts = {};
            fullForecastRaw.list.forEach(item => {
                const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = item;
                }
            });
            setDailyForecastData(Object.values(dailyForecasts));

            setMapUrl(`https://maps.google.com/maps?q=${latitudeToUse},${longitudeToUse}&z=10&output=embed`);
            const AI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

            if (!AI_API_KEY) {
                console.error("OpenAI API key is missing!");
            }

            const aiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AI_API_KEY}`;

            // --- AI General Summary Integration ---
            const generalSummaryPrompt = `Given the current weather in ${currentData.name}, ${currentData.sys.country}:
Temperature: ${Math.round(currentData.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}
Description: ${currentData.weather[0].description}
Humidity: ${currentData.main.humidity}%
Wind Speed: ${currentData.wind.speed} m/s
Pressure: ${currentData.main.pressure} hPa
Visibility: ${(currentData.visibility / 1000).toFixed(1)} km
Local Time: ${formatTime(currentData.dt, currentData.timezone)}
Sunrise: ${formatTime(currentData.sys.sunrise, currentData.timezone)}
Sunset: ${formatTime(currentData.sys.sunset, currentData.timezone)}
${aqiData ? `Air Quality Index (AQI): ${aqiData.aqi} (${getAqiDescription(aqiData.aqi)})` : ''}

And a 5-day forecast with daily temperatures (approximately midday):
${Object.values(dailyForecasts).map(day => `- ${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: Temp ${Math.round(day.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}, Feels ${Math.round(day.main.feels_like)}°${currentUnit === 'metric' ? 'C' : 'F'}, Min ${Math.round(day.main.temp_min)}°${currentUnit === 'metric' ? 'C' : 'F'}, Max ${Math.round(day.main.temp_max)}°${currentUnit === 'metric' ? 'C' : 'F'} (${day.weather[0].description})`).join('\n')}

Please provide a brief, engaging summary of the overall weather situation for the next few days and suggest one or two suitable activities for someone in this location. Keep it concise, within 100 words.`;

            const aiGeneralPayload = { contents: [{ role: "user", parts: [{ text: generalSummaryPrompt }] }] };
            const aiGeneralResponse = await fetch(aiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aiGeneralPayload)
            });

            const aiGeneralResult = await aiGeneralResponse.json();
            if (aiGeneralResult.candidates && aiGeneralResult.candidates.length > 0 &&
                aiGeneralResult.candidates[0].content && aiGeneralResult.candidates[0].content.parts &&
                aiGeneralResult.candidates[0].content.parts.length > 0) {
                const text = aiGeneralResult.candidates[0].content.parts[0].text;
                setAiSummary(text);
            } else {
                setAiSummary("Could not generate AI summary.");
            }
            setLoadingAI(false);


            // --- AI Hourly Recommendations Integration ---
            const hourlyForecastPromptData = fullForecastRaw.list.slice(0, 16)
                .map(item => {
                    const hour = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                    return `${hour}: Temp ${Math.round(item.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}, Feels ${Math.round(item.main.feels_like)}°${currentUnit === 'metric' ? 'C' : 'F'}, ${item.weather[0].description}, Wind ${item.wind.speed} m/s`;
                }).join('\n');

            const hourlyRecommendationsPrompt = `Given the hourly weather forecast for ${currentData.name}, ${currentData.sys.country} over the next 48 hours:
${hourlyForecastPromptData}

Please suggest specific outdoor activities or considerations for each major time block (e.g., morning, afternoon, evening) over the next day or two, based on temperature, conditions, and wind. Provide concise, actionable advice. If conditions are unfavorable, suggest indoor alternatives. Keep it under 150 words.`;

            const aiHourlyPayload = { contents: [{ role: "user", parts: [{ text: hourlyRecommendationsPrompt }] }] };

            const aiHourlyResponse = await fetch(aiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aiHourlyPayload)
            });

            const aiHourlyResult = await aiHourlyResponse.json();
            if (aiHourlyResult.candidates && aiHourlyResult.candidates.length > 0 &&
                aiHourlyResult.candidates[0].content && aiHourlyResult.candidates[0].content.parts &&
                aiHourlyResult.candidates[0].content.parts.length > 0) {
                const text = aiHourlyResult.candidates[0].content.parts[0].text;
                setHourlyRecommendations(text);
            } else {
                setHourlyRecommendations("Could not generate hourly recommendations.");
            }
            setLoadingHourlyAI(false);

            // --- AI Extreme Weather Alert Integration ---
            const extremeWeatherPrompt = `Analyze the following weather data for ${currentData.name}, ${currentData.sys.country} and its 5-day forecast. Identify any potentially extreme weather conditions (e.g., unusually high/low temperatures, very strong winds, heavy precipitation). If extreme conditions are present, provide a brief alert message and practical safety advice. If no extreme conditions are found, state that.
Current Weather: Temp ${Math.round(currentData.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}, Description: ${currentData.weather[0].description}, Wind: ${currentData.wind.speed} m/s, Visibility: ${(currentData.visibility / 1000).toFixed(1)} km.
5-Day Forecast:
${Object.values(dailyForecasts).map(day => `- ${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: Temp ${Math.round(day.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}, Description: ${day.weather[0].description}, Wind: ${day.wind.speed} m/s`).join('\n')}
${aqiData ? `Current Air Quality Index (AQI): ${aqiData.aqi} (${getAqiDescription(aqiData.aqi)})` : ''}

Consider "extreme" for:
- Temperatures above 35°C (95°F) or below -5°C (23°F)
- Wind speed above 10 m/s (22 mph)
- Weather descriptions indicating heavy rain, heavy snow, thunderstorm, tornado, hurricane.
- AQI above 3 (Poor or Very Poor).
Provide a concise alert.`;

            const aiAlertPayload = { contents: [{ role: "user", parts: [{ text: extremeWeatherPrompt }] }] };

            const aiAlertResponse = await fetch(aiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aiAlertPayload)
            });

            const aiAlertResult = await aiAlertResponse.json();
            if (aiAlertResult.candidates && aiAlertResult.candidates.length > 0 &&
                aiAlertResult.candidates[0].content && aiAlertResult.candidates[0].content.parts &&
                aiAlertResult.candidates[0].content.parts.length > 0) {
                const text = aiAlertResult.candidates[0].content.parts[0].text;
                setExtremeWeatherAlert(text);
            } else {
                setExtremeWeatherAlert("Could not check for extreme weather alerts.");
            }
            setLoadingAlertAI(false);

            // --- AI Clothing Recommendation Integration ---
            const clothingPrompt = `Given the current weather conditions:
Temperature: ${Math.round(currentData.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}
Feels Like: ${Math.round(currentData.main.feels_like)}°${currentUnit === 'metric' ? 'C' : 'F'}
Description: ${currentData.weather[0].description}
Humidity: ${currentData.main.humidity}%
Wind Speed: ${currentData.wind.speed} m/s

And a brief outlook for the next few hours (from hourly forecast):
${fullForecastRaw.list.slice(0, 3).map(item => `- ${formatTime(item.dt, currentData.timezone)}: ${Math.round(item.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'} (${item.weather[0].description})`).join('\n')}

Please suggest appropriate clothing for someone spending time outdoors today in ${currentData.name}. Consider layers, accessories (umbrella, hat), and footwear based on the conditions. Be concise, within 70 words.`;

            const aiClothingPayload = { contents: [{ role: "user", parts: [{ text: clothingPrompt }] }] };

            const aiClothingResponse = await fetch(aiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aiClothingPayload)
            });

            const aiClothingResult = await aiClothingResponse.json();
            if (aiClothingResult.candidates && aiClothingResult.candidates.length > 0 &&
                aiClothingResult.candidates[0].content && aiClothingResult.candidates[0].content.parts &&
                aiClothingResult.candidates[0].content.parts.length > 0) {
                const text = aiClothingResult.candidates[0].content.parts[0].text;
                setClothingRecommendation(text);
            } else {
                setClothingRecommendation("Could not generate clothing recommendation.");
            }
            setLoadingClothingAI(false);


        } catch (err) {
            console.error("Error fetching weather data or AI summary:", err);
            setError(err.message);
            setAiSummary("Error generating AI summary.");
            setHourlyRecommendations("Error generating hourly recommendations.");
            setExtremeWeatherAlert("Error checking for extreme weather alerts.");
            setAqiError("Failed to fetch data, please try again.");
            setClothingRecommendation("Error generating clothing recommendation.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (city) {
            fetchWeather(city, false, unit);
        } else {
            setError("Please enter a city name to search.");
        }
    };

    const toggleUnit = () => {
        const newUnit = unit === 'metric' ? 'imperial' : 'metric';
        setUnit(newUnit);
        if (weatherData) {
            fetchWeather(weatherData.name, false, newUnit);
        } else if (city) {
            fetchWeather(city, false, newUnit);
        }
    };

    const handleHistoryClick = (histCity) => {
        setCity(histCity); // Set the city in the input field from history
        fetchWeather(histCity, false, unit);
    };

    const toggleMap = () => {
        setShowMap(prevShowMap => !prevShowMap);
    };

    // This function is now responsible for initial load geolocation attempt
    const initializeGeolocationWeather = () => {
        setGeolocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Pass coordinates as the query, and indicate it's a coordinate lookup
                    fetchWeather(`${latitude},${longitude}`, true, unit);
                    setGeolocationLoading(false);
                },
                (geoError) => {
                    console.error("Geolocation error:", geoError.message, "Code:", geoError.code);
                    let errorMessage = "Geolocation denied or failed. Showing weather for a default city (London).";
                    if (geoError.code === geoError.PERMISSION_DENIED) {
                        errorMessage = "Location access denied. Please allow location access to use this feature. Showing weather for a default city (London).";
                    } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
                        errorMessage = "Location information unavailable. Showing weather for a default city (London).";
                    } else if (geoError.code === geoError.TIMEOUT) {
                        errorMessage = "Request to get user location timed out. Showing weather for a default city (London).";
                    }
                    setError(errorMessage);
                    fetchWeather("London", false, unit); // Fallback to London
                    setGeolocationLoading(false);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            setError("Geolocation is not supported by your browser. Showing weather for a default city (London).");
            fetchWeather("London", false, unit); // Fallback to London
            setGeolocationLoading(false);
        }
    };


    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    useEffect(() => {
        initializeGeolocationWeather(); // Call this on component mount
    }, [unit]); // Re-run when unit changes to update weather data for current location

    //     return (
    //         <div
    //             className={`min-h-screen font-inter p-4 transition-colors duration-500 flex flex-col items-center justify-between
    //       ${theme === 'light'
    //                     ? 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200'
    //                     : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'}`}
    //         >
    //             <div
    //                 className={`w-full max-w-6xl p-6 sm:p-10 md:p-14 rounded-lg shadow-xl backdrop-blur-lg bg-opacity-80
    //         transition-all duration-500 border-2
    //         ${theme === 'light'
    //                         ? 'bg-white border-blue-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
    //                         : 'bg-gray-800 border-gray-700 hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)]'}`}
    //             >
    //                 {/* Top Nav */}
    //                 <NavBar theme={theme} toggleTheme={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))} />

    //                 {/* Search + History + Unit */}
    //                 <div className="space-y-6">
    //                     <SearchBar city={city} setCity={setCity} handleSearch={handleSearch} theme={theme} />
    //                     <SearchHistoryDisplay searchHistory={searchHistory} handleHistoryClick={handleHistoryClick} theme={theme} />
    //                     <UnitToggle unit={unit} toggleUnit={toggleUnit} theme={theme} />

    //                     <LoadingAndErrorMessages
    //                         loading={loading}
    //                         geolocationLoading={geolocationLoading}
    //                         error={error}
    //                         theme={theme}
    //                     />
    //                 </div>

    //                 {/* Main Weather Data Display */}
    //                 {weatherData && !loading && !geolocationLoading && !error && (
    //                     <div className="mt-10 space-y-10">
    //                         <CurrentWeatherDisplay
    //                             weatherData={weatherData}
    //                             unit={unit}
    //                             formatTime={formatTime}
    //                             theme={theme}
    //                             localTime={localTime}
    //                         />
    //                         <AirQualityDisplay aqiData={aqiData} loadingAqi={loadingAqi} aqiError={aqiError} theme={theme} />
    //                         <MapDisplay mapUrl={mapUrl} theme={theme} showMap={showMap} />
    //                         <ForecastDisplay dailyForecastData={dailyForecastData} unit={unit} theme={theme} />
    //                         <HourlyForecastDisplay
    //                             fullHourlyForecastData={fullHourlyForecastData}
    //                             unit={unit}
    //                             theme={theme}
    //                             hourlyRecommendations={hourlyRecommendations}
    //                             loadingHourlyAI={loadingHourlyAI}
    //                             timezoneOffset={weatherData.timezone}
    //                         />
    //                         <ClothingRecommendationAI
    //                             clothingRecommendation={clothingRecommendation}
    //                             loadingClothingAI={loadingClothingAI}
    //                             theme={theme}
    //                         />
    //                         <AISummaryDisplay aiSummary={aiSummary} loadingAI={loadingAI} theme={theme} />
    //                         <ExtremeWeatherAlertAI alertMessage={extremeWeatherAlert} loadingAlertAI={loadingAlertAI} theme={theme} />
    //                     </div>
    //                 )}
    //             </div>

    //             {/* Footer */}
    //             <footer
    //                 className={`w-full mt-12 py-6 text-center text-sm transition-colors duration-500
    //   ${theme === 'light' ? 'text-gray-700 bg-white/70 border-t border-blue-100' : 'text-gray-300 bg-gray-800/50 border-t border-gray-700'}`}
    //             >
    //                 <p className="mb-1">
    //                     🌤️ Built by <span className="font-semibold">Anand Kishore</span> — Weather insights powered by AI & OpenWeatherMap API.
    //                 </p>

    //                 <p className="text-xs">© {new Date().getFullYear()} All rights reserved.</p>

    //                 <button
    //                     onClick={scrollToTop}
    //                     className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300"
    //                 >
    //                     ⬆️ Back to Top
    //                 </button>
    //             </footer>


    //         </div>
    //     );

    return (
        <div
            className={`min-h-screen font-inter p-4 transition-colors duration-500 flex flex-col items-center justify-between relative
        ${theme === 'light'
                    ? 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200'
                    : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'}`}
        >
            {/* Cloud Backgrounds */}
            <AnimatedCloud theme={theme} />
            <AnimatedCloud theme={theme} />

            <div
                className={`w-full max-w-6xl p-6 sm:p-10 md:p-14 rounded-lg shadow-xl backdrop-blur-lg bg-opacity-80
          transition-all duration-500 border-2 relative z-10
          ${theme === 'light'
                        ? 'bg-white border-blue-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
                        : 'bg-gray-800 border-gray-700 hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)]'}`}
            >
                {/* Top Nav */}
                <NavBar theme={theme} toggleTheme={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))} />

                {/* Search + History + Unit */}
                <div className="space-y-6">
                    <SearchBar city={city} setCity={setCity} handleSearch={handleSearch} theme={theme} />
                    <SearchHistoryDisplay searchHistory={searchHistory} handleHistoryClick={handleHistoryClick} theme={theme} />
                    <UnitToggle unit={unit} toggleUnit={toggleUnit} theme={theme} />

                    <LoadingAndErrorMessages
                        loading={loading}
                        geolocationLoading={geolocationLoading}
                        error={error}
                        theme={theme}
                    />
                </div>

                {/* Main Weather Data Display */}
                {weatherData && !loading && !geolocationLoading && !error && (
                    <div className="mt-10 space-y-10">
                        <CurrentWeatherDisplay
                            weatherData={weatherData}
                            unit={unit}
                            formatTime={formatTime}
                            theme={theme}
                            localTime={localTime}
                        />
                        <AirQualityDisplay aqiData={aqiData} loadingAqi={loadingAqi} aqiError={aqiError} theme={theme} />
                        <MapDisplay mapUrl={mapUrl} theme={theme} showMap={showMap} />
                        <ForecastDisplay dailyForecastData={dailyForecastData} unit={unit} theme={theme} />
                        <HourlyForecastDisplay
                            fullHourlyForecastData={fullHourlyForecastData}
                            unit={unit}
                            theme={theme}
                            hourlyRecommendations={hourlyRecommendations}
                            loadingHourlyAI={loadingHourlyAI}
                            timezoneOffset={weatherData.timezone}
                        />
                        <ClothingRecommendationAI
                            clothingRecommendation={clothingRecommendation}
                            loadingClothingAI={loadingClothingAI}
                            theme={theme}
                        />
                        <AISummaryDisplay aiSummary={aiSummary} loadingAI={loadingAI} theme={theme} />
                        <ExtremeWeatherAlertAI alertMessage={extremeWeatherAlert} loadingAlertAI={loadingAlertAI} theme={theme} />
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer
                className={`w-full mt-12 py-6 text-center text-sm transition-colors duration-500
          ${theme === 'light'
                        ? 'text-gray-700 bg-white/70 border-t border-blue-100'
                        : 'text-gray-300 bg-gray-800/50 border-t border-gray-700'}`}
            >
                <p className="mb-1">
                    🌤️ Built by <span className="font-semibold">Anand Kishore</span> — Weather insights powered by AI & OpenWeatherMap API.
                </p>

                <p className="text-xs">© {new Date().getFullYear()} All rights reserved.</p>

                <button
                    onClick={scrollToTop}
                    className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                    ⬆️ Back to Top
                </button>
            </footer>
        </div>
    );
};

export default Weather;
