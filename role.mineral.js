var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        creep.say('mineral');

        //creep.checkWorking();
        // if creep is bringing energy to the spawn or an extension but has no energy left
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the spawn or an extension
        if (creep.memory.working == true) {
            let container = creep.room.storage;
            if(container != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(container, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
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
            var source = creep.room.find(FIND_MINERALS)[0];
            // specifically goto source 0 (middle)
            // need to load balance source 1 (bottom left)
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#000',
                    lineStyle: 'dashed',
                    strokeWidth: .15,
                    opacity: 1}});
            }
        }
    }
};