var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer'),
    wallRepairer: require('role.wallRepairer'),
    longDistanceHarvester: require('role.longDistanceHarvester'),
    claimer: require('role.claimer'),
    miner: require('role.miner'),
    lorry: require('role.lorry'),
    attack: require('role.attack'),
    mineral: require('role.mineral'),
    remoteMiner: require('role.remoteMiner'),
    remoteLorry: require('role.remoteLorry')
};

Creep.prototype.runRole =
    function () {
        roles[this.memory.role].run(this);
    };

/** @function
 @param {bool} useContainer
 @param {bool} useSource */
Creep.prototype.getEnergy =
    function (useContainer, useSource) {
        /** @type {StructureContainer} */
        let container;
        // if the Creep should look for containers
        if (useContainer) {
            // find closest container
            container = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                s.store[RESOURCE_ENERGY] > 0
            });
            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    this.moveTo(container);
                }
            }
        }
        // if no container was found and the Creep should look for Sources
        if (container == undefined && useSource) {
            // find closest source
            var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

            // try to harvest energy, if the source is not in range
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards it
                this.moveTo(source);
            }
        }
    };

Creep.prototype.checkWorking = function() {
    var creep = this;
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
}

Creep.prototype.setSource = function() {
    var creep = this;

    if(!Memory.minerSource) { Memory.minerSource = {}; }
    if(!Memory.minerSource[creep.room.name]) { Memory.minerSource[creep.room.name] = {}; }
    //console.log('room',creep.room.name);

    // have we set a source?
    //if ((creep.memory.source == undefined || true) && creep.room.name == 'W82N8') {
    if(creep.memory.source == undefined) {
        //creep.memory.source = undefined;

        // num sources
        var sources = creep.room.find(FIND_SOURCES);

        creepsInRoom = creep.room.find(FIND_MY_CREEPS);

        // num miners
        var miners = _.filter(creepsInRoom, (creep) => creep.memory.role == 'miner');

        // num miners per source
        var numMinersPerSource = Math.ceil(miners.length / sources.length);
        //console.log('numMinersPerSource',numMinersPerSource);

        //var sourcesArray = [];
        for (let source in sources) {
            Memory.minerSource[creep.room.name][source] = 0;
        }

        // loop through miners
        for (let name in miners) {
            //var thisCreep = Game.creeps[name];
            var thisCreep = miners[name];
            //console.log(name, thisCreep);

            if(thisCreep != undefined && thisCreep.memory.role == 'miner' && thisCreep.memory.source != undefined) {
                Memory.minerSource[creep.room.name][thisCreep.memory.source]++;
                //console.log('+');
            }
        }


        for (let source in sources) {
            //should i add to it?
            if(Memory.minerSource[creep.room.name][source] < numMinersPerSource) {
                creep.memory.source = source;
                console.log('assigning '+creep+' to '+source);
                break;
            }
        }

        //console.log('sourcesArray',JSON.stringify(Memory.minerSource[creep.room.name]));
    }
}

Creep.prototype.moveToFlag = function() {
    creep = this;
    creep.memory.home = 'W82N8';

    //console.log(creep.room.name, creep.memory.home);
    if (creep.room.name != creep.memory.home) {
        //creep.say('builder');
        let flag = Game.flags.Flag1;
        creep.moveTo(flag, {visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ff0000',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: 1}});


        return false;
    }
}

Creep.prototype.checkHomeRoom = function() {
    creep = this;
    //creep.memory.home = 'W82N8';

    //console.log(creep.room.name, creep.memory.home);
    if (creep.memory.home != undefined && creep.room.name != creep.memory.home) {
        // find exit to home room
        var exit = creep.room.findExitTo(creep.memory.home);
        // and move to exit
        let findexit = creep.moveTo(creep.pos.findClosestByPath(exit), {visualizePathStyle: {
            fill: 'transparent',
            stroke: '#36f7ff',
            lineStyle: 'dashed',
            strokeWidth: .05,
            opacity: 1}});
        return false;
    }
    else {
        return true;
    }
}



Creep.prototype.droppedAssign = function(drop_id) {
    if(!Memory.droppedAssigned) {
        //Memory.droppedAssigned = {};
    }
    Memory.droppedAssigned[drop_id] = this.name;
    this.memory.drop = drop_id;
}
Creep.prototype.droppedUnassign = function(drop_id) {
    if(!Memory.droppedAssigned) {
        //Memory.droppedAssigned = {};
    }
    delete Memory.droppedAssigned[drop_id];
    delete this.memory.drop;
}

Creep.prototype.getDropped = function(dropped) {
    let creep = this;

    if(dropped != undefined) {
        let pickup = creep.pickup(dropped);
        if (pickup == ERR_NOT_IN_RANGE) {
            // move towards it
            creep.moveTo(dropped, {visualizePathStyle: {
                fill: 'transparent',
                stroke: '#00ff00',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: 1}});
            return false;
        }
        else if(pickup == 0) {
            console.log('-- drop collected - ',creep.name, dropped.amount);
            creep.droppedUnassign(dropped.id);
        }

        // when drop has been fully picked up, remove assignments
    }
    else {
        return true;
    }
}

Creep.prototype.handleDropped = function() {
    let creep = this;

    //  find dropped energy
    // todo - this should be in main, so its not running the same shit in multiple places
    let dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
        filter: (d) => !Memory.droppedAssigned[d.id]
                    && d.amount > 1
    });

    //console.log(dropped);

    // check if creep is already assigned to a drop
    if(dropped != undefined && creep.memory.drop == undefined) {
        console.log('droppedAssigned',JSON.stringify(Memory.droppedAssigned));
        console.log('dropped',dropped);
        // assign creep to drop
        creep.droppedAssign(dropped.id);
        // run drop action
        return creep.getDropped(dropped);
    }
    else {
        return true;
    }

}