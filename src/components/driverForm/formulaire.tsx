import { useState } from 'react';

export default function Formulaire() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        vehicule: '',
        disponibilite: false,
        adresse: '',
    });
    
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.vehicule) {
            setConfirmationMessage('Tous les champs sont requis.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/driver', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Erreur lors de l\'ajout du chauffeur');

            const addedDriver = await response.json();
            console.log('Chauffeur ajouté:', addedDriver);

            setConfirmationMessage('Chauffeur ajouté avec succès !');
            setFormData({ nom: '', prenom: '', email: '', telephone: '', vehicule: '', disponibilite: false, adresse: '' });
            setTimeout(() => setConfirmationMessage(null), 3000);
        } catch (error) {
            console.error('Erreur:', error);
            setConfirmationMessage('Une erreur est survenue.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mb-4 mt-6">
                <h2 className="text-2xl font-semibold mb-4">Ajouter un chauffeur</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nom" className="block text-lg font-medium text-gray-700">Nom</label>
                        <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Nom" />
                    </div>
                    <div>
                        <label htmlFor="prenom" className="block text-lg font-medium text-gray-700">Prénom</label>
                        <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Prénom" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Email" />
                    </div>
                    <div>
                        <label htmlFor="telephone" className="block text-lg font-medium text-gray-700">Téléphone</label>
                        <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Téléphone" />
                    </div>
                    <div>
                        <label htmlFor="adresse" className="block text-lg font-medium text-gray-700">Adresse</label>
                        <input type="text" id="adresse" name="adresse" value={formData.adresse} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Adresse" />
                    </div>
                    <div>
                        <label htmlFor="vehicule" className="block text-lg font-medium text-gray-700">Véhicule</label>
                        <input type="text" id="vehicule" name="vehicule" value={formData.vehicule} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" placeholder="Véhicule" />
                    </div>
                    <div>
                        <label htmlFor="disponibilite" className="block text-lg font-medium text-gray-700">Disponibilité</label>
                        <select id="disponibilite" name="disponibilite" value={String(formData.disponibilite)} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg">
                            <option value="true">Disponible</option>
                            <option value="false">Indisponible</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full p-3 mt-4 bg-blue-600 text-white rounded-lg">Ajouter Chauffeur</button>
                </form>
                {confirmationMessage && <p className="text-center mt-4 text-green-600">{confirmationMessage}</p>}
            </div>
        </div>
    );
}
