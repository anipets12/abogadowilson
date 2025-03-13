import React from 'react';
import { FaBalanceScale, FaGavel, FaUserShield, FaBook, FaShieldAlt, FaBuilding } from 'react-icons/fa';
import ServiceLayout from './ServiceLayout';

const Penal = () => {
  // Precios de servicios
  const servicios = [
    {
      id: 1,
      nombre: "Consulta Inicial",
      descripcion: "Evaluación de su caso, análisis preliminar y orientación legal básica",
      precio: 50,
      duracion: "1 hora",
      destacado: false
    },
    {
      id: 2,
      nombre: "Patrocinio Básico",
      descripcion: "Representación legal en etapas iniciales del proceso penal",
      precio: 500,
      duracion: "1 mes",
      destacado: true,
      caracteristicas: [
        "Análisis exhaustivo del caso",
        "Elaboración de estrategia de defensa",
        "Representación en audiencias preliminares",
        "Comunicación constante",
        "Informes periódicos del avance"
      ]
    },
    {
      id: 3,
      nombre: "Patrocinio Completo",
      descripcion: "Representación integral durante todo el proceso penal",
      precio: 1200,
      duracion: "Hasta finalización del caso",
      destacado: false
    },
    {
      id: 4,
      nombre: "Defensa en Estafas",
      descripcion: "Representación especializada en casos de estafas y fraudes financieros",
      precio: 750,
      duracion: "Por caso",
      destacado: true,
      caracteristicas: [
        "Análisis de pruebas y documentación",
        "Estrategia de defensa especializada",
        "Representación en todas las instancias",
        "Gestión de evidencias digitales"
      ]
    },
    {
      id: 5,
      nombre: "Defensa en Robos",
      descripcion: "Defensa legal en casos de robo simple y agravado",
      precio: 600,
      duracion: "Por caso",
      destacado: false,
      caracteristicas: [
        "Evaluación de circunstancias atenuantes",
        "Análisis de procedimientos policiales",
        "Impugnación de pruebas ilegales"
      ]
    },
    {
      id: 6,
      nombre: "Asesoría en Delitos Empresariales",
      descripcion: "Defensa en casos de delitos económicos y corporativos",
      precio: 900,
      duracion: "Por caso",
      destacado: false,
      caracteristicas: [
        "Análisis de responsabilidad corporativa",
        "Defensa ante acusaciones de fraude fiscal",
        "Estrategias para minimizar impacto reputacional"
      ]
    },
    {
      id: 7,
      nombre: "E-Book: Guía Completa de Derecho Penal",
      descripcion: "Guía digital completa sobre procesos penales, derechos y consejos prácticos",
      precio: 25,
      duracion: "Compra única",
      destacado: true,
      caracteristicas: [
        "200+ páginas de contenido especializado",
        "Formularios y modelos de documentos",
        "Actualizado con la última legislación",
        "Envío inmediato por correo electrónico"
      ]
    }
  ];

  // Casos de éxito
  const casosExito = [
    {
      titulo: "Absolución en caso de presunto delito financiero",
      descripcion: "Cliente acusado de fraude financiero fue absuelto tras demostrar inconsistencias en la acusación",
      resultado: "Absolución completa"
    },
    {
      titulo: "Reducción sustancial de pena en caso de tráfico",
      descripcion: "Logramos reducir la sentencia de 8 a 2 años mediante acuerdo",
      resultado: "Reducción de pena"
    },
    {
      titulo: "Sobreseimiento en caso de tenencia ilícita",
      descripcion: "Caso sobreseído por irregularidades en procedimiento policial",
      resultado: "Caso archivado"
    },
    {
      titulo: "Recuperación de bienes en caso de estafa",
      descripcion: "Cliente recuperó el 90% de los bienes perdidos en un esquema de estafa piramidal",
      resultado: "Recuperación de bienes"
    },
    {
      titulo: "Defensa exitosa en caso de robo agravado",
      descripcion: "Cliente fue absuelto por falta de pruebas y procedimiento policial irregular",
      resultado: "Absolución completa"
    }
  ];

  // Áreas de especialización
  const especialidades = [
    { 
      icon: <FaGavel />, 
      title: "Delitos contra la propiedad", 
      description: "Robos, hurtos, estafas, fraudes y otros delitos contra el patrimonio" 
    },
    { 
      icon: <FaUserShield />, 
      title: "Delitos contra las personas", 
      description: "Lesiones, amenazas, homicidios y violencia" 
    },
    { 
      icon: <FaBalanceScale />, 
      title: "Delitos económicos", 
      description: "Fraude fiscal, blanqueo de capitales y delitos societarios" 
    },
    { 
      icon: <FaGavel />, 
      title: "Delitos contra la salud pública", 
      description: "Tráfico de drogas y sustancias ilícitas" 
    },
    { 
      icon: <FaUserShield />, 
      title: "Delitos informáticos", 
      description: "Hacking, fraudes online y delitos digitales" 
    },
    { 
      icon: <FaShieldAlt />, 
      title: "Estafas y fraudes", 
      description: "Defensa especializada en casos de estafa, fraude financiero y piramidal" 
    },
    {
      icon: <FaBuilding />,
      title: "Delitos empresariales",
      description: "Asesoría en casos de responsabilidad corporativa, fraude fiscal y malversación"
    },
    { 
      icon: <FaBook />, 
      title: "Recursos educativos", 
      description: "E-books y guías especializadas en derecho penal para consulta" 
    },
    { 
      icon: <FaBalanceScale />, 
      title: "Recursos y apelaciones", 
      description: "Presentación de recursos ante resoluciones desfavorables" 
    },
  ];

  return (
    <ServiceLayout
      title="Penal"
      icon={<FaBalanceScale className="mr-2 text-yellow-400" />}
      description="Defensa legal especializada para proteger sus derechos y libertades en procedimientos penales. Más de 15 años de experiencia defendiendo casos complejos con resultados probados."
      services={servicios}
      successCases={casosExito}
      specialties={especialidades}
      whatsappText="Hola Abg. Wilson, necesito asesoría en derecho penal."
    />
  );
};

export default Penal;
