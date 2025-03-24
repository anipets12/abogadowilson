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

function App() {
  const [apiReady, setApiReady] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Verificar la API al iniciar
  useEffect(() => {
    const verifyApiConnection = async () => {
      try {
        // Intentar hasta 3 veces con delay entre intentos
        for (let i = 0; i < 3; i++) {
          try {
            // Solicitud al endpoint de salud para verificar la API
            const response = await axios.get('/api/health', { timeout: 5000 });
            if (response.data && response.data.status === 'ok') {
              console.log('Conexión con API exitosa');
              setApiReady(true);
              return;
            }
          } catch (err) {
            console.log(`Intento ${i+1} fallido: ${err.message}`);
            // Esperar antes de reintentar
            if (i < 2) {
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          }
        }
        
        // Si llegamos aquí, asumir modo de desarrollo local
        console.log('API en modo de desarrollo local o no disponible');
        setApiReady(true); // Seguir cargando la aplicación de todos modos
      } catch (error) {
        console.error('Error al verificar la API:', error);
        setApiError(error.message);
        // En producción, seguir cargando la aplicación incluso con errores
        setApiReady(true);
      }
    };
    
    verifyApiConnection();
  }, []);

  // Si la API no está lista, mostrar un indicador de carga
  if (!apiReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Conectando con los servicios...</p>
        </div>
      </div>
    );
  }

  // Si hay un error con la API, mostrar un mensaje amigable
  if (apiError) {
    console.warn('La aplicación continuará aunque hubo un error con la API:', apiError);
  }

  return (
    <AuthProvider>
      <AppContent />
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
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        
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
    </Router>
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