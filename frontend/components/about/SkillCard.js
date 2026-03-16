import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';

const levelLabel = (percentage, isEnglish) => {
  if (percentage >= 90) return isEnglish ? 'Advanced' : 'Avançado';
  if (percentage >= 70) return isEnglish ? 'Proficient' : 'Proficiente';
  if (percentage >= 55) return isEnglish ? 'Intermediate' : 'Intermediário';
  return isEnglish ? 'Learning' : 'Aprendendo';
};

export default function SkillCard({ title, percentage, icon, onClick, isActive }) {
  const { language } = useLanguage();
  const isEnglish = language === 'en-US';

  return (
    <motion.div
      className={`relative p-4 rounded-2xl cursor-pointer border overflow-hidden transition-colors duration-200 ${
        isActive
          ? 'bg-primary/10 dark:bg-primary/10 border-primary/50'
          : 'bg-gray-100 dark:bg-dark border-gray-200 dark:border-dark-lighter hover:border-primary/35 dark:hover:border-primary/35'
      }`}
      onClick={onClick}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.985 }}
    >
      {/* Subtle top accent on active */}
      {isActive && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, rgb(147,51,234), transparent)' }}
        />
      )}

      <div className="flex items-center gap-3">
        {/* Icon */}
        {icon && (
          <div className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden border transition-colors duration-200 ${
            isActive
              ? 'bg-white dark:bg-dark-secondary border-primary/20'
              : 'bg-white dark:bg-dark-secondary border-gray-100 dark:border-dark-lighter'
          }`}>
            <Image
              src={icon}
              alt={title}
              width={30}
              height={30}
              className="object-contain"
              loading="eager"
            />
          </div>
        )}

        {/* Middle: name + bar */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`font-semibold text-sm truncate ${isActive ? 'text-primary' : 'text-gray-800 dark:text-gray-200'}`}>
              {title}
            </span>
            <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${
              isActive
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-dark-lighter text-gray-600 dark:text-gray-400'
            }`}>
              {percentage}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-dark-lighter rounded-full h-[5px] overflow-hidden">
            <motion.div
              className="h-[5px] rounded-full"
              style={{ background: 'linear-gradient(90deg, rgb(147,51,234), rgb(192,132,252))' }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
            />
          </div>

          {/* Level label + hint */}
          <div className="mt-1.5 flex items-center justify-between">
            <p className={`text-[11px] font-medium ${isActive ? 'text-primary/70' : 'text-gray-400 dark:text-gray-600'}`}>
              {levelLabel(percentage, isEnglish)}
            </p>
            <span className="text-[11px] text-gray-400 dark:text-gray-600 flex items-center gap-0.5">
              {isActive
                ? (isEnglish ? 'Click to close' : 'Clique para fechar')
                : (isEnglish ? 'Click for details' : 'Clique para detalhes')}
              <motion.span
                animate={{ x: isActive ? [0, 2, 0] : [0, 4, 0] }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
              >
                {isActive ? ' ×' : ' →'}
              </motion.span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
