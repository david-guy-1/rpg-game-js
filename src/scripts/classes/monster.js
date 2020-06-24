import * as U from '../utilities.js';
class monster{

    constructor(name,attack,defense,hp,attack_pattern = "",drops = [], currency_drops= {}, flags = {}){
		U.assert(U.check_type(arguments, 
		["string", "number", "number", "number", "any", Array, "object", "object"]
		
		));
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.hp = hp;
        this.max_hp=hp;
        this.effects = {"name":name, "attack":[], "defense":[], "poison":[], "speed":[],"mana":[],"other":[]};
        this.flags = flags; // is the monster, say, undead . 
		// flags must be an object
        this.attack_pattern = attack_pattern; // only used in attack patterns.js, can be anything that can be JSONified.
		
        this.drops = drops; // item drops list
		this.currency_drops = currency_drops; // currency drops list
		this.current_delay = 0;
		
    }
	has_flag(flag_name){
		return this.flags[flag_name] != undefined
	}
	get_flag(flag_name){
		return this.flags[flag_name];
	}
	has_other_effect(effect_name){
		for(var effect of this.effects.other){
			if(effect.name == effect_name){
				return true;
			}
		}
		return false;
	}
}
export default monster; 

