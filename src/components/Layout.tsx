import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  wide?: boolean;
}

export default function Layout({ children, wide }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: '#f8fffe' }}>
      <Navbar />
      <main className={`mx-auto px-4 sm:px-6 py-6 page-fade-in ${wide ? 'max-w-screen-2xl' : 'max-w-7xl'}`}>
        {children}
      </main>
    </div>
  );
}
