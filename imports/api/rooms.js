/* global process */
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

export const Rooms = new Mongo.Collection('rooms');

if(Meteor.isServer){
  Meteor.publish('rooms', num =>{
    const options = {
      sort: {createdAt:-1},
      limit:num
    };
    console.log(options);
    return Rooms.find({}, options);
  });
}

 /* Para eliminar huecos de seguridad, deberían hacer verificaciones sobre los parámetros que entran y van a usarse en los métodos
que modifican la base de datos, en este caso específico usar por ejemplo: "check(room, Object);", de hecho deberían verificar cada parámetro 
o sea, como  "check(titulo, String);", "check(tamano, Number);", etc. */

Meteor.methods({
  'rooms.addRoom':function(room){
    
    let id = Rooms.insert({
      owner:room.owner,
      titulo:room.titulo,
      descripcion:room.descripcion,
      precio:room.precio,
      tamano:room.tamano,
      sector:room.sector,
      direccion:room.direccion,
      servicios:room.servicios,
      reglas:room.reglas,
      images:room.images
    });
    console.log('insertado',id);
    return id;
    //let result = Meteor.users.find({'emails[0].address':room.owner},{fields:{'profile':1,'_id':0}}).fetch();
    //console.log(owner);
    //result[0].profile.rooms.push(id);
    //console.log(result[0]);
    //Meteor.users.update({username: room.owner}, {$set: {'profile.rooms': result[0].profile.rooms}});
  },
  'rooms.getRoom':function(id){
    //console.log('fetching',id);
    let room = Rooms.find({_id:id}).fetch();
    //console.log(room);
    if(typeof room != 'undefined'){
      return room;
    }
  }
});
