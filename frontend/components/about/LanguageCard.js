import { motion } from 'framer-motion';

const SEGMENT_COUNT = 5;

export default function LanguageCard({ name, level, description, abilities }) {
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-dark-lighter bg-white dark:bg-dark p-5 shadow-sm"
      whileHover={{ y: -3, borderColor: 'rgba(147,51,234,0.4)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Top accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, rgb(147,51,234), transparent)' }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{description}</p>
        </div>

        {/* Segmented level indicator */}
        <div className="flex gap-1 mt-0.5">
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2.5 h-5 rounded-sm"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: 1,
                scaleY: 1,
                backgroundColor: i < level ? 'rgb(147,51,234)' : 'rgb(229,231,235)',
              }}
              transition={{ delay: 0.08 * i, duration: 0.25, ease: 'easeOut' }}
              style={{
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </div>
      </div>

      {/* Thin divider */}
      <div className="w-full h-px bg-gray-100 dark:bg-dark-lighter mb-4" />

      {/* Abilities */}
      <div className="space-y-2.5">
        {abilities.map((ability, idx) => (
          <div key={ability.skill}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">{ability.skill}</span>
              <span className="text-primary font-medium">{ability.level}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-dark-lighter rounded-full h-1 overflow-hidden">
              <motion.div
                className="h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, rgb(147,51,234), rgb(192,132,252))' }}
                initial={{ width: 0 }}
                animate={{ width: ability.level }}
                transition={{ duration: 0.8, delay: 0.15 + idx * 0.08, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
