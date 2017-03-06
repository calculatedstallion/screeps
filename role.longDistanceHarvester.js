module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        creep.say('LDH');

        if(!creep.handleDropped()) {
            return false;
        }

        creep.checkWorking();

        if(creep.memory.sourceIndex == 0 || true) {
            //console.log(creep.name,'yo');



            // find somewhere to put energy
            if (creep.memory.working == true) {
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

                //console.log('structure',structure);
                //console.log(creep.transfer(structure, RESOURCE_ENERGY));

                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    let wtf4 = creep.moveTo(structure, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#0000ff',
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
            }
            // find source
            else {
                let target = Game.rooms[creep.memory.target];
                if(target != undefined) {
                    Memory.targetRooms = {};
                    Memory.targetRooms[creep.memory.target] = target;
                }
                else if(Memory.targetRooms != undefined && Memory.targetRooms[creep.memory.target] != undefined){
                    //target = Memory.targetRooms[creep.memory.target];
                }

                if(target == undefined) {
                    var exit = creep.room.findExitTo(creep.memory.target);
                    // move to exit
                    let wtf = creep.moveTo(creep.pos.findClosestByPath(exit), {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#0000ff',
                        lineStyle: 'dashed',
                        strokeWidth: .15,
                        opacity: 1}});
                    return false;
                }
                //console.log(JSON.stringify(target));

                // find source
                var source = target.find(FIND_SOURCES)[creep.memory.sourceIndex];
                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    let wtf2 = creep.moveTo(source, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#0000ff',
                        lineStyle: 'dashed',
                        strokeWidth: .15,
                        opacity: 1}});
                    if(wtf2 == ERR_NO_PATH) {
                        //let wtf3 = creep.move(RIGHT);
                        //console.log('wtf3',wtf3);
                    }
                    //console.log('wtf2',wtf2);
                }
            }

            return false;
        }

        /*
        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // if in home room
            if (creep.room.name == creep.memory.home) {

                // if theres a container next to the source
                var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
                var structure = source.pos.findInRange(FIND_STRUCTURES, 10, {
                    filter: (s) => _.sum(s.store) < s.storeCapacity
                })[0];

                structure = creep.room.storage;

                // goto storage
                if (structure == undefined) {
                    var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_STORAGE)
                    });
                }

                // goto other spawns ext etc
                if (structure == undefined) {
                    // find closest spawn, extension or tower which is not full
                    structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_EXTENSION
                        || s.structureType == STRUCTURE_TOWER
                        || s.structureType == STRUCTURE_SPAWN)
                        && s.energy < s.energyCapacity
                    });
                    if (structure == undefined) {
                        structure = creep.room.storage;
                    }
                }

                // if we found one
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        let wtf4 = creep.moveTo(structure, {visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#0000ff',
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
                }
            }
            // if not in home room...
            else {
                // find exit to home room
                var exit = creep.room.findExitTo(creep.memory.home);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
        // if creep is supposed to harvest energy from source
        else {

            if(!creep.handleDropped()) {
                return false;
            }

            let dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
                //filter: (e) => !Memory.droppedAssigned[e]
            });
            //console.log('dropped',dropped);
            // dont pickup in home room, there are lorries to do that
            if(creep.room.name == 'W82N7') {
                dropped = undefined;
            }

            if(false && dropped != undefined) {
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
            else if (creep.room.name == creep.memory.target) {
               // find source
               var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
                // try to harvest energy, if the source is not in range
               if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                   // move towards the source
                   let wtf2 = creep.moveTo(source, {visualizePathStyle: {
                       fill: 'transparent',
                       stroke: '#0000ff',
                       lineStyle: 'dashed',
                       strokeWidth: .15,
                       opacity: 1}});
                   if(wtf2 == ERR_NO_PATH) {
                        let wtf3 = creep.move(RIGHT);
                       //console.log('wtf3',wtf3);
                   }
                   //console.log('wtf2',wtf2);
               }
            }
            // if not in target room
            else {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                // move to exit
                let wtf = creep.moveTo(creep.pos.findClosestByRange(exit), {visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#0000ff',
                    lineStyle: 'dashed',
                    strokeWidth: .15,
                    opacity: 1}});
                //console.log('wtf',wtf);
            }
        }
         */
    }
};