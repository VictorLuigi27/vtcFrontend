import React, { useState } from "react";

// Ajoute un type pour les props, incluant chauffeurId
interface ModalCourseProps {
  onClose: () => void;
  chauffeurId: string; // Propriété chauffeurId
}

export default function ModalCourse({ onClose, chauffeurId }: ModalCourseProps) {
  const [destination, setDestination] = useState("");
  const [montant, setMontant] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!destination || !montant) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    const courseData = {
      destination,
      montant: parseFloat(montant),
      chauffeurId,
    };

    try {
      const response = await fetch("http://localhost:3000/api/driver/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la course.");
      }

      const newCourse = await response.json();
      setSuccess("Course ajoutée avec succès !");
      console.log("Course ajoutée:", newCourse);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue est survenue.");
      }
      console.error("Erreur:", error);
    }
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
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="montant" className="block text-sm font-medium text-gray-700">Montant</label>
            <input
              type="number"
              id="montant"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">Annuler</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}

