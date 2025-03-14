import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaPaperclip, FaDownload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        // Obtener los IDs de usuarios únicos
        const userIds = [...new Set(data.map(comment => comment.user_id))];
        
        // Obtener los perfiles de los usuarios
        if (userIds.length > 0) {
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);
            
          if (profileError) {
            console.error('Error fetching profiles:', profileError);
          } else {
            // Crear un objeto con los perfiles indexados por ID
            const profileMap = {};
            profiles.forEach(profile => {
              profileMap[profile.id] = profile;
            });
            setUserProfiles(profileMap);
          }
        }

        setComments(data);
      } catch (err) {
        setError(err.message);
        toast.error(`Error al cargar comentarios: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      toast.error('Debe iniciar sesión para eliminar un comentario');
      return;
    }
    
    try {
      const comment = comments.find(c => c.id === commentId);
      
      if (comment.user_id !== user.id) {
        toast.error('Solo puede eliminar sus propios comentarios');
        return;
      }
      
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
        
      if (error) throw error;
      
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comentario eliminado correctamente');
    } catch (err) {
      toast.error(`Error al eliminar comentario: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando comentarios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Comentarios ({comments.length})</h3>
      
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No hay comentarios aún. ¡Sé el primero en comentar!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const profile = userProfiles[comment.user_id] || {};
            const userName = profile.full_name || 'Usuario Anónimo';
            
            return (
              <div key={comment.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{userName}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                    
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                          <FaPaperclip className="mr-1" /> Archivos adjuntos:
                        </p>
                        <ul className="space-y-1">
                          {comment.attachments.map((file, index) => (
                            <li key={index} className="text-sm flex items-center">
                              <a 
                                href={file.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center"
                              >
                                {file.name} <FaDownload className="ml-1" />
                              </a>
                              <span className="text-gray-500 ml-2">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {user && user.id === comment.user_id && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-sm text-red-600 hover:text-red-800 mt-2"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentList;
