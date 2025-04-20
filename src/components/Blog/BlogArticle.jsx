import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaShare, FaRegBookmark, FaBookmark, FaWhatsapp, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import NewsletterSignup from '../Newsletter/NewsletterSignup';
import articlesData from './articles.json';

const BlogArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [saved, setSaved] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  useEffect(() => {
    if (articleId) {
      const foundArticle = articlesData.find(a => a.id === parseInt(articleId));
      if (foundArticle) {
        setArticle(foundArticle);
        
        // Encontrar artículos relacionados de la misma categoría
        const related = articlesData
          .filter(a => a.category === foundArticle.category && a.id !== foundArticle.id)
          .slice(0, 3);
        setRelatedArticles(related);
      } else {
        navigate('/404');
      }
      setLoading(false);
    }
    
    // Verificar si el artículo está guardado por el usuario
    if (user) {
      checkIfSaved();
    }
    
    // Scroll al inicio al cargar un nuevo artículo
    window.scrollTo(0, 0);
  }, [articleId, user]);
  
  const fetchRelatedArticles = async (category, currentArticleId) => {
    try {
      const related = articlesData
        .filter(a => a.category === category && a.id !== currentArticleId)
        .slice(0, 3);
      setRelatedArticles(related);
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };
  
  const checkIfSaved = async () => {
    try {
      // Simular la verificación de si el artículo está guardado
      setSaved(Math.random() < 0.5); // Cambiar esto por la lógica real de verificación
    } catch (error) {
      console.error('Error checking if saved:', error);
      setSaved(false);
    }
  };
  
  const handleToggleSave = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para guardar artículos');
      return;
    }
    
    try {
      // Simular la acción de guardar o eliminar el artículo
      setSaved(!saved);
      toast.success(saved ? 'Artículo eliminado de guardados' : 'Artículo guardado correctamente');
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error('Error al guardar el artículo. Intente nuevamente.');
    }
  };
  
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || 'Artículo legal interesante';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`;;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        toast.success('Enlace copiado al portapapeles');
        setShowShareOptions(false);
        return;
    }
    
    window.open(shareUrl, '_blank');
    setShowShareOptions(false);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 bg-gray-200 rounded mb-6 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded mb-12 w-1/2"></div>
        <div className="h-80 bg-gray-200 rounded-lg mb-8"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Artículo no encontrado</h2>
          <p className="mt-2 text-gray-600">El artículo que estás buscando no existe o ha sido eliminado.</p>
          <Link to="/blog" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Volver al blog
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <FaArrowLeft className="mr-2" /> Volver al blog
        </Link>
        
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">{article.title}</h1>
            <p className="mt-4 text-xl text-gray-500">{article.excerpt}</p>
            
            <div className="mt-6 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg">
                  {article.author.split(' ').map(name => name[0]).join('')}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{article.author}</p>
                <div className="flex space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-3 w-3 mr-1" />
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <span>{article.readTime} min de lectura</span>
                  </div>
                  {article.views && (
                    <div className="flex items-center">
                      <span>{article.views.toLocaleString()} lecturas</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          
          {/* Article Actions */}
          <div className="mt-6 flex justify-between border-b border-gray-200 pb-4">
            <div className="flex space-x-4">
              <button 
                className="flex items-center text-gray-500 hover:text-blue-600"
                onClick={handleToggleSave}
              >
                {saved ? <FaBookmark className="mr-1" /> : <FaRegBookmark className="mr-1" />}
                <span>{saved ? 'Guardado' : 'Guardar'}</span>
              </button>
              
              <div className="relative">
                <button 
                  className="flex items-center text-gray-500 hover:text-blue-600"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                >
                  <FaShare className="mr-1" />
                  <span>Compartir</span>
                </button>
                
                {showShareOptions && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleShare('whatsapp')}
                      >
                        <FaWhatsapp className="mr-3 text-green-500" /> WhatsApp
                      </button>
                      <button 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleShare('facebook')}
                      >
                        <FaFacebook className="mr-3 text-blue-600" /> Facebook
                      </button>
                      <button 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleShare('twitter')}
                      >
                        <FaTwitter className="mr-3 text-blue-400" /> Twitter
                      </button>
                      <button 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleShare('linkedin')}
                      >
                        <FaLinkedin className="mr-3 text-blue-700" /> LinkedIn
                      </button>
                      <button 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleShare('copy')}
                      >
                        <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg> Copiar enlace
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex">
              {article.tags && article.tags.map((tag, index) => (
                <Link 
                  key={index} 
                  to={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 mr-2"
                >
                  <FaTag className="mr-1 h-3 w-3" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Featured Image */}
          {article.image && (
            <div className="my-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
          
          {/* Article Content */}
          <div className="prose prose-blue prose-lg max-w-none mt-8" dangerouslySetInnerHTML={{ __html: article.content }} />
          
          {/* Author Bio */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-xl">
                  {article.author.split(' ').map(name => name[0]).join('')}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-900">{article.author}</h3>
                <p className="text-base text-gray-600">Abogado especializado en derecho civil, penal y tránsito. Con más de 10 años de experiencia, brinda asesoría legal integral a personas y empresas en Ecuador.</p>
                <div className="mt-2">
                  <Link to="/about" className="text-blue-600 hover:text-blue-800 text-sm font-medium">Más sobre el autor</Link>
                </div>
              </div>
            </div>
          </div>
        </article>
        
        {/* Newsletter Signup */}
        <div className="max-w-4xl mx-auto mt-12">
          <NewsletterSignup />
        </div>
        
        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Artículos Relacionados</h2>
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
              {relatedArticles.map((related) => (
                <div key={related.id} className="flex flex-col rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                  <div className="flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover"
                      src={related.image || '/images/blog/default.jpg'}
                      alt={related.title}
                    />
                  </div>
                  <div className="flex-1 bg-white p-5 flex flex-col justify-between">
                    <div className="flex-1">
                      <Link to={`/blog/article/${related.id}`} className="block mt-1">
                        <p className="text-lg font-semibold text-gray-900 hover:text-blue-700">{related.title}</p>
                        <p className="mt-3 text-sm text-gray-500 line-clamp-2">{related.excerpt}</p>
                      </Link>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <span>{formatDate(related.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogArticle;
