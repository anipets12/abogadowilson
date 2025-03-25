import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

import Navbar from './components/Navigation/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Blog from './components/Blog';
import Footer from './components/Footer/Footer';
import ProcessSearch from './components/ProcessSearch';
import Chat from './components/Chat';
import Testimonials from './components/Testimonials';
import Forum from './components/Forum';
import TopicDetail from './components/Forum/TopicDetail';
import PrivacyPolicy from './components/PrivacyPolicy';
import JudicialNews from './components/JudicialNews';
import Afiliados from './components/Afiliados';
import Referidos from './components/Referidos';
import Registration from './components/Registration';
import ContactPage from './components/Contact/ContactPage';
import DashboardPage from './components/Dashboard/DashboardPage';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import AppointmentCalendar from './components/Appointment/AppointmentCalendar';
import CookieConsent from './components/Common/CookieConsent';
import Newsletter from './components/Newsletter/Newsletter';
import ConsultationHub from './components/Consultation/ConsultationHub';
import Ebooks from './components/Ebooks';
import PaymentForm from './components/Payment/PaymentForm';
import ThankYouPage from './components/Payment/ThankYouPage';
import ConsultasPenales from './components/ConsultasPenales';
import ConsultasTransito from './components/ConsultasTransito';
import ConsultasCiviles from './components/ConsultasCiviles';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import TerminosCondiciones from './components/TerminosCondiciones';
import Seguridad from './components/Seguridad';

// Servicios específicos
import Penal from './components/Services/Penal';
import Civil from './components/Services/Civil';
import Comercial from './components/Services/Comercial';
import Transito from './components/Services/Transito';
import Aduanas from './components/Services/Aduanas';

// Componentes de chat
import WhatsAppChat from './components/Chat/WhatsAppChat';
import LiveChat from './components/Chat/LiveChat';

// Nuevo componente de pago
import CheckoutForm from './components/Payment/CheckoutForm';

// Importamos el contexto de autenticación
import { AuthProvider, useAuth } from './context/AuthContext';

// Determinar la URL base según el entorno (similar a apiService.js)
const getBaseUrl = () => {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '';  // URL relativa para Cloudflare
  }
  return 'http://localhost:8787';
};

function App() {
  const [apiReady, setApiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar la API al iniciar
  useEffect(() => {
    const verifyApiConnection = async () => {
      try {
        // En producción, asumimos que la API está lista
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          console.log('Entorno de producción detectado, asumiendo API disponible');
          setApiReady(true);
          setIsLoading(false);
          return;
        }

        // En desarrollo, intentamos verificar la API
        const response = await axios.get(`${getBaseUrl()}/api/health`, { 
          timeout: 5000,
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        console.log('Conexión con API exitosa');
        setApiReady(true);
      } catch (error) {
        console.error('Error al verificar API:', error);
        // En desarrollo, mostramos error pero igual continuamos
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          toast.error('No se pudo conectar con la API. Algunas funcionalidades podrían no estar disponibles.');
        }
        // Permitimos acceso a la aplicación de todos modos
        setApiReady(true);
      } finally {
        setIsLoading(false);
      }
    };

    verifyApiConnection();
  }, []);

  // Si estamos cargando, mostrar pantalla de carga
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-gray-800 to-gray-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
        <h2 className="text-xl font-semibold">Cargando aplicación...</h2>
        <p className="text-sm mt-2 text-gray-300">Esto tomará solo unos segundos</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: 'white',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Componente AppContent separado para usar el contexto de autenticación
function AppContent() {
  const { user, loading, authReady } = useAuth();
  
  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading && !authReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <Testimonials />
              <Blog />
              <ProcessSearch />
              <Newsletter />
            </>
          } />
          
          {/* Servicios */}
          <Route path="/servicios/penal" element={<Penal />} />
          <Route path="/servicios/civil" element={<Civil />} />
          <Route path="/servicios/comercial" element={<Comercial />} />
          <Route path="/servicios/transito" element={<Transito />} />
          <Route path="/servicios/aduanas" element={<Aduanas />} />
          
          {/* Consultas */}
          <Route path="/consultas/penales" element={<ConsultasPenales />} />
          <Route path="/consultas/transito" element={<ConsultasTransito />} />
          <Route path="/consultas/civiles" element={<ConsultasCiviles />} />
          
          {/* Otras rutas */}
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/chat" element={<LiveChat />} />
          <Route path="/noticias" element={<JudicialNews />} />
          <Route path="/afiliados" element={<Afiliados />} />
          <Route path="/referidos" element={<Referidos />} />
          <Route path="/consulta" element={<ConsultationHub />} />
          <Route path="/ebooks" element={<Ebooks />} />
          <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/seguridad" element={<Seguridad />} />
          
          {/* Foro */}
          <Route path="/foro" element={<Forum />} />
          <Route path="/foro/tema/:id" element={<TopicDetail />} />
          
          {/* Rutas de autenticación */}
          <Route path="/registro" element={
            user ? <Navigate to="/dashboard" /> : <Register />
          } />
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/recuperar-password" element={
            user ? <Navigate to="/dashboard" /> : <ForgotPassword />
          } />
          <Route path="/reset-password" element={
            user ? <Navigate to="/dashboard" /> : <ResetPassword />
          } />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          } />
          <Route path="/cliente" element={
            <RequireAuth>
              <ClientDashboard />
            </RequireAuth>
          } />
          <Route path="/calendario" element={
            <RequireAuth>
              <AppointmentCalendar />
            </RequireAuth>
          } />
          <Route path="/pago" element={
            <RequireAuth>
              <PaymentForm />
            </RequireAuth>
          } />
          <Route path="/checkout" element={
            <RequireAuth>
              <CheckoutForm />
            </RequireAuth>
          } />
          <Route path="/gracias" element={<ThankYouPage />} />
          <Route path="/ebooks/download/:id" element={<ProtectedDownload />} />
          
          {/* Ruta de fallback */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8 text-center">
                <h1 className="text-4xl font-extrabold text-red-600">404</h1>
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Página no encontrada
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  La página que estás buscando no existe o ha sido movida.
                </p>
                <div className="mt-5">
                  <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                    Volver al inicio
                  </Link>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>
      
      <Footer />
      <CookieConsent />
      <WhatsAppChat />
    </div>
  );
}

// Componente para proteger rutas que requieren autenticación
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    // Redireccionar al login, guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default App;