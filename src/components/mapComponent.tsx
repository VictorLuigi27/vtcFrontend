import React, { useEffect, useRef } from 'react';
import googleMapsLoader from '../utils/googleMapsLoader'; // Charge la fonction pour charger l'API

interface Driver {
  _id: string;
  nom: string;
  prenom: string;
  telephone: string;
  vehicule: string;
  latitude: number;
  longitude: number;
  disponibilite: boolean;
  adresse: string;
}

const MapComponent: React.FC<{ drivers: Driver[] }> = ({ drivers }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      const google = await googleMapsLoader(); // Charger l'API Google Maps
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 12,
      });

      drivers.forEach(driver => {
        if (driver.disponibilite) {
          // Vérifier que la latitude et la longitude sont des nombres valides
          const lat = driver.latitude;
          const lng = driver.longitude;
    
          // Si la latitude ou la longitude sont invalides, ne pas créer le marqueur
          if (isNaN(lat) || isNaN(lng)) {
            console.error(`Coordonnées invalides pour le chauffeur ${driver.nom}: ${driver.latitude}, ${driver.longitude}`);
            return;
          }
    
          const position = new google.maps.LatLng(lat, lng); // Créer un LatLng valide

          // Crée un nouvel AdvancedMarkerElement pour chaque chauffeur
          const markerElement = document.createElement('div');
          markerElement.style.width = '60px';
          markerElement.style.height = '60px';
          markerElement.style.backgroundImage = 'url(https://www.svgrepo.com/svg/283135/maps-and-flags-pin)';
          markerElement.style.backgroundSize = 'cover';
          markerElement.style.borderRadius = '50%';

          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: position,  // Utilise un objet LatLng valide
            map,
            content: markerElement,
          });

          // Fenêtre d'information
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3>${driver.nom} ${driver.prenom}</h3>
                <p><strong>Téléphone:</strong> ${driver.telephone}</p>
                <p><strong>Adresse:</strong> ${driver.adresse}</p>
                <p><strong>Véhicule:</strong> ${driver.vehicule}</p>
                <p><strong>Disponibilité:</strong> ${driver.disponibilite ? 'Disponible' : 'Indisponible'}</p>
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
      });
    };

    loadGoogleMaps(); // Initialiser la carte et les marqueurs
  }, [drivers]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};

export default MapComponent;

