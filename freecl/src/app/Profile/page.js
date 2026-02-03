"use client";
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
// 1. IMPORTAMOS LAS FUNCIONES DE RESEÑAS
import { getFavorites, updateProfile, getUserReviews, deleteReview } from "@/services/api"; 
import GameCard from "@/components/GameCard";

// ... (El array AVAILABLE_AVATARS se mantiene igual, lo omito para no ocupar espacio innecesario) ...
const AVAILABLE_AVATARS = [
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Mario",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Link",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=GamerOne",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Zelda",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pacman",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Cloud",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aragorn",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Legolas",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Gimli",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Wizard",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Sorceress",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Paladin",
  "https://api.dicebear.com/7.x/bottts/svg?seed=R2D2",
  "https://api.dicebear.com/7.x/bottts/svg?seed=C3PO",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Cyberpunk",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Mecha",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Droid",
  "https://api.dicebear.com/7.x/big-ears/svg?seed=Elf",
  "https://api.dicebear.com/7.x/big-ears/svg?seed=Hobbit",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool",
  "https://api.dicebear.com/7.x/identicon/svg?seed=Matrix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Dovahkiin",
  "https://api.dicebear.com/7.x/bottts/svg?seed=GLaDOS",
];

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('favoritos');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [favGames, setFavGames] = useState([]);
  // 2. NUEVO ESTADO PARA LAS RESEÑAS
  const [userReviews, setUserReviews] = useState([]); 

  const [formData, setFormData] = useState({
    name: '',     
    email: '',    
    description: '', 
    age: '', 
    gender: '', 
    profileImage: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        description: user.description || '', 
        age: user.age || '', 
        gender: user.gender || '', 
        profileImage: user.profileImage || 'https://placehold.co/150'
      });
      fetchData(); // Llamamos a una función unificada
    }
  }, [user]);

  // Función unificada para cargar favoritos y reseñas
  const fetchData = async () => {
    try {
      // Cargar Favoritos
      const favRes = await getFavorites();
      let favData = Array.isArray(favRes) ? favRes : (favRes.data || []);
      setFavGames(favData);

      // Cargar Reseñas (LÓGICA DE LA IMAGEN ADAPTADA A TU API)
      const reviewsRes = await getUserReviews();
      // Aseguramos que sea array
      const reviewsData = Array.isArray(reviewsRes) ? reviewsRes : (reviewsRes.data || []); 
      setUserReviews(reviewsData);

    } catch (error) {
      console.error("Error cargando datos del perfil", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("¿Seguro que quieres borrar esta reseña?")) return;
    
    const success = await deleteReview(reviewId);
    if (success) {
      setUserReviews(prev => prev.filter(r => r.id !== reviewId));
    } else {
      alert("Error al eliminar la reseña");
    }
  };

  const visibleFavorites = favGames.filter(game => {
    const gameId = Number(game.external_id || game.id);
    return user?.favorites?.includes(gameId);
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectAvatar = (url) => {
    setFormData({ ...formData, profileImage: url });
    setShowAvatarSelector(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await updateProfile(formData);

      if (res.success) {
        const updatedUser = { ...user, ...res.user, ...formData };
        setUser(updatedUser);
        sessionStorage.setItem('pg_user', JSON.stringify(updatedUser));
        
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
        
        {/* TARJETA DE PERFIL (VISTA LECTURA / EDICIÓN) */}
        <div className="bg-[#161b22] p-8 rounded-xl border border-gray-800 mb-8">
          {!isEditing ? (
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img 
                src={formData.profileImage || "https://placehold.co/150"} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover bg-gray-800" 
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
             <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... (TU CÓDIGO DE EDICIÓN SE MANTIENE IGUAL) ... */}
              <div className="flex flex-col items-center gap-4 border-b border-gray-700 pb-6">
                 <label className="text-xs text-gray-500 uppercase font-bold">Imagen de Perfil</label>
                 <div className="flex items-center gap-4">
                    <img src={formData.profileImage || "https://placehold.co/150"} alt="Preview" className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover bg-gray-800"/>
                    <button type="button" onClick={() => setShowAvatarSelector(!showAvatarSelector)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors">
                        {showAvatarSelector ? "Cerrar selección" : "Cambiar Avatar"}
                    </button>
                 </div>
                 {showAvatarSelector && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 bg-[#0d1117] p-4 rounded border border-gray-700 mt-2">
                        {AVAILABLE_AVATARS.map((avatarUrl, index) => (
                            <img key={index} src={avatarUrl} alt={`Avatar ${index}`} onClick={() => selectAvatar(avatarUrl)} className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all hover:scale-110 object-cover bg-gray-800 ${formData.profileImage === avatarUrl ? 'border-blue-500' : 'border-transparent hover:border-gray-500'}`}/>
                        ))}
                    </div>
                 )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500 uppercase font-bold">Nombre</label><input name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0d1117] p-2 rounded border border-gray-700 outline-none focus:border-blue-500 text-white" required /></div>
                <div><label className="text-xs text-gray-500 uppercase font-bold">Email</label><input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0d1117] p-2 rounded border border-gray-700 outline-none focus:border-blue-500 text-white" required /></div>
                <div><label className="text-xs text-gray-500 uppercase font-bold">Edad</label><input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full bg-[#0d1117] p-2 rounded border border-gray-700 outline-none focus:border-blue-500 text-white" /></div>
                <div><label className="text-xs text-gray-500 uppercase font-bold">Género</label><select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#0d1117] p-2 rounded border border-gray-700 outline-none focus:border-blue-500 text-white"><option value="">Seleccionar...</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option><option value="Otro">Otro</option></select></div>
                <div className="md:col-span-2"><label className="text-xs text-gray-500 uppercase font-bold">Descripción</label><textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-[#0d1117] p-2 rounded border border-gray-700 outline-none focus:border-blue-500 text-white resize-none" rows="3" /></div>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={updating} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold transition-colors disabled:opacity-50">{updating ? "Guardando..." : "Guardar Cambios"}</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-bold transition-colors">Cancelar</button>
              </div>
            </form>
          )}
        </div>

        {/* TABS DE FAVORITOS / RESEÑAS */}
        <div className="flex border-b border-gray-800 mb-6 bg-[#161b22] rounded-t-xl">
          <button onClick={() => setActiveTab('favoritos')} className={`flex-1 py-4 font-bold ${activeTab === 'favoritos' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}>
            ❤️ Favoritos ({visibleFavorites.length})
          </button>
          <button onClick={() => setActiveTab('resenas')} className={`flex-1 py-4 font-bold ${activeTab === 'resenas' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}>
            📝 Mis Reseñas ({userReviews.length})
          </button>
        </div>

        <div className="bg-[#161b22] p-6 rounded-b-xl border border-t-0 border-gray-800 min-h-[200px]">
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
            // 3. AQUÍ ESTÁ LA LÓGICA DE LA IMAGEN IMPLEMENTADA
            <div className="grid gap-4">
               {userReviews.length > 0 ? (
                 userReviews.map((review) => (
                    <div key={review.id} className="p-5 border border-gray-700 rounded-lg shadow-sm bg-[#0d1117] hover:border-blue-500/50 transition-colors relative group">
                        {/* Botón de borrar (extra útil para perfil) */}
                        <button 
                            onClick={() => handleDeleteReview(review.id)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Eliminar reseña"
                        >
                            🗑️
                        </button>

                        {/* Título del juego (Si el backend lo envía) */}
     <h2 className="font-bold text-lg text-blue-400 mb-1">
   {/* Si existe el objeto game, muestra el título. Si no, muestra "Juego no encontrado" */}
   {review.game ? review.game.title : "Juego no disponible"}
</h2>

{/* Para la imagen de fondo o miniatura si quisieras ponerla */}
{review.game && (
   <img src={review.game.thumbnail} alt={review.game.title} className="w-full h-24 object-cover mb-2 rounded" />
)}
                        
                        {/* Estrellas usando .repeat() como en la imagen */}
                        <div className="text-yellow-500 text-sm mb-2">
                            {'★'.repeat(review.rating)}
                            <span className="text-gray-600 ml-2 text-xs">({review.rating}/5)</span>
                        </div>

                        {/* Comentario */}
                        <p className="italic text-gray-300 mb-3 bg-gray-800/50 p-3 rounded border border-gray-800">
                            "{review.comment}"
                        </p>

                        {/* Fecha */}
                        <span className="text-xs text-gray-500 font-mono">
                            Publicado el: {new Date(review.created_at).toLocaleDateString()}
                        </span>
                    </div>
                 ))
               ) : (
                  // Mensaje si está vacío (como en la imagen)
                  <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
                     <p className="text-gray-500 text-lg">Aún no has escrito ninguna reseña.</p>
                     <p className="text-gray-600 text-sm mt-2">¡Ve a un juego y comparte tu opinión!</p>
                  </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;