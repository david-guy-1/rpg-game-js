import monster from "../classes/monster.js"
import * as U from "../utilities.js";

function monster_generator(difficulty, attack_adjust = 1, defense_adjust = 1, hp_adjust = 1, flags = [],attack_pattern = "basic attack"){
	U.assert(U.check_type(arguments, ["number", "number", "number", "number", Array, "string"], "monster generator type error"))
		
	return new monster(
		"generated", // name
		Math.floor(difficulty * 100 * attack_adjust),// attack
		Math.floor(difficulty * 5 * defense_adjust),//defense
		Math.floor(difficulty*1000 * hp_adjust),//hp
		flags,//flags
		attack_pattern,//attack_pattern
		[],//drops
		{"gold":Math.floor(difficulty*1.24)} // currency_drops
	)
}

export default monster_generator; 


