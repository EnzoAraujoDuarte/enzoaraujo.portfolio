import Image from 'next/image';

/**
 * Basic timeline item component
 * @param {Object} props - Component props
 * @param {string} props.period - Time period text
 * @param {string} props.title - Item title
 * @param {string} props.description - Item description
 */
export function TimelineItem({ period, title, description }) {
  return (
    <div className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-4 before:h-4 before:bg-primary before:rounded-full before:z-10 before:content-[''] before:shadow-md">
      <div className="absolute left-2 top-1 bottom-0 w-[1px] bg-gray-200 dark:bg-dark"></div>
      <div className="text-sm text-primary font-semibold mb-1">{period}</div>
      <div className="font-bold text-gray-900 dark:text-white mb-1">{title}</div>
      <div className="text-gray-700 dark:text-gray-300">{description}</div>
    </div>
  );
}

/**
 * Timeline item with image component
 * @param {Object} props - Component props
 * @param {string} props.period - Time period text
 * @param {string} props.title - Item title
 * @param {string} props.description - Item description
 * @param {string} props.imageSrc - Image source
 * @param {string} props.alt - Image alt text
 */
export function TimelineItemWithImage({ period, title, description, imageSrc, alt }) {
  return (
    <div className="flex flex-col tablet:flex-row items-start gap-4 mb-8">
      <div className="w-16 h-16 tablet:w-20 tablet:h-20 bg-white dark:bg-dark-secondary rounded-lg overflow-hidden shadow-sm flex-shrink-0 p-1">
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt={alt || title}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
      <div className="flex-grow">
        <div className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-4 before:h-4 before:bg-primary before:rounded-full before:z-10 before:content-[''] before:shadow-md">
          <div className="absolute left-2 top-1 bottom-0 w-[1px] bg-gray-200 dark:bg-dark"></div>
          <div className="text-sm text-primary font-semibold mb-1">{period}</div>
          <div className="font-bold text-gray-900 dark:text-white mb-1">{title}</div>
          <div className="text-gray-700 dark:text-gray-300">{description}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Career position timeline item
 * @param {Object} props - Component props
 * @param {string} props.title - Position title
 * @param {string} props.period - Time period text
 * @param {string} props.description - Position description
 */
export function CareerPosition({ title, period, description }) {
  return (
    <div className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-3 before:h-3 before:bg-primary before:rounded-full before:z-10 before:content-['']">
      <div className="absolute left-[5px] top-4 bottom-0 w-[2px] bg-primary bg-opacity-30"></div>
      <div className="font-bold text-gray-900 dark:text-white mb-1">{title}</div>
      <div className="text-sm text-primary font-semibold mb-2">{period}</div>
      <div className="text-gray-700 dark:text-gray-300">{description}</div>
    </div>
  );
} 