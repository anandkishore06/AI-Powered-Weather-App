// CurrentWeatherDisplay Component
export const CurrentWeatherDisplay = ({ weatherData, unit, formatTime, theme, localTime }) => (
    <div className={`text-center p-10 rounded-xl shadow-xl mt-8 border animate-fade-in-up
        ${theme === 'light' ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-200' : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'}`}>
        <h2 className={`text-4xl font-extrabold mb-3 tracking-tight animate-bounce-in ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {weatherData.name}, {weatherData.sys.country}
        </h2>
        <div className={`text-7xl font-extrabold flex items-center justify-center mb-6 ${theme === 'light' ? 'text-blue-800' : 'text-blue-400'}`}>
            {weatherData.weather[0].icon && (
                <img
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                    alt={weatherData.weather[0].description}
                    className="w-32 h-32 drop-shadow-lg transform hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/cccccc/000000?text=Icon"; }}
                />
            )}
            {Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
        </div>
        <p className={`text-2xl capitalize mb-8 font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {weatherData.weather[0].description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-8">
            <div className={`p-6 rounded-2xl shadow-md border transform hover:scale-105 transition-all duration-200 group
                ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-700 border-gray-600'}`}>
                <p className={`font-semibold text-lg mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Local Time</p>
                <p className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>{localTime}</p>
            </div>
            {[
                { label: "Humidity", value: `${weatherData.main.humidity}%` },
                { label: "Wind Speed", value: `${weatherData.wind.speed} m/s` },
                { label: "Feels Like", value: `${Math.round(weatherData.main.feels_like)}°${unit === 'metric' ? 'C' : 'F'}` },
                weatherData.sys.sunrise && { label: "Sunrise", value: formatTime(weatherData.sys.sunrise, weatherData.timezone) },
                weatherData.sys.sunset && { label: "Sunset", value: formatTime(weatherData.sys.sunset, weatherData.timezone) },
                { label: "Pressure", value: `${weatherData.main.pressure} hPa` },
                weatherData.visibility && { label: "Visibility", value: `${(weatherData.visibility / 1000).toFixed(1)} km` }
            ].filter(Boolean).map((item, index) => (
                <div key={index} className={`p-6 rounded-2xl shadow-md border transform hover:scale-105 transition-all duration-200 group
                    ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-700 border-gray-600'}`}>
                    <p className={`font-semibold text-lg mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>{item.label}</p>
                    <p className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>{item.value}</p>
                </div>
            ))}
        </div>
    </div>
);