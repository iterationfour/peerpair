import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Tasks } from '/imports/api/task/TaskCollection';

Interests.publish();
Profiles.publish();

Meteor.publish('Tasks', function publishTasksData() {
  return Tasks.find();
});
