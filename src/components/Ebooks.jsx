import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBook, FaDownload, FaShoppingCart, FaCheck, FaFilePdf } from 'react-icons/fa';
import { ebookService } from '../services/ebookService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ebooksData = [
  {
    id: 0,
    title: "Introducción al Derecho: Conceptos Básicos para Todos",
    description: "Guía gratuita que explica los fundamentos del derecho, sistema judicial y procesos legales básicos en Ecuador. ¡Perfecto para comenzar a entender el mundo legal!",
    price: 0,
    coverImage: "https://images.unsplash.com/photo-1505664194779-8beaceb93744",
    pages: 25,
    popular: true,
    category: "Básico",
    isFree: true,
    pdfUrl: "/ebooks/introduccion-al-derecho.pdf"
  },
  {
    id: 1,
    title: "Guía Completa de Derecho Civil para No Abogados",
    description: "Un compendio práctico sobre contratos, propiedades y derechos civiles explicado en lenguaje sencillo.",
    price: 19.99,
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3",
    pages: 120,
    popular: true,
    category: "Civil"
  },
  {
    id: 2,
    title: "Manual de Defensa en Casos Penales",
    description: "Estrategias y procedimientos para entender el proceso penal y conocer sus derechos durante una acusación.",
    price: 24.99,
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3",
    pages: 150,
    popular: false,
    category: "Penal"
  },
  {
    id: 3,
    title: "Derecho Comercial para Emprendedores",
    description: "Todo lo que necesita saber para proteger legalmente su negocio y evitar problemas jurídicos comunes.",
    price: 29.99,
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3",
    pages: 180,
    popular: true,
    category: "Comercial"
  },
  {
    id: 4,
    title: "Guía de Trámites de Tránsito",
    description: "Procedimientos, multas y recursos legales relacionados con infracciones y accidentes de tránsito.",
    price: 14.99,
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3",
    pages: 95,
    popular: false,
    category: "Tránsito"
  },
  {
    id: 5,
    title: "Procedimientos Aduaneros Simplificados",
    description: "Explicación detallada de los procesos de importación, exportación y resolución de controversias aduaneras.",
    price: 22.99,
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3",
    pages: 135,
    popular: false,
    category: "Aduanas"
  },
  {
    id: 6,
    title: "Divorcio en Ecuador: Guía Práctica",
    description: "Todo el proceso explicado paso a paso, incluyendo pensiones alimenticias, custodia y división de bienes.",
    price: 18.99,
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3",
    pages: 110,
    popular: true,
    category: "Civil"
  }
];

