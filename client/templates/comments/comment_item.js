/*global Template*/

Template.commentItem.helpers({
    submittedText: function () {
        return this.submitted.toString();
    }
});