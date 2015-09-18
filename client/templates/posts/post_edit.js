/*global Template, $, Posts, Router, Errors, Session, validatePost*/
Template.postEdit.events({
    "submit form": function (e) {
        e.preventDefault();
        //var postObject = this;
        var currentPostId = this._id;
        var postProperties = {
            url: $(e.target).find("[name=url]").val(),
            title: $(e.target).find("[name=title]").val()
        };
        var errors = validatePost(postProperties);
        if (errors.title || errors.url)
            return Session.set("postSubmitErrors", errors);
        /*Meteor.call("updatePost", postProperties, postObject, function (error, result) {
            if (error)
                return alert(error.reason);
            if ("isNotuser" in result && result.isNotUser)
                return alert("The user has no permissions to modify this post!");
            if ("postExists" in result && result.postExists)
                return alert("This link has already been posted!");
            Router.go("postPage", {
                _id: result._id
            });
        });*/
        Posts.update({
            _id: currentPostId
        }, {
            $set: postProperties
        }, function (error) {
            if (error) {
                Errors.throw(error.reason);
            } else {
                Router.go("postPage", {
                    _id: currentPostId
                });
            }
        });
    },
    "click .delete": function (e) {
        e.preventDefault();
        if (confirm("Delete This Post")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go("postsList");
        }
    }
});

Template.postEdit.onCreated(function () {
    Session.set("postSubmitErrors", {});
});

Template.postEdit.helpers({
    errorMessage: function (field) {
        return Session.get("postSubmitErrors")[field];
    },
    errorClass: function (field) {
        return !!Session.get("postSubmitErrors")[field] ? "has-error" : "";
    }
});