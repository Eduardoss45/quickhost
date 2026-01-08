import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppRoutes } from '@/routes/index';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Toaster />
    <AppRoutes />
  </BrowserRouter>
);
