import { useEffect } from 'react';
import { useUser } from './hooks/new/useUser';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  const { bootstrapSession, hydrated } = useUser();
  useEffect(() => {
    bootstrapSession();
  }, []);

  if (!hydrated) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
