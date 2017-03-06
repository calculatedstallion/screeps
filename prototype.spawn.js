

var listOfRolesX = {
    'harvester': [WORK,WORK,CARRY,MOVE],
    'miner': [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
    'mineral': [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
    //'builder': [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE],
    'builder': [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
    'repairer': [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
    'wallRepairer': [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
    'upgrader': [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
    'lorry': [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    'attack': [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
};

var listOfRoles1 = {
    'harvester': [WORK,WORK,CARRY,MOVE],
    'miner': [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
    'remoteMiner': [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
    'mineral': [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
    //'builder': [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE],
    'builder': [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    'repairer': [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
    'wallRepairer': [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
    'upgrader': [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE],
    'lorry': [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    'remoteLorry': [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,MOVE],
    'attack': [MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
};
var listOfRoles2 = {
    'harvester': [WORK,WORK,CARRY,MOVE],
    'miner': [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
    'mineral': [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
    'builder': [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],
    'repairer': [WORK,WORK,CARRY,MOVE],
    'wallRepairer': [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
    'upgrader': [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE],
    'lorry': [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    'attack': [MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
};
var listOfRoles3 = {
    'harvester': [WORK,WORK,CARRY,MOVE],
    'miner': [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
    'mineral': [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
    'builder': [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
    'repairer': [WORK,WORK,CARRY,MOVE],
    'wallRepairer': [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
    'upgrader': [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
    'lorry': [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    'attack': [MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
};

    // create best role for max energy?
    
    StructureSpawn.prototype.createCustomCreep = 
    function(roleName, home) {
        if(this.name == 'Spawn3' ) {
            listOfRolesY = listOfRoles3;
        }
        else if(this.name == 'Spawn2' ) {
            listOfRolesY = listOfRoles2;
        }
        else {
            listOfRolesY = listOfRoles1;
        }

        if(!home) {
            home = this.room.name;
        }

        // get home room
        // from spawn name

        //console.log(roleName, listOfRolesX[roleName]);
        return this.createCreep(listOfRolesY[roleName], undefined, { role: roleName, working: false, home: home});
    };
    
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreepX =
        function (energy, roleName) {
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200);
            // make sure the creep is not too big (more than 50 parts)
            numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
            var body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
    
            // create creep with the created body and the given role
            return this.createCreep(body, undefined, { role: roleName, working: false });
        };
        
// create a new function for StructureSpawn
StructureSpawn.prototype.createLongDistanceHarvester =
    function (energy, numberOfWorkParts, home, target, sourceIndex) {

        // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
        var body = [];
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }
        energy -= 100 * numberOfWorkParts;

        // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
        //energy -= 150 * numberOfWorkParts;

        var numberOfParts = Math.floor(energy / 100);
        // make sure the creep is not too big (more than 50 parts)

        //console.log('numberOfParts',numberOfParts);
        numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
        //console.log('energy',energy,'numberOfParts',numberOfParts);
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
        //console.log(body);

        // create creep with the created body
        return this.createCreep(body, undefined, {
            role: 'longDistanceHarvester',
            home: home,
            target: target,
            sourceIndex: sourceIndex,
            working: false
        });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createClaimer =
    function (target, mode) {
        if(!mode) { mode = 'reserve'; }
        return this.createCreep([CLAIM,CLAIM,MOVE], undefined, { role: 'claimer', target: target, mode: mode });
    };

var listOfRoles = ['harvester', 'lorry', 'claimer', 'upgrader', 'repairer', 'builder', 'wallRepairer'];

StructureSpawn.prototype.spawnCreepsIfNecessary = function() {
    /** @type {Room} */
    let room = this.room;
    // find all creeps in room
    /** @type {Array.<Creep>} */
    let creepsInRoom = room.find(FIND_MY_CREEPS);

    // count the number of creeps alive for each role in this room
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a specific role
    /** @type {Object.<string, number>} */
    let numberOfCreeps = {};
    for (let role of listOfRoles) {
        numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
    }
    let maxEnergy = room.energyCapacityAvailable;
    let name = undefined;
    //console.log(this.name,JSON.stringify(numberOfCreeps));


    // setup some minimum numbers for different roles

    if(this.name == 'Spawn3') {
        var minimumNumberOfHarvesters = 0;
        var minimumNumberOfMiners = 2;
        var minimumNumberOfRemoteMiners = 0;
        var minimumNumberOfLong = 0;
        var minimumNumberOfWallRepairers = 0;
        var minimumNumberOfRepairers = 1;
        var minimumNumberOfLorries = 2;
        var minimumNumberOfRemoteLorries = 0;
        var minimumNumberOfUpgraders = 2;
        var minimumNumberOfBuilders = 2;
        var minimumNumberOfMinerals = 0;
    }
    else if(this.name == 'Spawn2') {
        var minimumNumberOfHarvesters = 0;
        var minimumNumberOfMiners = 2;
        var minimumNumberOfRemoteMiners = 0;
        var minimumNumberOfLong = 0;
        var minimumNumberOfWallRepairers = 0;
        var minimumNumberOfRepairers = 1;
        var minimumNumberOfLorries = 2;
        var minimumNumberOfRemoteLorries = 0;
        var minimumNumberOfUpgraders = 2;
        var minimumNumberOfBuilders = 2;
        var minimumNumberOfMinerals = 0;
    }
    else {
        var minimumNumberOfHarvesters = 0;
        var minimumNumberOfMiners = 2;
        var minimumNumberOfRemoteMiners = 2;
        var minimumNumberOfLong = 0;
        var minimumNumberOfWallRepairers = 0;
        var minimumNumberOfRepairers = 1;
        var minimumNumberOfLorries = 2;
        var minimumNumberOfRemoteLorries = 2;
        var minimumNumberOfUpgraders = 3;
        var minimumNumberOfBuilders = 1;
        var minimumNumberOfMinerals = 0;
    }

    var minimumNumberOfAttackers = 0;


    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfAttackers = _.sum(creepsInRoom, (c) => c.memory.role == 'attack');
    var numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
    var numberOfLorries = _.sum(creepsInRoom, (c) => c.memory.role == 'lorry');
    var numberOfRemoteLorries = _.sum(Game.creeps, (c) => c.memory.role == 'remoteLorry');
    var numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'repairer');
    var numberOfWallRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'wallRepairer');
    var numberOfMiners = _.sum(creepsInRoom, (c) => c.memory.role == 'miner');
    var numberOfRemoteMiners = _.sum(Game.creeps, (c) => c.memory.role == 'remoteMiner');
    var numberOfMinerals = _.sum(creepsInRoom, (c) => c.memory.role == 'mineral');
    var numberOfLong = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester');
    //console.log(this.name, "Harvesters:"+numberOfHarvesters, "Upgraders:"+numberOfUpgraders, "Builders:"+numberOfBuilders, "Repairers:"+numberOfRepairers, "Miners:"+numberOfMiners);

    if(this.name == 'Spawn1') {
        if (numberOfMiners == 0) {
            Game.notify('No miners!');
        }
        if (numberOfLorries == 0) {
            Game.notify('No lorries!');
        }
    }


    var tryingRole = undefined;

    // if not enough harvesters
    if (numberOfAttackers < minimumNumberOfAttackers) {
        // try to spawn one
        tryingRole = 'attack';
        name = this.createCustomCreep(tryingRole);
    }
    // if not enough harvesters
    else if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        tryingRole = 'harvester';
        name = this.createCreep([WORK,WORK,CARRY,MOVE], undefined, { role: tryingRole, working: false});
    }
    // if not enough miners
    else if (numberOfMiners < minimumNumberOfMiners) {
        // try to spawn one
        tryingRole = 'miner';
        name = this.createCustomCreep(tryingRole);
    }
    else if (numberOfLorries < minimumNumberOfLorries) {
        // try to spawn one
        tryingRole = 'lorry';
        name = this.createCustomCreep(tryingRole);
    }
    // if not enough miners
    else if (numberOfRemoteMiners < minimumNumberOfRemoteMiners) {
        // try to spawn one
        tryingRole = 'remoteMiner';
        var xy = this.getNextRM();

        if (xy.RMTarget != undefined && xy.RMSourceIndex != undefined) {

            name = this.createCustomCreep(tryingRole);
            if (!(name < 0) && name != undefined) {

                Game.creeps[name].memory.target = xy.RMTarget;
                Game.creeps[name].memory.sourceIndex = xy.RMSourceIndex;
            }
        }
        else {
            name = -100;
        }
    }
    else if (numberOfRemoteLorries < minimumNumberOfRemoteLorries) {
        // try to spawn one
        tryingRole = 'remoteLorry';
        name = this.createCustomCreep(tryingRole);
    }
    // if not enough upgraders
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        // try to spawn one
        tryingRole = 'upgrader';
        name = this.createCustomCreep(tryingRole);
    }
    // if not enough repairers
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        // try to spawn one
        tryingRole = 'repairer';
        name = this.createCustomCreep(tryingRole);
    }
    // if not enough repairers
    else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
        // try to spawn one
        tryingRole = 'wallRepairer';
        name = this.createCustomCreep(tryingRole);
    }
    /*
    else if (numberOfLong < minimumNumberOfLong) {

    }
    */
    // if not enough builders
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        // try to spawn one
        tryingRole = 'builder';
        name = this.createCustomCreep('builder');
    }
    // if not enough miners
    else if (numberOfMinerals < minimumNumberOfMinerals) {
        // try to spawn one
        tryingRole = 'mineral';
        name = this.createCustomCreep(tryingRole);
    }
    else {
        // else try to spawn a builder
        //name = -6;

        if(this.name == 'Spawn1' && false) {

            // try to spawn one
            var x = this.getNextLDH();
            //console.log(JSON.stringify(x));
            if (x.LDHTarget != undefined && x.LDHSourceIndex != undefined) {

                tryingRole = 'longDistanceHarvester';
                name = this.createLongDistanceHarvester(1200, 5, homeRoom, x.LDHTarget, x.LDHSourceIndex);
            }
            else {
                //name = -100;
            }
        }
    }

    // see what spawns are trying to make next
    if(!Memory.nextSpawn) { Memory.nextSpawn = {}; }
    Memory.nextSpawn[this.name] = tryingRole;

    //this.createLongDistanceHarvester(1000, 5, 'W82N7', 'W82N6', 0);

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0) && name != undefined) {
        console.log(this.name, " - Spawned new " + Game.creeps[name].memory.role + " creep: " + name);

        console.log(this.name, " - Harvesters:"+numberOfHarvesters, "Lorries:"+numberOfLorries, "Upgraders:"+numberOfUpgraders, "Builders:"+numberOfBuilders, "Repairers:"+numberOfRepairers, "WallRepairers:"+numberOfWallRepairers, "Miners:"+numberOfMiners, "Long:"+numberOfLong);
    }
    //console.log(this.name, ' - ', "Harvesters:"+numberOfHarvesters, "Lorries:"+numberOfLorries, "Upgraders:"+numberOfUpgraders, "Builders:"+numberOfBuilders, "Repairers:"+numberOfRepairers, "Miners:"+numberOfMiners, "Long:"+numberOfLong);

};

StructureSpawn.prototype.getNextLDH = function() {
    //if(!Memory.LDH) { Memory.LDH = { 'W82N6': { 0:0, 1:0 }, 'W83N7': { 0:0} }; }
    if(!Memory.LDH) { Memory.LDH = { 'E24S81': { 0:0, 1:0 } }; }
    if(!Memory.minLDH) { Memory.minLDH = { 'E24S81': { 0:1, 1:2 } }; }
    let LDH = {};
    for(let LDHCreepName in Game.creeps) {
        let LDHCreep = Game.creeps[LDHCreepName];
        if(LDHCreep.memory.role == 'longDistanceHarvester') {
            //console.log('LDH - ',LDHCreep.memory.target,LDHCreep.memory.sourceIndex);
            if(!LDH[LDHCreep.memory.target]) {
                LDH[LDHCreep.memory.target] = {};
            }
            if(!LDH[LDHCreep.memory.target][LDHCreep.memory.sourceIndex]) {
                LDH[LDHCreep.memory.target][LDHCreep.memory.sourceIndex] = 0;
            }
            LDH[LDHCreep.memory.target][LDHCreep.memory.sourceIndex]++;
        }
    }
    //console.log('LDH count', JSON.stringify(LDH));
    //console.log('LDH min', JSON.stringify(Memory.minLDH));
    Memory.LDH = LDH;

    let LDHTarget;
    let LDHSourceIndex;

    // next LDH target
    loop1: for(let LDHRoom in Memory.minLDH) {
        //console.log('- ',LDHRoom);
        loop2: for(let LDHsource in Memory.minLDH[LDHRoom]) {
            //console.log('- - ',LDHsource, ' - ', Memory.minLDH[LDHRoom][LDHsource]);
            //
            if(Memory.minLDH[LDHRoom] && Memory.minLDH[LDHRoom][LDHsource] &&
                (!Memory.LDH[LDHRoom] || !Memory.LDH[LDHRoom][LDHsource] || Memory.LDH[LDHRoom][LDHsource] < Memory.minLDH[LDHRoom][LDHsource])) {
                //console.log(LDHRoom, LDHsource);
                LDHTarget = LDHRoom;
                LDHSourceIndex = LDHsource;
                break loop1;
            }
        }
    }
    if (LDHTarget != undefined && LDHSourceIndex != undefined) {
        //console.log('---', LDHTarget, LDHSourceIndex);
    }

    return { 'LDHTarget': LDHTarget, 'LDHSourceIndex': LDHSourceIndex };
};
StructureSpawn.prototype.getNextRM = function() {
    if(!Memory.RM) { Memory.RM = { 'E24S81': { 0:0, 1:0 } }; }
    if(!Memory.minRM) { Memory.minRM = { 'E24S81': { 0:1, 1:1 } }; }
    let RM = {};
    for(let RMCreepName in Game.creeps) {
        let RMCreep = Game.creeps[RMCreepName];
        if(RMCreep.memory.role == 'remoteMiner') {
            //console.log('RM - ',RMCreep.memory.target,RMCreep.memory.sourceIndex);
            if(!RM[RMCreep.memory.target]) {
                RM[RMCreep.memory.target] = {};
            }
            if(!RM[RMCreep.memory.target][RMCreep.memory.sourceIndex]) {
                RM[RMCreep.memory.target][RMCreep.memory.sourceIndex] = 0;
            }
            RM[RMCreep.memory.target][RMCreep.memory.sourceIndex]++;
        }
    }
    //console.log('RM count', JSON.stringify(RM));
    //console.log('RM min', JSON.stringify(Memory.minRM));
    Memory.RM = RM;

    let RMTarget;
    let RMSourceIndex;

    // next RM target
    loop1: for(let RMRoom in Memory.minRM) {
        //console.log('- ',RMRoom);
        loop2: for(let RMsource in Memory.minRM[RMRoom]) {
            //console.log('- - ',RMsource, ' - ', Memory.minRM[RMRoom][RMsource]);
            if(Memory.minRM[RMRoom] && Memory.minRM[RMRoom][RMsource] &&
                (!Memory.RM[RMRoom] || !Memory.RM[RMRoom][RMsource] || Memory.RM[RMRoom][RMsource] < Memory.minRM[RMRoom][RMsource])) {
                //console.log(RMRoom, RMsource);
                RMTarget = RMRoom;
                RMSourceIndex = RMsource;
                break loop1;
            }
        }
    }
    if (RMTarget != undefined && RMSourceIndex != undefined) {
        //console.log('---', RMTarget, RMSourceIndex);
    }

    return { 'RMTarget': RMTarget, 'RMSourceIndex': RMSourceIndex };
};