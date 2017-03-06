var roleBuilder = require('role.builder');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {

        // check if objects in other rooms are <40%?
        // only send repairers from home room
        if(creep.room.name == homeRoom && false) {
            let roomRepair = ['E24S81'];
            //let roomRepair = ['W82N6','W83N7'];
            for (let roomIndex in roomRepair) {
                let roomName = roomRepair[roomIndex];
                let room = Game.rooms[roomName];

                // is there a creep there already?
                let numRepairers = _.sum(Game.creeps, c => c.memory.role == 'repairer' && c.memory.home == roomName);

                if(room != undefined) {
                    var structure = room.find(FIND_STRUCTURES, {
                        filter: (s) => s.hits < ((s.hitsMax / 4)*3) && (
                            s.structureType == STRUCTURE_ROAD ||
                            s.structureType == STRUCTURE_CONTAINER
                        )
                    })[0];
                }

                //console.log('rep',roomName,numRepairers,structure,structure.pos);

                // go to room!
                if(numRepairers == 0 && structure != undefined) {
                    console.log(roomName, numRepairers, structure.structureType, structure.hits, structure.hitsMax);
                    creep.memory.home = roomName;
                }
            }
        }

        if(!creep.checkHomeRoom()) {
            return false;
        }

        creep.say('repair');
        creep.checkWorking();

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            // look for containers
            var structure = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.hits < (s.hitsMax / 2) && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART

            }).sort(function (a, b) {
                return _.sum(a.hits) < _.sum(b.hits)
            })[0];
            if(structure == undefined) {
                var structure = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType == STRUCTURE_CONTAINER
                }).sort(function (a, b) {
                    return _.sum(a.hits) < _.sum(b.hits)
                })[0];
            }
            // look for anything except walls and ramparts
            if(structure == undefined) {
                structure = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
                }).sort(function (a, b) {
                    return _.sum(a.hits) < _.sum(b.hits)
                })[0];
            }

            // if we find one
            if (structure != undefined) {
                // try to repair it, if it is out of range
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ff9400',
                        lineStyle: 'dotted',
                        strokeWidth: .3,
                        opacity: 1}});
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
                roleBuilder.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // is there energy in a container?
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            });
            //console.log('structure',structure);
            if (structure != null) {
                if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(structure);
                }
            }
            else {

                // find closest source
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(source);
                }
            }
        }
    }
};