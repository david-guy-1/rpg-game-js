import monster from "../classes/monster.tsx"
import * as U from "../utilities.tsx";

function monster_generator(difficulty : number) : monster{
	
		
	return new monster(
		"generated", // name
		Math.floor(difficulty * 100 * 1),// attack
		Math.floor(difficulty * 5 * 1),//defense
		Math.floor(difficulty*1000 * 1),//hp
		[],//attack_pattern
		[],//drops
		{"gold":Math.floor(difficulty*1.24)},// currency_drops
		[],//flags
	)
}

export default monster_generator; 


