import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Meteor } from 'meteor/meteor';

Template.Directory_Profile.events({
  'click .rep': function (event){
    event.preventDefault();

    //find both users IDs
    const repperID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
    const reppeeID = Profiles.findDoc(this.profile.username)._id;

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
      //confirm action
      var retVal = confirm("Are you sure you want to give this user +rep? You cannot undo this process.");
      if(retVal) {
        //find the current reputation array
        var newrep = Profiles.findDoc(reppeeID).reputation;
        //if it's empty, just makea new one
        if (newrep == null || newrep.length < 1) {
          newrep = [repperID.toString()];
        }
        //otherwise, push the new ID onto the old array
        else {
          newrep.push(repperID.toString());
        }
        //update the Profile with the new reputation array
        Profiles.update(
            { _id: reppeeID },
            {
              $set:
                  {
                    reputation: newrep
                  }
            }
        );
        //notify the user of the successful operation
        alert("Success! Thank you for rating this user.")
      }
    }
  },

  'click .report': function (event){
    event.preventDefault();

    //find both users IDs
    const reporterID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
    const reporteeID = Profiles.findDoc(this.profile.username)._id;


    if(reporterID === reporteeID){
      //Don't let users give report themselves
      alert("You can't report yourself.");
    }

    else if(_.some(Profiles.findDoc(reporteeID).report, _.has({ _id: reporterID }))) {
      //if this person has already reported this person, abort
      alert("You have already reported this person.");
    }

    //otherwise, give user +rep
    else{
      //confirm action
      if(confirm("Are you sure you want to report this user?")){
        var retVal = prompt("Please enter your reason for reporting this user.", "");
        if(retVal) {
          //find the old report array
          var newReport = Profiles.findDoc(reporteeID).report;
          //if the array is empty, just make a new one
          if (newReport == null || newReport.length < 1) {
            newReport = [{ reporter: reporterID.toString(), reason: retVal }];
          }
          //otherwise, push the ID and reason string as a new object into the array
          else {
            newReport.push({ reporter: reporterID.toString(), reason: retVal });
          }
          //update the Profile with the new report array
          Profiles.update(
              { _id: reporteeID },
              {
                $set:
                    {
                      report: newReport
                    }
              }
          );
          //notify the user of the successful operation
          alert("Success! The admin will be notified of this report.")
        }
      }
    }
  },

  'click .favoriteadd': function (event){
    event.preventDefault();

    //find both users IDs
    const favoriterID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
    const favoriteeID = Profiles.findDoc(this.profile.username)._id;

    if(favoriterID === favoriteeID){
      //Don't let users favorite themselves
      alert("You can't favorite yourself.");
    }

    else if(_.contains(Profiles.findDoc(favoriterID).favorites, favoriteeID)){
      //if this person has already favorited this person, abort (this case should never show up)
      alert("You have already favorited this person.");
    }

    //otherwise, favorite user
    else{
      //confirm action
      var retVal = confirm("Are you sure you want to favorite this user?");
      if(retVal){
        //find the current favorites array
        var newFave = Profiles.findDoc(favoriterID).favorites;
        //if the array is empty, just make a new one
        if (newFave == null || newFave.length < 1){
          newFave = [favoriteeID.toString()];
        }
        //otherwise, push the new enty into the old array
        else{newFave.push(favoriteeID.toString());}
        //push the new favorites array
        Profiles.update(
            { _id: favoriterID },
            { $set:
                  {
                    favorites: newFave
                  }
            }
        );
        //notify the user of the successful operation
        alert("Success! You have now added this user to your favorites.")
      }
    }
  },

  'click .favoritedelete': function (event){
    event.preventDefault();

    //find both users IDs
    const favoriterID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
    const favoriteeID = Profiles.findDoc(this.profile.username)._id;


    if(favoriterID === favoriteeID){
      //Don't let users unfavorite themselves
      alert("You can't unfavorite yourself. Hell, you can't even favorite yourself.");
    }

    //check for empty favorites entry
    else if(Profiles.findDoc(favoriterID).favorites == null || Profiles.findDoc(favoriterID).favorites.length < 1){
      alert("You don't have any favorited users.")
    }

    else if(!_.contains(Profiles.findDoc(favoriterID).favorites, favoriteeID)){
      //if this person hasn't favorited this person, abort (this case should never show up)
      alert("You haven't favorited this person.");
    }

    //otherwise, unfavorite user
    else{
      //confirm action
      var retVal = confirm("Are you sure you want to remove this user from your favorites?");
      if(retVal){
        //find current favorites array
        var newFave = Profiles.findDoc(favoriterID).favorites;
        //if this is the only favorite in the array, just change the array to an empty array
        if (newFave.length == 1){
          newFave = [];
        }
        //otherwise, find the index of the unwanted ID and splice it out
        else{
          var index = newFave.indexOf(favoriteeID)
          newFave.splice(index, 1);
        }

        //update the Profile to have the new array
        Profiles.update(
            { _id: favoriterID },
            { $set:
                  {
                    favorites: newFave
                  }
            }
        );
        //notify the user of the successful operation
        alert("Success! You have now added this user to your favorites.")
      }
    }
  },

});