module.exports = function (name, gender, race, classification, description) {
    this.name = name;
    this.gender = gender;
    this.race = race;
    this.classification = classification;
    this.description = description;
}

function generateStats(race, classification) {
    race = race.toLowerCase();
    classification = classification.toLowerCase();
    let hp, attack, defense, agility;
    switch (race) {
        case "human":
            hp = 0;
            attack = 0;
            defense = 0;
            agility = 0;
            break;
        case "elf":
            hp = 0;
            attack = 0;
            defense = 0;
            agility = 0;
            break;
        case "dwarf":
            hp = 0;
            attack = 0;
            defense = 0;
            agility = 0;
            break;
        case "halfling":
            hp = 0;
            attack = 0;
            defense = 0;
            agility = 0;
            break;
        case "gnome":
            hp = 0;
            attack = 0;
            defense = 0;
            agility = 0;
            break;
        case "half-orc":
            hp = 0;
            attack = 0;
            defense = 0;
            agility = 0;
            break;

        default:
            hp = 0;
            attack = 0;
            defense = 0;
            agility = 0;
            break;
    }
    switch (classification) {
        case "barbarian":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "bard":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "cleric":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "druid":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "fighter":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "monk":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "paladin":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "ranger":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "rogue":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "sorcerer":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "warlock":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
        case "wizard":
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;

        default:
            hp += 0;
            attack += 0;
            defense += 0;
            agility += 0;
            break;
    }
}

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