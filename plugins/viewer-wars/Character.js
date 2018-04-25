/*
    Character Model should include:
        Creation Date
        Name
        Age
        Gender
        Race
        Class
        Description
        gear
        stats
            hp
            attack
            defense
            agility
*/
/*
    DB.vwars-items -> Items.js -> vwars.js
    DB.vwars-chars -> vwars.js
    Character.js ->  vwars.js
*/

module.exports = function (name, gender, race, classification, description) {
    var obj = {}
    obj.name = name;
    obj.gender = gender;
    obj.race = race;
    obj.classification = classification;
    obj.description = description;
    obj.creationDate = new Date();
    obj.age = 0;
    obj.gear = generateGear(classification);
    obj.stats = generateStats();
    return obj;
}

function generateStats() {
    let hp = 100,
        attack = 15,
        defense = 15,
        agility = 15;
    let r1 = Math.random(),
        r2 = Math.random(),
        r3 = Math.random(),
        r4 = Math.random();
    hp *= 1 + (r1 > 0.5 ? r1 : 0.5);
    attack *= 1 + (r2 > 0.5 ? r2 : 0.5);
    defense *= 1 + (r3 > 0.5 ? r3 : 0.5);
    agility *= 1 + (r4 > 0.5 ? r4 : 0.5);
    hp = Math.floor(hp);
    return {
        hp: hp,
        attack: attack,
        defense: defense,
        agility: agility
    };
}
function generateGear(classification) {
    let gearList = [];
    switch (classification) {
        case "barbarian":
            gearList.push(3);
            break;
        case "bard":
            gearList.push(3);
            break;
        case "cleric":
            gearList.push(3);
            break;
        case "druid":
            gearList.push(3);
            break;
        case "fighter":
            gearList.push(3);
            break;
        case "monk":
            gearList.push(3);
            break;
        case "paladin":
            gearList.push(3);
            break;
        case "ranger":
            gearList.push(3);
            break;
        case "rogue":
            gearList.push(3);
            break;
        case "sorcerer":
            gearList.push(3);
            break;
        case "warlock":
            gearList.push(3);
            break;
        case "wizard":
            gearList.push(3);
            break;
        default:
            gearList.push(3);
            break;
    }
}
