/* global process */
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const ChatRooms = new Mongo.Collection('chatrooms');

if(Meteor.isServer){
  Meteor.publish('chatrooms', () =>{
    return ChatRooms.find({});
  });
}

 /* Para eliminar huecos de seguridad, deberían hacer verificaciones sobre los parámetros que entran y van a usarse en los métodos
que modifican la base de datos, en este caso específico usar por ejemplo: "check(usersrc, Object);", dependiendo de lo que se espere 
(yo asumí que usersrc es un objeto) */

Meteor.methods({
  'chatrooms.createRoom': function(usersrc,userdst){
    /* let idChat = ChatRooms.upsert(
      {$or:[{user1:usersrc,user2:userdst},{user1:userdst,user2:usersrc}]},
      {
        user1:usersrc,
        user2:userdst,
        messages:[]
      }); */
    let idRoom = ChatRooms.findOne(
      {$or:[{user1:usersrc,user2:userdst},{user1:userdst,user2:usersrc}]});
    console.log(idRoom);
    if (idRoom === undefined){
      console.log('creando sala');
      idRoom = ChatRooms.insert(
        {
          user1:usersrc,
          user2:userdst,
          messages:[]
        });
      console.log(idRoom);
    }
    return idRoom;
  },
  'chatrooms.sendMessage': function(message,userSrc,userDst){
    ChatRooms.update(
      {$or:[{user1:userSrc,user2:userDst},{user1:userDst,user2:userSrc}]},
      {$push:{messages:{time:Date.now(),user:userSrc,text:message}}},{},(err,i) => {console.log(err,i);});
    console.log(message,'sent');
  }
});
