const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');



//Schema GraphQl

const schema = buildSchema(`
type Livre {
  id : ID!
  titre: String!
  auteur: Auteur!
  datedePublication: String!
  genre: Genre!
  nombreDePages: Int
}

type Auteur{
  id: ID!
  nom:String!
  livres: [Livre]!
}
 type Genre{
    id:ID!
    nom: String!
    livres:[Livre]!
  

}

type Query{
  livres: [Livre]!
  livre(id:ID!): Livre
  auteurs: [Auteur]!
  auteur(id:ID!): Auteur
  genres: [Genre]!
  genre(id:ID!): Genre
}

type Mutation {
  ajouterLivre(titre: String!, auteurId: ID!, dateDePublication: String!, genreId: ID!, nombreDePages: Int): Livre
  ajouterAuteur(nom: String!): Auteur
  ajouterGenre(nom: String!): Genre
}
`)
//Resolveurs pour schéma
const livres = [
  {
    id: '1',
    titre: 'Le Seigneur des Anneaux',
    auteurId: '1',
    dateDePublication: '1954',
    genreId: '1',
    nombreDePages: 1576,
  },
  {
    id: '2',
    titre: "Harry Potter à l'école des sorciers",
    auteurId: '2',
    dateDePublication: '1997',
    genreId: '2',
    nombreDePages: 380,
  },
  {
    id: '3',
    titre: 'Titeuf, la revanche des hommes',
    auteurId: '3',
    dateDePublication: '2013',
    genreId: '3',
    nombreDePages: '45'
  }

];

const auteurs = [
  {
    id: '1',
    nom: 'Tolkien',
  },
  {
    id: '2',
    nom: 'Rowling',
  },

  {
    id: '3',
    nom: 'Victor Hugo'
  }
  
];

const genres = [
  {
    id: '1',
    nom: 'Fantasy',
  },
  {
    id: '2',
    nom: 'Jeunesse',
  },
  {
    id: '3',
    nom: 'horreur'
  }
    


];
const resolvers = {
  Query: {
    livres: () => livres,
    livre: (_,{id}) => livres.find(livre => livre.id === id),
    auteurs: () => auteurs,
    auteur: (_,{id}) => auteurs.find(auteur => auteur.id === id),
    genres: () => genre,
    genre: (_,{id}) => genres.find(genre => genre.id === id)
  },
  Mutation: {
    ajouterLivre: (_, { titre, auteurId, dateDePublication, genreId, nombreDePages }) => {
      const id = String(livres.length + 1);
      const nouveauLivre = { id, titre, auteurId, dateDePublication, genreId, nombreDePages };
      livres.push(nouveauLivre);
      return nouveauLivre;
    },
    ajouterAuteur: (_, { nom }) => {
      const id = String(auteurs.length + 1);
      const nouvelAuteur = { id, nom };
      auteurs.push(nouvelAuteur);
      return nouvelAuteur;
    },
    ajouterGenre: (_, { nom }) => {
      const id = String(genres.length + 1);
      const nouveauGenre = { id, nom };
      genres.push(nouveauGenre);
      return nouveauGenre;
    },
  },
  Livre: {
    auteur: (parent) => auteurs.find(auteur => auteur.id === parent.auteurId),
    genre: (parent) => genres.find(genre => genre.id === parent.genreId),
  },
  Auteur: {
    livres: (parent) => livres.filter(livre => livre.auteurId === parent.id),
  },
  Genre: {
    livres: (parent) => livres.filter(livre => livre.genreId === parent.id),
  },
};

//Express server
const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

// Démarrage du serveur
app.listen(4000, () => console.log('Serveur en écoute sur http://localhost:4000/graphql'));