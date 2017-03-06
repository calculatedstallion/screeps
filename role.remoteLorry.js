var roleLorry = require('role.lorry');

module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        creep.say('RL');

        if(!creep.handleDropped()) {
            return false;
        }

        creep.checkWorking();

        // find somewhere to put energy
        if (creep.memory.working == true) {

            // repair container
            // is there a container in range, with low hits

            var roadRepair = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (s) => s.hits < s.hitsMax && s.structureType == STRUCTURE_ROAD
            });
            if(roadRepair.length > 0) {
                //console.log('roadRepair',roadRepair, roadRepair[0].hits, creep.repair(roadRepair[0]));
                if (creep.repair(roadRepair[0]) == ERR_NOT_IN_RANGE) {
                }
            }

            // in home room
            let home = Game.rooms[homeRoom];

            let structure = home.storage;

            // goto other spawns ext etc
            if (structure == undefined) {
                // find closest spawn, extension or tower which is not full
                structure = home.find(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_EXTENSION
                    || s.structureType == STRUCTURE_TOWER
                    || s.structureType == STRUCTURE_SPAWN)
                    && s.energy < s.energyCapacity
                })[0];
            }
            if (structure == undefined) {
                // find closest spawn, extension or tower which is not full
                structure = home.find(FIND_STRUCTURES, {
                    filter: (s) => _.sum(s.store) < s.storeCapacity
                })[0];
            }

            // do transfer
            let transfer = creep.transfer(structure, RESOURCE_ENERGY);

            if (transfer == ERR_NOT_IN_RANGE) {
                // move towards it
                let wtf4 = creep.moveTo(structure, {visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#58a1ff',
                    lineStyle: 'dashed',
                    strokeWidth: .15,
                    opacity: 1}});
                //console.log('wtf4',wtf4);
                //console.log('LDH structure',structure.structureType, structure.pos);

                if(wtf4 == ERR_NO_PATH) {
                    let wtf5 = creep.move(LEFT);
                    //console.log('wtf3',wtf3);
                }
            }
            else if(transfer === 0) {
                delete creep.memory.target;
            }
        }
        // find source
        else {
            // is target already set
            if(creep.memory.target != undefined) {
                let container = Game.getObjectById(creep.memory.target);
                if (container != undefined) {
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
                    delete creep.memory.target;
                }
            }
            else {
                // no target set, find one
                let roomRL = ['E24S81'];
                let rlInHome = Game.rooms[homeRoom].find(FIND_MY_CREEPS, {
                    filter: (c) => c.memory.role == 'remoteLorry'
                });
                loop1: for (let roomIndex in roomRL) {
                    let roomName = rlInHome[roomIndex];
                    let room = Game.rooms[roomRL];

                    //console.log('RL',room,roomName);
                    if (room != undefined) {
                        // get rooms not owned, but with containers in
                        let containers = room.find(FIND_STRUCTURES, {
                            filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > creep.carryCapacity
                            //filter: s => s.structureType == STRUCTURE_CONTAINER
                        });
                        loop2: for(let containerIndex in containers) {
                            let container = containers[containerIndex];
                            //console.log('RL', container);
                            // how many containers in room

                            // check container exists
                            if (container != undefined) {
                                // send lorry from main

                                // keep remote containers in memory, with existing energy amount
                                // allocate everything en route to make a withdrawal (all creep roles)
                                // determine container energy unclaimed amount
                                // check lorries against unclaimed and send accordingly

                                // check if lorry is already going to container
                                let lorryCheck = _.sum(Game.creeps, c => c.memory.role == 'remoteLorry' && c.memory.target == container.id);
                                //let lorryCheck = 0;
                                //console.log(container, lorryCheck);
                                if (lorryCheck == 0) {

                                    creep.memory.target = container.id;
                                    console.log('RL being assigned! ', container, creep.name, container.pos);
                                    //Game.notify('RM being assigned! '+container+' - '+creep.name+' - '+container.pos+' - '+container.room);
                                    break loop1;
                                }
                            }
                        }
                    }
                }
            }

            // if nothing to collect yet, be a domestic lorry
            if(creep.memory.target == undefined) {
                roleLorry.run(creep);
            }
        }
    }
};