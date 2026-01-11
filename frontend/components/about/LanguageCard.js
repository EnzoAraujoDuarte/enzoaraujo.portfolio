import { motion } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';

/**
 * Language proficiency card component
 * @param {Object} props - Component props
 * @param {string} props.name - Language name
 * @param {number} props.level - Language proficiency level (1-5)
 * @param {string} props.description - Language proficiency description
 * @param {Array} props.abilities - Language abilities with their proficiency levels
 */
export default function LanguageCard({ name, level, description, abilities }) {
  return (
    <motion.div 
      className="bg-gray-100 dark:bg-dark rounded-lg p-5 shadow-sm"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h4>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.span 
              key={star} 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * star }}
              className={star <= level ? "text-primary" : "text-gray-400 dark:text-gray-600"}
            >
              ★
            </motion.span>
          ))}
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">{description}</p>
      
      <div className="space-y-3">
        {abilities.map((ability) => (
          <div key={ability.skill}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-gray-300">{ability.skill}</span>
              <span className="text-primary">{ability.level}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-lighter rounded-full h-1.5">
              <motion.div 
                className="bg-primary h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: ability.level }}
                transition={{ duration: 0.8, delay: 0.3 }}
              ></motion.div>
            </div>
          </div>
        ))}
      </div>
      
      <motion.div 
        className="mt-4 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center p-2 rounded-full bg-primary bg-opacity-10">
          <FiGlobe className="text-primary mr-1" size={16} />
          <span className="text-sm text-primary font-medium">{name}</span>
        </div>
      </motion.div>
    </motion.div>
  );
} 