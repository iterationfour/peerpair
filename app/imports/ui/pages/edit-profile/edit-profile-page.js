import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Meteor } from 'meteor/meteor';
import { Admins } from '/imports/ui/layouts/user/if-authorized';


const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Edit_Profile_Page.onCreated(function onCreated() {
  // console.log(Meteor.user().profile.name);
  // console.log(Profiles.dumpOne(FlowRouter.getParam('username')));
  // console.log(FlowRouter.getParam('username'));
  // console.log(FlowRouter.getParam('_id'));
  // console.log(FlowRouter.getRouteName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Edit_Profile_Page');
});

Template.Edit_Profile_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  interests() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = profile.interests;
    return profile && _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
        });
  },
});


Template.Edit_Profile_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const firstName = event.target.First.value;
    const lastName = event.target.Last.value;
    // const title = event.target.Title.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const picture = event.target['Profile Picture'].value;
    const github = event.target.Github.value;
    const facebook = event.target.Facebook.value;
    const instagram = event.target.Instagram.value;
    const bio = event.target['About Me'].value;

    var interests;
    if (!event.target.Major.selectedOptions) {
      interests = ["Accounting (BBA)"];
    } else {
      console.log(event.target.Major.selectedOptions);
      const selectedInterests = _.filter(event.target.Major.selectedOptions, (option) => option.selected);
      console.log(selectedInterests);
      interests = _.map(selectedInterests, (option) => option.value);
      console.log(interests);
    }
    // Preserve report field
    let report,
      reputation,
      favorites;
    if (Profiles.isDefined(FlowRouter.getParam('username'))) {
      console.log('doc found - set all to prev value');
      report = Profiles.findDoc(FlowRouter.getParam('username')).report;
      // Preserve reputation field
      reputation = Profiles.findDoc(FlowRouter.getParam('username')).reputation;
      // Preserve favorites field
      favorites = Profiles.findDoc(FlowRouter.getParam('username')).favorites;
    } else {
      console.log('doc not found - set all null');
      report = [];
      reputation = [];
      favorites = [];
    }


    const updatedProfileData = { firstName, lastName, /* title, */ picture, github, facebook, instagram, bio, interests,
      username, report, reputation, favorites };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Profiles.getSchema().clean(updatedProfileData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      if (Profiles.isDefined(FlowRouter.getParam('username'))) {
        const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
        const id = Profiles.update(docID, { $set: cleanData });
        instance.messageFlags.set(displaySuccessMessage, id);
        instance.messageFlags.set(displayErrorMessages, false);
      } else {
        console.log('new profile');
        Profiles.define(cleanData);
      }
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },

  'click .delete': function (event) {
    // Disable the default event behavior. //CHECK
    event.preventDefault();
    const username = FlowRouter.getParam('username');
    const id = FlowRouter.getParam('_id');
    console.log(`username = ${username}`);
    console.log(`id = ${id}`);
    // Call the ‘remove’ function associated with the Contacts collection
    // passing it the docID of the Contact to be removed.
    // const contactData = Contacts.findOne(FlowRouter.getParam('_id'));

    // Call the FlowRouter.go function to take the user back to the Admin page.
    // for redirecting, check if
    const jessie = 'jlblanke';
    const andrew = 'aobatake';
    const kian = 'kiank';
    const beejay = 'beejayi';
    const pj = 'johnson';
    const Admins = [jessie, kian, beejay, pj];
    const currentLoggedIn = Meteor.user().profile.name;
    console.log(`currentCAS = ${currentLoggedIn}`);
    if (username === Meteor.user().profile.name) {
      console.log(`deleting self: ${username}`);
      Meteor.logout();
      Profiles.removeIt(username);
    } else {
      console.log(`admin deleting ${username}`);
      Profiles.removeIt(username);
      FlowRouter.go(`/${currentLoggedIn}/admin/admin-board`);
    }
  },
});

