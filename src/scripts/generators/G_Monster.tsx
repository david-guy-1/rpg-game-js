import monster from "../classes/monster"
import * as U from "../utilities";

function monster_generator(difficulty, attack_adjust = 1, defense_adjust = 1, hp_adjust = 1, attack_pattern = "basic attack",flags = {}){
	U.assert(U.check_type(arguments, ["number", "number", "number", "number", "any", "object"], "monster generator type error"))
		
	return new monster(
		"generated", // name
		Math.floor(difficulty * 100 * attack_adjust),// attack
		Math.floor(difficulty * 5 * defense_adjust),//defense
		Math.floor(difficulty*1000 * hp_adjust),//hp
		attack_pattern,//attack_pattern
		[],//drops
		{"gold":Math.floor(difficulty*1.24)},// currency_drops
		flags,//flags
	)
}

export default monster_generator; 


