'use client';

import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
