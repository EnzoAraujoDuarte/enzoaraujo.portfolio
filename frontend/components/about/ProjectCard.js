import Image from 'next/image';
import { FiCode } from 'react-icons/fi';


/**
 * Static editorial card. The deployments these used to link out to are stale,
 * so the card carries the work visually and stops there — no hover affordance
 * that promises a destination it cannot deliver.
 */
export default function ProjectCard({ project, index }) {
  return (
    <article data-reveal
      className="group flex flex-col h-full">
      <div
      className="relative aspect-[16/10] overflow-hidden rounded-xl bg-graphite">
        <div className="absolute -inset-y-[9%] inset-x-0">
          {project.images?.[0] ? (
            <>
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover saturate-[0.35] contrast-[1.05] transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:saturate-[0.7]"
              />
              {project.images?.[1] && (
                <Image
                  src={project.images[1]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover saturate-[0.35] contrast-[1.05] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ember/10 to-transparent">
              <FiCode className="w-10 h-10 text-ember/25" />
            </div>
          )}
        </div>

        {/* Grain inside the frame, so the screenshots sit in the page texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{ backgroundImage: 'url(/Images/art/grain-256.png)' }}
        />

        <span className="meta absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-bone/15 bg-ink/60 px-2.5 py-1 backdrop-blur-sm text-bone/80">
          {project.status === 'Online' && <span className="h-1 w-1 rounded-full bg-ember" />}
          {project.status}
        </span>
      </div>

      <div className="flex flex-col flex-grow pt-5">
        <h3 className="font-display text-base laptop:text-lg font-semibold text-bone leading-snug tracking-[-0.015em]">
          {project.title}
        </h3>

        <p className="mt-2.5 text-[0.8125rem] text-bone/55 leading-relaxed line-clamp-3 text-pretty">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="font-mono text-[11px] text-ash">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="font-mono text-[11px] text-ash/60">+{project.tags.length - 3}</span>
          )}
        </div>
      </div>
    </article>
  );
}
