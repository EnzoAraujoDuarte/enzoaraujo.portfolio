import { motion } from 'framer-motion';

export default function SkillDomainCard({ domain, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col h-full pl-6 pr-1 py-1 border-l-2 border-gray-200 dark:border-white/10 hover:border-primary transition-colors duration-500"
    >
      <h3 className="font-display text-lg laptop:text-xl font-bold text-gray-900 dark:text-white leading-snug tracking-[-0.02em]">
        {domain.name}
      </h3>

      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5 text-pretty">
        {domain.description}
      </p>

      <div className="mt-auto flex flex-wrap gap-1.5">
        {domain.tools.map((tool) => (
          <span
            key={tool}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-dark-lighter text-gray-600 dark:text-gray-300"
          >
            {tool}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
