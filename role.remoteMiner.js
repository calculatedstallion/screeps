module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        creep.say('RM');

        if(!creep.handleDropped()) {
            return false;
        }

        creep.checkWorking();

        // repair container
        // is there a container in range, with low hits
        var containerRepair = creep.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: (s) => s.hits < s.hitsMax && s.structureType == STRUCTURE_CONTAINER
        });
        if(containerRepair.length > 0) {
            //console.log('containerRepair',containerRepair, containerRepair[0].hits);
            if (creep.repair(containerRepair[0]) == ERR_NOT_IN_RANGE) {
                // move towards it
                creep.moveTo(containerRepair[0], {visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#ff9400',
                    lineStyle: 'dotted',
                    strokeWidth: .3,
                    opacity: 1}});
            }
        }

        // find somewhere to put energy
        if (creep.memory.working == true) {

            // find closest spawn, extension or tower which is not full
            let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => _.sum(s.store) < s.storeCapacity
            });

            //console.log('structure',structure);
            //console.log(creep.transfer(structure, RESOURCE_ENERGY));

            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // move towards it
                let wtf4 = creep.moveTo(structure, {visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#ff28e9',
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
                    stroke: '#ff28e9',
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
                    stroke: '#ff28e9',
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
    }
};