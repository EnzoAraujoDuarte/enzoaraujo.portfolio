'use client';

import Header from './Header';

export default function Layout({ children, isHomePage = false }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark">
      <Header isTransparent={isHomePage} />
      <main className={`flex-grow ${isHomePage ? '' : 'pt-16'}`}>
        {children}
      </main>
    </div>
  );
} 