import { useEffect, useState } from "react";

// Définir une interface pour le chauffeur
interface Chauffeur {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  vehicule: string;
  disponibilite: boolean;
}

const EspacePro = () => {
  const token = localStorage.getItem("token");

  // State pour stocker les informations du chauffeur connecté
  const [chauffeurInfo, setChauffeurInfo] = useState<Chauffeur | null>(null); // Typage explicite

  const [error, setError] = useState<string | null>(null);

  // Vérification si l'utilisateur est connecté via le token
  const isChauffeurConnected = token !== null;

  useEffect(() => {
    if (isChauffeurConnected) {
      const fetchChauffeurInfo = async () => {
        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('Token manquant');
          return;
        }
        
        try {
          const response = await fetch('http://localhost:3000/api/driver/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        
          if (!response.ok) {
            setError('Erreur de récupération des informations du chauffeur');
            return;
          }
        
          const data = await response.json();
          setChauffeurInfo(data); // Stocker les données du chauffeur dans le state
        } catch (error) {
          console.error('Erreur:', error);
          setError('Erreur interne lors de la récupération des informations');
        }
      };
      
      fetchChauffeurInfo();
    }
  }, [token, isChauffeurConnected]);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Rediriger vers la page de connexion après la déconnexion
  };

  return (
    <div className="bg-neutral-900 p-8 space-y-6">
      {isChauffeurConnected ? (
        <>
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-center mb-4">Bienvenue dans votre espace professionnel</h2>
            {/* Affichage des informations du chauffeur connecté */}
            {chauffeurInfo ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Infos personnelles :</h3>
                <div className="text-lg">
                  <p><strong>Nom:</strong> {chauffeurInfo.nom}</p>
                  <p><strong>Prénom:</strong> {chauffeurInfo.prenom}</p>
                  <p><strong>Adresse:</strong> {chauffeurInfo.adresse}</p>
                  <p><strong>Téléphone:</strong> {chauffeurInfo.telephone}</p>
                  <p><strong>Véhicule:</strong> {chauffeurInfo.vehicule}</p>
                  <p><strong>Disponibilité:</strong> {chauffeurInfo.disponibilite ? 'Disponible' : 'Indisponible'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-lg text-gray-400">
                Chargement des informations...
              </div>
            )}

            {/* Bouton de déconnexion */}
            <div
              onClick={handleLogout}
              className="bg-red-600 text-white text-lg font-semibold rounded-lg p-3 cursor-pointer mt-6 hover:bg-red-700 transition duration-200 ease-in-out"
            >
              Déconnexion
            </div>
          </div>
        </>
      ) : (
        <p className="text-white text-lg text-center">
          Vous devez être connecté pour accéder à l'espace professionnel.
        </p>
      )}

      {/* Affichage des erreurs s'il y en a */}
      {error && <p className="text-red-600 text-center text-xl">{error}</p>}
    </div>
  );
};

export default EspacePro;
