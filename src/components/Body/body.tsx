import React, { useState } from 'react';
import { Driver } from '../../types';  // On importe la fiche d'identité du chauffeur
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // Icones pour améliorer l'affichage

interface BodyProps {
  drivers: Driver[];
}

const Body: React.FC<BodyProps> = ({ drivers }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    vehicule: '',
    disponibilite: false,
  });

  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // On peut ajouter le chauffeur
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
  
      // Réinitialise le formulaire
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
  
  

  return (
    <div className="flex flex-col items-center mt-10 px-4 md:px-8">
      <h1 className="text-black text-3xl font-bold mb-6">Carte et liste des Chauffeurs</h1>

      {/* Afficher la liste des chauffeurs */}
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <ul>
            {drivers && drivers.length === 0 ? (
              // Je met un chargement pour voir si les données se charge ou si il y a pas de données
              <p className="text-gray-600">Chargement des chauffeurs...</p>
            ) : (
              // Ensuite je les affiches
              drivers.length > 0 ? (
                drivers.map((driver) => (
                  <li 
                    className="flex justify-between items-center mb-4 p-4 border-b border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                    key={driver._id}
                  >
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold">{driver.nom} {driver.prenom}</h3>
                      <p className="text-gray-500 flex items-center">
                        <FaPhone className="mr-2 text-blue-600" />
                        {driver.telephone}
                      </p>
                    </div>
                    <div>
                      <span 
                        className={`px-3 py-1 text-sm rounded-full ${driver.disponibilite ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                      >
                        {driver.disponibilite ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                // Et si aucun chauffeur n'est trouvé
                <p className="text-gray-600">Aucun chauffeur trouvé.</p>
              )
            )}
          </ul>
        </div>


      {/* Google Map */}
      <div className="mt-6 w-full max-w-4xl bg-blue-800 p-6 rounded-lg shadow-lg text-white mb-5">
      <div className="flex items-center mb-4">
        <FaMapMarkerAlt className="mr-3 text-2xl" />
        <h2 className="text-xl font-semibold">Google Maps</h2>
      </div>
      <p>Localisation des chauffeurs sur la carte...</p>
      </div>

      {/* Message de confirmation */}
      {confirmationMessage && (
        <div className="mt-4 w-full max-w-4xl bg-green-500 p-4 rounded-lg text-white text-center">
          <p>{confirmationMessage}</p>
        </div>
      )}

      {/* Formulaire d'ajouts des chauffeurs */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Ajouter un chauffeur</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label htmlFor="nom" className="block text-lg font-medium text-gray-700">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom"
            />
          </div>

          {/* Prénom */}
          <div>
            <label htmlFor="prenom" className="block text-lg font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Prénom"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="telephone" className="block text-lg font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Téléphone"
            />
          </div>

          {/* Véhicule */}
          <div>
            <label htmlFor="vehicule" className="block text-lg font-medium text-gray-700">Véhicule</label>
            <input
              type="text"
              id="vehicule"
              name="vehicule"
              value={formData.vehicule}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Véhicule"
            />
          </div>

          {/* Disponibilité */}
          <div>
            <label htmlFor="disponibilite" className="block text-lg font-medium text-gray-700">Disponibilité</label>
            <select
              id="disponibilite"
              name="disponibilite"
              value={formData.disponibilite ? 'true' : 'false'}
              onChange={(e) => setFormData({
                ...formData,
                disponibilite: e.target.value === 'true'
              })}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Disponible</option>
              <option value="false">Indisponible</option>
            </select>
          </div>

          {/* Bouton d'envoie des données' */}
          <div>
            <button type="submit" className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none">
              Ajouter le chauffeur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Body;