import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Réinitialise les erreurs

    // Validation de base
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
        // Simuler une requête à l'API
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
      
        const data = await response.json();
      
        if (response.ok) {
          // Stocker le token dans le localStorage
          localStorage.setItem("token", data.token);
          alert("Connexion réussie !");
          window.location.href = "/"; // Rediriger vers la page d'accueil
        } else {
          // Gestion des erreurs
          setError(data.message || "Erreur lors de la connexion.");
        }
      } catch (err: unknown) {
        // Vérification si l'erreur est une instance d'Error
        if (err instanceof Error) {
          setError(err.message || "Une erreur est survenue. Veuillez réessayer plus tard.");
        } else {
          setError("Une erreur inconnue est survenue.");
        }
      }
      
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Connexion
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Se connecter
          </button>
        </form>
        <Link to="/register">
            <p className="text-center mt-5 text-blue-600 hover:underline">
                Créer un compte ?
            </p>
        </Link>
      </div>
    </div>
  );
}

  