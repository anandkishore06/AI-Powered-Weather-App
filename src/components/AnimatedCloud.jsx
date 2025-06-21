import { motion } from 'framer-motion';

export const AnimatedCloud = ({ theme }) => (
    <motion.svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-10 left-10 w-32 h-32 opacity-20 z-0"
        initial={{ x: -50 }}
        animate={{ x: 50 }}
        transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
        }}
        fill={theme === 'light' ? '#a0aec0' : '#edf2f7'}
    >
        <path d="M48.3 30.9c.1-.6.2-1.3.2-2 0-5.5-4.5-10-10-10-3.4 0-6.4 1.7-8.2 4.3C28.6 22.4 26.4 22 24 22c-5.5 0-10 4.5-10 10 0 .5 0 .9.1 1.3C10.6 34.5 8 38.1 8 42.3 8 48.1 13 53 18.7 53h28.7C52.9 53 58 47.9 58 42.3c0-5-3.8-9.1-8.7-11.4z" />
    </motion.svg>
);
