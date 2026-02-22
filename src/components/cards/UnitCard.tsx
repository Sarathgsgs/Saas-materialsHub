import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface UnitCardProps {
  id: string;
  name: string;
  unitNumber: number;
}

export const UnitCard: React.FC<UnitCardProps> = ({ id, name, unitNumber }) => {
  return (
    <Link to={`/unit/${id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm hover:shadow-md dark:bg-gray-800 dark:shadow-gray-900 border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            {unitNumber}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
        </div>
        <div className="text-gray-400 dark:text-gray-500">
          &rarr;
        </div>
      </motion.div>
    </Link>
  );
};
