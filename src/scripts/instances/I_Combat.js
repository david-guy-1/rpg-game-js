//fighting global variables, should be set to null/[] if not fighting.

import items from '../classes/item.js';
import monster from '../classes/monster.js';
import monster_skill from '../classes/monster_skill.js';
import * as U from '../utilities.js';
import compute_attack_pattern from "../logic/attack_patterns.js";
// I think we should avoid using tables for anything other than initializing. What if we need to generate things dynamically?
//cloning: always use Object.assign(new monster(), monster_list[i])
class I_Combat{
	constructor(player, monster_list, dungeon){ // does not mutate these
		this.player = player;
		this.fighting_monsters = [];
		this.monster_list = monster_list; // not mutated!!!
		this.dungeon = dungeon; // this can be undefined
		for(var i=0; i<monster_list.length; i++){
			this.fighting_monsters.push(Object.assign(new monster(), monster_list[i]));
		} // safe to mutate monsters, but not player.
		this.fought_monsters = []; 
		this.items_dropped = [];
		this.currency_dropped = {};
		this.currently_queued_attack = 0; // is the attack that is currently queued
	    this.currently_attacking_monster = 0; // currently attacking monster
	    this.current_ticks = 0; // number of ticks so far
		this.fight_ended = false;
		this.fight_result = "";
	}




	 calculate_stats(){ // returns the player's stats
		var attack = this.player.attack;
		var defense = this.player.defense;
		var hp = this.player.hp;
		var mana = this.player.mana; 
		for(var i=0; i<this.player.items.length; i++){
			var item = this.player.items[i];
			if(item == undefined){
				continue;
			}
			attack += item.attack ;
			defense += item.defense ;		
			hp += item.hp ;
			mana+= item.mana;
		}

		return [attack, defense, hp, mana];
	}




	 fight_begin(queued_attack, target){
		//can't mutate player, use this instead.
		var player_stats = this.calculate_stats();
		this.player_attack =player_stats[0];
		this.player_defense = player_stats[1]
		this.player_hp = player_stats[2];
		this.player_max_hp = player_stats[2];
		this.player_mana=player_stats[3];
		this.player_max_mana=player_stats[3];
		this.player_current_cd = 0; // in ticks.
		this.currently_queued_attack = queued_attack;
		this.currently_attacking_monster = target; // this is the index!
		this.current_ticks = 0;
		
		this.player_effects = [];
		// extra code goes here, maybe. 
		this.cooldowns = U.fillArray(0, 10);  // index -> number of ticks
		
	}

	 add_monster(monster){
		this.fighting_monsters.push(monster)
		
	}
	 has_effect(unit, name){
	 // returns if the unit has an effect
	 // unit is either "player" or a monster object
		if(unit == "player"){
			var effects_list = this.player_effects;
		} else{
			var effects_list = unit.effects
		}
		for(var i=0;i<effects_list.length;i++){
			if(effects_list[i].name == name){
				return true;
			}
		}
		return false;
	}
	//returns whether or not the player has this item
	has_item(item_name){
		for(var i=0; i<this.player.items.length ;i++){
			if(this.player.items[i].name == item_name){
				return true;
			}
		}
		return false;
	}
	// returns the first monster with this name, or "undefined" otherwise.
	get_monster_by_name(monster_name){
		for(var i=0; i<this.fighting_monsters.length; i++){
			if(this.fighting_monsters[i].name == monster_name){
				return this.fighting_monsters[i];
			}
		}
		return undefined;
	}
	
	does_attack_succeed(attack_index, target_monster){ 
			var attack = this.player.skills[attack_index]
			var attack_name = attack.name;
			
			var undead_only_attacks = ["smite undead"]
			var has_effect = this.has_effect.bind(this)
			
			// undead only on a non-undead.
			if(target_monster.has_flag("undead") == false && undead_only_attacks.indexOf(attack_name) != -1){ 
				return false; 
			}
			
			//cooldown
			if(this.cooldowns[attack_index] != 0 ){
				return false;
			}
			
			
			// smite undead - need sword of undead
			if(attack_name == "smite undead" && !this.has_item("sword of undead fighting")){
					return  false;
			}
			// calculate mana here.
			
			if(attack_name == "empower" && this.has_effect("player", "empower cooldown")){
				return  false;
			}
			return true;
			
	}
	
