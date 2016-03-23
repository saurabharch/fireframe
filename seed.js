/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));


var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus',
            admin: true
        },
        {
            email: 'test@gmail.com',
            password: '1'
        },
        {
            email: 'user1@gmail.com',
            password: '1'
        }
    ];

    return User.createAsync(users);

};

var seedTeams = function() {
    
    var teams = [
        {
            name: "Team Alpha",
            administrator:,
            members:
        },
        {
            name: "Team Bravo",
            administrator:,
            members:
        }
    ];

    return;

};

var seedProjects = function() {

	var projects = [
        {
            name: Fullstack Website,
            team:
            type: Website
        }, 
        {
            name: Jimmys Newsletter
            team:
            type: Newsletter
        }
    ];

    return ; 
};

var seedWireframes = function() {
    
    var wireframes = [
        {
            master: true,
            project:,
            photoUrl: 'http://blog.skipper18.com/wp-content/uploads/2014/01/wireframe-example-large-1.png'
        },
        {
            master: true,
            project:,
            photoUrl: 'http://blog.skipper18.com/wp-content/uploads/2014/01/wireframe-example-large-1.png'
        }
    ];

    return;
};

var seedComponents = function() {

    var seedComponents = [
        {
            type: "box",
            style: {
                "background-color": "rgb(255, 255, 255)",
                "border-color": "rgb(128, 128, 128)",
                "border-style": "solid",
                height: "50px",
                left: 170,
                opacity: "1",
                top: 145.98959350585938,
                width: "50px",
                "z-index":  "0"
            },
            wireframe: 
        },
        {
            type: "circle",
            style: {
                "background-color": "rgb(255, 255, 255)",
                "border-color": "rgb(128, 128, 128)",
                "border-style": "dashed",
                height: "327px",
                left: 175.98959350585938,
                opacity: "1",
                top: 293.9930725097656,
                width: "309px",
                "z-index":  "0"
            },
            wireframe: 
        }
    ];

    return ;
};

connectToDb.then(function () {
	    
    User.findAsync({}).then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            process.kill(0);
        }
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