export default function Ebooks() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasedEbooks, setPurchasedEbooks] = useState([]);

  const categories = ['Todos', 'Civil', 'Penal', 'Comercial', 'Tránsito', 'Aduanas'];

  useEffect(() => {
    const loadPurchasedEbooks = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('ebook_purchases')
            .select('ebook_id')
            .eq('user_id', user.id);
          setPurchasedEbooks(data?.map(p => p.ebook_id) || []);
        } catch (error) {
          console.error('Error loading purchases:', error);
        }
      }
      setIsLoading(false);
    };
    
    loadPurchasedEbooks();
  }, [user]);

  // Filtrar los e-books por categoría y término de búsqueda
  const filteredEbooks = ebooksData
    .filter(ebook => (selectedCategory === 'Todos' || ebook.category === selectedCategory))
    .filter(ebook => ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    ebook.description.toLowerCase().includes(searchTerm.toLowerCase()));

  // Agregar al carrito
  const addToCart = (ebook) => {
    if (!cartItems.some(item => item.id === ebook.id)) {
      setCartItems([...cartItems, ebook]);
    }
  };

  // Remover del carrito
  const removeFromCart = (ebookId) => {
    setCartItems(cartItems.filter(item => item.id !== ebookId));
  };

  // Calcular total del carrito
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Por favor inicie sesión para continuar');
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      const { data: { sessionId }, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { cartItems }
      });

      if (error) throw error;
      window.location.href = sessionId;
    } catch (error) {
      toast.error('Error al procesar el pago');
      console.error('Checkout error:', error);
    }
  };

  const handleDownload = async (ebook) => {
    try {
      setDownloading(true);
      
      if (!ebook.isFree && !user) {
        toast.error('Debe iniciar sesión para descargar este ebook');
        navigate('/login', { state: { from: location } });
        return;
      }

      if (!ebook.isFree && !purchasedEbooks.includes(ebook.id)) {
        toast.error('Debe comprar este ebook primero');
        return;
      }

      await ebookService.trackDownload(ebook.id);
      const downloadUrl = await ebookService.getDownloadUrl(ebook.id);
      
      // Crear un link temporal y simular click
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${ebook.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('¡Descarga iniciada!');
    } catch (error) {
      console.error('Error al descargar:', error);
      toast.error('Error al iniciar la descarga');
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="loader"></div>
    </div>;
  }

  return (
    <div className="py-12 bg-secondary-50">
      <div className="container-custom">
        {/* Featured Free Ebook */}
        <div className="mb-16">
          <motion.div
            className="card p-6 border-2 border-primary-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <img
                  src={ebooksData[0].coverImage}
                  alt={ebooksData[0].title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full font-bold">
                  GRATIS
                </div>
              </div>
              <div>
                <span className="text-primary-600 font-semibold mb-2 block">E-book Gratuito</span>
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">{ebooksData[0].title}</h2>
                <p className="text-secondary-600 mb-6">{ebooksData[0].description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center text-secondary-600">
                    <FaFilePdf className="mr-2" /> {ebooksData[0].pages} páginas
                  </span>
                  <span className="flex items-center text-secondary-600">
                    <FaDownload className="mr-2" /> PDF descargable
                  </span>
                </div>
                <motion.button
                  onClick={() => handleDownload(ebooksData[0])}
                  className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaDownload /> Descargar Ahora
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="text-center mb-12">
          <h2 className="section-title">Biblioteca Legal Digital</h2>
          <p className="text-xl text-secondary-600">
            E-books especializados para entender sus derechos y procedimientos legales
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
            <div className="relative w-full md:w-2/3">
              <input
                type="text"
                placeholder="Buscar e-books..."
                className="form-input pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen del carrito */}
        {cartItems.length > 0 && (
          <motion.div 
            className="mb-8 card border-2 border-primary-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4">
              <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center">
                <FaShoppingCart className="mr-2 text-primary-600" /> 
                Carrito de Compra ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </h3>
              
              <div className="divide-y divide-secondary-100">
                {cartItems.map(item => (
                  <div key={item.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <FaBook className="mr-2 text-primary-600" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-4 font-bold">${item.price}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-secondary-100">
                <span className="text-lg font-bold">Total: ${cartTotal}</span>
                <motion.button 
                  onClick={handleCheckout}
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Proceder al pago
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista de e-books */}
        {filteredEbooks.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
            <h3 className="text-xl font-bold text-secondary-500 mt-4">No se encontraron e-books</h3>
            <p className="text-secondary-400">Intente con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEbooks.filter(ebook => !ebook.isFree).map(ebook => (
              <motion.div
                key={ebook.id}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <img
                    src={ebook.coverImage}
                    alt={ebook.title}
                    className="w-full h-48 object-cover"
                  />
                  {ebook.popular && (
                    <div className="absolute top-0 right-0 bg-primary-600 text-white px-3 py-1 text-sm font-bold">
                      Popular
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 bg-secondary-900 bg-opacity-80 text-white px-3 py-1">
                    {ebook.pages} páginas
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-secondary-900">{ebook.title}</h3>
                    <span className="badge-primary">{ebook.category}</span>
                  </div>
                  <p className="text-secondary-600 mb-4">{ebook.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600">${ebook.price}</span>
                    {cartItems.some(item => item.id === ebook.id) ? (
                      <span className="flex items-center text-green-600 font-medium">
                        <FaCheck className="mr-1" /> Agregado
                      </span>
                    ) : (
                      <motion.button
                        onClick={() => addToCart(ebook)}
                        className="btn-primary flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaShoppingCart className="mr-2" /> Comprar
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Sección de beneficios */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-secondary-900 text-center mb-8">
            Beneficios de nuestros E-Books Legales
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="card text-center p-6"
              whileHover={{ y: -10 }}
            >
              <div className="rounded-full bg-primary-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-primary-600 text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-secondary-900 mb-2">Conocimiento Accesible</h4>
              <p className="text-secondary-600">Información legal especializada explicada en lenguaje claro y comprensible.</p>
            </motion.div>
            <motion.div 
              className="card text-center p-6"
              whileHover={{ y: -10 }}
            >
              <div className="rounded-full bg-primary-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaDownload className="text-primary-600 text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-secondary-900 mb-2">Disponibilidad Inmediata</h4>
              <p className="text-secondary-600">Descarga instantánea tras la compra, sin esperas ni envíos.</p>
            </motion.div>
            <motion.div 
              className="card text-center p-6"
              whileHover={{ y: -10 }}
            >
              <div className="rounded-full bg-primary-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-secondary-900 mb-2">Ahorro de Tiempo</h4>
              <p className="text-secondary-600">Resuelva dudas legales básicas sin necesidad de consultas presenciales.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
