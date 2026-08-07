import { motion } from 'framer-motion';
import { formatPeriod } from '../../utils/dateUtils';

function TechTag({ children }) {
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-dark-lighter text-gray-300">
      {children}
    </span>
  );
}

function Role({ role, isCurrent, isEnglish }) {
  const period = role.period ?? formatPeriod(role.startYear, role.startMonth, isEnglish);

  return (
    <div className="relative pl-8 tablet:pl-10 pb-10 last:pb-0">
      {/* Rail */}
      <div className="absolute left-[5px] top-3 bottom-0 w-px bg-white/[0.08]" />

      {/* Node */}
      <div
        className={`absolute left-0 top-[7px] w-[11px] h-[11px] rounded-full border-2 ${
          isCurrent
            ? 'bg-primary border-primary shadow-[0_0_0_4px_rgba(147,51,234,0.15)]'
            : 'bg-dark border-white/20'
        }`}
      />

      <h4 className="font-display text-lg tablet:text-xl font-bold text-white leading-snug tracking-[-0.015em]">
        {role.title}
      </h4>

      <p className="mt-1 text-xs font-semibold text-primary tabular-nums">{period}</p>

      <ul className="mt-4 space-y-2.5">
        {role.highlights.map((highlight) => (
          <li
            key={highlight}
            className="relative pl-4 text-sm text-gray-400 leading-relaxed text-pretty before:absolute before:left-0 before:top-[0.6em] before:w-1 before:h-1 before:rounded-full before:bg-primary/50"
          >
            {highlight}
          </li>
        ))}
      </ul>

      {role.stack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {role.stack.map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CareerTimeline({ career, isEnglish }) {
  return (
    <div className="space-y-12 tablet:space-y-16">
      {career.map((company, companyIndex) => (
        <motion.article
          key={company.company}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: companyIndex * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-1 laptop:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-6 laptop:gap-12"
        >
          {/* Company column — sticky on desktop so it anchors the roles beside it */}
          <div className="laptop:sticky laptop:top-28 laptop:self-start">
            {company.isCurrent && (
              <span className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isEnglish ? 'Current' : 'Atual'}
              </span>
            )}

            <h3 className="font-display text-xl tablet:text-2xl font-bold text-white leading-tight tracking-[-0.02em]">
              {company.company}
            </h3>

            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              {company.location}
            </p>

            {company.duration && (
              <p className="mt-1 text-xs text-gray-600">{company.duration}</p>
            )}
          </div>

          <div>
            {company.roles.map((role, roleIndex) => (
              <Role
                key={role.title}
                role={role}
                isCurrent={company.isCurrent && roleIndex === 0}
                isEnglish={isEnglish}
              />
            ))}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
