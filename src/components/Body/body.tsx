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
  const [activeTab, setActiveTab] = useState<'drivers' | 'map' | 'add'>('drivers'); 

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    vehicule: '',
    disponibilite: false,
    adresse: '',
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
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.vehicule) {
      setConfirmationMessage('Tous les champs sont requis.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout du chauffeur');

      const addedDriver = await response.json();
      console.log('Chauffeur ajouté:', addedDriver);

      setConfirmationMessage('Chauffeur ajouté avec succès !');
      setFormData({ nom: '', prenom: '', email: '', telephone: '', vehicule: '', disponibilite: false, adresse: ''});
      setTimeout(() => setConfirmationMessage(null), 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setConfirmationMessage('Une erreur est survenue.');
    }
  };

  const handleDelete = (driverId: string) => {
    fetch(`http://localhost:3000/api/driver/${driverId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Chauffeur supprimé') {
          setDrivers(prevDrivers => prevDrivers.filter(driver => driver._id !== driverId));
          setConfirmationMessage('Chauffeur supprimé avec succès!');
        } else {
          setConfirmationMessage('Erreur lors de la suppression.');
        }
      })
      .catch(() => setConfirmationMessage('Une erreur est survenue.'));
  };

  const openEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setOpenModal(true);
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4 md:px-8">
      <h1 className="text-black text-2xl sm:text-3xl font-bold mb-6">Gestion des Chauffeurs</h1>

      {/* Barre de navigation secondaire */}
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('drivers')} className={`p-2 rounded ${activeTab === 'drivers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
          Chauffeurs Disponibles
        </button>
        <button onClick={() => setActiveTab('map')} className={`p-2 rounded ${activeTab === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
          Carte
        </button>
        <button onClick={() => setActiveTab('add')} className={`p-2 rounded ${activeTab === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
          Ajouter un Chauffeur
        </button>
      </div>

      {/* Section Chauffeurs Disponibles */}
      {activeTab === 'drivers' && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
          <ul>
            {drivers.length === 0 ? (
              <p className="text-gray-600">Chargement des chauffeurs...</p>
            ) : (
              drivers.map((driver) => (
                <li key={driver._id} className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 border-b border-gray-300 rounded-lg hover:bg-gray-100 transition-all">
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
      )}

     {/* Section Carte */}
      {activeTab === 'map' && (
        <div className="mt-6 w-full h-[600px] bg-blue-800 p-6 rounded-lg shadow-lg text-white mb-5">
          <div className="flex items-center mb-4">
            <FaMapMarkerAlt className="mr-3 text-2xl" />
            <h2 className="text-xl font-semibold">Google Maps</h2>
          </div>
          <div className="h-full w-full rounded-lg overflow-hidden">
            <MapComponent drivers={drivers} />
          </div>
        </div>
      )}

      {/* Section Ajouter un Chauffeur */}
      {activeTab === 'add' && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mb-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Ajouter un chauffeur</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-lg font-medium text-gray-700">Nom</label>
              <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Nom" />
            </div>
            <div>
              <label htmlFor="prenom" className="block text-lg font-medium text-gray-700">Prénom</label>
              <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Prénom" />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Email" />
            </div>
            <div>
              <label htmlFor="telephone" className="block text-lg font-medium text-gray-700">Téléphone</label>
              <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Téléphone" />
            </div>
            <div>
              <label htmlFor="adresse" className="block text-lg font-medium text-gray-700">Adresse</label>
              <input type="text" id="adresse" name="adresse" value={formData.adresse} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Adresse" />
            </div>
            <div>
              <label htmlFor="vehicule" className="block text-lg font-medium text-gray-700">Véhicule</label>
              <input type="text" id="vehicule" name="vehicule" value={formData.vehicule} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Véhicule" />
            </div>
            <div>
              <label htmlFor="disponibilite" className="block text-lg font-medium text-gray-700">Disponibilité</label>
              <select id="disponibilite" name="disponibilite" value={String(formData.disponibilite)} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg">
                <option value="true">Disponible</option>
                <option value="false">Indisponible</option>
              </select>
            </div>
            <button type="submit" className="w-full p-3 mt-4 bg-blue-600 text-white rounded-lg">Ajouter Chauffeur</button>
          </form>
          {confirmationMessage && <p className="text-center mt-4 text-green-600">{confirmationMessage}</p>}
        </div>
      )}

      {openModal && selectedDriver && <ModalEdit driver={selectedDriver} setOpenModal={setOpenModal} setDrivers={setDrivers} />}
    </div>
  );
};

export default Body;