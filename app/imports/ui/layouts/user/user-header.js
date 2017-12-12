import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

Template.User_Header.helpers({
  routeUserName() {
    return Meteor.user().profile.name;
  },
});
