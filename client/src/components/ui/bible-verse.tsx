import { ReactNode } from 'react';

interface BibleVerseProps {
  children: ReactNode;
  reference?: string;
  className?: string;
}

const BibleVerse = ({ children, reference, className = '' }: BibleVerseProps) => {
  return (
    <div className={`bible-verse text-sm mb-4 ${className}`}>
      {children}
      {reference && <span className="font-medium"> - {reference}</span>}
    </div>
  );
};

export default BibleVerse;
