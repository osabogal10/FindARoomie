import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Messages = new Mongo.Collection('messages');

if(Meteor.isServer){
  Meteor.publish('messages', () =>{
    return Messages.find({});
  });
}

Meteor.methods({
  'messages.addMessage': function()
  {
      const id = Meteor.userId();
      let dateP = moment().format('DD/MM/YYYY - h:mm:ss a'); 
      if (!id){
          throw new Meteor.Error("Not Authorized!")
      }

      try
      {
        // CODE REVIEW  - Ricardo Andres Angel Villadiego
        // Insert solo recibe un documento a insertar y un callback como argumento
        // Mongo genera los _id automaticamente no es necesarario tneer msgID
        // user1ID y user1Name pueden llega rpor parametro desde el cliente
          Messages.insert({id: Meteor.userId()},{    
            msgID: ""+Messages.find({}).count+1,
            user1ID: "", //El dueño de la sala -> El que tiene la habitacion
            user1Name: "", 
            user2ID: Meteor.userId(),
            user2Name: Meteor.user.name(),
            text = textP,
            msgDate = dateP
          });
          return true;
      }
      catch (err)
      {
          throw new Meteor.Error(err);
      }
  }
});
