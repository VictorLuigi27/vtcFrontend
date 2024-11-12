import React, { useEffect } from 'react';
import googleMapsLoader from '../utils/googleMapsLoader';

interface Driver {
  _id: string;
  nom: string;
  prenom: string;
  latitude: number;
  longitude: number;
  disponibilite: boolean;
}

const DriverMap: React.FC<{ drivers: Driver[] }> = ({ drivers }) => {

  useEffect(() => {
    const loadGoogleMaps = async () => {
      const google = await googleMapsLoader();
      const mapInstance = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 12,
      });
      console.log('Carte initialisée');

      // Ajouter les marqueurs des chauffeurs avec AdvancedMarkerElement
      drivers.forEach(driver => {
        if (driver.disponibilite) {
          new google.maps.marker.AdvancedMarkerElement({
            position: { lat: driver.latitude, lng: driver.longitude },
            map: mapInstance,
            title: `${driver.nom} ${driver.prenom}`,
          });
        }
      });
    };

    loadGoogleMaps();
  }, [drivers]);

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default DriverMap;

