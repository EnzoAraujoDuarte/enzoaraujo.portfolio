
export default function SectionHeading({ index, label, title, lead }) {
  return (
    <header data-reveal
      className="mb-10 tablet:mb-14">
      <div className="flex items-center gap-4 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-bone/55 whitespace-nowrap">
          {index} — {label}
        </p>
        <div className="flex-1 h-px bg-bone/10" />
      </div>

      <h2 className="font-display text-3xl tablet:text-4xl laptop:text-5xl font-bold text-bone tracking-[-0.03em] leading-[1.05] text-balance">
        {title}
      </h2>

      {lead && (
        <p className="mt-5 max-w-2xl text-base tablet:text-lg text-bone/55 leading-relaxed text-pretty">
          {lead}
        </p>
      )}
    </header>
  );
}
