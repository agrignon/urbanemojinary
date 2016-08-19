import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
export const UserVotes = new Mongo.Collection('uservotes');

UserVotes.allow({
  insert(userId, emoji) {
    return userId;
  },
  update(userId, emoji, fields, modifier) {
    return userId;
  },
  remove(userId, emoji) {
    return userId;
  }
});
if (Meteor.isServer) {
	Meteor.publish('uservotes', function() {
        return UserVotes.find({userId:this.userId});
    });
}