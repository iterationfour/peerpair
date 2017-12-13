import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.If_Authorized.helpers({
  /**
   * @returns {*} True if Meteor is in the process of logging in.
   */
  authInProcess: function authInProcess() {
    return Meteor.loggingIn();
  },

  /**
   * Determine if the user is authorized to view the current page.
   * If current user's username matches the username in the URL, they are authorized.
   * Otherwise, they are not authorized.
   * @returns {boolean} True if there is a logged in user and they are authorized to visit the page.
   */
  isAuthorized: function isAuthorized() {
    // Only logged in users can see a page protected by this template.
    if (!Meteor.user()) {
      // console.log('isAuthorized', 'not logged in');
      return false;
    }

    // Check that the current user is accessing a page in their area.
    const routeUserName = FlowRouter.getParam('username');
    const loggedInUserName = Meteor.user().profile.name;
    const adminPage = 'Admin_Page';
    const routePage = FlowRouter.getRouteName();

    const jessie = 'jlblanke';
    const andrew = 'aobatake';
    const kian = 'kiank';
    const beejay = 'beejayi';
    const pj = 'johnson';

    const Admins = [jessie, kian, beejay, pj];

    if (_.contains(Admins, loggedInUserName)) {
      return true;
    } else if (adminPage === routePage) {
      return false;
    } else if (routeUserName === loggedInUserName) {
      return true;
    } else if (routeUserName === undefined) {
      return true;
    }
    return false;
  },

});
