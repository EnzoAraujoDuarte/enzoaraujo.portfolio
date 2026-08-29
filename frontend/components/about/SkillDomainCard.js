
export default function SkillDomainCard({ domain, index }) {
  return (
    <article data-reveal
      className="group relative flex flex-col h-full pl-6 pr-1 py-1 border-l-2 border-bone/10 hover:border-ember transition-colors duration-500">
      <div className="flex items-center gap-3 flex-wrap">
        <h3 className="font-display text-lg laptop:text-xl font-bold text-bone leading-snug tracking-[-0.02em]">
          {domain.name}
        </h3>
        {domain.note && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] border border-bone/15 text-bone/55">
            {domain.note}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-bone/55 leading-relaxed mb-5 text-pretty">
        {domain.description}
      </p>

      <div className="mt-auto flex flex-wrap gap-1.5">
        {domain.tools.map((tool) => (
          <span
            key={tool}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-graphite text-bone/70"
          >
            {tool}
          </span>
        ))}
      </div>
    </article>
  );
}
