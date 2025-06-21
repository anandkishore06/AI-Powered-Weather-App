// SearchBar Component
export const SearchBar = ({ city, setCity, handleSearch, theme }) => ( // Removed handleCurrentLocationSearch prop
    <div className="flex flex-col gap-4 mb-4 mt-8">
        <div className="flex flex-col sm:flex-row gap-4">
            <input
                type="text"
                className={`flex-1 p-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-lg shadow-inner-lg hover:shadow-lg
                    ${theme === 'light' ? 'border-blue-400 focus:ring-blue-600 text-gray-800 placeholder-gray-500 bg-blue-50' : 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-400'}`}
                placeholder="Search for a city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <button
                className={`p-3.5 rounded-xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center text-lg font-semibold transform hover:scale-105 active:scale-95
                    ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white focus:ring-blue-500' : 'bg-gradient-to-r from-blue-800 to-indigo-900 text-white focus:ring-blue-600'}`}
                onClick={handleSearch}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Search
            </button>
        </div>
        {/* Removed the "Use Current Location" button */}
    </div>
);