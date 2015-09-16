/*global Meteor, Posts, Mongo, check, _, ownsDocument*/
Posts = new Mongo.Collection('posts');

function postWithSameLink(url) {
    var isPost = Posts.findOne({
        url: url
    });
    return isPost ? {
        postExists: true,
        _id: isPost._id
    } : {
        postExists: false,
    };
}

Meteor.methods({
    insertPost: function (postAttributes) {
        check(Meteor.userId(), String);
        check(postAttributes, {
            url: String,
            title: String
        });
        var postUrl = postAttributes.url;
        var checkPostUrl = postWithSameLink(postUrl);
        if (checkPostUrl.postExists) return checkPostUrl;
        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date()
        });
        var postId = Posts.insert(post);
        return {
            _id: postId
        };
    }

    //updatePost: function (postAttributes, postObject) {
    //    check(Meteor.userId(), String);
    //    check(postObject, {
    //        url: String,
    //        title: String,
    //        userId: String,
    //        author: String,
    //        submitted: Date,
    //        _id: String
    //    });
    //    check(postAttributes, {
    //        url: String,
    //        title: String
    //    });
    //    var clientId = Meteor.userId();
    //    var postId = postObject._id;
    //    if (!ownsDocument(clientId, postObject)) {
    //        return {
    //            isNotUser: true
    //        };
    //    } else {
    //        var postUrl = postAttributes.url;
    //        var checkPostUrl = postWithSameLink(postUrl);
    //        if (checkPostUrl.postExists && checkPostUrl._id != postId) return checkPostUrl;
    //        Posts.update({
    //            _id: postId
    //        }, {
    //            $set: postAttributes
    //        });
    //        return {
    //            _id: postId
    //        };
    //    }
    //}
});

Posts.allow({
    update: function (userId, doc) {
        return ownsDocument(userId, doc);
    },
    remove: function (userId, doc) {
        return ownsDocument(userId, doc);
    }
});

Posts.deny({
    update: function (userId, doc, fieldNames) {
        return (_.without(fieldNames, "url", "title").length > 0);
    }
});