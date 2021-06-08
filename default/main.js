let roles = require('roles');

let towers = require('structure.towers');

let makeCreep = function (roleKey, role) {
    Game.spawns[role.spawn].spawnCreep(role.bodyParts, role.name + Game.time,
        { memory: { role: roleKey } });
};

let clearCreeps = function () {
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
};

let debug = function () {
    for (name in Game.rooms) {
        let room = Game.rooms[name];
        room.visual.text(room.name, 5, 35);
        room.visual.text('energy: ' + room.energyAvailable + '/' + room.energyCapacityAvailable, 5, 36);
        room.visual.text('Level: ' + room.controller.level + ' (' + room.controller.progress + '/' + room.controller.progressTotal + ')', 19, 43);
        room.visual.text('⚡: ' + room.storage.store.getUsedCapacity(RESOURCE_ENERGY), 20, 24);
        let i = 0;
        for (let roleKey of Object.keys(roles)) {
            room.visual.text(roles[roleKey].name + ': ' + roles[roleKey].currentCreeps, 5, 37 + i);
            i++;
        }
    }
};

let showRoles = function () {
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        let role = roles[creep.memory.role];
        if (role.icon !== undefined) {
            creep.room.visual.text(role.icon, creep.pos);
        }
        else {
            creep.room.visual.text('X', creep.pos);
        }
    }
};

let shield = function () {
    var hostiles = Game.rooms['E41S16'].find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        Game.rooms['E41S16'].controller.activateSafeMode();
    }
};

module.exports.loop = function () {
    //shield();
    towers.tick();

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (roles[creep.memory.role] !== undefined) {
            roles[creep.memory.role].currentCreeps++;
            roles[creep.memory.role].logic.run(creep);
        }
    }
    //debug();
    for (let roleKey of Object.keys(roles)) {
        if (roles[roleKey].currentCreeps < roles[roleKey].maxCreeps) makeCreep(roleKey, roles[roleKey]);
        roles[roleKey].currentCreeps = 0;
    }
    clearCreeps();
    showRoles();
};