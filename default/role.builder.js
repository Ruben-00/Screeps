/*
 * States:
 * -2 -> waiting 💤
 * -1 -> upgrading 🆙
 *  0 -> charging ⚡
 *  1 -> repairing 🔨
 *  2 -> building 🧱
 */

let changeState = function (creep, stateVal, oldState) {
    if (stateVal === oldState) return oldState;
    creep.memory.state = stateVal;
    switch (stateVal) {
        case -2:
            creep.say('💤');
            break;
        case -1:
            creep.say('🆙');
            break;
        case 0:
            creep.say('⚡');
            break;
        case 1:
            creep.say('🔨');
            break;
        case 2:
            creep.say('🧱');
            break;
        default:
            creep.say(stateVal);
            break;
    }
    return stateVal;
};

let stateSelector = function (creep, state) {
    let target = 0;
    if (state === undefined) {
        creep.memory.state = 0;
        state = 0;
    }
    if (state === 0 && creep.store.getFreeCapacity() > 0) {
        return 0;
    }
    if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
        state = changeState(creep, 0, state);
    }
    else if (creep.room.find(FIND_MY_STRUCTURES, {filter: object => object.hits < object.hitsMax}).length > 0) {
        state = changeState(creep, 1, state);
    }
    else if (creep.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
        state = changeState(creep, 2, state);
    }
    else if (creep.room.controller.level < 8) {
        state = changeState(creep, -1, state);
    }
    else {
        if (creep.store.getFreeCapacity() > 0) {
            state = changeState(creep, 0, state);
        }
        else {
            state = changeState(creep, -2, state);
        }
    }
    return state;
};

let stateAction = function (creep, state) {
    let target;
    switch (state) {
        case -1:
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ff8800' } });
            }
            break;
        case 0:
            if (creep.room.storage !== undefined && creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                break;
            }
            target = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ff8800' } });
            }
            break;
        case 1:
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ff8800' } });
            }
            break;
            break;
        case 2:
            target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
            if (creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ff8800' } });
            }
            break;
            break;
        default:
            creep.moveTo(Game.flags['Wait'], { visualizePathStyle: { stroke: '#ff8800' } });
            break;
    }
};

let roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let state = creep.memory.state;
        state = stateSelector(creep, state);
        stateAction(creep, state);
    }
};

module.exports = roleHarvester;