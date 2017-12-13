import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Meteor } from 'meteor/meteor';

Template.Directory_Profile.events({
  'click .rep': function (event){
   event.preventDefault();
   //confirm action
   var retVal = confirm("Are you sure you want to give this user +rep? You cannot undo this process.");
   if(retVal){
     //find both users IDs
     const repperID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
     const reppeeID = Profiles.findDoc(this.profile.username)._id;

     console.log(repperID);
     console.log(reppeeID);

     if(repperID === reppeeID){
       //Don't let users give themselves +rep
       alert("You can't +rep yourself.");
     }

     else if(_.contains(Profiles.findDoc(reppeeID).reputation, repperID)){
       //if this person has already +repped this person, abort
       alert("You have already given this person +rep.");
     }

     //otherwise, give user +rep
     else{
       const newrep = Profiles.findDoc(reppeeID).reputation;
       newrep.push(repperID.toString());
       console.log(newrep);
       Profiles.update(
           { _id: reppeeID },
           { $set:
                 {
                   reputation: newrep
                 }
           }
       );
       const updated = Profiles.findDoc(reppeeID).reputation;
       console.log(updated);
       alert("Success! Thank you for rating this user.")
     }
   }
  },
});