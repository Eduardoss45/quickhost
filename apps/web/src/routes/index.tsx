import Login from '@/components/Login';
import Register from '@/components/Register';
import { Route, Routes } from 'react-router-dom';
import App from '@/App';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
