import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ebookService } from '../services/ebookService';
import { toast } from 'react-hot-toast';

export default function ProtectedDownload() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initiateDownload = async () => {
      try {
        if (!user) {
          toast.error('Debe iniciar sesión para descargar');
          navigate('/login');
          return;
        }

        const ebook = await ebookService.getEbook(id);
        
        // Verificar si el usuario tiene acceso
        if (!ebook.isFree && !user.purchases?.includes(id)) {
          toast.error('No tiene acceso a este ebook');
          navigate('/ebooks');
          return;
        }

        // Iniciar descarga
        const downloadUrl = await ebookService.getDownloadUrl(id);
        window.location.href = downloadUrl;
        
        // Redirigir después de iniciar la descarga
        setTimeout(() => {
          navigate('/ebooks');
        }, 1000);

      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al procesar la descarga');
        navigate('/ebooks');
      }
    };

    initiateDownload();
  }, [id, user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-lg">Preparando su descarga...</p>
      </div>
    </div>
  );
}
