import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Meteor } from 'meteor/meteor';
import { Tasks, TasksSchema } from '/imports/api/task/TaskCollection';

const selectedInterestsKey = 'selectedInterests';

Template.Profile_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, undefined);
  this.subscribe('Tasks');
});

Template.Profile_Page.helpers({
  tasksList() {
    //console.log(Tasks.find());
    return Tasks.find({username:FlowRouter.getParam('username')});
  },
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
  userProfile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  favorites() {
    let userprofile = Profiles.findDoc(FlowRouter.getParam('username'));
    let userfavorites = userprofile.favorites;
    return _.map(userfavorites, favoriteID => Profiles.findDoc(favoriteID));
  },
});

Template.Profile_Page.events({
  'submit .task-data-form'(event, instance) {
    event.preventDefault();

    const course = event.target.Course.value;
    const task = event.target.Task.value;
    const dueDate = event.target.Due_Date.value;
    const username = FlowRouter.getParam('username');

    const newTaskData = { course, task, dueDate, username };
    // Clear out any old validation errors.
    // instance.context.reset();
    // Invoke clean so that newStudentData reflects what will be inserted.
    //const cleanData = Tasks.getSchema().clean(newTaskData);
    // Determine validity.
    //instance.context.validate(cleanData);
    //if (instance.context.isValid()) {
    const id = Tasks.insert(newTaskData);
    console.log (id);
      //instance.messageFlags.set(displayErrorMessages, false);
    //} else {
      //instance.messageFlags.set(displayErrorMessages, true);
    //}


  },

  'click .delete': function (event) {
    event.preventDefault();
    if (confirm('Finished with task?')) {
      Tasks.remove(event.currentTarget.id);
    }
    return false;
  },
});
