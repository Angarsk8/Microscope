/*global Template, Errors, Meteor*/

Template.meteorErrors.helpers({
    errors: function () {
        return Errors.collection.find();
    }
});

Template.meteorError.onRendered(function () {
    var error = this.data;
    Meteor.setTimeout(function () {
        Errors.collection.remove({
            _id: error._id
        });
    }, 3000);
});

