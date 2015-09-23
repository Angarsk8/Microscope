/*global Meteor, Posts, Mongo, check, _, ownsDocument, validatePost*/
Posts = new Mongo.Collection('posts');

validatePost = function (post) {
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
    insertPost: function (postAttributes) {
        check(Meteor.userId(), String);
        check(postAttributes, {
            url: String,
            title: String
        });
        var errors = validatePost(postAttributes);
        if(errors.title || errors.url)
            throw new Meteor.Error("Invalid Post", "You must set a title and a URL for the post!");
        var postUrl = postAttributes.url;
        var checkPostUrl = postWithSameLink(postUrl);
        if (checkPostUrl.postExists) return checkPostUrl;
        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0
        });
        var postId = Posts.insert(post);
        return {
            _id: postId
        };
    }

    /*updatePost: function (postAttributes, postObject) {
        check(Meteor.userId(), String);
        check(postObject, {
            url: String,
            title: String,
            userId: String,
            author: String,
            submitted: Date,
            _id: String
        });
        check(postAttributes, {
            url: String,
            title: String
        });
        var clientId = Meteor.userId();
        var postId = postObject._id;
        if (!ownsDocument(clientId, postObject)) {
            return {
                isNotUser: true
            };
        } else {
            var postUrl = postAttributes.url;
            var checkPostUrl = postWithSameLink(postUrl);
            if (checkPostUrl.postExists && checkPostUrl._id != postId) return checkPostUrl;
            Posts.update({
                _id: postId
            }, {
                $set: postAttributes
            });
            return {
                _id: postId
            };
        }
    }*/
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

Posts.deny({
    update: function (userId, doc, fieldNames, modifier) {
        var errors = validatePost(modifier.$set);
        return errors.title || errors.url;
    }
});

