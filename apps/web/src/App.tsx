import { useEffect } from 'react';
import { useUser } from './hooks/useUser';
import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { initSocket } from '@/services/notification.socket';
import { useChatNotifications } from './hooks/useNotifications';
import { useFavoritesStore } from './store/favorites.store';

function App() {
  const { bootstrapSession, hydrated, user } = useUser();
  const { fetchFavorites } = useFavoritesStore();

  useEffect(() => {
    bootstrapSession();
  }, []);

  useEffect(() => {
    if (!hydrated || !user) return;

    fetchFavorites();

    const socket = initSocket();

    return () => {
      socket?.disconnect();
    };
  }, [hydrated, user, fetchFavorites]);

  useChatNotifications();

  if (!hydrated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 container mx-auto shadow-sm">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
