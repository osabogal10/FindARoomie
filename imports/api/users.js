import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isServer) {
  Meteor.publish('users', () => {
    return Meteor.users.find({});
  });
}
  
Meteor.methods({
  'users.add':function(user){
    let userID = Meteor.users.insert({
      profileImage:user.profileImage,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileFB: user.profileFB,
      profileTW: user.profileTW,
      type: 'Search',
      rooms: {}
    });
    console.log('insertado',userID);
    let result = Meteor.users.find({username:user.firstName}).fetch();
    console.log(result[0].profile);
  },
  'users.findById'({userID}) {
    check(userID, String);
    const user = Meteor.users.find({userID: userID}).fetch();
    return user;
  },
  'users.findAll'(){
    const users = Meteor.users.find();
    return users;
  },
  'users.updateType'({userID},newType) {
    const user = Meteor.users.findOne({userID: userID});
    Meteor.users.update(user[0].userID, type = newType);
    return user;
  },
  'users.updateRooms'({userID},roomsP) {
    const user = Meteor.users.findOne({userID: userID});
    Meteor.users.update(user[0].userID, rooms = roomsP);
    return user;
  },
  'users.updateContactInfo' ({userID},emailP,phoneNumberP,profileFBP,profileTWP) {
    const user = Meteor.users.findOne({userID: userID});
    Meteor.users.update(user[0].userID, email = emailP);
    Meteor.users.update(user[0].userID, phoneNumber = phoneNumberP);
    Meteor.users.update(user[0].userID, profleFB = profileFBP);
    Meteor.users.update(user[0].userID, profileTW = profileTWP);
    return user;
  },
  //CODE REVIEW - Ricardo Andres Angel Villadiego
  // el if(Meteor.isServer) sobra ya que los metodos siempre estan en el servidor
  'users.findByUsername'(username) {
    if (Meteor.isServer){
      //console.log('me llego',username);
      check(username, String);
      const user = Accounts.findUserByEmail(username);
      //console.log(user);
      if(typeof user != 'undefined'){
        return user;
      }
    }
  },
  'users.pushRoom'(owner,roomid){
    if (Meteor.isServer){
      let user = Accounts.findUserByEmail(owner);
      //console.log('encontrado',user);
      let userid=user._id;
      let rooms = user.profile.rooms;
      rooms.push(roomid);
      Meteor.users.update({_id:userid},{$set: {'profile.rooms': rooms}});
    }
  },
  'users.getNameByID'(idUser){
    const user = Meteor.users.findOne({_id: idUser},{fields:{profile:1,_id:0}});
    console.log(user.profile.firstName +' '+user.profile.lastName);
    return user.profile.firstName +' '+user.profile.lastName;
  }
});
