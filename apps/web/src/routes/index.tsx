import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { Route, Routes } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/Home';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Home accommodations={[]} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
