/*global Router, Posts, Meteor*/
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return Meteor.subscribe('notifications');
    }
});

PostsListController = RouteController.extend({
    template: "postsList",
    increment: 5,
    postsLimit: function() {
        return parseInt(this.params.postsLimit) || this.increment;
    },
    findOptions: function() {
        return {
            sort: {
                submitted: -1
            },
            limit: this.postsLimit()
        };
    },
    subscriptions: function() {
        this.postsSub = Meteor.subscribe("posts", this.findOptions());
    },
    posts: function() {
        return Posts.find({}, this.findOptions());
    },
    data: function() {
        var hasMore = this.posts().count() === this.postsLimit();
        var nextPath = this.route.path({
            postsLimit: this.postsLimit() + this.increment
        });
        return {
            posts: this.posts(),
            ready: this.postsSub.ready,
            nextPath: hasMore ? nextPath : null
        };
    }
});

Router.route('/posts/:_id', {
    name: 'postPage',
    waitOn: function() {
        return [
            Meteor.subscribe("singlePost", this.params._id),
            Meteor.subscribe("comments", this.params._id)
        ];
    },
    data: function() {
        return Posts.findOne(this.params._id);
    }
});

Router.route("/submit", {
    name: "postSubmit"
});

Router.route("/posts/:_id/edit", {
    name: "postEdit",
    waitOn: function() {
        return Meteor.subscribe("singlePost", this.params._id);
    },
    data: function() {
        return Posts.findOne(this.params._id);
    }
});

Router.route('/:postsLimit?', {
    name: 'postsList'
});


var requireLogin = function() {
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

var verifyOwnPost = function() {
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
