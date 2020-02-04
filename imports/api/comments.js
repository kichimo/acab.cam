import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Comments = new Mongo.Collection('comments');

Meteor.methods({
  'comments.insert'(vidId, comment, author) {

    check(comment, String);
    check(author, String);
    // Make sure the user is logged in before inserting a task
    //   if (! this.userId) {
    //     throw new Meteor.Error('not-authorized');
    //   }

    Comments.insert({
      vidId,
      comment,
      author,
      createdAt: new Date(),
    });
    return true
  },
  'comments.findOne'(id) {
    check(id, String);
    return Comments.findOne({vidId: id})
  }
});


if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('comments', function commentsPublication(id) {
      return Comments.find({vidId: id});
    });
  }