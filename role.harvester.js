var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        //creep.say('harvester');
        // have we set a source?
        if (creep.memory.source == undefined) {
            // num sources
            var sources = creep.room.find(FIND_SOURCES);
            // num miners
            var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            //var miners = _(Game.creeps).filter({ memory: { role: 'miner' }}).value();

            // num miners per source
            var numMinersPerSource = Math.ceil(miners.length / sources.length);
            //console.log('numMinersPerSource',numMinersPerSource);

            var Xsources = [];
            for (let source in sources) {
                Xsources[source] = 0;
            }

            // loop through miners
            for (let name in Game.creeps) {
                var creepx = Game.creeps[name];

                if(creepx.memory.role == 'harvester' && creepx.memory.source != undefined) {
                    Xsources[creepx.memory.source]++;
                }
            }
            //console.log('Xsources',Xsources);


            for (let source in sources) {
                //should i add to it?
                if(Xsources[source] < numMinersPerSource) {
                    creep.memory.source = source;
                    console.log('assigning '+creep+' to '+source);
                    break;
                }
            }
        }

        creep.checkWorking();

        // if creep is supposed to transfer energy to the spawn or an extension
        if (creep.memory.working == true) {
            // find closest spawn or extension which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => s.energy < s.energyCapacity
            });
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => _.sum(s.store) < s.storeCapacity
            });

            // if we found one
            if (structure != null) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
            // put it in a container
            else if(container != null) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container);
                }
            }
            else {
                //console.log('idle', creep.name);
                //creep.say('idle');
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            var sources = creep.room.find(FIND_SOURCES);
            // specifically goto source 0 (middle)
            // need to load balance source 1 (bottom left)
            if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.source]);
            }
            /*
            // find closest source
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            // try to harvest energy, if the source is not in range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(source);
            }
            */
        }
    }
};