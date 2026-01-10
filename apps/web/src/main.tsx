import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppRoutes } from '@/routes/index';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Toaster />
    <AppRoutes />
  </BrowserRouter>
);
