/*global Meteor, Posts, Mongo, check, _, ownsDocument, validatePost*/
Posts = new Mongo.Collection('posts');

validatePost = function(post) {
    var errors = {};
    if (!post.title) errors.title = "Please fill in a headline";
    if (!post.url) errors.url = "Please fill in a URL";
    return errors;
};

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
    insertPost: function(postAttributes) {
        check(Meteor.userId(), String);
        check(postAttributes, {
            url: String,
            title: String
        });
        var errors = validatePost(postAttributes);
        if (errors.title || errors.url)
            throw new Meteor.Error("Invalid Post", "You must set a title and a URL for the post!");
        var postUrl = postAttributes.url;
        var checkPostUrl = postWithSameLink(postUrl);
        if (checkPostUrl.postExists) return checkPostUrl;
        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });
        var postId = Posts.insert(post);
        return {
            _id: postId
        };
    },
    upvote: function(postId) {
        check(this.userId, String);
        check(postId, String);
        var affected = Posts.update({
            _id: postId,
            upvoters: {
                $ne: this.userId
            }
        }, {
            $addToSet: {
                upvoters: this.userId
            },
            $inc: {
                votes: 1
            }
        });
        if (!affected)
            throw new Meteor.Error("invalid", "You weren't able to upvote that post");
    }
});

Posts.allow({
    update: function(userId, doc) {
        // return true;
        return ownsDocument(userId, doc);
    },
    remove: function(userId, doc) {
        //return true;
        return ownsDocument(userId, doc);
    }
});

Posts.deny({
    update: function(userId, doc, fieldNames) {
        // return false;
        // Meteor._sleepForMs(5000);
        return (_.without(fieldNames, "url", "title").length > 0);
    }
});

Posts.deny({
    update: function(userId, doc, fieldNames, modifier) {
        var errors = validatePost(modifier.$set);
        // return false;
        return errors.title || errors.url;
    }
});
