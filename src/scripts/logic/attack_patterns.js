
import monster_skill from '../classes/monster_skill.js';
import effect from '../classes/effect.js';

export function compute_attack_pattern(monster, combat_instance){ // returns a monster_skill instance, and a number indicating either the index of an allied monster, or "player"
	 
	 // test skeleton does a one-shot at 100 ticks
	 if(monster.name == "test_skeleton"){
		if(combat_instance.current_ticks == 100){
			return {"skill":new monster_skill("instant_kill",99999, 47, [], [] , []), "target":"player"};
		} else if(combat_instance.current_ticks < 50 || combat_instance.current_ticks > 101){
			return {"skill":new monster_skill("monster_attack",1.0, 47, [], [] , []), "target":"player"};
		} else {
			return {"skill":new monster_skill("nothing",0, 0, [], [] , []), "target":"player"};
		}
	 }
	 
	 
	 if(monster.attack_pattern == "poison attack"){
		return {"skill":new monster_skill("monster_attack",1.0, 47, [], [new effect("poison", 100, monster.attack/400)] , []), "target":"player"};
	 }
	 //default
	 return {"skill":new monster_skill("monster_attack",1.0, 47, [], [] , []), "target":"player"};
	 
}

export default compute_attack_pattern;