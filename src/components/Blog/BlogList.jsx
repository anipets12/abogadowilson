import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag, FaSearch, FaFilter } from 'react-icons/fa';
import articlesData from './articles.json';
import categoriesData from './categories.json';

const BlogList = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  useEffect(() => {
    setArticles(articlesData);
    setCategories(categoriesData);
    setLoading(false);
  }, []);
  
  useEffect(() => {
    filterArticles();
  }, [searchTerm, selectedCategory, articles]);
  
  const filterArticles = () => {
    let filtered = [...articles];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    setFilteredArticles(filtered);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="h-12 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-60 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Blog Legal</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Artículos, noticias y análisis sobre temas legales relevantes
          </p>
        </div>
        
        {/* Filtros y búsqueda */}
        <div className="mt-10 bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar Artículos
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Título, tema o etiqueta..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  id="category"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lista de Artículos */}
        {filteredArticles.length > 0 ? (
          <div className="mt-12 grid gap-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {filteredArticles.map((article) => (
              <div key={article.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={article.image || '/images/blog/default.jpg'}
                    alt={article.title}
                  />
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600">
                      <Link to={`/blog/category/${article.category}`} className="hover:underline">
                        {categories.find(cat => cat.id === article.category)?.name || article.category}
                      </Link>
                    </p>
                    <Link to={`/blog/article/${article.id}`} className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900 hover:text-blue-700">{article.title}</p>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">{article.excerpt}</p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{article.author}</span>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                        {article.author.split(' ').map(name => name[0]).join('')}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {article.author}
                      </p>
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaCalendarAlt className="h-3 w-3 mr-1" />
                          <span>{formatDate(article.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <span>{article.readTime} min de lectura</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mt-8 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron artículos</h3>
            <p className="mt-1 text-sm text-gray-500">Intenta con otros términos de búsqueda o selecciona otra categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
