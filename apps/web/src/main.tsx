import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppRoutes } from '@/routes/index';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Toaster
      richColors
      toastOptions={{
        style: {
          background: '#ffffff',
          color: '#000000',
          borderLeft: '4px solid #fb923c',
        },
      }}
    />
    <AppRoutes />
  </BrowserRouter>
);
