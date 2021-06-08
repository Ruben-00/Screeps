let roles = {
    harvester: {
        name: 'harvester',
        logic: require('role.harvester'),
        bodyParts: [WORK, WORK, CARRY, MOVE],
        maxCreeps: 10,
        currentCreeps: 0,
        spawn: 'Spawn1'
    },
    builder: {
        name: 'builder',
        logic: require('role.builder'),
        bodyParts: [WORK, CARRY, MOVE],
        maxCreeps: 0,
        currentCreeps: 0,
        spawn: 'Spawn1'
    }
};

let makeCreep = function(roleKey, role) {
    Game.spawns[role.spawn].spawnCreep( role.bodyParts, role.name + Game.time,
    { memory: { role: roleKey } } );
};

module.exports.loop = function () {
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (roles[creep.memory.role] !== undefined) {
            roles[creep.memory.role].currentCreeps++;
            roles[creep.memory.role].logic.run(creep);
        }
    }
    for (let roleKey of Object.keys(roles)) {
        if (roles[roleKey].currentCreeps < roles[roleKey].maxCreeps) makeCreep(roleKey, roles[roleKey]);
        roles[roleKey].currentCreeps = 0;
    }
};