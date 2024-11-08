// Marqueurs des chauffeurs

import React, { useEffect, useState } from 'react';
import googleMapsLoader from '../utils/googleMapsLoader'; // Import du loader Google Maps

interface Driver {
  _id: string;
  nom: string;
  prenom: string;
  latitude: number;
  longitude: number;
  disponibilite: boolean;
}

const DriverMap: React.FC<{ drivers: Driver[] }> = ({ drivers }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      const google = await googleMapsLoader();
      const mapInstance = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 48.8566, lng: 2.3522 }, // Centrer la carte sur Paris
        zoom: 12,
      });
      setMap(mapInstance);
      addMarkers(mapInstance);
    };

    loadGoogleMaps();
  }, []);

  const addMarkers = (mapInstance: google.maps.Map) => {
    drivers.forEach(driver => {
      if (driver.disponibilite) {
        new google.maps.Marker({
          position: { lat: driver.latitude, lng: driver.longitude },
          map: mapInstance,
          title: `${driver.nom} ${driver.prenom}`,
        });
      }
    });
  };

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default DriverMap;
