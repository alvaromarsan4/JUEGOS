"use client";
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
// Importamos la función updateProfile que maneja el CSRF y getFavorites
import { getFavorites, updateProfile } from "@/services/api"; 
import GameCard from "@/components/GameCard";

const ProfilePage = () => {
  // Ahora setUser ya existe gracias al Paso 1
  const { user, setUser } = useContext(AuthContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('favoritos');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [favGames, setFavGames] = useState([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',     
    email: '',    
    description: '', 
    age: '', 
    gender: '', 
    profileImage: ''
  });

  // 1. Cargar datos del usuario en el formulario al iniciar o cambiar usuario
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        description: user.description || '', 
        age: user.age || '', 
        gender: user.gender || '', 
        // Usamos placehold.co para evitar errores de red si no hay imagen
        profileImage: user.profileImage || 'https://placehold.co/150'
      });
      fetchRealFavorites();
    }
  }, [user]);

  // 2. Cargar favoritos reales desde la API
  const fetchRealFavorites = async () => {
    try {
      const res = await getFavorites();
      let data = Array.isArray(res) ? res : (res.data || []);
      setFavGames(data);
    } catch (error) {
      console.error("Error cargando favoritos en perfil", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Filtrar favoritos visuales (Optimistic UI)
  const visibleFavorites = favGames.filter(game => {
    const gameId = Number(game.external_id || game.id);
    return user?.favorites?.includes(gameId);
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. ENVÍO DEL FORMULARIO (CORREGIDO)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // Llamamos a la API (updateProfile maneja la cookie CSRF automáticamente)
      const res = await updateProfile(formData);

      if (res.success) {
        // Mezclamos los datos antiguos del usuario con los nuevos que devolvió la API (o los del form)
        const updatedUser = { ...user, ...res.user, ...formData };
        
        // A. Actualizamos el contexto (Pinta la UI nueva al instante)
        setUser(updatedUser);
        
        // B. Persistimos en LocalStorage (Para que no se pierda al dar F5)
        localStorage.setItem('pg_user', JSON.stringify(updatedUser)); 
        
        setIsEditing(false);
        alert("¡Perfil actualizado con éxito!");
      } else {
        alert(`Error: ${res.message || "No se pudo actualizar"}`);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return <div className="text-white text-center mt-20">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white pb-20 px-4">
      <div className="max-w-4xl mx-auto pt-10">
        
        {/* TARJETA DE PERFIL */}
        <div className="bg-[#161b22] p-8 rounded-xl border border-gray-800 mb-8">
          {!isEditing ? (
            // VISTA DE LECTURA
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img 
                src={formData.profileImage || "https://placehold.co/150"} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover" 
                onError={(e) => { e.target.src = "https://placehold.co/150"; }} 
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold">{formData.name}</h1>
                <p className="text-gray-400 text-sm mb-2">{formData.email}</p>
                <p className="text-gray-300 mt-2">{formData.description || "Sin descripción..."}</p>
                
                <div className="flex gap-4 mt-4 justify-center md:justify-start text-blue-400 text-sm">
                  <span className="bg-blue-900/20 px-3 py-1 rounded-full border border-blue-800/30">🎂 {formData.age || '?'} años</span>
                  <span className="bg-blue-900/20 px-3 py-1 rounded-full border border-blue-800/30">⚧ {formData.gender || '?'}</span>
                </div>
              </div>
              <button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-bold transition-colors">
                Editar Perfil
              </button>
            </div>
          ) : (
            // VISTA DE EDICIÓN (FORMULARIO)
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Nombre */}
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Nombre</label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full bg-[#0d1117] p-2 rounded border border-gray-700 outline-none focus:border-blue-500 text-white" 
                    required 
                  />
                </div>

                {/* Email (OBLIGATORIO) */}
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Email</label>
                  <input 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full bg-[#0d1117] p-2 rounded border border-gray-700 outline-none focus:border-blue-500 text-white" 
                    required 
                  />
                </div>

                {/* Edad */}
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Edad</label>
                  <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full bg-[#0d1117] p-2 rounded border border-gray-700 outline-none focus:border-blue-500 text-white" />
                </div>

                {/* Género */}
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Género</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#0d1117] p-2 rounded border border-gray-700 outline-none focus:border-blue-500 text-white">
                    <option value="">Seleccionar...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 uppercase font-bold">Descripción</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-[#0d1117] p-2 rounded border border-gray-700 outline-none focus:border-blue-500 text-white resize-none" rows="3" />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={updating} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold transition-colors disabled:opacity-50">
                  {updating ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-bold transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* TABS (Favoritos / Reseñas) */}
        <div className="flex border-b border-gray-800 mb-6 bg-[#161b22] rounded-t-xl">
          <button onClick={() => setActiveTab('favoritos')} className={`flex-1 py-4 font-bold ${activeTab === 'favoritos' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}>
            ❤️ Favoritos ({visibleFavorites.length})
          </button>
          <button onClick={() => setActiveTab('resenas')} className={`flex-1 py-4 font-bold ${activeTab === 'resenas' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}>
            📝 Reseñas
          </button>
        </div>

        {/* CONTENIDO DE TABS */}
        <div className="bg-[#161b22] p-6 rounded-b-xl border border-t-0 border-gray-800">
          {activeTab === 'favoritos' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {loading ? (
                <p className="col-span-full text-center py-10">Cargando favoritos...</p>
              ) : visibleFavorites.length > 0 ? (
                visibleFavorites.map(game => (
                  <GameCard key={game.id || game.external_id} game={game} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-10">Aún no tienes favoritos.</p>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">Próximamente verás tus reseñas aquí.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;