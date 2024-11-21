import { Link } from "react-router-dom";

interface ModalMenuProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

export default function ModalMenu({ openModal, setOpenModal }: ModalMenuProps) {
  if (!openModal) return null;

  const token = localStorage.getItem("token");

  // Vérification si l'utilisateur est connecté via le token
  const isChauffeurConnected = token !== null; // On vérifie uniquement la présence du token

  let chauffeurId: string | undefined = undefined;

  if (isChauffeurConnected && token) {
    try {
      // Décoder manuellement le token JWT
      const payload = token.split('.')[1]; // Partie du payload
      const decoded = JSON.parse(atob(payload)); // Décoder le Base64 du payload
      chauffeurId = decoded.id; // Récupérer l'ID du chauffeur
    } catch (error) {
      console.error("Erreur de décodage du token", error);
    }
  }

  return (
    <div
      className="bg-neutral-900 p-2 flex flex-col items-center mt-4 py-3 space-y-5"
      onClick={() => setOpenModal(false)}
    >
      {/* Si l'utilisateur n'est pas connecté, afficher le bouton de connexion */}
      {!isChauffeurConnected && (
        <Link to="/login">
          <div className="bg-black text-white text-lg shadow-lg rounded-lg p-2">
            <p>Connexion</p>
          </div>
        </Link>
      )}

       {/* Bouton de l'espace professionnel */}
       {isChauffeurConnected && chauffeurId && (
        <Link to={`/espace-pro/${chauffeurId}`}>
          <div className="bg-black text-white text-lg shadow-lg rounded-lg p-2">
            <p>Espace Pro</p>
          </div>
        </Link>
      )}

      <Link to="/formulaire">
        <div className="bg-black text-white text-lg shadow-lg rounded-lg p-2">
          <img
            src="/parameter.svg"
            alt="Parametre"
            className="h-8 w-8 lg:h-10 lg:w-10"
          />
        </div>
      </Link>
    </div>
  );
}
