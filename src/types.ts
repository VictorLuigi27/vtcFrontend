// Fiche d'identité du chauffeur

export interface Driver {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    vehicule: string;
    disponibilite: boolean;
  }
  