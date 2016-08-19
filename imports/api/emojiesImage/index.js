import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
export const EmojieImages = new Mongo.Collection('emojieImages');

EmojieImages.allow({
  insert(userId, emoji) {
    return true;
  },
  update(userId, emoji, fields, modifier) {
    return true;
  },
  remove(userId, emoji) {
    return true;
  }
});