module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        creep.say('CLAIMER');
        //creep.memory.target = 'W83N7';
        // if in target room
        if (creep.room.name != creep.memory.target) {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.target);
            // move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit), {visualizePathStyle: {
                fill: 'transparent',
                stroke: '#36f7ff',
                lineStyle: 'dashed',
                strokeWidth: .05,
                opacity: 1}});
        }
        else {
            if(creep.memory.mode == 'claim') {
                // try to claim controller
                let claim = creep.claimController(creep.room.controller);
                if (claim == ERR_NOT_IN_RANGE) {
                    // move towards the controller
                    creep.moveTo(creep.room.controller, {
                        visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#36f7ff',
                            lineStyle: 'dashed',
                            strokeWidth: .05,
                            opacity: 1
                        }
                    });
                }
            }
            // tries to reserve
            //else if(claim == ERR_GCL_NOT_ENOUGH) {
            else if(creep.memory.mode == 'reserve') {

                if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    // move towards the controller
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#36f7ff',
                        lineStyle: 'dashed',
                        strokeWidth: .05,
                        opacity: 1}});
                }
            }
        }
    }
};