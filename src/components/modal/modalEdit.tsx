import React, { useState, useEffect } from 'react';
import { Driver } from '../../types';

interface ModalEditProps {
  driver: Driver;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

const ModalEdit: React.FC<ModalEditProps> = ({ driver, setOpenModal, setDrivers }) => {
  const [formData, setFormData] = useState(driver);
  const [succesMessage, setSuccesMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormData(driver);
  }, [driver]);

  const formatPhoneNumber = (input: string) => {
    // Mettre des epaces tous les 2 chiffres
    return input.replace(/\s/g, '').replace(/(\d{2})(?=\d)/g, '$1 ');
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: name === 'telephone' ? formatPhoneNumber(value) : value
    }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/driver/${driver._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du chauffeur');
      }
  
      const updatedDriver = await response.json();
      console.log('Chauffeur mis à jour:', updatedDriver);
  
      // Affichage du message de succès
      setSuccesMessage('Chauffeur modifié avec succès !');
  
      // Mise à jour du state des chauffeurs après modification
      setDrivers(prevDrivers =>
        prevDrivers.map(d => (d._id === driver._id ? updatedDriver : d))
      );
  
      // Attendre un délai avant de fermer la modal
      setTimeout(() => {
        setOpenModal(false);  // Ferme la modal après un délai
      }, 2000); // 2 secondes de délai pour permettre la visibilité du message
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={() => setOpenModal(false)}>
      {/* Message de succès */}
      {succesMessage && (
        <div className="absolute top-4 w-full max-w-2xl bg-green-500 p-4 rounded-lg text-white text-center">
          <p>{succesMessage}</p>
        </div>
      )}
  
      {/* Modal */}
      <div className="bg-neutral-900 p-6 flex flex-col items-center space-y-5 w-full rounded-xl sm:max-w-lg md:max-w-xl lg:max-w-2xl lg:rounded-xl" onClick={e => e.stopPropagation()}>
        <div className="absolute top-2 right-2 text-white cursor-pointer" onClick={() => setOpenModal(false)}>
          &times;
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label htmlFor="nom" className="block text-lg font-medium text-gray-700">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="prenom" className="block text-lg font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="telephone" className="block text-lg font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="adresse" className="block text-lg font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="vehicule" className="block text-lg font-medium text-gray-700">Véhicule</label>
            <input
              type="text"
              id="vehicule"
              name="vehicule"
              value={formData.vehicule}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="disponibilite" className="block text-lg font-medium text-gray-700">Disponibilité</label>
            <select
              id="disponibilite"
              name="disponibilite"
              value={formData.disponibilite ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, disponibilite: e.target.value === 'true' })}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Disponible</option>
              <option value="false">Indisponible</option>
            </select>
          </div>
          <button type="submit" className="w-full p-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default ModalEdit;