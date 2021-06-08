/*
 * States:
 * -2 -> waiting 💤
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
    else if (creep.room.storage.store.getFreeCapacity() > 0) {
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
    if (!creep.pos.inRangeTo(creep.room.storage.pos, 0)) {
        creep.moveTo(Game.flags['Wire']);
    }
    let target;
    switch (state) {
        case 0:
            target = creep.pos.findClosestByPath(FIND_SOURCES)
            if (target !== null )creep.harvest(target, RESOURCE_ENERGY);    
            break;
        case 1:
            creep.transfer(creep.room.storage, RESOURCE_ENERGY);
            break;
    }
};

let roleWire = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let state = creep.memory.state;
        state = stateSelector(creep, state);
        stateAction(creep, state);
    }
};

module.exports = roleWire;