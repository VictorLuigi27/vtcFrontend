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
        center: { lat: 48.866667, lng: 2.333333 },
        zoom: 12,
        mapId: '874020db26c1c05a',
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

            // Utilisation de l'AdvancedMarkerElement avec une image personnalisée
            const marker = new google.maps.marker.AdvancedMarkerElement({
              position: position,
              map: map,
              content: (() => {
                const div = document.createElement('div');
                div.style.width = '30px';
                div.style.height = '60px';
                div.style.backgroundImage = "url('/marker-maps.svg')";
                div.style.backgroundSize = 'contain';
                div.style.backgroundPosition = 'center';
                div.style.backgroundRepeat = 'no-repeat';
                return div;
              })(),
            });

            // Créer l'InfoWindow pour chaque conducteur
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="color: black; font-size: 18px; line-height: 1.5; padding: 10px;">
                  <h3>${driver.nom} ${driver.prenom}</h3>
                  <p><strong>Téléphone:</strong> ${driver.telephone}</p>
                  <p><strong>Adresse:</strong> ${driver.adresse}</p>
                  <p><strong>Véhicule:</strong> ${driver.vehicule}</p>
                  <p><strong>Disponibilité:</strong> ${driver.disponibilite ? 'Disponible' : 'Indisponible'}</p>
                </div>
              `,
            });

            // Utiliser google.maps.event.addListener pour l'événement de clic
            marker.addListener('click', () => {
              // Ouvrir l'infoWindow au clic
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

