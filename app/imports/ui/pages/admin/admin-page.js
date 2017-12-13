import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';

const selectedInterestsKey = 'selectedInterests';

Template.Admin_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, undefined);
});

Template.Admin_Page.helpers({
  profiles() {
    // Initialize selectedInterests to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const selectedInterests = Template.instance().messageFlags.get(selectedInterestsKey);
    return _.filter(allProfiles, profile => _.intersection(profile.interests, selectedInterests).length > 0);
  },

  interests() {
    return _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return {
            label: interest.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), interest.name),
          };
        });
  },

  routeUserName() {
    return FlowRouter.getParam('username');
  },
});

/*        {
          "firstName": "Andrew",
          "lastName": "Obatake",
          "username": "aobatake",
          "github": "aobatake",
          "bio": "I am an student studying Computer Engineering at the University of Hawaii.",
          "interests": [
            "Computer Engineering (BS)"
          ],
          "picture": "",
          "report": [],
          "reputation": [],
          "favorites": []
        },
*/