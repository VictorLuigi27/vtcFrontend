// API GOOGLE MAP 

let googleMapsPromise: Promise<typeof google>;
const googleMapsLoader = (): Promise<typeof google> => {
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // Utilisez la dernière version disponible sans spécifier le paramètre 'v'
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAg-qy7MCkYt70qKH2dIiHV79CbrlGJNE8&libraries=places,geometry,marker`;
      script.async = true;
      script.onload = () => resolve(window.google);
      script.onerror = (e) => reject(new Error("Erreur lors du chargement de l'API Google Maps: " + e));
      document.head.appendChild(script);
    });
  }
  return googleMapsPromise;
};


export default googleMapsLoader;