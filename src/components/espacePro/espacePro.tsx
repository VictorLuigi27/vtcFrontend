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
  const location = useLocation(); 
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  console.log('ID récupéré de l\'URL:', id);

  const [chauffeurInfo, setChauffeurInfo] = useState<Chauffeur | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture de la modal

  const isChauffeurConnected = token !== null;

  useEffect(() => {
    if (isChauffeurConnected && token) {
      const fetchChauffeurInfo = async () => {
        if (!token) {
          console.log('Token manquant');
          localStorage.removeItem("token");
          window.location.href = "/login";
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
          setChauffeurInfo(data);
        } catch (error) {
          console.error('Erreur:', error);
          setError('Erreur interne lors de la récupération des informations');
        }
      };

      fetchChauffeurInfo();
    }
  }, [token, isChauffeurConnected]);

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

      const updatedChauffeur = await response.json();
      setChauffeurInfo(updatedChauffeur);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur interne lors de la mise à jour');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen); // Fonction pour ouvrir/fermer la modal

  return (
    <div className="bg-neutral-900 p-8 space-y-6">
      {isChauffeurConnected ? (
        <>
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-center mb-4">Bienvenue dans votre espace professionnel: {id}</h2>

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
            
                <div className="flex items-center">
                  <label className="text-lg mr-4">Disponibilité:</label>
                  <input 
                    type="checkbox"
                    checked={chauffeurInfo.disponibilite}
                    onChange={(e) => handleDisponibiliteChange(e.target.checked)}
                    className="h-5 w-5"
                  />
                </div>

                {/* Bouton "Ajouter une course" sous Disponibilité */}
                <button
                  onClick={toggleModal}
                  className="mt-6 bg-blue-500 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 w-full"
                >
                  Ajouter une course
                </button>

              </div>
            ) : (
              <div className="text-center text-lg text-gray-400">
                Chargement des informations...
              </div>
            )}

            <div className="h-full w-full rounded-lg overflow-hidden mt-4">
              {chauffeurInfo && <MapComponent drivers={[chauffeurInfo]} />}
            </div>

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

      {error && <p className="text-red-600 text-center text-xl">{error}</p>}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Ajouter une course</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  id="destination"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="montant" className="block text-sm font-medium text-gray-700">Montant</label>
                <input
                  type="number"
                  id="montant"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Ajouter la course
              </button>
            </form>
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <span className="text-2xl">&times;</span> {/* Icône "fermer" */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EspacePro;

