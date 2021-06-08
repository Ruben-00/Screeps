/*
 * States:
 * default -> charging
 * 0 -> transfering
 * 1 -> upgrading
 */

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.state === undefined || creep.store.getCapacity() <= creep.store.getFreeCapacity())  creep.memory.state = -1;
        if (Game.spawns['Spawn1'].energy >= Game.spawns['Spawn1'].energyCapacity && creep.memory.state !== -1) {
                creep.memory.state = 1;
        }
        if (creep.store.getFreeCapacity() > 0 && creep.memory.state !== -1 || creep.store.getFreeCapacity() === 0) {
            if (Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity) {
                creep.memory.state = 0;
            }
            else {
                creep.memory.state = 1;
            }
        }
        switch(creep.memory.state) {
            case 0:
                if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1']);
                }
                break;
            case 1:
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                break;
            default:
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
                break;
        }
        //console.log(creep.name + ' : ' +  creep.memory.state);
	}
};

module.exports = roleHarvester;