import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaReply, FaThumbsUp, FaUser, FaTrash, FaEdit } from 'react-icons/fa';
import supabase, { fetchData, insertData, getCurrentUser, updateData, deleteData } from '../../services/supabase';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  // Cargar datos del tema y comentarios
  useEffect(() => {
    const loadTopic = async () => {
      try {
        // Intentar cargar el tema desde Supabase
        const { data: topicData, success } = await fetchData('topics');
        
        if (success && topicData) {
          const foundTopic = topicData.find(t => t.id === parseInt(topicId));
          if (foundTopic) {
            setTopic(foundTopic);
            
            // Registrar una vista
            await updateData('topics', foundTopic.id, {
              views: (foundTopic.views || 0) + 1
            });
            
            // Cargar comentarios
            const { data: commentsData } = await fetchData('comments');
            if (commentsData) {
              const topicComments = commentsData.filter(c => c.topic_id === parseInt(topicId));
              setComments(topicComments);
            }
          } else {
            // Si no se encuentra en la base de datos, intentar usar datos de ejemplo
            setTopic({
              id: parseInt(topicId),
              title: 'Tema de ejemplo',
              content: 'Este es un contenido de ejemplo para el tema seleccionado.',
              author: 'Dr. Wilson Ipiales',
              date: new Date().toISOString(),
              views: 1,
              category: 'Derecho Penal'
            });
          }
        }
      } catch (err) {
        console.error('Error al cargar el tema:', err);
        setError('Error al cargar el tema. Por favor, intente nuevamente.');
      }
    };

    const checkCurrentUser = async () => {
      const { user } = await getCurrentUser();
      setCurrentUser(user);
    };

    loadTopic();
    checkCurrentUser();
  }, [topicId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      if (!currentUser) {
        throw new Error('Debe iniciar sesión para comentar');
      }
      
      const commentData = {
        topic_id: parseInt(topicId),
        content: newComment,
        author_id: currentUser.id,
        author_name: currentUser.user_metadata?.full_name || 'Usuario',
        created_at: new Date().toISOString(),
        parent_id: replyingTo?.id || null,
        likes: 0
      };
      
      const { data, success } = await insertData('comments', commentData);
      
      if (success && data) {
        // Actualizar la lista de comentarios
        setComments([...comments, data[0]]);
        
        // Actualizar contador de respuestas en el tema
        if (topic) {
          await updateData('topics', topic.id, {
            replies: (topic.replies || 0) + 1
          });
          setTopic({...topic, replies: (topic.replies || 0) + 1});
        }
        
        // Limpiar el formulario
        setNewComment('');
        setReplyingTo(null);
      } else {
        throw new Error('Error al publicar el comentario');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al publicar el comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setNewComment(`@${comment.author_name} `);
    document.getElementById('comment-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        throw new Error('Debe iniciar sesión para dar me gusta');
      }
      
      const commentToUpdate = comments.find(c => c.id === commentId);
      if (commentToUpdate) {
        const { success } = await updateData('comments', commentId, {
          likes: (commentToUpdate.likes || 0) + 1
        });
        
        if (success) {
          setComments(comments.map(c => 
            c.id === commentId ? {...c, likes: (c.likes || 0) + 1} : c
          ));
        }
      }
    } catch (err) {
      console.error('Error al dar me gusta:', err);
      setError(err.message || 'Error al dar me gusta');
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.content);
  };

  const saveEdit = async () => {
    try {
      if (!editText.trim()) {
        return;
      }
      
      const { success } = await updateData('comments', editingComment, {
        content: editText,
        edited: true
      });
      
      if (success) {
        setComments(comments.map(c => 
          c.id === editingComment ? {...c, content: editText, edited: true} : c
        ));
        setEditingComment(null);
        setEditText('');
      }
    } catch (err) {
      console.error('Error al editar comentario:', err);
      setError('Error al editar el comentario');
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este comentario?')) {
      try {
        const { success } = await deleteData('comments', commentId);
        
        if (success) {
          setComments(comments.filter(c => c.id !== commentId));
          
          // Actualizar contador de respuestas
          if (topic) {
            await updateData('topics', topic.id, {
              replies: Math.max((topic.replies || 0) - 1, 0)
            });
            setTopic({...topic, replies: Math.max((topic.replies || 0) - 1, 0)});
          }
        }
      } catch (err) {
        console.error('Error al eliminar comentario:', err);
        setError('Error al eliminar el comentario');
      }
    }
  };

  const renderComments = (parentId = null, depth = 0) => {
    const filteredComments = comments.filter(c => c.parent_id === parentId);
    
    return filteredComments.map(comment => (
      <div key={comment.id} className={`ml-${depth * 5} mb-6`}>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                <FaUser className="text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">{comment.author_name}</h4>
                <p className="text-xs text-secondary-500">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                    locale: es
                  })}
                  {comment.edited && ' (editado)'}
                </p>
              </div>
            </div>
            {currentUser && currentUser.id === comment.author_id && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(comment)}
                  className="text-secondary-500 hover:text-primary-600"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDelete(comment.id)}
                  className="text-secondary-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
          
          {editingComment === comment.id ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full border rounded-md p-2 text-sm"
                rows="3"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button 
                  onClick={() => setEditingComment(null)} 
                  className="px-3 py-1 text-sm bg-secondary-100 text-secondary-700 rounded-md"
                >
                  Cancelar
                </button>
                <button 
                  onClick={saveEdit} 
                  className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-secondary-700 text-sm mt-2">{comment.content}</p>
          )}
          
          <div className="mt-3 flex items-center space-x-4">
            <button 
              onClick={() => handleLike(comment.id)}
              className="flex items-center text-xs text-secondary-500 hover:text-primary-600"
            >
              <FaThumbsUp className="mr-1" /> 
              <span>{comment.likes || 0} Me gusta</span>
            </button>
            <button 
              onClick={() => handleReply(comment)}
              className="flex items-center text-xs text-secondary-500 hover:text-primary-600"
            >
              <FaReply className="mr-1" /> Responder
            </button>
          </div>
        </div>
        
        {/* Comentarios anidados */}
        <div className="ml-5 mt-3">
          {renderComments(comment.id, depth + 1)}
        </div>
      </div>
    ));
  };

  if (!topic) {
    return (
      <div className="py-12 bg-secondary-50">
        <div className="container-custom">
          <div className="text-center">
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-secondary-50">
      <div className="container-custom">
        <div className="mb-6">
          <button
            onClick={() => navigate('/foro')}
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <FaArrowLeft className="mr-2" /> Volver al foro
          </button>
        </div>

        <div className="card mb-8">
          <h1 className="text-2xl font-bold text-secondary-900 mb-3">{topic.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-secondary-500 mb-6">
            <span className="mr-4">Por {topic.author}</span>
            <span className="mr-4">
              {formatDistanceToNow(new Date(topic.date), {
                addSuffix: true,
                locale: es
              })}
            </span>
            <span className="mr-4">{topic.views} vistas</span>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
              {topic.category}
            </span>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-secondary-700">{topic.content || topic.excerpt}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">
            Comentarios ({comments.length})
          </h2>
          
          {renderComments()}
          
          {comments.length === 0 && (
            <div className="text-center py-6 text-secondary-500">
              No hay comentarios todavía. ¡Sé el primero en comentar!
            </div>
          )}
        </div>

        <div id="comment-form" className="card">
          <h3 className="text-lg font-bold text-secondary-900 mb-4">
            {replyingTo ? `Respondiendo a ${replyingTo.author_name}` : 'Dejar un comentario'}
          </h3>
          
          {replyingTo && (
            <div className="bg-secondary-50 p-3 rounded-lg mb-4 text-sm text-secondary-700">
              <p className="font-medium">{replyingTo.author_name} escribió:</p>
              <p className="mt-1">{replyingTo.content}</p>
              <button 
                onClick={() => setReplyingTo(null)}
                className="text-xs text-primary-600 mt-2"
              >
                Cancelar respuesta
              </button>
            </div>
          )}
          
          {!currentUser && (
            <div className="bg-yellow-50 p-4 rounded-lg mb-4 text-sm text-yellow-700">
              Debes <Link to="/login" className="font-medium hover:underline">iniciar sesión</Link> para comentar.
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!currentUser || isSubmitting}
                rows="4"
                className="input-field"
                placeholder="Escribe tu comentario aquí..."
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <motion.button
                type="submit"
                className="btn-primary"
                disabled={!currentUser || isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Enviando...' : 'Publicar comentario'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
