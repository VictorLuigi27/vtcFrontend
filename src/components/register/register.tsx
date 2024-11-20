import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [vehicule, setVehicule] = useState("");
  const [disponibilite, setDisponibilite] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Réinitialise les erreurs

    console.log("Données soumises:", {
      nom,
      prenom,
      email,
      password,
      adresse,
      telephone,
      vehicule,
      disponibilite,
    });

    console.log(disponibilite); // Vérifiez la valeur de disponibilite

    // Validation des champs
    if (!nom || !prenom || !email || !password || !adresse || !telephone || !vehicule || disponibilite === undefined) {
      setError("Tous les champs sont obligatoires.");
      console.log("Erreur: tous les champs doivent être remplis.");
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email invalide.");
      console.log("Erreur: email invalide.");
      return;
    }

    // Validation du mot de passe
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      console.log("Erreur: mot de passe trop court.");
      return;
    }

    try {
        // Afficher les données envoyées avant de faire la requête
        console.log({
          nom,
          prenom,
          email,
          password,
          adresse,
          telephone,
          vehicule,
          disponibilite,
        });
      
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom,
            prenom,
            email,
            password,
            adresse,
            telephone,
            vehicule,
            disponibilite,
          }),
        });
      
        console.log("Réponse du serveur:", response);
      
        if (!response.ok) {
          const data = await response.json();
          setError(data.message || "Erreur lors de l'inscription.");
          console.log("Erreur du backend:", data.message);
        } else {
          alert(`Chauffeur inscrit avec succès !`);
          navigate("/login");
        }
      } catch (err) {
        console.log("Erreur lors de la requête:", err);
        setError("Une erreur est survenue. Veuillez réessayer plus tard.");
      }
      
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Inscription Chauffeur</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Formulaire */}
          <div className="mb-4">
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              id="nom"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Votre nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              id="prenom"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Votre prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {passwordVisible ? "Cacher" : "Afficher"}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              id="telephone"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Votre numéro de téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              id="adresse"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Votre adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="voiture" className="block text-sm font-medium text-gray-700 mb-1">Voiture</label>
            <input
              type="text"
              id="voiture"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Modèle de voiture"
              value={vehicule}
              onChange={(e) => setVehicule(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="disponibilite" className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
            <input
              type="checkbox"
              id="disponibilite"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              checked={disponibilite}
              onChange={() => setDisponibilite(!disponibilite)}
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}