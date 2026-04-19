'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import FloatingMenu from './FloatingMenu';
import FloatingConsultForm from './FloatingConsultForm';

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col pt-0">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingMenu />
      <FloatingConsultForm />
    </div>
  );
}
