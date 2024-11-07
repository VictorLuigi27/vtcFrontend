import { BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Body from './components/Body/body';
import { useState, useEffect } from 'react';
import { Driver } from './types';

function App() {
  const [drivers, setDrivers] = useState<Driver[]>([]);  // Utilisation du type Driver pour l'état

  useEffect(() => {
    fetch('http://localhost:3000/api/driver')
      .then(response => response.json())
      .then((data: Driver[]) => setDrivers(data))  
      .catch(error => console.error('Erreur:', error));
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <Body drivers={drivers} />

        <Routes>
          {/* Routes ici pour plus tard */}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
