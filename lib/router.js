/*global Router, Posts, Meteor*/
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function () {
        return Meteor.subscribe('posts');
    }
});

Router.route('/', {
    name: 'postsList'
});

Router.route('/posts/:_id', {
    name: 'postPage',
    data: function () {
        return Posts.findOne(this.params._id);
    }
});

Router.route("/submit", {
    name: "postSubmit"
});

Router.route("/posts/:_id/edit", {
    name: "postEdit",
    data: function () {
        return Posts.findOne(this.params._id);
    }
});

var requireLogin = function () {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render("loading");
        } else {
            this.render("accessDenied");
        }
    } else {
        this.next();
    }
};

var verifyOwnPost = function () {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render("loading");
        } else {
            this.render("accessDenied");
        }
    } else {
        var post = Posts.findOne({
            _id: this.params._id
        });
        var postUserId = post ? post.userId : null;
        if (postUserId) {
            if (postUserId != Meteor.userId()) {
                this.render("accessDenied");
            } else {
                this.next();
            }
        } else {
            this.render("postsList");
        }
    }
};

Router.onBeforeAction('dataNotFound', {
    only: 'postPage'
});

Router.onBeforeAction(requireLogin, {
    only: "postSubmit"
});

//Router.onBeforeAction(verifyOwnPost, {
//    only: "postEdit"
//});