	 calculate_damage_p2m(attack_index, target_monster){ 
			var attack = this.player.skills[attack_index]
			var attack_name = attack.name;
			var tentative_damage = attack.damageMult*this.player_attack;
				
				
			// go through every player effect and see if that changes damage dealt.
				for(var i=0;i<this.player_effects.length;i++){
					var effect = this.player_effects[i];
					
					// (player's) effects, well , effect starts here.
					if(effect.name == "attack_mult"){
						tentative_damage *= effect.strength;
					}
				}
				
				// same for monster
				for(var i=0;i<target_monster.effects.length;i++){
					var effect = target_monster.effects[i];	
					// (monster's) effects, well , effect starts here.
				}
			return tentative_damage;
	}
	// "global" cooldown
	 calculate_delay_p2m(attack_index, target_monster){ 
				var attack = this.player.skills[attack_index]
				var attack_name = attack.name;
				var tentative_delay = attack.delay; 				
				// go through every player effect and see if that changes damage dealt.
				
				for(var i=0;i<this.player_effects.length;i++){
					var effect = this.player_effects[i];
					
					// (player's) effects, well , effect starts here.
					if(effect.name == "speed_mult"){
						tentative_delay *= effect.strength;
					}
				}
				
				// same for monster
				for(var i=0;i<target_monster.effects.length;i++){
					var effect = target_monster.effects[i];	
					// (monster's) effects, well , effect starts here.
				}
			return tentative_delay;	
	}
	//cooldown for that one ability
	calculate_cd_p2m(attack_index, target_monster){ 
			var attack = this.player.skills[attack_index]
			var attack_name = attack.name;
			var tentative_cd = attack.cd; 				
				// go through every player effect and see if that changes cooldown.
				
				for(var i=0;i<this.player_effects.length;i++){
					var effect = this.player_effects[i];
					
					// (player's) effects, well , effect starts here.

				}
				
				// same for monster
				for(var i=0;i<target_monster.effects.length;i++){
					var effect = target_monster.effects[i];	
					// (monster's) effects, well , effect starts here.
				}
			return tentative_cd;	
	}
	
	
	 apply_effects_p2m(attack_index, target_monster){ 
		var attack = this.player.skills[attack_index]
		var attack_name = attack.name;
		//self 
		for(var i=0; i<attack.self_effects.length;i++){
			var effect = attack.self_effects[i]
			this.player_effects.push(effect);
	//		console.log("adding effect " + effect.name  + " at tick " + this.current_ticks);
		}
		
		//enemy monster
		for(var i=0; i<attack.target_effects.length;i++){
			var effect = attack.target_effects[i]
			target_monster.effects.push(effect);
		}
		
		//all 
		for(var i=0; i<attack.global_effects.length;i++){
			for(var j=0; j<this.fighting_monsters.length;j++){
					var effect = attack.global_effects[i]
					var monster = this.fighting_monsters[j];
					monster.effects.push(effect)
			}
			
		}
		// extra code goes here!
	}
	
	//attack is a monster_skill instance, since there are no indices for monste skills
	//target_index is either "player", or the index of a monster
	 does_monster_attack_succeed(attack, target_index){  
		var has_effect = this.has_effect.bind(this)
		
		if(has_effect("player", "immune")){
			return false;
		}
			return true;			
	}
	
	
	 calculate_damage_m2p(attack, attacking_monster){
			var tentative_damage = attack.damage*attacking_monster.attack;
			// go through every monster effect and see if that changes damage dealt.
				for(var i=0;i<attacking_monster.effects.length;i++){
					var effect = attacking_monster.effects[i];
					
					// (monster's) effects, well , effect starts here.
				}
				
				// same for player
				for(var i=0;i<this.player_effects.length;i++){
					var effect = this.player_effects[i];	
					// (player's) effects, well , effect starts here.
				}
			return tentative_damage;
	}
	 calculate_cd_m2p(attack, attacking_monster){
		var tentative_cd = attack.cd; 				
		// go through every monster effect and see if that changes damage dealt.
				
				for(var i=0;i<attacking_monster.effects.length;i++){
					var effect = attacking_monster.effects[i];
					// (monster's) effects, well , effect starts here.
				}
				
				// same for player
				for(var i=0;i<this.player_effects.length;i++){
					var effect = this.player_effects[i];	
					// (player's) effects, well , effect starts here.
				}
			return tentative_cd;	
	}
	
