var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        creep.say('builder');


        creep.checkWorking();




        // move a builder from main home to another room
        // check there aren't too many builders in target room
        // todo - check rooms for construction?
        // todo bring the builders back to home room if there are no more construction sites
        if(creep.ticksToLive > 1300 && false) {
            let maxCreepsInRemoteRooms = 2;
            let keepCreepsInHomeRoom = 1;

            loop1: for(let MainRoomName in Memory.roomSet) {

                //console.log(creep.room.name, MainRoomName);
                // check if creep is in one of the main rooms
                if(creep.room.name == MainRoomName) {

                    //console.log('MainRoomName', MainRoomName);
                    loop2: for (let TargetRoomName in Memory.roomSet[MainRoomName]) {
                        //console.log('-- TargetRoomName', TargetRoomName);

                        var creepsInMainRoom = Game.rooms[MainRoomName].find(FIND_MY_CREEPS, {
                            filter: c => c.memory.role == 'builder' && c.memory.home != TargetRoomName
                        });
                        if (Game.rooms[TargetRoomName] == undefined) {
                            var consInTargetRoom = 0;
                        }
                        else {
                            var consInTargetRoom = Game.rooms[TargetRoomName].find(FIND_CONSTRUCTION_SITES).length;
                        }

                        var creepsInTargetRoom = _.sum(Game.creeps, (c) => c.memory.role == 'builder' && c.memory.home == TargetRoomName);
                        //var creepsInTargetRoom2 = _.filter(Game.creeps, (c) => c.memory.role == 'builder' && c.memory.home == target);

                        //console.log('creepsInTargetRoom',TargetRoomName, creepsInTargetRoom);
                        //console.log('creepsInTargetRoom',consInTargetRoom,creepsInMainRoom.length,keepCreepsInHomeRoom,creepsInTargetRoom,maxCreepsInRemoteRooms);
                        //console.log(consInTargetRoom);
                        if (consInTargetRoom > 0 && creepsInMainRoom.length >= keepCreepsInHomeRoom && creepsInTargetRoom < maxCreepsInRemoteRooms) {
                            console.log('creep to remote',creepsInMainRoom[0]);
                            creepsInMainRoom[0].memory.home = TargetRoomName;
                        }
                    }
                }
            }

            /*
            var target = 'E24S81';
            //var target = 'E21S81';

            var creepsInMainRoom = Game.rooms[homeRoom].find(FIND_MY_CREEPS, {
                filter: c => c.memory.role == 'builder' && c.memory.home != target
            });
            if (Game.rooms[target] == undefined) {
                var consInTargetRoom = 0;
            }
            else {
                var consInTargetRoom = Game.rooms[target].find(FIND_CONSTRUCTION_SITES).length;
            }

            var creepsInTargetRoom = _.sum(Game.creeps, (c) => c.memory.role == 'builder' && c.memory.home == target);
            //var creepsInTargetRoom2 = _.filter(Game.creeps, (c) => c.memory.role == 'builder' && c.memory.home == target);

            //console.log('creepsInTargetRoom',creepsInTargetRoom);
            //console.log(consInTargetRoom);
            if (consInTargetRoom > 0 && creepsInMainRoom.length >= keepCreepsInHomeRoom && creepsInTargetRoom < maxCreepsInRemoteRooms) {
                //console.log('creep to remote',creepsInMainRoom[0]);
                creepsInMainRoom[0].memory.home = target;
            }
            */
        }


        if(!creep.checkHomeRoom()) {
            //creep.say(target);
            return false;
        }



        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                filter: (s) => s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_CONTAINER
            });
            if(constructionSite == undefined) {
                constructionSite = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_EXTENSION
                }).sort(function (a, b) {
                    return _.sum(a.progress) < _.sum(b.progress)
                })[0];
                //console.log(constructionSite);
            }
            if(constructionSite == undefined) {
                constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                    filter: (s) => s.structureType == STRUCTURE_TOWER
                });
            }
            if(constructionSite == undefined) {
                constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                    filter: (s) => s.structureType == STRUCTURE_ROAD
                });
            }
            if(constructionSite == undefined) {
                constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            }

            // if one is found
            if (constructionSite != undefined) {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ffd900',
                        lineStyle: 'dotted',
                        strokeWidth: .3,
                        opacity: 1}});
                }
            }
            // if no constructionSite is found
            else {
                // go upgrading the controller
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // is there energy in a container half full?
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0,
            });
            if (structure == undefined) {
                structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > (s.storeCapacity / 2),
                });
            }
            // container less than half full, but most full
            if (structure == undefined) {
                structure = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
                }).sort(function (a, b) {
                    return _.sum(a.store) < _.sum(b.store)
                })[0];
            }

            if (structure != undefined) {
                //console.log(creep.withdraw(structure, RESOURCE_ENERGY),ERR_NOT_IN_RANGE);
                if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(structure, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ffd900',
                        lineStyle: 'dotted',
                        strokeWidth: .3,
                        opacity: 1}});
                    //console.log('moving towards',structure);
                }
                else {
                    //console.log('withdraw energy from cont');
                }
            }
            else {
                // find closest source
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    //console.log(creep.name, source,creep.moveTo(source));

                    if((creep.name == 'Ethan' || creep.name == 'Lincoln' || creep.name == 'Hunter') && false) {
                        creep.moveTo(20,27, {visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#fff2b3',
                            lineStyle: 'dotted',
                            strokeWidth: .3,
                            opacity: 1}});
                        return false;
                    }

                    var movesource = creep.moveTo(source, {maxRooms: 1, visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#fff2b3',
                        lineStyle: 'dotted',
                        strokeWidth: .3,
                        opacity: 1}});
                }
            }
        }
    }
};