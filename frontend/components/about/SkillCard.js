import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Skill card component with progress bar
 * @param {Object} props - Component props
 * @param {string} props.title - Skill title
 * @param {number} props.percentage - Skill proficiency percentage
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.isActive - Whether the card is active/selected
 */
export default function SkillCard({ title, percentage, onClick, isActive }) {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';
  
  return (
    <motion.div 
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isActive 
          ? 'bg-primary bg-opacity-10 border border-primary' 
          : 'bg-gray-100 dark:bg-dark hover:bg-gray-200 dark:hover:bg-dark-lighter border border-transparent'
      }`}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between mb-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span>
        <span className={`font-semibold ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-dark-lighter rounded-full h-2.5">
        <motion.div 
          className="bg-primary h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        ></motion.div>
      </div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
        <span>{isActive ? (isEnglish ? 'Click to close' : 'Clique para fechar') : (isEnglish ? 'Click for details' : 'Clique para detalhes')}</span>
        <motion.span 
          animate={{ x: isActive ? [0, 2, 0] : [0, 5, 0] }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
          className="ml-1"
        >
          {isActive ? '×' : '→'}
        </motion.span>
      </div>
    </motion.div>
  );
} 