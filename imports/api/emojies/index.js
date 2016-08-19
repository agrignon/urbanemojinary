import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
export const Emojies = new Mongo.Collection('emojies');
var emojiFields = {
     "_id" : 1, 
     "emojiCode" : 1, 
     "emojiDesc" : 1, 
     "emojiUse" : 1, 
     "createdDt" : 1, 
     "createdById" : 1, 
     "votes" : 1, 
     "tags" : 1,
     "info.profile.name" : 1
}
Emojies.allow({
  insert(userId, emoji) {
    return userId && emoji.createdById === userId;
  },
  update(userId, emoji, fields, modifier) {
    return userId;
    
  },
  remove(userId, emoji) {
    return userId && emoji.createdById === userId;
  }
});
if (Meteor.isServer) {

    Meteor.methods({
        findEmojiByID : function(id){
            return Emojies.find({_id : id}).fetch();
        }
    });


    Meteor.publish('emojiById', function(id) {
        // console.log("emojiById....",id);
        // var self = this;
        // var t =  Emojies.aggregate([
        //         { $match : { _id : id } },
        //         { 
        //             $lookup: {
        //                 from: "users", 
        //                 localField: "createdById", 
        //                 foreignField: "_id", 
        //                 as: "info"
        //             } 
        //         },
        //         { $unwind: "$info"},
        //         { $project : emojiFields}
        //     ]);
        // t.forEach(function(emoji) {
        //   self.added('emojies', emoji._id, emoji);
        // });
        // self.ready();
        return Emojies.find({_id : id});
    });

    Meteor.publish('userById', function(id) {
        return Meteor.users.find({_id:id},{fields: {'profile.name':1}});
    });
    Meteor.publish('tagEmojies', function(tag) {
        return Emojies.find({tags:tag});
    });
    Meteor.publish('emojies', function() {
        return Emojies.find({});
    });

    Meteor.publish('userEmojies', function(userId) {
        if (userId) {
            return Emojies.find({
                'createdById': userId
            });
        }
        return this.ready();
    });

    Meteor.publish('searchedEmojies', function(searchTerm) {
        if (searchTerm && searchTerm.length > 0) {
            return Emojies.find({
                $text: {
                    $search: searchTerm
                }
            }, {
                fields: {
                    score: {
                        $meta: 'textScore'
                    }
                },
                sort: {
                    score: {
                        $meta: 'textScore'
                    }
                }
            });
        } else {
            return this.ready();
        }
    });

}