import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Body from './components/Body/body';
import { useState, useEffect } from 'react';
import { Driver,  DriversResponse} from './types';
import LegalMentions from './components/mentions/mentions';
import Formulaire from './components/driverForm/formulaire';
import Login from './components/login/login';
import Register from './components/register/register';

function App() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/driver?limit=0')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur de récupération des chauffeurs');
        }
        return response.json();
      })
      .then((data: DriversResponse) => {
        console.log('Chauffeurs récupérés:', data);
        setDrivers(data.drivers);
        
      })
      .catch(error => console.error('Erreur:', error));
  }, []);

  console.log("Nombre de chauffeurs dans Body:", drivers.length);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Définition des Routes */}
        <Routes>
        <Route path="/" element={<Body drivers={drivers} setDrivers={setDrivers} />} />
          <Route path="/mentionslegales" element={<LegalMentions />} />
          <Route path="/formulaire" element={<Formulaire />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        {/* Le Footer reste toujours visible */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
