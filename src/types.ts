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
  
  export interface DriversResponse {
    drivers: Driver[];       
    total: number;           
    totalPages: number;      
    currentPage: number;     
  }