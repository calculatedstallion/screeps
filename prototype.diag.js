global.homeRoom = 'E23S81';
//global.targetXRoom = 'E24S81';
global.targetXRoom = 'E24S82';

// roomSet

if(Memory.roomSet == undefined) {
    Memory.roomSet = {
        E23S81: {
            E24S81: true,
            E24S82: true
        },
        E21S81: {
            E22S81: true,
            E22S82: true,
            E21S82: true
        },
        E24S83: {}
    }
}

global.roomSet = function() {
    console.log('roomSet',JSON.stringify(Memory.roomSet));
}

// nextspawn

global.nextSpawn = function() {
    return JSON.stringify(Memory.nextSpawn);
}

// LDH

global.LDH = function() {
    console.log('actual LDH',JSON.stringify(Memory.LDH));
    console.log('min LDH',JSON.stringify(Memory.minLDH));
}

global.ccs = function() {
    let ccs = {};

    // for each spawn
    for (let spawnName in Game.spawns) {
        let creepsInRoom = Game.spawns[spawnName].room.find(FIND_MY_CREEPS);
        //console.log(creepsInRoom);
        for(let creepID in creepsInRoom) {
            let creep = creepsInRoom[creepID];
            //console.log(creepID, creep);

            if(ccs[spawnName] == undefined) { ccs[spawnName] = {}; }
            if(ccs[spawnName][creep.memory.role] == undefined) { ccs[spawnName][creep.memory.role] = 0; }

            ccs[spawnName][creep.memory.role]++;

            //console.log(spawnName, creep.name, creep.memory.role);
        }
    }


    return JSON.stringify(ccs);
}

global.energy = function() {
    let rooms = [homeRoom,'E21S81','E24S83'];
    let res = {};

    for(let roomIndex in rooms) {
        let roomName = rooms[roomIndex];
        console.log(roomName);
        let room = Game.rooms[roomName];

        let sources = room.find(FIND_SOURCES_ACTIVE);
        let sourcesInfo = {};
        for (let sourceName in sources) {
            let source = sources[sourceName];
            //console.log(sourceName, source);
            //sourcesInfo[sourceName] = source.energy / source.ticksToRegeneration;
            sourcesInfo[sourceName] = Math.floor((100 / (source.energy / 10)) * source.ticksToRegeneration);
        }

        let energy = {
            energyAvailable: room.energyAvailable,
            energyCapacityAvailable: room.energyCapacityAvailable,
            sourcesInfo: sourcesInfo
        };
        res[roomName] = energy;
    }
    //console.log(JSON.stringify(Memory.LDH));
    //console.log(JSON.stringify(Memory.minLDH));
    return JSON.stringify(res)
}