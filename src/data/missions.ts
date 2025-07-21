import { Mission } from '../types/game';

export const missions: Mission[] = [
  {
    id: 1,
    name: "Le Secret du Parc",
    location: "Parc de Verdure",
    description: "Longe la barricade qui entoure le mini-golf, près des jeux pour enfants. Dans la perspective d'un angle, à l'Est tu trouveras un chiffre.",
    answer: "15",
    type: "calculation",
    hints: [
      "Un nombre (2 chiffres) est attendu pour le code",
      "\"+\" calcul indispensable pour trouver le code",
      "8+7=?"
    ],
    content: {
      story: "Puis, sur le monument aux morts, trouve la deuxième date gravée sur la plus grande plaque côté Est. Le troisième chiffre est un élément clé du code."
    }
  },
  {
    id: 2,
    name: "L'Énigme du Casino",
    location: "Casino",
    description: "Un puzzle représentant deux statues visibles proche du Casino. Reconstitue-les pour comprendre le code.",
    answer: "678", // Updated code
    type: "puzzle",
    hints: [
      "Le chiffre en face de la ligne t'indique la photo à garder",
      "Une suite de chiffres apparaîtra si tu suis bien les consignes"
    ],
    content: {
      story: "Une fois le puzzle assemblé, tu devras trouver un code à partir de la position des images et indices proche du puzzle.",
      puzzle: {
        pieces: 12,
        solution: "Reconstitue le puzzle pour révéler les indices cachés"
      }
    }
  },
  {
    id: 3,
    name: "L'Histoire du Majestic",
    location: "Le Majestic",
    description: "L'hôtel a vu passer l'histoire… Pour commencer, il n'a pas toujours été un hôtel.",
    answer: "82",
    type: "calculation",
    hints: [
      "Xynthia et Majestic",
      "Une soustraction est attendue",
      "2010 – 1928 = ?"
    ],
    content: {
      story: "À la fin de la Première Guerre mondiale, il devient un cinéma jusqu'en 1926. Racheté en 1927, il devient un hôtel en novembre 1928. Une submersion par Xynthia en 2010."
    }
  },
  {
    id: 4,
    name: "La Statue Mystérieuse",
    location: "L'Atelier des Cousins",
    description: "Une statue de la Vierge et son enfant trône près de l'atelier. Un nom est inscrit à proximité. Retrouve-le et saisis-le.",
    answer: "Stella Maris",
    type: "text",
    hints: [
      "Mon premier brille dans la nuit",
      "Mon second recouvre plus de 70 % de la Terre",
      "Mon tout se dit dans une langue ancienne (latin)"
    ],
    content: {}
  },
  {
    id: 5,
    name: "Le Trésor de l'Église",
    location: "L'Église",
    description: "Au Nord, la culture s'offre en boîte… et cache un secret.",
    answer: "9",
    type: "text",
    hints: [
      "Des bancs me sont de compagnie"
    ],
    content: {
      story: "Fouille et tu trouveras un chiffre caché."
    }
  }
];