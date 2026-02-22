import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface SubjectCardProps {
  id: string;
  name: string;
  code: string;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ id, name, code }) => {
  return (
    <Link to={`/subject/${id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-col h-40 rounded-xl bg-white p-5 shadow-sm hover:shadow-md dark:bg-gray-800 dark:shadow-gray-900 border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all"
      >
        <div className="flex-1">
          <span className="inline-block rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            {code}
          </span>
          <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
            {name}
          </h3>
        </div>
        <div className="mt-auto text-sm text-gray-500 dark:text-gray-400">
          View Units &rarr;
        </div>
      </motion.div>
    </Link>
  );
};
