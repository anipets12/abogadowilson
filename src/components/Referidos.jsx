import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHandshake, FaGift, FaLightbulb, FaChartLine, FaRegPaperPlane, FaStar, FaRegCommentDots } from 'react-icons/fa';

const Referidos = () => {
    const benefits = [
        {
            icon: <FaGift className="text-purple-500 text-3xl" />,
            title: 'Recompensas Inmediatas',
            description: 'Obtén créditos de $50 por cada amigo o familiar que contrate nuestros servicios legales.'
        },
        {
            icon: <FaHandshake className="text-blue-500 text-3xl" />,
            title: 'Beneficio Mutuo',
            description: 'Tu referido también recibe un 10% de descuento en su primera consulta legal.'
        },
        {
            icon: <FaChartLine className="text-green-500 text-3xl" />,
            title: 'Sin Límites',
            description: 'Refiere a tantas personas como desees. No hay límite en las recompensas que puedes ganar.'
        },
        {
            icon: <FaLightbulb className="text-yellow-500 text-3xl" />,
            title: 'Proceso Simple',
            description: 'Solo necesitas compartir tu código único o usar nuestras herramientas de referidos.'
        }
    ];

    const testimonials = [
        {
            name: 'Carlos Mendoza',
            role: 'Empresario',
            content: 'He referido a 5 colegas empresarios y todos quedaron muy satisfechos con los servicios legales. Ya he acumulado $250 en créditos que usé para mi asesoría anual.',
            stars: 5
        },
        {
            name: 'María Fernández',
            role: 'Contadora',
            content: 'El proceso de referidos es muy sencillo. Simplemente compartí mi enlace en grupos profesionales y ya he ganado varios créditos. ¡Excelente iniciativa!',
            stars: 5
        },
        {
            name: 'Roberto Jiménez',
            role: 'Arquitecto',
            content: 'Referí a mi hermano que necesitaba asesoría legal para su negocio y ambos salimos beneficiados. El servicio fue excepcional y el descuento fue un gran incentivo.',
            stars: 4
        }
    ];

    const steps = [
        {
            number: 1,
            title: 'Regístrate en nuestro programa',
            description: 'Crea tu cuenta para acceder al programa de referidos y obtener tu código único.'
        },
        {
            number: 2,
            title: 'Comparte tu código',
            description: 'Envía tu código o enlace personalizado a amigos y conocidos que necesiten servicios legales.'
        },
        {
            number: 3,
            title: 'Tu referido contrata',
            description: 'Cuando tu referido utilice tus datos y contrate cualquiera de nuestros servicios.'
        },
        {
            number: 4,
            title: 'Ambos ganan',
            description: 'Tú recibes créditos para futuros servicios legales y tu referido obtiene un descuento.'
        }
    ];

    return (
        <div className="bg-white">
            {/* Header de la página */}
            <div className="bg-gradient-to-r from-green-700 to-blue-800 py-20 px-4">
                <div className="container-custom text-center">
                    <motion.h1 
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Programa de Referidos
                    </motion.h1>
                    <motion.p 
                        className="text-xl text-green-100 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Refiere amigos, familiares o colegas y gana créditos para futuros servicios legales
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link 
                            to="/referidos/registro" 
                            className="bg-white hover:bg-gray-100 text-green-700 font-bold py-3 px-8 rounded-lg text-lg inline-flex items-center transition-colors duration-300 shadow-lg"
                        >
                            Comenzar Ahora
                            <FaRegPaperPlane className="ml-2" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Beneficios */}
            <div className="py-16">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Beneficios del Programa</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Descubre por qué nuestro programa de referidos es beneficioso para ti y tus conocidos
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div 
                                key={index}
                                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow border border-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * index }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <div className="mb-4 flex justify-center">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cómo funciona */}
            <div className="py-16 bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Cómo Funciona</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Es muy fácil participar y comenzar a ganar recompensas
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div 
                                key={index}
                                className="relative"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 * index }}
                            >
                                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center text-green-800 font-bold text-xl mb-4 mx-auto">
                                    {step.number}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-6 left-1/2 w-full h-0.5 bg-green-200"></div>
                                )}
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{step.title}</h3>
                                <p className="text-gray-600 text-center">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonios */}
            <div className="py-16">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Lo que dicen nuestros referidores</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Experiencias de personas que ya están ganando con nuestro programa
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div 
                                key={index}
                                className="bg-white rounded-lg shadow-md p-6 border border-gray-100 relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * index }}
                            >
                                <div className="mb-4">
                                    {Array(5).fill(0).map((_, i) => (
                                        <FaStar 
                                            key={i} 
                                            className={`inline-block ${i < testimonial.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">
                                    "{testimonial.content}"
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {testimonial.name}, {testimonial.role}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Referidos;
