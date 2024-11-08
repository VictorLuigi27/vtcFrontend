import React, { useEffect, useRef } from 'react';
import googleMapsLoader from '../utils/googleMapsLoader';
import { Driver } from '../types';

interface MapComponentProps {
  drivers: Driver[];
}

const MapComponent: React.FC<MapComponentProps> = ({ drivers }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Charge l'API Google Maps
        const google = await googleMapsLoader();

        // Initialisation de la carte
        const map = new google.maps.Map(mapRef.current!, {
          center: { lat: 48.8566, lng: 2.3522 }, // Coordonnées de Paris
          zoom: 10,
        });

        // Ajout des marqueurs pour les chauffeurs
        drivers.forEach((driver) => {
          if (driver.latitude && driver.longitude) {
            // Personnalisation de l'icône du marqueur
            const markerIcon = {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Exemple : icône de marqueur personnalisé (tu peux changer ça)
              scaledSize: new google.maps.Size(32, 32), // Taille du marqueur
            };

            // Création du marqueur avec AdvancedMarkerElement
            const marker = new google.maps.marker.AdvancedMarkerElement({
              position: { lat: driver.latitude, lng: driver.longitude },
              map,
              title: `${driver.nom} ${driver.prenom}`,
              icon: markerIcon, 
            });

            // Ajout d'une infobulle (InfoWindow) pour afficher des infos sur le chauffeur
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div>
                  <h3>${driver.nom} ${driver.prenom}</h3>
                  <p><strong>Téléphone:</strong> ${driver.telephone}</p>
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
      } catch (error) {
        console.error("Erreur lors du chargement de la carte Google Maps :", error);
      }
    };

    initializeMap();
  }, [drivers]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};

export default MapComponent;



