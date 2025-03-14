import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Toaster, toast } from 'react-hot-toast';

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
import ForgotPassword from './components/Auth/ForgotPassword';
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

// Configuración de Supabase con manejo de errores
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error de configuración: Variables de entorno de Supabase no encontradas.');
}

export const supabase = createClient(
  supabaseUrl || 'https://svzdqpaqtghtgnbmojxl.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2emRxcGFxdGdodGduYm1vanh*IiwicmVsZSI6ImFub24iLCJpYXQiOjE2ODQyNTQ0NjQsImV4cCI6MTk5OTgzMDQ2NH0.J7vYdTy9mHpXIWZzM4kxwT0NS6pcS-L78_vwVRRokxo'
);

function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Establecer la sesión inicial
    const setInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error al obtener la sesión:', error.message);
        } else {
          setSession(data.session);
        }
      } catch (err) {
        console.error('Error al conectar con Supabase:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    setInitialSession();

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (event === 'SIGNED_IN') {
          toast.success('Sesión iniciada correctamente');
        } else if (event === 'SIGNED_OUT') {
          toast.success('Sesión cerrada correctamente');
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Función para proteger rutas que requieren autenticación
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }
    
    if (!session) {
      toast.error('Debes iniciar sesión para acceder a esta página');
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Navbar />
        <Toaster position="top-center" />
        <main className="flex-grow w-full mx-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Services />
                  <ProcessSearch />
                  <Testimonials />
                  <Blog />
                  <Newsletter />
                </>
              } />
              <Route path="/servicios" element={<Services />} />
              <Route path="/servicios/penal" element={<Penal />} />
              <Route path="/servicios/civil" element={<Civil />} />
              <Route path="/servicios/comercial" element={<Comercial />} />
              <Route path="/servicios/transito" element={<Transito />} />
              <Route path="/servicios/aduanas" element={<Aduanas />} />
              <Route path="/consultas" element={<ProcessSearch />} />
              <Route path="/consulta-ia" element={<ConsultationHub />} />
              <Route path="/consultas/penales" element={<ConsultasPenales />} />
              <Route path="/consultas/transito" element={<ConsultasTransito />} />
              <Route path="/consultas/civiles" element={<ConsultasCiviles />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/testimonios" element={<Testimonials />} />
              <Route path="/foro" element={<Forum />} />
              <Route path="/foro/tema/:topicId" element={<TopicDetail />} />
              <Route path="/privacidad" element={<PrivacyPolicy />} />
              <Route path="/terminos" element={<TerminosCondiciones />} />
              <Route path="/seguridad" element={<Seguridad />} />
              <Route path="/noticias" element={<JudicialNews />} />
              <Route path="/afiliados" element={<Afiliados />} />
              <Route path="/referidos" element={<Referidos />} />
              <Route path="/ebooks" element={<Ebooks />} />
              <Route path="/registro" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/cliente" element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/calendario" element={
                <ProtectedRoute>
                  <AppointmentCalendar />
                </ProtectedRoute>
              } />
              <Route path="/pago" element={<PaymentForm />} />
              <Route path="/checkout" element={<CheckoutForm />} />
              <Route path="/gracias" element={<ThankYouPage />} />
              <Route path="*" element={
                <div className="text-center py-20">
                  <h2 className="text-3xl font-bold text-red-600">Página no encontrada</h2>
                  <p className="mt-4 text-gray-600">La página que estás buscando no existe o ha sido movida.</p>
                  <Link to="/" className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Volver al inicio
                  </Link>
                </div>
              } />
            </Routes>
          </div>
        </main>
        <Footer />
        <CookieConsent />
        
        {/* Botones de chat flotantes en lados opuestos */}
        <WhatsAppChat /> {/* Lado izquierdo */}
        <LiveChat /> {/* Lado derecho */}
      </div>
    </Router>
  );
}

export default App;