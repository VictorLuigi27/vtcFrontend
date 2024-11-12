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

      const geocodeAddress = async (adresse: string) => {
        const geocoder = new google.maps.Geocoder();
        return new Promise<google.maps.LatLng | null>((resolve, reject) => {
          geocoder.geocode({ address: adresse }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              const lat = results[0].geometry.location.lat();
              const lng = results[0].geometry.location.lng();
              resolve(new google.maps.LatLng(lat, lng)); // Utilisation des propriétés lat et lng
            } else {
              console.error(`Erreur de géocodage pour l'adresse : ${adresse} (Statut : ${status})`);
              reject(`Erreur de géocodage pour ${adresse}`);
            }
          });
        });
      };

      for (const driver of drivers) {
        if (driver.disponibilite) {
          try {
            const position = await geocodeAddress(driver.adresse);
            if (!position) return;

            const marker = new google.maps.Marker({
              position: position,
              map: map,
              icon: {
                url: 'https://www.svgrepo.com/svg/283135/maps-and-flags-pin',
                size: new google.maps.Size(60, 60),
                scaledSize: new google.maps.Size(60, 60),
              },
            });

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
          } catch {
            console.error(`Impossible de géocoder l'adresse pour le chauffeur ${driver.nom}: ${driver.adresse}`);
          }
        }
      }
    };

    loadGoogleMaps(); // Initialiser la carte et les marqueurs
  }, [drivers]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};

export default MapComponent;
