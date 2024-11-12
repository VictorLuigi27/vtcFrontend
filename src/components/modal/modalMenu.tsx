import { Link } from "react-router-dom";

interface ModalMenuProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

export default function ModalMenu({openModal, setOpenModal}: ModalMenuProps) {
    if(!openModal) return null;

  return (
    <div 
    className="bg-neutral-900 p-2 flex flex-col items-center mt-4 py-3 space-y-5" 
    onClick={() => setOpenModal(false)}>
        
        {/* Bouton de connexion */}
        <div className="bg-black text-white text-lg shadow-lg rounded-lg p-2">
            <p>Connexion</p>
        </div>

        {/* Bouton de l'espace profesionnel */}
        <div className="bg-black text-white text-lg shadow-lg rounded-lg p-2">
            <p>Espace Pro</p>
        </div>

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
  )
}