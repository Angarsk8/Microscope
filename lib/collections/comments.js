/*global Mongo, Meteor, check, Posts, _, createCommentNotification, Comments*/
Comments = new Mongo.Collection("comments");

Meteor.methods({
    "insertComment": function (commentAttributes) {
        check(Meteor.userId(), String);
        check(commentAttributes, {
            body: String,
            postId: String
        });
        var post = Posts.findOne(commentAttributes.postId);
        if (!post)
            throw new Meteor.Error("Invalid Comment", "You must comment on a post!");
        var user = Meteor.user();
        var comment = _.extend(commentAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date()
        });
        Posts.update({
            _id: comment.postId
        }, {
            $inc: {
                commentsCount: 1
            }
        });
        comment._id = Comments.insert(comment);
        createCommentNotification(comment);
        return comment._id;
    }
});
