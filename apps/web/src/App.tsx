import { useEffect } from 'react';
import { useUser } from './hooks/new/useUser';
import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  const { bootstrapSession, hydrated } = useUser();
  useEffect(() => {
    bootstrapSession();
  }, []);

  if (!hydrated) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-1 bg-zinc-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
