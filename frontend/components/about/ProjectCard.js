import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiArrowUpRight, FiCode } from 'react-icons/fi';

import { EASE, DURATION, viewportOnce, clipReveal } from '../../lib/motion';
import { useParallax } from '../../hooks/useParallax';

export default function ProjectCard({ project, index, isEnglish }) {
  const { ref: parallaxRef, y: imageY } = useParallax(14);
  const Wrapper = project.url ? 'a' : 'div';
  const linkProps = project.url
    ? { href: project.url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: DURATION.base, delay: (index % 3) * 0.08, ease: EASE.out }}
      ref={parallaxRef}
      className="h-full"
    >
      <Wrapper {...linkProps} className="group flex flex-col h-full">
        <motion.div
          variants={clipReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative aspect-[16/10] overflow-hidden rounded-xl bg-dark-lighter"
        >
          <motion.div style={{ y: imageY }} className="absolute -inset-y-[9%] inset-x-0">
          {project.images?.[0] ? (
            <>
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              {project.images?.[1] && (
                <Image
                  src={project.images[1]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
              <FiCode className="w-10 h-10 text-primary/25" />
            </div>
          )}
          </motion.div>

          <span
            className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm border ${
              project.status === 'Online'
                ? 'bg-black/50 text-emerald-300 border-emerald-500/30'
                : 'bg-black/50 text-violet-300 border-violet-400/30'
            }`}
          >
            {project.status === 'Online' && <span className="w-1 h-1 rounded-full bg-emerald-400" />}
            {project.status}
          </span>
        </motion.div>

        <div className="flex flex-col flex-grow pt-5">
          <h3 className="font-display text-base laptop:text-lg font-bold text-white leading-snug tracking-[-0.015em] group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          <p className="mt-2.5 text-[0.8125rem] text-gray-400 leading-relaxed line-clamp-3 text-pretty">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[11px] font-medium text-gray-500">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[11px] font-medium text-gray-600">
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.07] group-hover:border-primary/30 transition-colors duration-500">
            {project.url ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                {isEnglish ? 'View project' : 'Ver projeto'}
                <FiArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            ) : (
              <span className="text-xs text-gray-500">
                {isEnglish ? 'In development' : 'Em desenvolvimento'}
              </span>
            )}
          </div>
        </div>
      </Wrapper>
    </motion.article>
  );
}
