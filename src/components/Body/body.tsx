import { useState } from 'react';
import { Driver } from '../../types';
import { FaPhone, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import ModalEdit from '../modal/modalEdit';
import MapComponent from '../mapComponent';

interface BodyProps {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

const Body: React.FC<BodyProps> = ({ drivers, setDrivers }) => {
  const [activeTab, setActiveTab] = useState<'drivers' | 'map'>('drivers');
  const [openModal, setOpenModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all'); // Filtre de disponibilité

  // Filtrage des chauffeurs en fonction de la disponibilité
  const filteredDrivers = drivers.filter(driver => {
    if (filter === 'available') {
      return driver.disponibilite;
    } else if (filter === 'unavailable') {
      return !driver.disponibilite;
    }
    return true; // Retourner tous les chauffeurs si aucun filtre n'est appliqué
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 10;

  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const currentDrivers = filteredDrivers.slice(
    (currentPage - 1) * driversPerPage, 
    currentPage * driversPerPage
  );

  const handleDelete = (driverId: string) => {
    fetch(`http://localhost:3000/api/driver/${driverId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Chauffeur supprimé') {
          setDrivers(prevDrivers => prevDrivers.filter(driver => driver._id !== driverId));
        } else {
          console.error('Erreur lors de la suppression.');
        }
      })
      .catch(() => console.error('Une erreur est survenue.'));
  };

  const openEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setOpenModal(true);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4 md:px-8">
      <h1 className="text-black text-2xl sm:text-3xl font-bold mb-6">Gestion des Chauffeurs</h1>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('drivers')} className={`p-2 rounded ${activeTab === 'drivers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
          Chauffeurs
        </button>
        <button onClick={() => setActiveTab('map')} className={`p-2 rounded ${activeTab === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
          Carte
        </button>
      </div>

      {activeTab === 'drivers' && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mb-6">
          {/* Filtre déroulant */}
          <div className="mb-4">
            <label htmlFor="filter" className="mr-2">Filtrer par disponibilité:</label>
            <select 
              id="filter" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as 'all' | 'available' | 'unavailable')} 
              className="p-2 border border-gray-300 rounded"
            >
              <option value="all">Tous</option>
              <option value="available">Disponibles</option>
              <option value="unavailable">Indisponibles</option>
            </select>
          </div>

          {/* Liste des chauffeurs */}
          <ul>
            {currentDrivers.length === 0 ? (
              <p className="text-gray-600">Aucun chauffeur à afficher...</p>
            ) : (
              currentDrivers.map((driver) => (
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

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
              Précédent
            </button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
              Suivant
            </button>
          </div>
        </div>
      )}

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

      {openModal && selectedDriver && <ModalEdit driver={selectedDriver} setOpenModal={setOpenModal} setDrivers={setDrivers} />}
    </div>
  );
};

export default Body;
