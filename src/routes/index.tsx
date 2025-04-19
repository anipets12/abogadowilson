import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes de carga lazu00ed
const Home = React.lazy(() => import('../pages/Home'));
const About = React.lazy(() => import('../pages/About'));
const Services = React.lazy(() => import('../pages/Services'));
const Contact = React.lazy(() => import('../pages/Contact'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Layout y componentes de carga
const Layout = React.lazy(() => import('../components/Layout'));
const Loading = () => <div className="loading-spinner">Cargando...</div>;

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          {/* Rutas pu00fablicas */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="sobre-mi" element={<About />} />
            <Route path="servicios" element={<Services />} />
            <Route path="contacto" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Register />} />
          </Route>
          
          {/* Rutas privadas */}
          <Route path="/dashboard/*" element={<Dashboard />} />
          
          {/* Rutas de error */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default AppRoutes;
