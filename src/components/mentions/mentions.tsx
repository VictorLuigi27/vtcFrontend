// Pour tester

export default function LegalMentions() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Mentions Légales</h1>

        <section className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Éditeur du site</h2>
          <p className="text-sm text-gray-600">
            Le site <strong>www.example.com</strong> est édité par :
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Nom de l'entreprise : VTX</li>
            <li>Adresse : 123 Rue Exemple, 75001 Paris, France</li>
            <li>Numéro de téléphone : +33 1 23 45 67 89</li>
            <li>Email : contact@example.com</li>
            <li>Capital social : 10 000€</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Hébergement</h2>
          <p className="text-sm text-gray-600">
            Le site est hébergé par :
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Hébergeur : OVH</li>
            <li>Adresse : 2 rue Kellermann, 59100 Roubaix, France</li>
            <li>Téléphone : +33 9 72 10 10 07</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Propriété intellectuelle</h2>
          <p className="text-sm text-gray-600">
            Le contenu du site (textes, images, logos, etc.) est la propriété exclusive de <strong>Votre Entreprise</strong>, sauf mention contraire. Toute reproduction ou représentation totale ou partielle de ce site est interdite sans autorisation préalable.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Protection des données personnelles</h2>
          <p className="text-sm text-gray-600">
            Conformément à la loi sur la protection des données personnelles, vous disposez d’un droit d’accès, de rectification, d’opposition et de suppression de vos données. Pour exercer ce droit, vous pouvez nous contacter par email à <strong>contact@example.com</strong>.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Responsabilité</h2>
          <p className="text-sm text-gray-600">
            <strong>Votre Entreprise</strong> ne peut être tenue responsable des erreurs ou omissions dans le contenu du site, ni des éventuels dommages liés à l'utilisation du site.
          </p>
        </section>
      </div>
    </div>
  );
}
