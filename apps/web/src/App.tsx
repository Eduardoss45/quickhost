import { useEffect } from 'react';
import { useUser } from './hooks/new/useUser';
import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { initSocket } from '@/services/socket';

function App() {
  const { bootstrapSession, hydrated, user } = useUser();

  useEffect(() => {
    bootstrapSession();
  }, []);

  useEffect(() => {
    if (!hydrated || !user) return;

    const socket = initSocket();

    return () => {
      socket?.disconnect();
    };
  }, [hydrated, user]);

  if (!hydrated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <Navbar />
      <main className="flex flex-1 justify-center container mx-auto px-4 bg-zinc-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
