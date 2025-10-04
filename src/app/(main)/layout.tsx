'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Footer from '@/components/root/footer/Footer';
import Navbar from '@/components/root/navbar/Navbar';
import { store, persistor } from '@/lib/store'; // make sure your store exports both
import { SessionProvider } from 'next-auth/react';

function Layout({ children }: { children: ReactNode }) {
  return (
  
    <SessionProvider>

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <section className="home w-full min-h-dvh flex flex-col max-w-5xl mx-auto">
          <Navbar />
          <main className="pb-24 min-h-[calc(100dvh-4rem)]">{children}</main>
          <Footer />
        </section>
      </PersistGate>
    </Provider>
    </SessionProvider>
  );
}

export default Layout;
