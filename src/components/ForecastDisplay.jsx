// ForecastDisplay Component (for Daily Forecast)
export const ForecastDisplay = ({ dailyForecastData, unit, theme }) => (
    dailyForecastData && dailyForecastData.length > 0 && (
        <div className={`mt-8 text-left p-8 rounded-xl shadow-xl border
            ${theme === 'light' ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300' : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center tracking-tight ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Daily Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                {dailyForecastData.map((day, index) => (
                    <div key={index} className={`p-4 rounded-xl shadow-md flex flex-col items-center border transform hover:scale-105 transition-transform duration-200 group
                        ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-600 border-gray-500'}`}>
                        <p className={`font-semibold text-sm mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                            {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        {day.weather[0].icon && (
                            <img
                                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                                alt={day.weather[0].description}
                                className="w-14 h-14 transform group-hover:scale-110 transition-transform duration-200"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/56x56/cccccc/000000?text=Icon"; }}
                            />
                        )}
                        <p className={`text-lg font-bold mt-1 ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
                            High: {Math.round(day.main.temp_max)}°{unit === 'metric' ? 'C' : 'F'}
                        </p>
                        <p className={`text-lg font-bold ${theme === 'light' ? 'text-blue-500' : 'text-blue-200'}`}>
                            Low: {Math.round(day.main.temp_min)}°{unit === 'metric' ? 'C' : 'F'}
                        </p>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Feels: {Math.round(day.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}
                        </p>
                        <p className={`text-sm capitalize text-center mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {day.weather[0].description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
);