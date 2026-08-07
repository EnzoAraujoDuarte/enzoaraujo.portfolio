import { motion } from 'framer-motion';
import { EASE, DURATION } from '../../lib/motion';

const rise = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: DURATION.slow, ease: EASE.expressive } },
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
