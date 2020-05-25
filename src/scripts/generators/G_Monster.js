import monster from "../classes/monster.js"


function monster_generator(difficulty, attack_adjust = 1, defense_adjust = 1, hp_adjust = 1, flags = [],attack_pattern = "basic attack"){
	return new monster(
		"generated", // name
		difficulty * 100 * attack_adjust,// attack
		difficulty * 5 * defense_adjust,//defense
		difficulty*2000 * hp_adjust,//hp
		flags,//flags
		attack_pattern,//attack_pattern
		[],//drops
		{"gold":Math.floor(difficulty*1.24)} // currency_drops
	)
}

export default monster_generator; 


