// import modules
require('prototype.tower');
require('prototype.spawn');
require('prototype.creep');
require('prototype.diag');

// make sure all creeps have optimal move
// make dropped energy so only 1 creep goes to get it
// stop other roles from getting energy from source if miners exist in room
// prevent all creeps from dieing off, have a backup to spawn a harvester in emergencies to get things rolling again
// make spawner check if other rooms need creeps
// spawn miner and assign to one when existing miner is about to die, so theres no wait. especially if theres not enough energy to spawn one immediately

// make spawner code work with memory
// make spawner code spawn based on available resources? based on max capacity
// make roles based in memory
// how to handle different requirements of different rooms? based on max capacity
// manually insert a creep into the queue,  eg check if spawn is busy / not enough, then make sure next is a custom one
// make link code work with memory and not just in my main room
// builder add current construction site to memory

// diag
// keep track of how much energy LDH / miners make in their lifespan. highlight creeps that are inefficient / not profitable

// notifications

// set path styles
    // attack - red
    // build - yellow
    // mining -
    // lorry
    // upgrader
    // repair
    // mineral
    // LDH
    // moving room - turquoise

// make idle logger, how many active / idle, why, etc
// if under attack, hit up safe mode
// spawn based on avail energy (with min amount, eg 300), to help new rooms

module.exports.loop = function () {

    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            console.log('RIP:'+name+' - '+Memory.creeps[name].role);
            delete Memory.creeps[name];
        }
        else {
            //delete Memory.creeps[name].upgrading;
            //Memory.creeps[name].working = false;
        }
    }

    if(!Memory.droppedAssigned) {
        Memory.droppedAssigned = {};
    }


    // find dropped energy

    //let droppedAll = {};
    for(let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        let dropped = room.find(FIND_DROPPED_ENERGY, {
            filter: (d) => !Memory.droppedAssigned[d.id]
            && d.amount > 50
        });
        /*
        if(dropped.length > 0) {
            for(let dropName in dropped) {
                let drop = dropped[dropName];
                console.log(JSON.stringify(drop.pos), drop.amount);
            }
        }
        */

        /*
        droppedAll[roomName] = dropped.length;
        if(dropped.length > 0) {
            for(let dropName in dropped) {
                let drop = dropped[dropName];
                console.log(JSON.stringify(drop.pos), drop.amount);
            }
        }
        */
        //console.log(roomName, dropped);
    }

    //console.log(JSON.stringify(droppedAll));
    //console.log('droppedAssigned',Memory.droppedAssigned);
    //Memory.droppedAll = droppedAll;



    // for each creeps
    for (let name in Game.creeps) {
        // run creep logic
        Game.creeps[name].runRole();

        /*
        // set memory home
        if(Game.creeps[name].memory.home == undefined) {
            if(Game.creeps[name].memory.role == 'longDistanceHarvester') {}
            else {
                console.log(Game.creeps[name].memory.role, Game.creeps[name].room.name, Game.creeps[name].memory.home);
                //Game.creeps[name].memory.home = Game.creeps[name].room.name;
            }
        }
        */

    }
    //console.log('------------');

    // links
    var links = _.filter(Game.structures, s => s.structureType == STRUCTURE_LINK);
    //console.log(links);
    if(links != undefined) {
        let link_from = undefined;
        let link_to = undefined;
        for(let linkName in links) {
            let link = links[linkName];

            if(link.id == '58b445410bea016858df7426' && link.energy > 700) {
                link_from = link;

            }
            if(link.id == '58b428557c10d66847004405') {
                link_to = link;
            }
        }

        // to > from
        if(link_from != undefined && link_to != undefined) {
            link_from.transferEnergy(link_to);
        }
    }

    // 58a47de436d9a1113d53f0f4 > 58a46c335287599e4b36e022

    // find all towers
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        // run tower logic
        if(tower.defend()) {}
        //else if(tower.repair()) {}
    }

    // reserve rooms
    if(true) {
        let roomsReserve = ['E24S81'];
        // claimers
        let claimers = _.filter(Game.creeps, c => c.memory.role == 'claimer');
        //console.log('claimers', JSON.stringify(claimers));
        // loop rooms
        for (let roomIndex in roomsReserve) {
            let roomName = roomsReserve[roomIndex];
            let room = Game.rooms[roomName];

            // check if something in room to 'see' it
            if (room == undefined) {
                //console.log('fog of war, nothing in room to see it', roomName);
                // send someone here

            }
            // check if room is reserved already
            else if (room.controller.reservation != undefined && room.controller.reservation.ticksToEnd > 400) {
                //console.log('already reserved', roomName, JSON.stringify(room.controller.reservation));
            }
            // check if claimer exists with home as room (they might be en route)
            else if (_.sum(claimers, c => c.memory.target == roomName) > 0) {
                //console.log('not reserved but en route', roomName, room.controller.reservation);
            }
            // spawn claimer
            else {
                //Game.rooms.E21S81.find(FIND_MY_SPAWNS)[0].name
                let claimname = Game.spawns.Spawn1.createClaimer(roomName, 'reserve');
                if(!(claimname < 0)) {
                    console.log('spawning claimer', claimname);
                }
                else {
                    //console.log('not spawning claimer', claimname);
                }
            }
        }
    }

    // spawn attacker
    //let attackSafeMode = Game.rooms['E24S82'].controller.safeMode;
    //console.log(attackSafeMode);
    // setup --
    // Memory.attackTargetSafeMode = 1234 // same number as controller safe mode
    // Memory.attackTargetMode = true
    Memory.attackTargetSafeMode--;
    let timeToAttack = Game.time+Memory.attackTargetSafeMode;
    if(Memory.attackTargetMode === true) {
        //console.log(Game.time, Memory.attackTargetSafeMode, timeToAttack);
    }
    if(Memory.attackTargetMode === true && Game.time >= timeToAttack) {
        let spawnAttacker = Game.spawns.Spawn1.createCustomCreep('attack');
        if (!(spawnAttacker < 0) && spawnAttacker != undefined) {
            Game.notify('Attacking attackFlag, safe mode should be down');
            console.log('attacking');
            Memory.attackTargetMode = false;
        }
    }


    // for each spawn
    for (let spawnName in Game.spawns) {
        // run spawn logic
        Game.spawns[spawnName].spawnCreepsIfNecessary();
    }

    /*
    // reserve rooms
    let roomsReserve = [ 'W82N6' ];
    // claimers
    let claimers = _.filter(Game.creeps, c => c.memory.role == 'claimer');
    console.log(JSON.stringify(claimers));
    // loop rooms
    for(let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        // check if room is reserved already
        if(roomsReserve.indexOf(roomName) >= 0 && room.controller.reservation == undefined) {
            console.log(roomName, room.controller.reservation);
        }
        // check if claimer exists with home as room (they might be en route)
        else if(_.filter(claimers, c => c.memory.home == roomName)) {
            console.log('not reserved but en route', roomName, room.controller.reservation);
        }
        // spawn claimer
        else {

        }
    }
    */







    // get to room
    // withdraw from container
    // go to main
    // transfer to storage




    // remote miners
    // LDH without the heading back to main
};