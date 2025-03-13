import { useState } from 'react';
import { motion } from 'framer-motion';

export default function JudicialNews() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  
  const categories = ['Todos', 'Nacional', 'Local', 'Constitucional', 'Penal', 'Civil'];
  
  const news = [
    {
      id: 1,
      title: 'Corte Nacional de Justicia emite resolución sobre prescripción en casos de tránsito',
      excerpt: 'La resolución establece nuevos criterios para determinar la prescripción de acciones en casos de infracciones de tránsito.',
      date: '2023-12-18',
      category: 'Nacional',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3',
      author: 'Redacción Legal',
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Nuevas reformas al Código Orgánico Integral Penal entrarán en vigencia en enero',
      excerpt: 'Las modificaciones buscan agilizar los procesos penales y fortalecer las garantías procesales de los acusados.',
      date: '2023-12-15',
      category: 'Penal',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3',
      author: 'Departamento Jurídico',
      readTime: '8 min'
    },
    {
      id: 3,
      title: 'Corte Constitucional declara inconstitucional artículo sobre prisión preventiva',
      excerpt: 'El fallo establece que la aplicación automática de prisión preventiva en ciertos delitos viola principios constitucionales.',
      date: '2023-12-12',
      category: 'Constitucional',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3',
      author: 'Ana Martínez',
      readTime: '6 min'
    },
    {
      id: 4,
      title: 'Juzgado de Ibarra implementa sistema digital para audiencias virtuales',
      excerpt: 'La iniciativa busca reducir tiempos de espera y facilitar el acceso a la justicia en la provincia de Imbabura.',
      date: '2023-12-10',
      category: 'Local',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3',
      author: 'Carlos Benítez',
      readTime: '4 min'
    },
    {
      id: 5,
      title: 'Consejo de la Judicatura anuncia plan de modernización de juzgados',
      excerpt: 'El plan incluye renovación tecnológica y capacitación para jueces y personal administrativo en todo el país.',
      date: '2023-12-08',
      category: 'Nacional',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3',
      author: 'Redacción Legal',
      readTime: '7 min'
    },
    {
      id: 6,
      title: 'Corte Provincial de Justicia resuelve caso emblemático sobre derechos de propiedad',
      excerpt: 'El fallo sienta un precedente importante para casos similares relacionados con disputas de tierras en zonas rurales.',
      date: '2023-12-05',
      category: 'Civil',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3',
      author: 'María Sánchez',
      readTime: '6 min'
    }
  ];

  const filteredNews = activeCategory === 'Todos' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  return (
    <div className="py-12 bg-secondary-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Noticias Judiciales</h2>
          <p className="text-xl text-secondary-600">
            Manténgase informado sobre las últimas novedades en el ámbito legal y judicial
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8 flex-wrap">
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg mb-2 ${activeCategory === category ? 'btn-primary' : 'btn-secondary'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map(item => (
            <motion.article
              key={item.id}
              className="card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover mb-4 rounded-t-lg"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary-600">{item.category}</span>
                  <span className="text-sm text-secondary-500">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-secondary-600 mb-4">{item.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                  <span className="text-sm text-secondary-500">{item.author}</span>
                  <span className="text-sm text-secondary-500">{item.readTime} de lectura</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-secondary-600">No hay noticias disponibles en esta categoría.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cargar Más Noticias
          </motion.button>
        </div>

        {/* Suscripción a Noticias */}
        <motion.div
          className="mt-16 card bg-primary-50 border border-primary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              Reciba Actualizaciones Legales
            </h3>
            <p className="text-lg text-secondary-600 mb-6">
              Suscríbase a nuestro boletín para recibir las últimas noticias judiciales y actualizaciones legales directamente en su correo electrónico.
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Su correo electrónico"
                  className="input-field flex-grow"
                  required
                />
                <motion.button
                  type="submit"
                  className="btn-primary whitespace-nowrap"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Suscribirse
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}