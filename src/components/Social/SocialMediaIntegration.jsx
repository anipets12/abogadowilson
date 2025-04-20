import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaLinkedin, FaTiktok, FaUsers, FaShareAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { socialMedia, contactInfo } from '../../config/appConfig';

const SocialMediaIntegration = ({ variant = 'default' }) => {
  // Configuración de redes sociales del abogado (importado desde appConfig.js)
  const socialLinks = {
    facebook: {
      page: socialMedia.facebook.pagina,
      groups: [
        { name: 'Derecho Ecuador', url: socialMedia.facebook.groups.derechoEcuador },
        { name: 'Abogados Ecuador', url: socialMedia.facebook.groups.abogadosEcuador }
      ],
      appId: '1951562888920654'
    },
    twitter: socialMedia.twitter.profile,
    instagram: 'https://www.instagram.com/wilsonipialesa/',
    whatsapp: socialMedia.whatsapp.api,
    phone: contactInfo.phones.primary,
    linkedin: 'https://www.linkedin.com/in/wilson-ipiales-9b7a72291/',
    tiktok: 'https://www.tiktok.com/@wilsonipialesabogado'
  };

  // Función para compartir en redes sociales
  const shareContent = (platform) => {
    const pageUrl = window.location.href;
    const title = 'Abogado Wilson Ipiales | Servicios Legales en Ecuador';
    const description = 'Servicios legales profesionales con el Abg. Wilson Alexander Ipiales Guerrón, especialista en derecho civil, penal y de tránsito.';

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl}`)}`;
        break;
      default:
        shareUrl = '';
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      toast.success(`Contenido compartido en ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
    }
  };

  // Función para abrir chat de WhatsApp
  const openWhatsappChat = () => {
    const message = 'Hola, me gustaría obtener más información sobre sus servicios legales.';
    // Usar directamente la URL configurada en appConfig
    window.open(socialMedia.whatsapp.api, '_blank');
  };

  // Renderizar barra de redes sociales compacta para header o footer
  if (variant === 'compact') {
    return (
      <div className="flex space-x-3">
        <a 
          href={socialLinks.facebook.page} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 transition duration-300"
          aria-label="Facebook"
        >
          <FaFacebook size={18} />
        </a>
        <a 
          href={socialLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-400 transition duration-300"
          aria-label="Twitter"
        >
          <FaTwitter size={18} />
        </a>
        <a 
          href={socialLinks.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-purple-600 transition duration-300"
          aria-label="Instagram"
        >
          <FaInstagram size={18} />
        </a>
        <button
          onClick={openWhatsappChat}
          className="text-gray-600 hover:text-green-600 transition duration-300"
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={18} />
        </button>
      </div>
    );
  }

  // Renderizar barra flotante para compartir
  if (variant === 'floating') {
    return (
      <motion.div 
        className="fixed left-4 top-1/3 flex flex-col space-y-3 bg-white p-2 rounded-full shadow-lg z-40"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <button 
          onClick={() => shareContent('facebook')}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
          aria-label="Compartir en Facebook"
        >
          <FaFacebook size={20} />
        </button>
        <button 
          onClick={() => shareContent('twitter')}
          className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500"
          aria-label="Compartir en Twitter"
        >
          <FaTwitter size={20} />
        </button>
        <button 
          onClick={() => shareContent('linkedin')}
          className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900"
          aria-label="Compartir en LinkedIn"
        >
          <FaLinkedin size={20} />
        </button>
        <button 
          onClick={() => shareContent('whatsapp')}
          className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"
          aria-label="Compartir en WhatsApp"
        >
          <FaWhatsapp size={20} />
        </button>
      </motion.div>
    );
  }

  // Renderizar sección completa de redes sociales (default)
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-lg shadow-md">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Conéctese con nosotros</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Siga nuestras redes sociales para estar al día con información legal relevante y servicios disponibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Facebook */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
            <div className="flex items-center mb-4">
              <FaFacebook className="text-blue-600 text-3xl mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Facebook</h3>
            </div>
            <div className="space-y-3">
              <a 
                href={socialLinks.facebook.page}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-700 hover:text-blue-900"
              >
                <span className="mr-2">Página oficial</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <FaUsers className="mr-1" /> Grupos comunitarios:
                </p>
                <ul className="space-y-1">
                  {socialLinks.facebook.groups.map((group, index) => (
                    <li key={index}>
                      <a 
                        href={group.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {group.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
            <div className="flex items-center mb-4">
              <FaWhatsapp className="text-green-600 text-3xl mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">WhatsApp</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Contáctenos directamente para consultas rápidas y agendar citas.
            </p>
            <button
              onClick={openWhatsappChat}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center"
            >
              <FaWhatsapp className="mr-2" />
              Iniciar chat
            </button>
            <p className="mt-2 text-sm text-gray-500 text-center">{socialLinks.whatsapp}</p>
          </div>

          {/* Otras redes */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
            <div className="flex items-center mb-4">
              <FaShareAlt className="text-purple-600 text-3xl mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Más canales</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a 
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-300"
              >
                <FaTwitter className="text-blue-400 text-2xl mb-2" />
                <span className="text-sm text-gray-700">Twitter</span>
              </a>
              <a 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition duration-300"
              >
                <FaInstagram className="text-pink-600 text-2xl mb-2" />
                <span className="text-sm text-gray-700">Instagram</span>
              </a>
              <a 
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-300"
              >
                <FaLinkedin className="text-blue-700 text-2xl mb-2" />
                <span className="text-sm text-gray-700">LinkedIn</span>
              </a>
              <a 
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                <FaTiktok className="text-black text-2xl mb-2" />
                <span className="text-sm text-gray-700">TikTok</span>
              </a>
            </div>
          </div>
        </div>

        {/* Invitación a compartir */}
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">¿Conoce a alguien que necesite asesoría legal?</h3>
              <p className="text-gray-600">Comparta nuestra información y ayúdenos a crecer</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => shareContent('facebook')}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
                aria-label="Compartir en Facebook"
              >
                <FaFacebook size={20} />
              </button>
              <button 
                onClick={() => shareContent('twitter')}
                className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500"
                aria-label="Compartir en Twitter"
              >
                <FaTwitter size={20} />
              </button>
              <button 
                onClick={() => shareContent('whatsapp')}
                className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"
                aria-label="Compartir en WhatsApp"
              >
                <FaWhatsapp size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaIntegration;
