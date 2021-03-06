/*global Template, $, Posts, Router, Errors, Session, validatePost*/
Template.postEdit.events({
    "submit form": function(e) {
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
        Posts.update({
            _id: currentPostId
        }, {
            $set: postProperties
        }, function(error) {
            if (error) {
                Errors.throw(error.reason);
            } else {
                Router.go("postPage", {
                    _id: currentPostId
                });
            }
        });
    },
    "click .delete": function(e) {
        e.preventDefault();
        if (confirm("Delete This Post")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go("home");
        }
    }
});

Template.postEdit.onCreated(function() {
    Session.set("postSubmitErrors", {});
});

Template.postEdit.helpers({
    errorMessage: function(field) {
        return Session.get("postSubmitErrors")[field];
    },
    errorClass: function(field) {
        return !!Session.get("postSubmitErrors")[field] ? "has-error" : "";
    }
});
