// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        // find closes hostile creep
        var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        // if one is found...
        if (target != undefined) {
            // ...FIRE!
            this.attack(target);
            return true;
        }
        else if(this.room.name == 'E24S83') {
            var closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && (s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_WALL)
            });
            closestDamagedStructure = undefined;
            //console.log(closestDamagedStructure);
            if(closestDamagedStructure == undefined && this.energy > 0) {
                var walls = this.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_RAMPART &&
                    s.hits < 2000
                });
                if(walls && walls.length == 0) {
                    walls = this.room.find(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_WALL ||
                        s.structureType == STRUCTURE_RAMPART)
                    });
                }

                //var target = undefined;

                // loop with increasing percentages
                for (let percentage = 0.0001; percentage <= 0.03; percentage = percentage + 0.0001){
                    // find a wall with less than percentage hits
                    for (let wall of walls) {
                        if (wall.hits / wall.hitsMax < percentage) {
                            //console.log(wall.hits , wall.hitsMax , (wall.hits / wall.hitsMax), percentage);
                            closestDamagedStructure = wall;
                            break;
                        }
                    }

                    // if there is one
                    if (closestDamagedStructure != undefined) {
                        // break the loop
                        break;
                    }
                }
            }

            if(closestDamagedStructure != undefined) {
                //console.log('repair',this.repair(closestDamagedStructure));
                this.repair(closestDamagedStructure);
            }
        }
    };

StructureTower.prototype.repair2 =
    function () {

    /*
        var structure = this.room.find(FIND_STRUCTURES, {
            // the second argument for findClosestByPath is an object which takes
            // a property called filter which can be a function
            // we use the arrow operator to define it
            filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
        });
        */
        var structure = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax && s.structureType == STRUCTURE_ROAD
        });

        if(structure != undefined) {
            //this.repair(structure);
            //console.log(this.repair(structure));
            return true;
        }
        return false;
    };