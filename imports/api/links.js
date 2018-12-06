import { Mongo } from 'meteor/mongo';
// Code Review - Ricardo Andres Angel Villadiego
// Parece inecesaria esta colleccion
export default Links = new Mongo.Collection('links');
