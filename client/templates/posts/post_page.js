/*global Template, Comments*/

Template.postPage.helpers({
    comments: function () {
        return Comments.find({
            postId: this._id
        });
    }
});