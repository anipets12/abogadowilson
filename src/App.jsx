import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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
  // Verificar la API al iniciar
  useEffect(() => {
    const verifyApiConnection = async () => {
      try {
        // Simplemente hacer una solicitud al servidor para verificar que responde
        await axios.get('/api/health');
        console.log('Conexión con API exitosa');
      } catch (error) {
        console.log('API en modo de desarrollo local');
        // No mostrar errores al usuario para no generar alarma
      }
    };
    
    verifyApiConnection();
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading: isLoading } = useAuth();

  // Función para proteger rutas que requieren autenticación
  const RequireAuth = ({ children }) => {
    if (isLoading) {
      return <div className="loading-screen">Cargando...</div>;
    }
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  return (
    <Router>
      <Toaster position="top-center" />
      <Navbar />
      <WhatsAppChat />
      
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
        
        {/* Autenticación */}
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Pagos */}
        <Route path="/pago" element={<PaymentForm />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/gracias" element={<ThankYouPage />} />
        
        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        } />
        <Route path="/mi-cuenta" element={
          <RequireAuth>
            <ClientDashboard />
          </RequireAuth>
        } />
        <Route path="/citas" element={
          <RequireAuth>
            <AppointmentCalendar />
          </RequireAuth>
        } />
      </Routes>
      
      <Footer />
      <CookieConsent />
    </Router>
  );
}

export default App;