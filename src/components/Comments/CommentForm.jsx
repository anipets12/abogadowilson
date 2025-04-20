import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import FileUploader from './FileUploader';
import { useToken } from '../../services/useToken';
import { toast } from 'react-hot-toast';

const CommentForm = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [tokensRemaining, setTokensRemaining] = useState(3);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Obtener tokens del usuario
        const { tokens, error } = await useToken.getUserTokens(user.id);
        if (!error) {
          setTokensRemaining(tokens);
        }
      }
    };
    
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('Debe iniciar sesión para comentar');
      }
      
      // Verificar si el usuario tiene tokens disponibles
      if (tokensRemaining <= 0) {
        throw new Error('No tiene tokens disponibles. Por favor recargue.');
      }

      // Usar un token para comentar
      const { tokensRemaining: newTokens, error: tokenError } = await useToken.useToken(user.id);
      
      if (tokenError) {
        throw new Error(tokenError);
      }

      const { data, error: insertError } = await supabase
        .from('comments')
        .insert([
          { 
            post_id: postId, 
            user_id: user.id, 
            content: comment, 
            attachments: attachments.length > 0 ? attachments : null,
            created_at: new Date().toISOString() 
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setComment('');
      setAttachments([]);
      setTokensRemaining(newTokens);
      toast.success('Comentario enviado correctamente');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (files) => {
    setAttachments(files);
    toast.success(`${files.length} archivo(s) adjuntado(s) correctamente`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4">Dejar un comentario</h3>
      
      {user ? (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Tokens disponibles: <span className="font-bold">{tokensRemaining}</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              required
            />
            
            <FileUploader onFileUpload={handleFileUpload} />
            
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <button
              type="submit"
              disabled={loading || tokensRemaining <= 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Comentario'}
            </button>
            
            {tokensRemaining <= 0 && (
              <p className="text-sm text-red-500">
                No tiene tokens disponibles. Por favor recargue para poder comentar.
              </p>
            )}
          </form>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">Debe iniciar sesión para comentar</p>
          <a 
            href="/login" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Iniciar Sesión
          </a>
        </div>
      )}
    </div>
  );
};

export default CommentForm;
