// todo make goto full container
module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        creep.say('lorry');

        /*
        let dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            //filter: (e) => !Memory.droppedAssigned[e]
            filter: (e) => e.amount > 10
        });
        */
        let dropped = undefined;
        if(dropped == undefined) {
            dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
                //filter: (e) => !Memory.droppedAssigned[e]
                filter: (e) => e.amount > 50
            });
        }
        if(dropped != undefined) {
            //creep.transfer(creep.room.storage);
            //console.log(creep.transfer(creep.room.storage, RESOURCE_ENERGY));

            if (creep.memory.working == true && creep.carry.energy == 0) {
                // switch state
                creep.memory.working = false;
            }
            // if creep is harvesting energy but is full
            else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
                // switch state
                creep.memory.working = true;
            }

            if(creep.memory.working) {
                //structure = creep.room.storage;
                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.energy < s.energyCapacity
                });
                if (structure == undefined) {
                    structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (s) => s.energy < s.energyCapacity
                    });
                }
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure, {visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#fff',
                            lineStyle: 'dashed',
                            strokeWidth: .15,
                            opacity: .5}});
                    }
                }
            }
            else {
                //console.log('c',dropped.amount);


                if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(dropped, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#00ff00',
                        lineStyle: 'dashed',
                        strokeWidth: .15,
                        opacity: 1}});
                }
            }



            return false;
        }

        if(!creep.checkHomeRoom() && !creep.memory.target) {
            creep.say(creep.memory.home);
            return false;
        }






        creep.checkWorking();

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            let recToTransfer = RESOURCE_ENERGY;
            let structure = undefined;

            // if creep has no energy, but other recs, take them to the storage
            if(_.sum(creep.carry) > 0 && creep.carry.energy == 0) {
                structure = creep.room.storage;

                for(let recName in creep.carry) {
                    if(creep.carry[recName] > 0) {
                        recToTransfer = recName;
                        break;
                    }
                }
            }
            // take energy to spawn + ext
            if (structure == undefined) {
                structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_EXTENSION
                    || s.structureType == STRUCTURE_SPAWN)
                    && s.energy < s.energyCapacity
                });
            }
            // take energy to tower
            if (structure == undefined) {
                structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_TOWER)
                    && s.energy < s.energyCapacity
                });
            }
            // take energy to storage
            if (structure == undefined && creep.room.storage) {
                structure = creep.room.storage;
            }


            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, recToTransfer) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure, {visualizePathStyle: {
                        fill: 'transparent', 
                        stroke: '#fff', 
                        lineStyle: 'dashed', 
                        strokeWidth: .15, 
                        opacity: .5}});
                }
            }
        }
        // if creep is supposed to get energy
        else {

            if(!creep.handleDropped()) {
                return false;
            }

            // is there a long distance target?
            if(creep.memory.target != undefined) {
                //console.log('OMG');
                let container = Game.getObjectById(creep.memory.target);
                if(container != undefined) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        let targetMove = creep.moveTo(container, {
                            visualizePathStyle: {
                                fill: 'transparent',
                                stroke: '#90ff2f',
                                lineStyle: 'dotted',
                                strokeWidth: .5,
                                opacity: .5
                            }
                        });
                        if(targetMove == 0) {
                            delete creep.memory.target;
                        }
                    }
                    return false;
                }
            }

            // is there minerals in containers, not in storage?
            if(false) {
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER && (
                        s.store[RESOURCE_UTRIUM_HYDRIDE] > 0 ||
                        s.store[RESOURCE_UTRIUM_HYDRIDE] > 0 ||
                        s.store[RESOURCE_UTRIUM_HYDRIDE] > 0 ||
                        s.store[RESOURCE_] > 0
                    )
                });
            }


            //  find link
            let link = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (l) => l.structureType == STRUCTURE_LINK &&
                                l.id == '58b428557c10d66847004405' &&
                                l.energy > 0
            });
            //  find dropped energy
            let dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
                //filter: (e) => !Memory.droppedAssigned[e]
            });
            //console.log('dropped',dropped);

            // find closest container

            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > creep.carryCapacity,
                sortBy: s => s.store
            });

            if (container == undefined) {
                //container = creep.room.storage;
                container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY]  > creep.carryCapacity,
                });
            }
            if(container == undefined) {
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
                    sortBy: s => s.store
                });
            }

            if(link != undefined) {
                if (creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(link, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#00ff00',
                        lineStyle: 'dashed',
                        strokeWidth: .15,
                        opacity: 1}});
                }
            }
            else if(false && dropped != undefined) {
                if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(dropped, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#00ff00',
                        lineStyle: 'dashed',
                        strokeWidth: .15,
                        opacity: 1}});
                }
            }
            // if one was found
            else if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container, {visualizePathStyle: {
                        fill: 'transparent', 
                        stroke: '#fff', 
                        lineStyle: 'dashed', 
                        strokeWidth: .15, 
                        opacity: .5}});
                }
            }
            else {
                //console.log('blah');
            }
        }
    }
};