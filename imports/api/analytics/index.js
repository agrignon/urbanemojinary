import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
export const Analytics = new Mongo.Collection('analytics');

Analytics.allow({
  insert(userId, emoji) {
  	return true;
  },
  update(userId, emoji, fields, modifier) {
  	return false;
  },
  remove(userId, emoji) {
  	return false;
  }
});