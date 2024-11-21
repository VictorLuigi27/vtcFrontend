import React, { useState } from "react";

export default function ModalCourse() {
  // États locaux pour les champs du formulaire
  const [destination, setDestination] = useState("");
  const [montant, setMontant] = useState("");

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajoute ici la logique pour soumettre les données
    console.log("Course ajoutée:", { destination, montant });
    // Réinitialise les champs après la soumission
    setDestination("");
    setMontant("");
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Ajouter une course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="montant" className="block text-sm font-medium text-gray-700">Montant</label>
            <input
              type="number"
              id="montant"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajouter la course
          </button>
        </form>
      </div>
    </div>
  );
}
