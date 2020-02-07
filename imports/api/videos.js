import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Index, MinimongoEngine } from 'meteor/easy:search'

export const Vids = new Mongo.Collection('videos');

export const VidsIndex = new Index({
  collection: Vids,
  fields: ['title', 'description'],
  engine: new MinimongoEngine(),
})

Meteor.methods({
  'vids.insert'(title, description, magnetUri, previewImg) {

    check(title, String);
    check(description, String);
    // Make sure the user is logged in before inserting a task
    //   if (! this.userId) {
    //     throw new Meteor.Error('not-authorized');
    //   }

    Vids.insert({
      title,
      description,
      magnetUri,
      previewImg,
      createdAt: new Date(),
    });
    return true
  },
  'vids.findOne'(id) {
    check(id, String);
    return Vids.findOne({_id: id})
  },
  'vids.find'(search){
    return Vids.find().fetch()
  },

});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('vids', function vidsPublication() {
    return Vids.find();
  });
}