import { motion } from 'framer-motion';
import { EASE, DURATION, viewportOnce } from '../../lib/motion';

export default function SkillDomainCard({ domain, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: DURATION.base, delay: index * 0.07, ease: EASE.out }}
      className="group relative flex flex-col h-full pl-6 pr-1 py-1 border-l-2 border-white/10 hover:border-primary transition-colors duration-500"
    >
      <div className="flex items-center gap-3 flex-wrap">
        <h3 className="font-display text-lg laptop:text-xl font-bold text-white leading-snug tracking-[-0.02em]">
          {domain.name}
        </h3>
        {domain.note && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] border border-white/15 text-gray-400">
            {domain.note}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-400 leading-relaxed mb-5 text-pretty">
        {domain.description}
      </p>

      <div className="mt-auto flex flex-wrap gap-1.5">
        {domain.tools.map((tool) => (
          <span
            key={tool}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-dark-lighter text-gray-300"
          >
            {tool}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
