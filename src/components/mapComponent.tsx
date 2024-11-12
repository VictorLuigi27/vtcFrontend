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
        const google = await googleMapsLoader();

        const map = new google.maps.Map(mapRef.current!, {
          center: { lat: 48.8566, lng: 2.3522 },
          zoom: 10,
        });

        drivers.forEach((driver) => {
          if (driver.latitude && driver.longitude) {
            
            const markerElement = document.createElement('div');
            markerElement.style.width = '60px';
            markerElement.style.height = '60px';
            markerElement.style.backgroundImage = 'url(https://www.svgrepo.com/svg/283135/maps-and-flags-pin)';
            markerElement.style.backgroundSize = 'cover';
            markerElement.style.borderRadius = '50%';

            const marker = new google.maps.marker.AdvancedMarkerElement({
              position: { lat: driver.latitude, lng: driver.longitude },
              map,
              content: markerElement, 
            });

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
        console.error('Erreur lors du chargement de la carte Google Maps :', error);
      }
    };

    initializeMap();
  }, [drivers]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};

export default MapComponent;



