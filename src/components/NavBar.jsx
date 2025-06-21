import { motion } from 'framer-motion';

export const NavBar = ({ theme, toggleTheme }) => (
    <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`w-full py-4 px-8 flex justify-between items-center rounded-t-3xl transition-all duration-500
      ${theme === 'light'
                ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-xl'
                : 'bg-gradient-to-r from-gray-900 to-gray-700 text-gray-100 shadow-xl'}`}
    >
        <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-blue-300"
        >
            WeatherNow
        </motion.h1>

        <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={toggleTheme}
            className={`p-2.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95
        ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h1M3 12H2m8.003-9.697l-.707.707M16.947 16.947l.707.707M3.75 4.5l.707-.707M19.25 19.5l-.707-.707M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
                </svg>
            )}
        </motion.button>
    </motion.nav>
);
