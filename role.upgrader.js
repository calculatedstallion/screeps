module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        creep.checkWorking();
        
        if(!creep.checkHomeRoom()) {
            creep.say(creep.memory.home);
            return false;
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
                if(creep.name == 'Mackenzie') {
                    //creep.move(BOTTOM_LEFT);
                }
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            let dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
                //filter: (e) => !Memory.droppedAssigned[e]
                filter: (e) => e.amount > 50
            });
            if(dropped != undefined) {
                if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(dropped, {
                        visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#00ff00',
                            lineStyle: 'dashed',
                            strokeWidth: .15,
                            opacity: 1
                        }
                    });
                }
                return false;
            }

            // is there energy in a container?
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE)
                && s.store[RESOURCE_ENERGY] > 0
            });
            if (structure != undefined) {
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