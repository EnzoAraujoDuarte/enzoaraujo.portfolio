import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import Image from 'next/image';

/**
 * Course item component with progress bar
 * @param {Object} props - Component props
 * @param {string} props.title - Course title
 * @param {string} props.description - Course description
 * @param {number} props.progress - Course progress percentage
 * @param {string} props.imageSrc - Course image source
 * @param {Function} props.onClick - Click handler for expandable courses
 * @param {boolean} props.isActive - Whether the course is active/selected
 * @param {boolean} props.expandable - Whether the course has expandable details
 */
export default function CourseItem({ title, description, progress, imageSrc, onClick, isActive, expandable }) {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';
  
  return (
    <motion.div 
      className={`p-5 bg-gray-100 dark:bg-dark rounded-lg ${expandable ? 'cursor-pointer' : ''} transition-all ${
        isActive 
          ? 'bg-primary bg-opacity-10 border border-primary' 
          : expandable ? 'hover:bg-gray-200 dark:hover:bg-dark-lighter border border-transparent' : 'border border-transparent'
      }`}
      onClick={onClick}
      whileTap={expandable ? { scale: 0.98 } : undefined}
    >
      <div className="flex items-center gap-4 mb-3">
        {imageSrc && (
          <div className="w-12 h-12 bg-white dark:bg-dark-secondary rounded-md overflow-hidden flex-shrink-0 p-1">
            <div className="relative w-full h-full">
              <Image
                src={imageSrc}
                alt={title}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        )}
        <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-3">{description}</p>
      <div className="w-full bg-gray-200 dark:bg-dark-lighter rounded-full h-2.5 mb-1">
        <motion.div 
          className="bg-primary h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        ></motion.div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-primary font-medium">{progress}%</div>
        {expandable && (
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <span>{isActive ? (isEnglish ? 'Click to close' : 'Clique para fechar') : (isEnglish ? 'Click for details' : 'Clique para detalhes')}</span>
            <motion.span 
              animate={{ x: isActive ? [0, 2, 0] : [0, 5, 0] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
              className="ml-1"
            >
              {isActive ? '×' : '→'}
            </motion.span>
          </div>
        )}
      </div>
    </motion.div>
  );
} 