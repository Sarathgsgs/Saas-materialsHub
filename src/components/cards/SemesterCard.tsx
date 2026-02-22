import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface SemesterCardProps {
  id: number;
  name: string;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({ id, name }) => {
  return (
    <Link to={`/semester/${id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative flex flex-col justify-center items-center h-48 rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
      >
        <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-full bg-indigo-50 dark:bg-indigo-900/20 transition-all group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40" />
        <h3 className="z-10 text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {name}
        </h3>
        <p className="z-10 mt-2 text-sm text-gray-500 dark:text-gray-400">
          View Subjects &rarr;
        </p>
      </motion.div>
    </Link>
  );
};
