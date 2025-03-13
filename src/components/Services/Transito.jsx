import React from 'react';
import { FaCar, FaExclamationTriangle, FaIdCard, FaFileAlt, FaLandmark } from 'react-icons/fa';
import ServiceLayout from './ServiceLayout';

const Transito = () => {
  // Precios de servicios
  const servicios = [
    {
      id: 1,
      nombre: "Consulta Inicial",
      descripcion: "Evaluación de su caso, análisis de infracciones y orientación legal",
      precio: 40,
      duracion: "1 hora",
      destacado: false
    },
    {
      id: 2,
      nombre: "Defensa en Infracciones",
      descripcion: "Representación legal para impugnar multas y sanciones administrativas",
      precio: 180,
      duracion: "Por caso",
      destacado: true,
      caracteristicas: [
        "Análisis de la infracción",
        "Preparación de impugnación",
        "Representación ante autoridades",
        "Seguimiento del proceso",
        "Recursos de apelación si necesario"
      ]
    },
    {
      id: 3,
      nombre: "Defensa en Accidentes",
      descripcion: "Representación en casos de accidentes con lesiones o daños materiales",
      precio: 450,
      duracion: "Por caso",
      destacado: false
    }
  ];

  // Casos de éxito
  const casosExito = [
    {
      titulo: "Impugnación exitosa de multa por exceso de velocidad",
      descripcion: "Cliente evitó multa de $600 y reducción de puntos debido a fallas técnicas en el radar",
      resultado: "Multa anulada"
    },
    {
      titulo: "Reducción de responsabilidad en accidente",
      descripcion: "Se logró demostrar responsabilidad compartida, reduciendo la indemnización a pagar por nuestro cliente",
      resultado: "Responsabilidad reducida al 30%"
    },
    {
      titulo: "Recuperación de licencia suspendida",
      descripcion: "Cliente recuperó su licencia suspendida antes del plazo original gracias a recursos administrativos",
      resultado: "Licencia recuperada"
    }
  ];

  // Áreas de especialización
  const especialidades = [
    { 
      icon: <FaCar />, 
      title: "Infracciones de Tránsito", 
      description: "Defensa en multas, fotomultas, y sanciones administrativas de tránsito" 
    },
    { 
      icon: <FaExclamationTriangle />, 
      title: "Accidentes Viales", 
      description: "Representación legal en accidentes con daños materiales o lesiones" 
    },
    { 
      icon: <FaIdCard />, 
      title: "Licencias y Permisos", 
      description: "Recuperación de licencias suspendidas y trámites administrativos" 
    },
    { 
      icon: <FaFileAlt />, 
      title: "Reclamaciones de Seguros", 
      description: "Asistencia en reclamos a compañías de seguros por accidentes" 
    },
    { 
      icon: <FaLandmark />, 
      title: "Procedimientos Administrativos", 
      description: "Recursos y apelaciones ante autoridades de tránsito" 
    },
    { 
      icon: <FaCar />, 
      title: "Delitos de Tránsito", 
      description: "Defensa en casos penales derivados de accidentes graves" 
    },
  ];

  return (
    <ServiceLayout
      title="Tránsito"
      icon={<FaCar className="mr-2 text-yellow-400" />}
      description="Asesoría legal especializada en ley de tránsito para defender sus derechos ante infracciones, accidentes y procedimientos administrativos. Proteja su licencia y evite sanciones injustas."
      services={servicios}
      successCases={casosExito}
      specialties={especialidades}
      whatsappText="Hola Abg. Wilson, necesito asesoría en derecho de tránsito."
    />
  );
};

export default Transito;
