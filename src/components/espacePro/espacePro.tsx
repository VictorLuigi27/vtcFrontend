import { useEffect, useState } from "react";
import MapComponent from '../mapComponent';
import { useLocation } from "react-router-dom";

interface Chauffeur {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  latitude: number;
  longitude: number;
  vehicule: string;
  disponibilite: boolean;
}

const EspacePro = () => {
  const token = localStorage.getItem("token");
  const location = useLocation(); // Cela nous donne l'objet location qui contient l'URL actuelle
  const params = new URLSearchParams(location.search); 
  
  const id = params.get('id');

  console.log('ID récupéré de l\'URL:', id);
  // State pour stocker les informations du chauffeur connecté
  const [chauffeurInfo, setChauffeurInfo] = useState<Chauffeur | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Vérification si l'utilisateur est connecté via le token
  const isChauffeurConnected = token !== null;

  useEffect(() => {
    if (isChauffeurConnected && token) {
      const fetchChauffeurInfo = async () => {
        console.log('Token:', token);
        

  
        if (!token) {
          console.log('Token manquant');
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        try {
          // Effectuer la requête en utilisant l'ID dans le token
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
          console.log('Données du chauffeur:', data);
          setChauffeurInfo(data);
        } catch (error) {
          console.error('Erreur:', error);
          setError('Erreur interne lors de la récupération des informations');
        }
      };
  
      fetchChauffeurInfo();
    }
  }, [token, isChauffeurConnected]);

  // Fonction pour mettre à jour la disponibilité du chauffeur
  const handleDisponibiliteChange = async (newDisponibilite: boolean) => {
    if (!chauffeurInfo) return;

    try {
      const response = await fetch(`http://localhost:3000/api/driver/${chauffeurInfo._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disponibilite: newDisponibilite }),
      });

      if (!response.ok) {
        setError('Erreur lors de la mise à jour de la disponibilité');
        return;
      }

      // Mettre à jour la disponibilité dans l'état local
      const updatedChauffeur = await response.json();
      setChauffeurInfo(updatedChauffeur);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur interne lors de la mise à jour');
    }
  };

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
            <h2 className="text-3xl font-semibold text-center mb-4">Bienvenue dans votre espace professionnel: {id}</h2>
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

                {/* Option pour changer la disponibilité */}
                <div className="flex items-center">
                  <label className="text-lg mr-4">Disponibilité:</label>
                  <input 
                    type="checkbox"
                    checked={chauffeurInfo.disponibilite}
                    onChange={(e) => handleDisponibiliteChange(e.target.checked)}
                    className="h-5 w-5"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-lg text-gray-400">
                Chargement des informations...
              </div>
            )}

            {/* Affichage de la carte si le chauffeur est disponible */}
            <div className="h-full w-full rounded-lg overflow-hidden mt-4">
              {chauffeurInfo && <MapComponent drivers={[chauffeurInfo]} />}
            </div>

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