// Write your package code here!
/*global Mongo*/

Errors = {
    collection: new Mongo.Collection(null),
    throw: function (message) {
        return Errors.collection.insert({
            message: message,
            seen: false
        });
    }
};