var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Project = mongoose.model('Project');
var Wireframe = mongoose.model('Wireframe');
var allUsers, allTeams;


connectToDb.then(function () {
    mongoose.connection.db.dropDatabase();
}).then(function() {
    chalk.green('Dropped DB before seeding');
    // console.log("LOOK HERE");
    return User.create([
        {   
            firstName: 'Gus',
            lastName: 'Fring',
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            firstName: 'Jeremy',
            lastName: 'Obama',
            email: 'obama@gmail.com',
            password: 'potus',
            admin: true
        },
        {
            firstName: 'Donald',
            lastName: 'Drumpf',
            email: 'test@gmail.com',
            password: '1'
        },
        {
            firstName: 'Ted',
            lastName: 'Rubio',
            email: 'user1@gmail.com',
            password: '1'
        }
    ]);
}).then(function(users) {
    allUsers = users;
    // console.log('users: ', users);
    return Team.create([
        {
            name: "Team Rebar",
            administrator: users[0],
            members: [users[1], users[2]]
        },
        {
            name: "Team Concrete",
            administrator: users[1],
            members: [users[3]]
        }
    ]);
}).then(function(teams) {
    allTeams = teams;
    // console.log('-------------')
    // console.log('teams: ', teams)

    return Wireframe.create([
        {
            master: true,

            components: [
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
                    }
                },
                {
                    type: "circle",
                    style: {
                        "background-color": "rgb(255, 255, 255)",
                        "border-color": "rgb(128, 128, 128)",
                        "border-style": "solid",
                        height: "327px",
                        left: 175.98959350585938,
                        opacity: "1",
                        top: 293.9930725097656,
                        width: "309px",
                        "z-index":  "0"
                    }
                }
            ],
            photoUrl: 'http://blog.skipper18.com/wp-content/uploads/2014/01/wireframe-example-large-1.png'
        },
        {
            master: true,
            components: [
                {
                    type: "box",
                    style: {
                        "background-color": "rgb(255, 255, 255)",
                        "border-color": "rgb(128, 128, 128)",
                        "border-style": "dashed",
                        height: "50px",
                        left: 170,
                        opacity: "1",
                        top: 145.98959350585938,
                        width: "30px",
                        "z-index":  "0"
                    }
                },
                {
                    type: "circle",
                    style: {
                        "background-color": "rgb(255, 255, 255)",
                        "border-color": "rgb(128, 128, 128)",
                        "border-style": "dashed",
                        height: "327px",
                        left: 180,
                        opacity: "1",
                        top: 293.9930725097656,
                        width: "200px",
                        "z-index":  "0"
                    }
                }
            ],
            photoUrl: 'http://wireframesketcher.com/samples/YouTube.png'
        }
    ]);

}).then(function(wireframes) {
    // console.log('-------------')
    // console.log('wireframes: ', wireframes)
    return Project.create([
        {
            name: "Fullstack Website",
            team: allTeams[0],
            creator: allUsers[0],
            wireframes: [wireframes[0]],
            type: "Website"
        }, 
        {
            name: "Jimmy's Newsletter",
            team: allTeams[1],
            creator: allUsers[1],
            wireframes: [wireframes[1]],
            type: "Newsletter"
        }
    ]);
}).then(function(){
    chalk.green('Seed successful!');
    process.kill(0);
}).catch(function (err) {
    console.log(err);
    process.kill(1);
});