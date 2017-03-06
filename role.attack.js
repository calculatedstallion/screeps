module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        //creep.say('ATTACKKKKKK!!!');
        let flag = Game.flags.attackFlag;
        if (flag) {
            if (creep) {
                if (creep.pos.roomName === flag.pos.roomName) {
                    let spawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
                    let hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                    let tower = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_TOWER
                    });


                    if(tower != undefined) {
                        if (creep.rangedAttack(tower) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(tower, {
                                visualizePathStyle: {
                                    fill: 'transparent',
                                    stroke: '#ff0000',
                                    lineStyle: 'solid',
                                    strokeWidth: .15,
                                    opacity: 1
                                }
                            });
                        }
                        else {
                            // keep attacking this dude
                            creep.memory.attack = tower;
                        }
                    }
                    else if(spawn != undefined) {
                        if (creep.rangedAttack(spawn) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(spawn, {
                                visualizePathStyle: {
                                    fill: 'transparent',
                                    stroke: '#ff0000',
                                    lineStyle: 'solid',
                                    strokeWidth: .15,
                                    opacity: 1
                                }
                            });
                        }
                        else {
                            // keep attacking this dude
                            creep.memory.attack = spawn;
                        }
                    }
                    else if(hostile != undefined) {
                        if (creep.rangedAttack(hostile) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(hostile, {
                                visualizePathStyle: {
                                    fill: 'transparent',
                                    stroke: '#ff0000',
                                    lineStyle: 'solid',
                                    strokeWidth: .15,
                                    opacity: 1
                                }
                            });
                        }
                        else {
                            // keep attacking this dude
                            creep.memory.attack = hostile;
                        }
                    }
                    /*
                    let outcome = creep.attack(spawn);
                    if (outcome === ERR_NOT_IN_RANGE) creep.moveTo(spawn)
                    */
                }
                else {
                    creep.moveTo(flag, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ff0000',
                        lineStyle: 'dashed',
                        strokeWidth: .15,
                        opacity: 1}});
                }
            }
            else {
                //Game.spawns.Spawn1.createCreep([TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK], "attacker")
                //Game.spawns.Spawn1.createCreep([TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK], undefined, { role: 'attack' });
                // Game.rooms.W82N7.energyAvailable
            }
        }
    }
};