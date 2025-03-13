import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="profile">
      {user ? (
        <>
          <h2>Perfil de Usuario</h2>
          <p>Bienvenido, {user.email}</p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </>
      ) : (
        <p>Por favor, inicia sesión para ver tu perfil.</p>
      )}
    </div>
  );
};

export default Profile;
