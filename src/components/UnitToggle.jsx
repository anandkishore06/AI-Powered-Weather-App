// UnitToggle Component
export const UnitToggle = ({ unit, toggleUnit, theme }) => (
    <div className="flex justify-center mb-6">
        <button
            onClick={toggleUnit}
            className={`py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 font-medium text-lg transform hover:scale-105 active:scale-95
                ${theme === 'light' ? 'bg-gradient-to-r from-purple-200 to-indigo-200 text-purple-900 focus:ring-purple-500' : 'bg-gradient-to-r from-purple-800 to-indigo-800 text-white focus:ring-purple-600'}`}
        >
            Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
        </button>
    </div>
);