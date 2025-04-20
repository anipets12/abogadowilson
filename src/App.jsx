import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

// Componentes de estructura base
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer/Footer';
import CookieConsent from './components/Common/CookieConsent';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Importaciones estáticas para los componentes que dan problemas
import ConsultasPenales from './components/ConsultasPenales';
import ConsultasTransito from './components/ConsultasTransito';
import ConsultasCiviles from './components/ConsultasCiviles';
import ConsultationHub from './components/Consultation/ConsultationHub';
import LiveChat from './components/Chat/LiveChat';
import Afiliados from './components/Afiliados';
import Referidos from './components/Referidos';
import JudicialNews from './components/JudicialNews';
import Ebooks from './components/Ebooks';
import PrivacyPolicy from './components/PrivacyPolicy';
import TerminosCondiciones from './components/TerminosCondiciones';
import Seguridad from './components/Seguridad';
import Forum from './components/Forum/Forum';
import TopicDetail from './components/Forum/TopicDetail';
import DashboardPage from './components/Dashboard/DashboardPage';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import AppointmentCalendar from './components/Appointment/AppointmentCalendar';
import PaymentForm from './components/Payment/PaymentForm';
import CheckoutForm from './components/Payment/CheckoutForm';
import ThankYouPage from './components/Payment/ThankYouPage';
import ProtectedDownload from './components/ProtectedDownload';

// Páginas principales
const HomePage = lazy(() => import('./components/Home/HomePage'));
const AboutPage = lazy(() => import('./components/About/AboutPage'));
const ServicesPage = lazy(() => import('./components/Services/ServicesPage'));
const ContactPage = lazy(() => import('./components/Contact/ContactPage'));

// Componentes de autenticación
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'));

// Dashboard y componentes del área del usuario
// Comentado temporalmente para permitir la compilación
/*
const DashboardLayout = lazy(() => import('./components/Dashboard/DashboardLayout'));
const DashboardHome = lazy(() => import('./components/Dashboard/DashboardHome'));
const UserProfile = lazy(() => import('./components/Dashboard/UserProfile'));
const UserConsultations = lazy(() => import('./components/Dashboard/UserConsultations'));
const UserAppointments = lazy(() => import('./components/Dashboard/UserAppointments'));
const UserEbooks = lazy(() => import('./components/Dashboard/UserEbooks'));
const UserTokens = lazy(() => import('./components/Tokens/TokensManager'));
*/

// Administración
// Comentado temporalmente para permitir la compilación
/*
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel'));
const AdminUsers = lazy(() => import('./components/Admin/AdminUsers'));
const AdminContent = lazy(() => import('./components/Admin/AdminContent'));
const AdminAnalytics = lazy(() => import('./components/Admin/AdminAnalytics'));
*/

// Herramientas y servicios
// Comentado temporalmente para permitir la compilación
/*
const ProcessSearch = lazy(() => import('./components/ProcessSearch'));
const AppointmentScheduler = lazy(() => import('./components/Appointment/AppointmentScheduler'));
*/

// Consultas y servicios legales
// const ConsultasPenales = lazy(() => import('./components/ConsultasPenales'));
// const ConsultasTransito = lazy(() => import('./components/ConsultasTransito'));
// const ConsultasCiviles = lazy(() => import('./components/ConsultasCiviles'));
// const ConsultationHub = lazy(() => import('./components/Consultation/ConsultationHub'));
// const LiveChat = lazy(() => import('./components/Chat/LiveChat'));

// Blog y contenido
const BlogList = lazy(() => import('./components/Blog/BlogList'));
const BlogArticle = lazy(() => import('./components/Blog/BlogArticle'));
const EbookStore = lazy(() => import('./components/Ebooks/EbookStore'));
const NewsletterSignup = lazy(() => import('./components/Newsletter/NewsletterSignup'));
// const JudicialNews = lazy(() => import('./components/JudicialNews'));
// const Ebooks = lazy(() => import('./components/Ebooks'));

// Foro
// Comentado temporalmente para permitir la compilación
/*
const ForumHome = lazy(() => import('./components/Forum/ForumHome'));
const ForumTopic = lazy(() => import('./components/Forum/ForumTopic'));
const ForumNewTopic = lazy(() => import('./components/Forum/ForumNewTopic'));
*/

// Afiliados y referidos
// const Afiliados = lazy(() => import('./components/Afiliados'));
// const Referidos = lazy(() => import('./components/Referidos'));

// Páginas legales y de información
// Comentado temporalmente para permitir la compilación
/*
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TerminosCondiciones = lazy(() => import('./components/TerminosCondiciones'));
const Seguridad = lazy(() => import('./components/Seguridad'));
*/

// Servicios específicos
const Penal = lazy(() => import('./components/Services/Penal'));
const Civil = lazy(() => import('./components/Services/Civil'));
const Comercial = lazy(() => import('./components/Services/Comercial'));
const Transito = lazy(() => import('./components/Services/Transito'));
const Aduanas = lazy(() => import('./components/Services/Aduanas'));

// Pagos y checkouts
// Comentado temporalmente para permitir la compilación
/*
const PaymentForm = lazy(() => import('./components/Payment/PaymentForm'));
const CheckoutForm = lazy(() => import('./components/Payment/CheckoutForm'));
const ThankYouPage = lazy(() => import('./components/Payment/ThankYouPage'));
*/

// Chat y comunicación
// Comentado temporalmente para permitir la compilación
/*
const WhatsAppChat = lazy(() => import('./components/Chat/WhatsAppChat'));
*/

// Error y páginas 404
const NotFoundPage = lazy(() => import('./components/Common/NotFoundPage'));

// Servicios específicos ya importados como lazy arriba (PenalService, etc.)

// Componentes de chat ya importados como lazy arriba

// Componentes de pago ya importados como lazy arriba

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

// Componente de carga para Suspense
function LoadingIndicator() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Componente AppContent separado para usar el contexto de autenticación
function AppContent() {
  const { user, loading, authReady, isAdmin } = useAuth();
  
  if (loading && !authReady) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingIndicator />}>
          <Routes>
            {/* Página de inicio */}
            <Route path="/" element={<HomePage />} />
          
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
          
            {/* Ruta de fallback (404) */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
      <CookieConsent />
      <WhatsAppChat />
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)'
        }
      }} />
    </div>
  );
}

// Componente para proteger rutas que requieren autenticación
function RequireAuth({ children }) {
  const { user, loading, authReady } = useAuth();
  const location = useLocation();

  if (loading && !authReady) {
    return <LoadingIndicator />;
  }
  
  if (!user) {
    // Redireccionar al login, guardando la ubicación actual
    toast.error('Debe iniciar sesión para acceder a esta sección');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Componente para proteger rutas que requieren rol de administrador
function RequireAdmin({ children }) {
  const { user, isAdmin, loading, authReady } = useAuth();
  const location = useLocation();

  if (loading && !authReady) {
    return <LoadingIndicator />;
  }
  
  if (!user) {
    toast.error('Debe iniciar sesión para acceder a esta sección');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    toast.error('No tiene permisos para acceder a esta sección');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default App;