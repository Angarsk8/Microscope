/*global Posts*/
var postsData = [
    {
        title: 'Introducing Telescope',
        url: 'http://sachagreif.com/introducing-telescope/',
        author: "Sacha Greif"
    },
    {
        title: 'Meteor',
        url: 'http://meteor.com',
        author: "Tom Coleman"
    },
    {
        title: 'The Meteor Book',
        url: 'http://themeteorbook.com',
        author: "Tom Coleman"
    }
];

if (Posts.find().count() === 0) {
    postsData.forEach(function (post) {
        return Posts.insert(post);
    });
}