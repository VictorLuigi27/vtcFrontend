// API GOOGLE MAP 

let googleMapsPromise: Promise<typeof google>;

const googleMapsLoader = (): Promise<typeof google> => {
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAg-qy7MCkYt70qKH2dIiHV79CbrlGJNE8`;
      script.async = true;
      script.onload = () => {
        resolve(window.google);
        console.log(window.google);
      };
      document.head.appendChild(script);
    });
  }
  return googleMapsPromise;
};

export default googleMapsLoader;
