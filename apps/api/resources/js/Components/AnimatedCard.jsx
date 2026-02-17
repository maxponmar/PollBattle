import { motion } from 'motion/react';

export default function AnimatedCard({
    className = '',
    delay = 0,
    children,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay, ease: 'easeOut' }}
            className={`panel p-5 ${className}`}
        >
            {children}
        </motion.div>
    );
}
