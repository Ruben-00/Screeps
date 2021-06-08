/*
 * States:
 * -2 -> waiting 💤
 * -1 -> upgrading 🆙
 *  0 -> charging ⚡
 *  1 -> transfering 🔋
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
            creep.say('🔋');
            break;
        default:
            creep.say(stateVal);
            break;
    }
    return stateVal;
};

let stateSelector = function (creep, state) {
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
    else if (Game.rooms['E41S16'].storage.store.getFreeCapacity() > 0) {
        state = changeState(creep, 1, state);
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
        case 0:
            if (Game.flags['Source'].room === undefined) {
                creep.moveTo(Game.flags['Source'], { visualizePathStyle: { stroke: '#00ff00' } });
            }
            else {
                target = creep.room.find(FIND_SOURCES)[1];
                if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });

                }
            }

            break;
        case 1:
            target = Game.rooms['E41S16'].storage;
            if (target !== null && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
            }
            break;
        default:
            creep.moveTo(Game.flags['Wait'], { visualizePathStyle: { stroke: '#00ff00' } });
            break;
    }
};

let roleCollector = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let state = creep.memory.state;
        state = stateSelector(creep, state);
        stateAction(creep, state);
    }
};

module.exports = roleCollector;