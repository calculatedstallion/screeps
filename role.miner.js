var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        creep.say('miner');
        
        creep.setSource();

        creep.checkWorking();

        if(!creep.checkHomeRoom()) {
            creep.say(creep.memory.home);
            return false;
        }

        //console.log(creep.name,creep.memory.working);

        // if creep is supposed to transfer energy to the spawn or an extension
        if (creep.memory.working == true) {
            var link = creep.pos.findInRange(FIND_MY_STRUCTURES, 5, {
                filter: (l) => l.structureType == STRUCTURE_LINK && l.energy < l.energyCapacity
            })[0];
            //console.log('link',link);
            var container = creep.pos.findInRange(FIND_STRUCTURES, 10, {
                filter: (s) => _.sum(s.store) < s.storeCapacity
            })[0];

            if(creep.room.name == 'W82N8' && container == undefined) {
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => _.sum(s.store) < s.storeCapacity
                });
            }

            if(link != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(link, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#000',
                        lineStyle: 'dashed',
                        strokeWidth: .15,
                        opacity: 1}});
                }
            }
            else if(container != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#000',
                        lineStyle: 'dashed',
                        strokeWidth: .15,
                        opacity: 1}});
                }
            }
            else {
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            var sources = creep.room.find(FIND_SOURCES);
            // specifically goto source 0 (middle)
            // need to load balance source 1 (bottom left)
            if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                let wtf6 = creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#000',
                    lineStyle: 'dashed',
                    strokeWidth: .15,
                    opacity: 1}});
                //console.log(creep.name,'wtf6',wtf6);
            }
        }
    }
};