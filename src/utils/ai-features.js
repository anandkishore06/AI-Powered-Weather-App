// Helper function to format Unix timestamp to a readable time
const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date(timestamp * 1000);
    const localTimeMs = date.getTime() + (timezoneOffset * 1000);
    const localDate = new Date(localTimeMs);
    return localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

// AISummaryDisplay Component (General AI Weather Insight)
export const AISummaryDisplay = ({ aiSummary, loadingAI, theme }) => (
    <div className={`mt-8 text-left p-8 rounded-2xl shadow-xl border animate-fade-in-up
        ${theme === 'light' ? 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300' : 'bg-gradient-to-br from-indigo-800 to-purple-900 border-indigo-700'}`}>
        <h3 className={`text-2xl font-bold mb-4 text-center ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>AI Weather Insight (Overview)</h3>
        {loadingAI ? (
            <div className={`text-center font-semibold text-lg animate-pulse ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>
                Generating AI summary...
            </div>
        ) : (
            <p className={`leading-relaxed text-base text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                {aiSummary || "AI summary will appear here."}
            </p>
        )}
    </div>
);

// ExtremeWeatherAlertAI Component
export const ExtremeWeatherAlertAI = ({ alertMessage, loadingAlertAI, theme }) => (
    <div className={`mt-8 text-left p-8 rounded-2xl shadow-xl border animate-fade-in-up
        ${theme === 'light' ? 'bg-gradient-to-br from-red-100 to-orange-100 border-red-300' : 'bg-gradient-to-br from-red-800 to-orange-900 border-red-700'}`}>
        <h3 className={`text-2xl font-bold mb-4 text-center ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            <span className="inline-block mr-2 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 inline-block" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.34c.52-.927 1.464-.927 1.984 0l5.578 9.969C16.48 14.167 15.688 15 14.654 15H5.346C4.312 15 3.52 14.167 4.162 13.309l5.578-9.969zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-7a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                </svg>
            </span>
            Extreme Weather Alert
        </h3>
        {loadingAlertAI ? (
            <div className={`text-center font-semibold text-lg animate-pulse ${theme === 'light' ? 'text-orange-700' : 'text-orange-400'}`}>
                Checking for extreme conditions...
            </div>
        ) : (
            <p className={`leading-relaxed text-base text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                {alertMessage || "No extreme weather alerts at this time."}
            </p>
        )}
    </div>
);

// ClothingRecommendationAI Component (New AI Feature)
export const ClothingRecommendationAI = ({ clothingRecommendation, loadingClothingAI, theme }) => (
    <div className={`mt-8 text-left p-8 rounded-2xl shadow-xl border animate-fade-in-up
        ${theme === 'light' ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200' : 'bg-gradient-to-br from-purple-800 to-pink-900 border-purple-700'}`}>
        <h3 className={`text-2xl font-bold mb-4 text-center ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            <span className="inline-block mr-2 text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 inline-block" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M18.685 19.023A9.75 9.75 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.75 9.75 0 003.065 7.023A3.753 3.753 0 016.53 15.63a2.25 2.25 0 001.07-1.916 3.75 3.75 0 013.75-3.75c1.875 0 3.162 1.054 3.162 1.054s.46-.053.893-.166a2.625 2.625 0 001.396-2.714C17.013 9.424 15.55 8.25 12 8.25c-2.905 0-5.5 1.152-5.5 1.152S6 10.183 6 12a2.25 2.25 0 002.25 2.25c.66 0 1.258-.162 1.749-.408V16.5L13.5 18H8.25Z" clipRule="evenodd" />
                </svg>
            </span>
            Clothing Recommendation (AI)
        </h3>
        {loadingClothingAI ? (
            <div className={`text-center font-semibold text-lg animate-pulse ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>
                Generating clothing recommendation...
            </div>
        ) : (
            <p className={`leading-relaxed text-base text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                {clothingRecommendation || "Clothing recommendation will appear here."}
            </p>
        )}
    </div>
);

// HourlyForecastDisplay Component (New Component)
export const HourlyForecastDisplay = ({ fullHourlyForecastData, unit, theme, hourlyRecommendations, loadingHourlyAI, timezoneOffset }) => (
    fullHourlyForecastData && fullHourlyForecastData.length > 0 && (
        <div className={`mt-8 text-left p-8 rounded-2xl shadow-xl border
            ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200' : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center tracking-tight ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Hourly Forecast & Activity Ideas</h3>
            <div className="flex overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-blue-400 scrollbar-track-blue-100">
                {fullHourlyForecastData.slice(0, 10).map((hourData, index) => (
                    <div key={index} className={`flex-shrink-0 w-32 p-3 mr-4 rounded-xl shadow-md flex flex-col items-center border transform hover:scale-105 transition-transform duration-200 group
                        ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-600 border-gray-500'}`}>
                        <p className={`font-semibold text-sm mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                            {formatTime(hourData.dt, timezoneOffset)}
                        </p>
                        {hourData.weather[0].icon && (
                            <img
                                src={`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`}
                                alt={hourData.weather[0].description}
                                className="w-12 h-12 transform group-hover:scale-110 transition-transform duration-200"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/cccccc/000000?text=Icon"; }}
                            />
                        )}
                        <p className={`text-lg font-bold mt-1 ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
                            {Math.round(hourData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
                        </p>
                        <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Feels: {Math.round(hourData.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}
                        </p>
                        <p className={`text-xs capitalize text-center mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {hourData.weather[0].description}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <h4 className={`text-xl font-bold mb-3 text-center ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>AI Hourly Recommendations</h4>
                {loadingHourlyAI ? (
                    <div className={`text-center font-semibold text-base animate-pulse ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>
                        Generating hourly recommendations...
                    </div>
                ) : (
                    <p className={`leading-relaxed text-base text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        {hourlyRecommendations || "Hourly recommendations will appear here."}
                    </p>
                )}
            </div>
        </div>
    )
);