import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { Route, Routes } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/Home';
import Configurations from '@/pages/Configurations';
import Chat from '@/pages/Chat';
import Host from '@/pages/Host';
import EditMultiStepForm from '@/components/forms/EditMultiStepForm';
import CreatorMultiStepForm from '@/components/forms/CreatorMultiStepForm';
import Favorites from '@/pages/Favorites';
import Announcement from '@/pages/Announcement';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/configurations" element={<Configurations />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/host" element={<Host />} />
        <Route path="/editor-accommodation/:id" element={<EditMultiStepForm />} />
        <Route path="/creator-accommodation" element={<CreatorMultiStepForm />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/announcement/:id" element={<Announcement />} />
      </Route>
    </Routes>
  );
}
