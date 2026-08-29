'use client';

import Header from './Header';
import Footer from './Footer';
import GrainOverlay from './GrainOverlay';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-ink">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <GrainOverlay />
    </div>
  );
}
