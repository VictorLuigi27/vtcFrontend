// API GOOGLE MAP 

let googleMapsPromise: Promise<typeof google>;

const googleMapsLoader = (): Promise<typeof google> => {
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAg-qy7MCkYt70qKH2dIiHV79CbrlGJNE8&v=3.46&libraries=places,geometry,marker`;
      script.async = true;
      script.onload = () => {
        resolve(window.google);
      };
      script.onerror = (e) => {
        console.error("Erreur lors du chargement de l'API Google Maps:", e);
      };
      document.head.appendChild(script);
    });
  }
  return googleMapsPromise;
};

export default googleMapsLoader;