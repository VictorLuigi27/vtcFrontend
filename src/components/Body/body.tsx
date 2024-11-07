import React from 'react';
import { Driver } from '../../types';  // On importe la fiche d'identité du chauffeur

interface BodyProps {
  drivers: Driver[];
}

const Body: React.FC<BodyProps> = ({ drivers }) => {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className='text-black text-2xl lg:text-3xl'>Carte des Chauffeurs</h1>
      <ul>
        {drivers.length > 0 ? (
          drivers.map(driver => (
            <li 
            className='text-black text-lg'
            key={driver._id}>
              {driver.nom} {driver.prenom} - {driver.telephone}
            </li>
          ))
        ) : (
          <p>Aucun chauffeur trouvé.</p>
        )}
      </ul>
    </div>
  );
}

export default Body;