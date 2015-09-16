/*global Template, $, Posts, Router, Meteor*/
Template.postEdit.events({
    "submit form": function (e) {
        e.preventDefault();
        //var postObject = this;
        var currentPostId = this._id;
        var postProperties = {
            url: $(e.target).find("[name=url]").val(),
            title: $(e.target).find("[name=title]").val()
        };

        //Meteor.call("updatePost", postProperties, postObject, function (error, result) {
        //    if (error)
        //        return alert(error.reason);
        //    if ("isNotuser" in result && result.isNotUser)
        //        return alert("The user has no permissions to modify this post!");
        //    if ("postExists" in result && result.postExists)
        //        return alert("This link has already been posted!");
        //    Router.go("postPage", {
        //        _id: result._id
        //    });
        //});

        Posts.update({
            _id: currentPostId
        }, {
            $set: postProperties
        }, function (error) {
            if (error) {
                alert(error.reason);
            } else {
                Router.go("postPage", {
                    _id: currentPostId
                });
            }
        });
    },
    "click .delete": function () {
        if (confirm("Delete This Post")) {
            var currentPostId = this._id;
            Posts.remove({
                _id: currentPostId
            });
            Router.go("postsList");
        }
    }
});