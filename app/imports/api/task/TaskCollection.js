import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

export const Tasks = new Mongo.Collection('Tasks');


export const TasksSchema = new SimpleSchema({
  wClass: {
    label: 'wClass',
    type: String,
    optional: false,
    max: 200,
  },
  task: {
    label: 'task',
    type: String,
    optional: false,
    max: 200,
  },
  dueDate: {
    label: 'dueDate',
    type: String,
    optional: false,
    max: 200,
  },
  username: {
    label: 'username',
    type: String,
    optional: false,
    max: 200,
  },
});

Tasks.attachSchema(TasksSchema);