	 apply_effects_m2p(attack, attacking_monster){
		//self 
		for(var i=0; i<attack.self_effects.length;i++){
			var effect = attack.self_effects[i]
			attacking_monster.effects.push(effect);
		}
		
		//player
		for(var i=0; i<attack.target_effects.length;i++){
			var effect = attack.target_effects[i]
			this.player_effects.push(effect);
		}
		
		//all 
		for(var i=0; i<attack.global_effects.length;i++){
			for(var j=0; j<this.fighting_monsters.length;j++){
					var effect = attack.global_effects[i]
					var monster = this.fighting_monsters[j];
					monster.effects.push(effect)
			}
		}
	}


	
	//when multiple effects expire, these will be called in order of decreasing index;
	 player_effect_expire(index){
		this.player_effects.splice(index,1);
	}
	 monster_effect_expire(monster_index,index){
		this.fighting_monsters[monster_index].effects.splice(index, 1);
	}
	
	 player_death(){
		//handle revives here
		this.fight_end("player loses");
	}
	
	//when multiple monsters die, this will be called in order of decreasing index.
	 monster_death(monster_index){
		// monster revives go here
		var monster = this.fighting_monsters[monster_index];
		// items dropped
		this.items_dropped = this.items_dropped.concat(monster.drops);
		U.addObject(this.currency_dropped, monster.currency_drops);
		this.fought_monsters.push(monster);
		// remove the monster
		this.fighting_monsters.splice(monster_index,1);

	}
	 fight_tick(){
	//	console.log("tick");
		//player_queued is a tuple  (string, number)
		//player attacks using the given attack on the monster indicated by the number.
		//monster attacks based on the monster's ai. 
		
		
		//question: should delays be in the classes or a global variable?
		//answers: monster delays are in the class, player's is in a global.
		
		//handle player attack. null is a valid input which causes the entire part to be skipped.
		
	// player attacks -------------------------
		var fighting_monsters = this.fighting_monsters; // pointer...
		
	var player_queued = {"skill":this.player.skills[this.currently_queued_attack], "target":this.currently_attacking_monster}; 
		if(this.player_current_cd == 0 && player_queued["skill"] != undefined && this.fighting_monsters[player_queued["target"]] != undefined){
			// attack using given attack;
			var target_monster = this.fighting_monsters[player_queued["target"]]; // this is an actual monster instance
			var attack = player_queued["skill"]; //this is NOT just the name
			
			var attack_succeeds = this.does_attack_succeed(this.currently_queued_attack, target_monster);
			
			
			// attacks can go wrong;
			
				
			if(attack_succeeds){ // attack succeeds.
				
				//calculate the damage it does:
				
				var damage = this.calculate_damage_p2m(this.currently_queued_attack, target_monster)
				var cd = this.calculate_delay_p2m(this.currently_queued_attack, target_monster)
				this.cooldowns[this.currently_queued_attack] = this.calculate_cd_p2m(this.currently_queued_attack, target_monster);
				this.player_current_cd = Math.floor(cd);
				target_monster.hp -= Math.floor(damage);
				this.apply_effects_p2m(this.currently_queued_attack, target_monster);

					
			}
		}
		
		for (var z=0;z<fighting_monsters.length;z++){
	// monster attacks-------------------
			var current_monster = fighting_monsters[z];
			var monster_attack = compute_attack_pattern(current_monster, this);
			var monster_attack_target = monster_attack["target"];
			monster_attack = monster_attack["skill"];
			
			//this is damage, cd, effect
			if(isNaN(current_monster.current_cd)){
				throw "monster's cd is NaN";
			}
			
			if(current_monster.current_cd == 0 && monster_attack != null){
				// attack using given attack;

				
				var attack_succeeds = this.does_monster_attack_succeed(monster_attack.name, monster_attack_target);
				
				// attacks can go wrong;
				

				if(attack_succeeds){ // monster attack succeeds.
					
					var damage = this.calculate_damage_m2p(monster_attack, current_monster);
					var cd = this.calculate_cd_m2p(monster_attack, current_monster);
					
					
					
					current_monster.current_cd = Math.floor(cd);
					this.player_hp -= Math.floor(damage);
					//apply effects
					this.apply_effects_m2p(monster_attack, current_monster);
				}
			}
		}
		// end of turn effects--------------------	    

		//first, cooldowns;
		for(var i=0; i<10; i++){	
			this.cooldowns[i] = this.cooldowns[i] -= 1;
			if(this.cooldowns[i] < 0){
				this.cooldowns[i] = 0;
			}
		}
		// handle all effects, backwards so that removing effects doesn't mess up rest of the list.
		
		for(var i=this.player_effects.length-1;i>=0;i--){
			var effect = this.player_effects[i];
			effect.duration-=1;
			// player effect tick  goes here
			if(effect.name == "poison"){
				this.player_hp -= effect.strength;
			}
			if(effect.duration <= 0){
				// expiry effects go here.
				this.player_effect_expire(i);
			}
		}
		//monsters : kth monster: 
		for (var k=fighting_monsters.length-1;k>=0; k--){
			var this_monster = this.fighting_monsters[k];
			var monster_effects = this_monster.effects;
			//ith effect
			for(var i=monster_effects.length-1;i>=0;i--){
				var monster_effect = monster_effects[i];
				// monster effect tick goes here
				if(effect.name == "poison"){
					this_monster.hp -= effect.strength;
				}
				monster_effect.duration-=1;
				if(monster_effect.duration <= 0){
					// expiry effects go here.
					this.monster_effect_expire(k, i);
				}
			}	
		}
		
		// handle deaths.
		if(this.player_hp <= 0){
			this.player_death();
		}
		
		//monster death
		for (var k=fighting_monsters.length-1;k>=0; k--){
			var current_monster = fighting_monsters[k];
			if(current_monster.hp <= 0){
				this.monster_death(k);
			}
		}
		//fight end
		if(this.fighting_monsters.length == 0){
			 // if ...
			this.fight_end("player wins");
		}
		
		// cooldowns go down
		for (var k=0;k<fighting_monsters.length; k++){
			fighting_monsters[k].current_cd = Math.max(fighting_monsters[k].current_cd-1, 0);
		}	
		this.player_current_cd =Math.max(0, this.player_current_cd -1);
		this.current_ticks++;
	}

	 fight_end(result){
		this.fight_ended = true;
		this.fight_result = result;
		//TODO: change this code.
		
		
		/*
		items_dropped = [];
		console.log(result);
		game_stack[game_stack.length-1] = "fight end";
		if(result == "player wins"){ // clear the item.
			player_effects =[];
			if(game_stack[game_stack.length-2] == "walking"){
				entities_table[player_row.toString() + "," + player_col.toString()] = undefined;
			} 
			if(game_stack[game_stack.length-2] == "overworld"){
				overworld_cleared_list[overworld_location[0] + "," + overworld_location[1]] = 1;
			}
			//handle item drops
			for(var i=0;i<fought_monsters.length;i++){
				var monster = fought_monsters[i];
				for(var j=0; j<monster.drops.length;j++){
					items_dropped.push(monster.drops[j]);
				}
			}
		}
		if(result == "player loses"){
			game_stack= ["town"]; // pop all, including dungeons and so on
		}
		
		//additional effects go here
		
		//finally, clear the fought monsters list;
		fought_monsters = [];
		*/
	}

}

export default I_Combat;


