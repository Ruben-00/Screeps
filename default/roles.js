let roles = {
    harvester: {
        name: 'harvester',
        icon: '🔋',
        logic: require('role.harvester'),
        bodyParts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        //bodyParts: [WORK, CARRY, MOVE],
        maxCreeps: 3,
        currentCreeps: 0,
        spawn: 'Spawn1'
    },
    builder: {
        name: 'builder',
        icon: '🧱',
        logic: require('role.builder'),
        bodyParts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
        maxCreeps: 1,
        currentCreeps: 0,
        spawn: 'Spawn1'
    },
    collector: {
        name: 'collector',
        icon: '🥾',
        logic: require('role.collector'),
        bodyParts: [MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY],
        maxCreeps: 1,
        currentCreeps: 0,
        spawn: 'Spawn1'
    },
    wire: {
        name: 'wire',
        icon: '🔌',
        logic: require('role.wire'),
        bodyParts: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE],
        maxCreeps: 1,
        currentCreeps: 0,
        spawn: 'Spawn1'
    }
};

module.exports = roles;