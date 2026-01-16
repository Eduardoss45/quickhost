import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { Route, Routes } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/Home';
import Configurations from '@/pages/Configurations';
import Chat from '@/pages/Chat';
import Host from '@/pages/Host';
import EditMultiStepForm from '@/pages/EditMultiStepForm';
import CreatorMultiStepForm from '@/pages/CreatorMultiStepForm';

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
      </Route>
    </Routes>
  );
}
