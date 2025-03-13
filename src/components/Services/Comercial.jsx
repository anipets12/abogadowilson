import React from 'react';
import { FaBuilding, FaChartLine, FaHandshake, FaShieldAlt, FaGlobe } from 'react-icons/fa';
import ServiceLayout from './ServiceLayout';

const Comercial = () => {
  // Precios de servicios
  const servicios = [
    {
      id: 1,
      nombre: "Asesoría Inicial",
      descripcion: "Consulta especializada para empresas y emprendedores",
      precio: 60,
      duracion: "1 hora",
      destacado: false
    },
    {
      id: 2,
      nombre: "Asesoría Empresarial",
      descripcion: "Representación y asesoría legal continua para negocios",
      precio: 600,
      duracion: "Mensual",
      destacado: true,
      caracteristicas: [
        "Redacción y revisión de contratos",
        "Asesoría en materia societaria",
        "Gestión de reclamaciones",
        "Representación legal",
        "Protección de propiedad intelectual"
      ]
    },
    {
      id: 3,
      nombre: "Resolución de Disputas",
      descripcion: "Mediación y representación en conflictos comerciales",
      precio: 800,
      duracion: "Por caso",
      destacado: false
    }
  ];

  // Casos de éxito
  const casosExito = [
    {
      titulo: "Recuperación de deuda comercial",
      descripcion: "Recuperamos $150,000 para un cliente tras una disputa comercial compleja con un proveedor",
      resultado: "Recuperación total de deuda"
    },
    {
      titulo: "Restructuración empresarial",
      descripcion: "Asesoramos en la restructuración que permitió a una empresa evitar el cierre y salvar 50 empleos",
      resultado: "Empresa sostenible"
    },
    {
      titulo: "Protección de marca registrada",
      descripcion: "Defendimos con éxito los derechos de marca de un cliente frente a un uso no autorizado",
      resultado: "Protección de propiedad intelectual"
    }
  ];

  // Áreas de especialización
  const especialidades = [
    { 
      icon: <FaBuilding />, 
      title: "Derecho Societario", 
      description: "Constitución, administración y dirección de empresas, fusiones y adquisiciones" 
    },
    { 
      icon: <FaHandshake />, 
      title: "Contratos Mercantiles", 
      description: "Elaboración, revisión y negociación de contratos comerciales de todo tipo" 
    },
    { 
      icon: <FaShieldAlt />, 
      title: "Propiedad Intelectual", 
      description: "Protección de marcas, patentes, derechos de autor y secretos comerciales" 
    },
    { 
      icon: <FaChartLine />, 
      title: "Competencia y Regulación", 
      description: "Asesoría en normativas de competencia, antimonopolio y regulación sectorial" 
    },
    { 
      icon: <FaGlobe />, 
      title: "Comercio Internacional", 
      description: "Soporte legal para importaciones, exportaciones y acuerdos internacionales" 
    },
    { 
      icon: <FaHandshake />, 
      title: "Resolución de Conflictos", 
      description: "Mediación, arbitraje y representación en litigios comerciales" 
    },
  ];

  return (
    <ServiceLayout
      title="Comercial"
      icon={<FaBuilding className="mr-2 text-yellow-400" />}
      description="Asesoría legal especializada para empresas, emprendedores y comerciantes. Soluciones personalizadas para proteger sus intereses comerciales y potenciar su negocio."
      services={servicios}
      successCases={casosExito}
      specialties={especialidades}
      whatsappText="Hola Abg. Wilson, necesito asesoría en derecho comercial."
    />
  );
};

export default Comercial;
