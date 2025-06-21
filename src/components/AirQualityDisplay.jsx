// AirQualityDisplay Component (New Component)
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

// Function to get AQI color based on value
const getAqiColor = (aqi) => {
    switch (aqi) {
        case 1: return "text-green-500";
        case 2: return "text-yellow-500";
        case 3: return "text-orange-500";
        case 4: return "text-red-500";
        case 5: return "text-purple-600";
        default: return "text-gray-500";
    }
};

export const AirQualityDisplay = ({ aqiData, loadingAqi, aqiError, theme }) => (
    <div className={`mt-8 text-left p-8 rounded-xl shadow-xl border animate-fade-in-up
        ${theme === 'light' ? 'bg-gradient-to-br from-lime-100 to-emerald-100 border-lime-300' : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'}`}>
        <h3 className={`text-2xl font-bold mb-4 text-center ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            <span className="inline-block mr-2 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 inline-block" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M7.5 10.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V10.5zm0 3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V13.5zm0 3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V16.5zm3-6a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V10.5zm0 3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V13.5zm0 3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V16.5zm3-6a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V10.5zm0 3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V13.5zm0 3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V16.5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M16.5 3A1.5 1.5 0 0015 4.5v15A1.5 1.5 0 0016.5 21h3A1.5 1.5 0 0021 19.5v-15A1.5 1.5 0 0019.5 3h-3zM18 6.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V6.75zm0 3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V9.75zm0 3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V12.75z" clipRule="evenodd" />
                </svg>
            </span>
            Air Quality Index (AQI)
        </h3>
        {loadingAqi ? (
            <div className={`text-center font-semibold text-lg animate-pulse ${theme === 'light' ? 'text-lime-700' : 'text-lime-400'}`}>
                Fetching air quality data...
            </div>
        ) : aqiError ? (
            <div className={`text-center font-semibold text-lg ${theme === 'light' ? 'text-red-700' : 'text-red-400'}`}>
                {aqiError}
            </div>
        ) : aqiData ? (
            <div className="text-center">
                <p className={`text-5xl font-extrabold ${getAqiColor(aqiData.aqi)} mb-2`}>
                    {aqiData.aqi}
                </p>
                <p className={`text-xl font-bold ${getAqiColor(aqiData.aqi)} mb-4`}>
                    {getAqiDescription(aqiData.aqi)}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>CO: <span className="font-bold">{aqiData.components.co}</span> μg/m³</p>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>NO2: <span className="font-bold">{aqiData.components.no2}</span> μg/m³</p>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>O3: <span className="font-bold">{aqiData.components.o3}</span> μg/m³</p>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>SO2: <span className="font-bold">{aqiData.components.so2}</span> μg/m³</p>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>PM2.5: <span className="font-bold">{aqiData.components.pm2_5}</span> μg/m³</p>
                    <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>PM10: <span className="font-bold">{aqiData.components.pm10}</span> μg/m³</p>
                </div>
            </div>
        ) : (
            <p className={`leading-relaxed text-base text-center ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Air quality data will appear here.
            </p>
        )}
    </div>
);