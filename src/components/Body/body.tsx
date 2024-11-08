import React, { useState } from 'react';
import { Driver } from '../../types';
import { FaPhone, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import ModalEdit from '../modal/modalEdit';
import MapComponent from '../mapComponent';

interface BodyProps {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

const Body: React.FC<BodyProps> = ({ drivers, setDrivers }) => {
  const fakeCoordinates = [
    { lat: 48.8566, lng: 2.3522 }, // Paris centre
    { lat: 48.8666, lng: 2.3332 }, // Nord de Pari
    { lat: 48.8433, lng: 2.3377 }, // Sud de Paris
    { lat: 48.8700, lng: 2.3400 }, // Est de Paris
    { lat: 48.661072, lng: 2.2688259 }  // La ville du bois
  ];

  // Ajout des fausses coordonnées pour chaque chauffeur
  const driversWithCoordinates = drivers.map((driver, index) => {
    const randomCoordinate = fakeCoordinates[index % fakeCoordinates.length]; // Cycle à travers les fausses coordonnées
    return {
      ...driver,
      coordinates: randomCoordinate
    };
  });

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    vehicule: '',
    disponibilite: false,
  });

  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false); 
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null); 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.vehicule) {
      setConfirmationMessage('Tous les champs sont requis.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du chauffeur');
      }

      const addedDriver = await response.json();
      console.log('Chauffeur ajouté:', addedDriver);

      setConfirmationMessage('Chauffeur ajouté avec succès !');

      // Réinitialisation du formulaire
      setTimeout(() => {
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          vehicule: '',
          disponibilite: false,
        });
        setConfirmationMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setConfirmationMessage('Une erreur est survenue.');
    }
  };

  const handleDelete = (driverId: string) => {
    fetch(`http://localhost:3000/api/driver/${driverId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Chauffeur supprimé') {
          console.log('Chauffeur supprimé avec succès:', driverId);

          // Mise à jour de la liste des chauffeurs
          setDrivers(prevDrivers => prevDrivers.filter(driver => driver._id !== driverId));

          setConfirmationMessage('Chauffeur supprimé avec succès!');
        } else {
          console.error('Erreur lors de la suppression:', data);
          setConfirmationMessage('Erreur lors de la suppression.');
        }
      })
      .catch(error => {
        console.error('Erreur de suppression:', error);
        setConfirmationMessage('Une erreur est survenue.');
      });
  };

  const openEditModal = (driver: Driver) => {
    setSelectedDriver(driver); // On sélectionne le chauffeur à modifier
    setOpenModal(true); // On ouvre le modal
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4 md:px-8">
      <h1 className="text-black text-2xl sm:text-3xl font-bold mb-6">Carte et liste des Chauffeurs</h1>

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <ul>
          {drivers.length === 0 ? (
            <p className="text-gray-600">Chargement des chauffeurs...</p>
          ) : (
            drivers.map((driver) => (
              <li className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 border-b border-gray-300 rounded-lg hover:bg-gray-100 transition-all" key={driver._id}>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <h3 className="text-xl font-semibold">{driver.nom} {driver.prenom}</h3>
                  <p className="text-gray-500 flex items-center mt-2 sm:mt-0 sm:ml-4">
                    <FaPhone className="mr-2 text-blue-600" />
                    {driver.telephone}
                  </p>
                </div>
                <div className="flex flex-wrap items-center space-x-4 mt-4 sm:mt-0">
                  <span className={`px-3 py-1 text-xs md:text-sm rounded-full ${driver.disponibilite ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {driver.disponibilite ? 'Disponible' : 'Indisponible'}
                  </span>
                  <button className="text-yellow-600 ml-4 text-xs md:text-base" onClick={() => openEditModal(driver)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-600 ml-4 text-xs md:text-base" onClick={() => handleDelete(driver._id)}>
                    Supprimer
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Google Maps Section */}
      <div className="mt-6 bg-blue-800 p-6 rounded-lg shadow-lg text-white mb-5">
        <div className="flex items-center mb-4">
          <FaMapMarkerAlt className="mr-3 text-2xl" />
          <h2 className="text-xl font-semibold">Google Maps</h2>
        </div>
        <p>Localisation des chauffeurs sur la carte...</p>
      </div>

      {/* Affichage de la carte */}
      <MapComponent drivers={driversWithCoordinates} />
      
      {/* Message de confirmation */}
      {confirmationMessage && (
        <div className="mt-4 w-full max-w-2xl bg-green-500 p-4 rounded-lg text-white text-center">
          <p>{confirmationMessage}</p>
        </div>
      )}

      {/* Formulaire d'ajout des chauffeurs */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mb-4 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Ajouter un chauffeur</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom" className="block text-lg font-medium text-gray-700">Nom</label>
            <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nom" />
          </div>
          <div>
            <label htmlFor="prenom" className="block text-lg font-medium text-gray-700">Prénom</label>
            <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Prénom" />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email" />
          </div>
          <div>
            <label htmlFor="telephone" className="block text-lg font-medium text-gray-700">Téléphone</label>
            <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Téléphone" />
          </div>
          <div>
            <label htmlFor="vehicule" className="block text-lg font-medium text-gray-700">Véhicule</label>
            <input type="text" id="vehicule" name="vehicule" value={formData.vehicule} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Véhicule" />
          </div>
          <div>
            <label htmlFor="disponibilite" className="block text-lg font-medium text-gray-700">Disponibilité</label>
            <select name="disponibilite" id="disponibilite" value={formData.disponibilite.toString()} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="true">Disponible</option>
              <option value="false">Indisponible</option>
            </select>
          </div>
          <button type="submit" className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg mt-4 hover:bg-blue-700">Ajouter</button>
        </form>
      </div>

      {/* Modal pour modification */}
      {openModal && selectedDriver && (
        <ModalEdit
          driver={selectedDriver}
          setOpenModal={setOpenModal}
          setDrivers={setDrivers}
        />
      )}
    </div>
  );
};

export default Body;

