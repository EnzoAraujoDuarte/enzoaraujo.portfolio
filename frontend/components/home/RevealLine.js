import { motion } from 'framer-motion';

const rise = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Masked entrance: the text slides up from behind its own bounds.
 * `as` keeps the heading level with the surrounding document outline.
 */
export default function RevealLine({ children, as: Tag = 'span', className = '' }) {
  return (
    <Tag className={`block overflow-hidden ${className}`}>
      <motion.span variants={rise} className="block">
        {children}
      </motion.span>
    </Tag>
  );
}
