import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { $ } from 'meteor/jquery';


/*                        LANDING ROUTE                       */

export const landingPageRouteName = 'Landing_Page';
FlowRouter.route('/', {
  name: landingPageRouteName,
  action() {
    BlazeLayout.render('Landing_Layout', { main: landingPageRouteName });
  },
});

/*                        DIRECTORY ROUTE                       */

function addDirectoryBodyClass() {
  $('body').addClass('directory-page-body');
}

function removeDirectoryBodyClass() {
  $('body').removeClass('directory-page-body');
}

export const directoryPageRouteName = 'Directory_Page';
FlowRouter.route('/directory', {
  name: directoryPageRouteName,
  action() {
    BlazeLayout.render('Directory_Layout', { main: directoryPageRouteName });
  },
  triggersEnter: [addDirectoryBodyClass],
  triggersExit: [removeDirectoryBodyClass],
});


/*                        USER ROUTES                      */


function addUserBodyClass() {
  $('body').addClass('user-layout-body');
}

function removeUserBodyClass() {
  $('body').removeClass('user-layout-body');
}

const userRoutes = FlowRouter.group({
  prefix: '/:username',
  name: 'userRoutes',
  triggersEnter: [addUserBodyClass],
  triggersExit: [removeUserBodyClass],
});

export const editProfilePageRouteName = 'Edit_Profile_Page';
userRoutes.route('/edit_profile', {
  name: editProfilePageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: editProfilePageRouteName });
  },
});

export const profilePageRouteName = 'Profile_Page';
userRoutes.route('/profile', {
  name: profilePageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: profilePageRouteName });
  },
});

export const searchPageRouteName = 'Search_Page';
userRoutes.route('/search', {
  name: searchPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: searchPageRouteName });
  },
});

export const rankingPageRouteName = 'Ranking_Page';
userRoutes.route('/rankings', {
  name: rankingPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: rankingPageRouteName });
  },
});


/*                        MISC ROUTES                       */
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Page_Not_Found');
  },
};


/*                        ADMIN ROUTES                       */

// I know we should be doing something like this but I couldn't figure it out....
export const adminRoutes = userRoutes.group({
  prefix: '/admin',
  name: 'adminRoutes',
});

export const adminPageRouteName = 'Admin_Page';
adminRoutes.route('/admin-board', {
  name: adminPageRouteName,
  action() {
    BlazeLayout.render('User_Layout', { main: adminPageRouteName });
  },
});

export const deleteProfile = 'Delete_Profile_Page';
adminRoutes.route('/delete-profile/:_id', {
  name: deleteProfile,
  action() {
    BlazeLayout.render('User_Layout', { main: deleteProfile });
  },
});
