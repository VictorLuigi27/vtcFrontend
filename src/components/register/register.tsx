import { useState } from "react";

export default function Register() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adresse, setAdresse] = useState("");
  const [vehicule, setVehicule] = useState("");
  const [disponibilite, setDisponibilite] = useState(false);
  const [role, setRole] = useState("chauffeur"); // 'chauffeur' ou 'utilisateur'
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Réinitialise les erreurs

    // Validation de base
    if (!nom || !prenom || !email || !password || !adresse || !role) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
        // Requête pour inscrire l'utilisateur (chauffeur ou utilisateur)
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
            vehicule: role === "chauffeur" ? vehicule : undefined,
            disponibilite: role === "chauffeur" ? disponibilite : undefined,
            role,
          }),
        });
      
        const data = await response.json();
      
        if (response.ok) {
          alert(data.message || "Inscription réussie !");
        } else {
          setError(data.message || "Erreur lors de l'inscription.");
        }
      } catch (err: unknown) {  // Définir 'err' comme étant de type 'unknown'
        if (err instanceof Error) {  // Vérification que l'erreur est une instance de 'Error'
          setError(err.message || "Une erreur est survenue. Veuillez réessayer plus tard.");
        } else {
          setError("Une erreur inconnue est survenue.");
        }
      }
      
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Inscription</h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              id="nom"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              id="adresse"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
            />
          </div>

          {role === "chauffeur" && (
            <>
              <div className="mb-4">
                <label htmlFor="vehicule" className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
                <input
                  type="text"
                  id="vehicule"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type de véhicule"
                  value={vehicule}
                  onChange={(e) => setVehicule(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="disponibilite" className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
                <input
                  type="checkbox"
                  id="disponibilite"
                  className="h-4 w-4"
                  checked={disponibilite}
                  onChange={(e) => setDisponibilite(e.target.checked)}
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select
              id="role"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="chauffeur">Chauffeur</option>
              <option value="utilisateur">Utilisateur</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}

