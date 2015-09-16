/*global Template, Session*/

Template.header.helpers({
    pageTitle: function () {
        return  Session.get("pageTitle");
    }
});


Session.setDefault("pageTitle", "Microscope");