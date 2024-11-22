import React, { useState, useEffect } from "react";

// Ajoute un type pour les props, incluant chauffeurId
interface ModalCourseProps {
  onClose: () => void;
  chauffeurId: string; // Propriété chauffeurId
}

interface Course {
  _id: string;
  destination: string;
  montant: number;
}

export default function ModalCourse({ onClose, chauffeurId }: ModalCourseProps) {
  const [destination, setDestination] = useState("");
  const [montant, setMontant] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  // Récupérer les courses du chauffeur lors du chargement du composant
  // Récupérer les courses du chauffeur lors du chargement du composant
useEffect(() => {
  const fetchCourses = async () => {
    try {
      // Récupérer le token depuis localStorage ou autre
      const token = localStorage.getItem("token");

      // Vérifie si le token est présent
      if (!token) {
        console.log("Token d'authentification manquant.");
        setError("Token d'authentification manquant.");
        return;
      }

      console.log("Token envoyé:", token);  // Log du token envoyé dans la requête

      const response = await fetch("http://localhost:3000/api/driver/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Envoi du token dans l'en-tête
        },
      });

      if (!response.ok) {
        console.log("Réponse non OK:", response.status);  // Log du status de la réponse
        throw new Error("Erreur lors de la récupération des courses.");
      }

      const data = await response.json();
      console.log("Data reçue:", data);  // Log des données reçues
      setCourses(data); // Stocke les courses récupérées
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur:", error.message);  // Log de l'erreur
        setError(error.message);
      } else {
        console.error("Erreur inconnue.");  // Log d'une erreur inconnue
        setError("Une erreur inconnue est survenue.");
      }
    }
  };

  fetchCourses();
}, []);


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
      chauffeurId,  // Utilise chauffeurId pour associer la course au chauffeur
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
      setCourses([...courses, newCourse]); // Ajouter la nouvelle course à la liste
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

  const handleDelete = (courseId: string) => {
    // Récupérer le token (assurer qu'il est stocké dans un endroit comme localStorage ou un contexte global)
    const token = localStorage.getItem('token'); // Ou d'autres sources selon où tu stockes ton token
  
    // Vérifier que le token existe
    if (!token) {
      console.error('Token manquant');
      return;
    }
  
    fetch(`http://localhost:3000/api/driver/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Course supprimée') {
          setCourses((prevCourses) => prevCourses.filter(course => course._id !== courseId));
        } else {
          console.error('Erreur lors de la suppression.', data.message);
        }
      })
      .catch(() => {
        console.error('Une erreur est survenue.');
      });
  };
  
  
  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Fermer la modal si on clique à l'extérieur de celle-ci
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleCloseModal} // Ajoute cet événement pour fermer la modal
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Ajouter une Course</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="destination" className="block text-lg font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez la destination"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="montant" className="block text-lg font-medium text-gray-700 mb-2">
              Montant (€)
            </label>
            <input
              type="number"
              id="montant"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Montant de la course"
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="font-semibold text-xl text-gray-800 mb-4">Mes Courses</h3>
          <div className="grid grid-cols-1 gap-6">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div key={index} className="border p-6 rounded-lg shadow-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">{course.destination}</span>
                    <span className="text-lg font-semibold text-blue-600">{course.montant}€</span>
                    <button
                      onClick={() => handleDelete(course._id)} // Appeler la fonction de suppression
                      className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Aucune course trouvée.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

}
