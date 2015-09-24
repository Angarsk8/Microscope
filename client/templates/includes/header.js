/*global Template, Session*/

Template.header.helpers({
    pageTitle: function() {
        return Session.get("pageTitle");
    },
    activeRouteClass: function( /*all routes go here*/ ) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();
        var active = args.some(function(route) {
            return Router.current() && Router.current().route.getName() == route
        });
        return active && "active"
    }
});


Session.setDefault("pageTitle", "Microscope");
