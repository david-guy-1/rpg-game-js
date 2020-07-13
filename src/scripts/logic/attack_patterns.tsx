
import monster_skill from '../classes/monster_skill';
import effect from '../classes/effect';
import * as U from "../utilities";
import monster from '../classes/monster';
import I_Combat from '../instances/I_Combat';

type attack_pattern_result = {
	"skill": monster_skill, 
	"target": number | "player"
}

export function compute_attack_pattern(monster : monster, combat_instance : I_Combat, monster_index : number) : attack_pattern_result | undefined { // returns either "undefined" or a monster_skill instance, and a number indicating either the index of an allied monster, or "player"
// this function is only called if the monster's delay is 0
	 
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

	 

	 if(typeof(monster.attack_pattern) == "object"){
	 // priority queue : 
		if(monster.attack_pattern["priority queue"] != undefined){
			// value should be a list of triples : monster_skill, cooldown, (string to choose a target)
			// the string must be "player", "self", or "name ____"
			// skills will go on cooldown even if it fails (but not to delay, as this function is not called if delay is not zero)
			var monster_skills = monster.attack_pattern["priority queue"]
			// first, initialize it
			if(monster.last_used == undefined){
				monster.last_used = U.fillArray(-Infinity, monster_skills.length);
			}
			// then , find the first skill for which the cooldown + lastUsed <= current time
			var current_time = combat_instance.current_ticks;
			var skill_to_use : undefined | monster_skill = undefined;
			for(var i=0; i<monster_skills.length; i++){
				var the_skill = monster_skills[i];
				if(the_skill[1] + monster.last_used[i] <= current_time){
					skill_to_use = the_skill;
					monster.last_used[i] = current_time;
					break;
				}
			}
			if(skill_to_use == undefined){
				return undefined;
			}
			// compute the target
			var target_string = skill_to_use[2];
			var target : "player" | number | undefined  = undefined;
			if(target_string == "player"){
				target = "player"
			}
			if(target_string == "self"){
				target = monster_index
			}
			if(target_string.substr(0, 5) == "name "){
				// find a monster named x.substr(5)
				for(var i=0; i<combat_instance.fighting_monsters.length;  i++){
					if(combat_instance.fighting_monsters[i].name == target_string.substr(5)){
						target = i;
						break;
					}
				}
			}
			if(target == undefined){
				return undefined;
			} else {
				return {"skill":skill_to_use[0], "target":target};
			}
			
			
		}
	 }
	 
	 //default
	 return {"skill":new monster_skill("monster_attack",1.0, 47, [], [] , []), "target":"player"};
	 
}

export default compute_attack_pattern;
