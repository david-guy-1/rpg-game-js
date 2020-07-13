//fighting global variables, should be set to null/[] if not fighting.

import items from '../classes/item';
import monster from '../classes/monster';
import monster_skill from '../classes/monster_skill';
import effect from "../classes/effect";
import * as U from '../utilities';
import compute_attack_pattern from "../logic/attack_patterns";
// I think we should avoid using tables for anything other than initializing. What if we need to generate things dynamically?
//cloning: always use Object.assign(new monster(), monster_list[i])

// "special" effects:

/*
effects is a hash table now. The keys are :
"attack, defense, poison, speed (player only), mana (player only) , other

attack, defense, speed and mana are all multiplicative. 

1.3 strength attack effect = damage multiplied by 1.3

0.7 strength defense effect = damage multiplied by 0.7 (so lower is better) 
*/

class I_Combat{
	constructor(player, monster_list, dungeon){ // does not mutate these
	// dungeon can be undefined
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
		this.has_other_effect = this.has_other_effect.bind(this);
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
		this.currently_queued_attack = queued_attack; // just the index
		this.currently_attacking_monster = target; // this is the index!
		this.current_ticks = 0;
		
		this.player_effects = {"name":"player", "attack":[], "defense":[], "poison":[], "speed":[],"mana":[],"other":[]};
		// extra code goes here, maybe. 
		this.cooldowns = U.fillArray(0, 10);  // index -> number of ticks
		
	}

	 add_monster(monster){
		this.fighting_monsters.push(monster)
		
	}
	 has_other_effect(unit, name){
	 // returns if the unit has an effect in the "other" category
	 // unit is either "player" or a monster object
		if(unit == "player"){
			var effects_list = this.player_effects.other;
		} else{
			var effects_list = unit.effects.other
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
			if(this.player.items[i] == undefined){
				continue;
			}
			if(this.player.items[i].name == item_name){
				return true;
			}
		}
		return false;
	}
	//returns whether or not the player has an item with a given tag
	has_item_with_tag(item_name){
		for(var i=0; i<this.player.items.length ;i++){
			if(this.player.items[i] == undefined){
				continue;
			}
			if(this.player.items[i].has_flag(item_name)){
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
			var passed = true;
			//"require item, require item with tag, require monster tag, require other effect" (all are OR individually, but AND with other requirements)
			if(attack.has_flag("require item")){
				// search player's items for an item with this name
				var items = attack.get_flag("require item");
				var passed = false;
				for(var i=0; i < items.length ; i++){
					if(this.has_item(items[i])){
						passed = true;
						break;
					}
				}
			}
			if(!passed){
				return false;
			}

			if(attack.has_flag("require item with tag")){
				// search player's items for an item with this name
				var tags = attack.get_flag("require item with tag");
				var passed = false;
				for(var i=0; i < tags.length ; i++){
					if(this.has_item_with_tag(tags[i])){
						passed = true;
						break;
					}
				}
			}
			if(!passed){
				return false;
			}

			if(attack.has_flag("require other effect")){
				// search player's items for an item with this name
				var tags = attack.get_flag("require other effect");
				var passed = false;
				for(var i=0; i < tags.length ; i++){
					if(target_monster.has_other_effect(tags[i])){
						passed = true;
						break;
					}
				}
			}
			if(!passed){
				return false;
			}

			if(attack.has_flag("require monster tag")){
				// search player's items for an item with this name
				var tags = attack.get_flag("require monster tag");
				var passed = false;
				for(var i=0; i < tags.length ; i++){
					if(target_monster.has_flag(tags[i])){
						passed = true;
						break;
					}
				}
			}
			if(!passed){
				return false;
			}

			
			return true;
			
	}
	multiply_through_effects(number, effects){
		U.assert(typeof(effects) == "object");
		for(var i=0; i<effects.length; i++){
			U.assert(effects[i] instanceof effect);
			number *= effects[i].strength;
		}
		return number;
	}
	
	 calculate_damage_p2m(attack_index, target_monster){ 
			var attack = this.player.skills[attack_index]
			var attack_name = attack.name;
			var tentative_damage = attack.damageMult*this.player_attack
			
			var is_damage = (attack.damageMult > 0); // is this an actual damaging attack? because heals are not reduced by defense.
			
			if(is_damage){
				tentative_damage -= target_monster.defense;
				tentative_damage = Math.max(0, tentative_damage);
			}
				
			// go through every player effect and see if that changes damage dealt.
			//default effects:
			tentative_damage = this.multiply_through_effects(tentative_damage, this.player_effects.attack)
			
			if(is_damage){
				tentative_damage = this.multiply_through_effects(tentative_damage, target_monster.effects.defense)
			}
			
			// non-default effects
				for(var i=0;i<this.player_effects.other.length;i++){
					var effect = this.player_effects.other[i];
					// (player's) effects, well , effect starts here.
				}
				
				// same for monster
				for(var i=0;i<target_monster.effects.length;i++){
					var effect = target_monster.effects.other[i];	
					// (monster's) effects, well , effect starts here.
				}
			return Math.floor(tentative_damage);
	}
	calculate_mana_cost(attack_index, target_monster){
				var attack = this.player.skills[attack_index]
				var attack_name = attack.name;
				var tentative_cost = attack.mana; 				
				// go through every player effect and see if that changes mana cost.
				
				tentative_cost = this.multiply_through_effects(tentative_cost, this.player_effects.mana)
				
				// non-default effects
				for(var i=0;i<this.player_effects.other.length;i++){
					var effect = this.player_effects.other[i];
					// (player's) effects, well , effect starts here.
				}
			
				// same for monster
				for(var i=0;i<target_monster.effects.other.length;i++){
					var effect = target_monster.effects.other[i];	
					// (monster's) effects, well , effect starts here.
				}
			return Math.floor(tentative_cost);			
	}
	// "global" cooldown
	 calculate_delay_p2m(attack_index, target_monster){ 
				var attack = this.player.skills[attack_index]
				var attack_name = attack.name;
				var tentative_delay = attack.delay; 				
				// go through every player effect and see if that changes delay.
	
				// non-default effects
				for(var i=0;i<this.player_effects.other.length;i++){
					var effect = this.player_effects.other[i];
					
					// (player's) effects, well , effect starts here.
				}
				
				// same for monster
				for(var i=0;i<target_monster.effects.other.length;i++){
					var effect = target_monster.effects.other[i];	
					// (monster's) effects, well , effect starts here.
				}
			return Math.floor(tentative_delay);	
	}
	//cooldown for that one ability
	calculate_cd_p2m(attack_index, target_monster){ 
			var attack = this.player.skills[attack_index]
			var attack_name = attack.name;
			var tentative_cd = attack.cd; 				
				// go through every player effect and see if that changes cooldown.
			
			tentative_cd = this.multiply_through_effects(tentative_cd, this.player_effects.speed)
				
		
				
				for(var i=0;i<this.player_effects.other.length;i++){
					var effect = this.player_effects.other[i];
					
					// (player's) effects, well , effect starts here.

				}
				
				// same for monster
				for(var i=0;i<target_monster.effects.other.length;i++){
					var effect = target_monster.effects.other[i];	
					// (monster's) effects, well , effect starts here.
				}
			return Math.floor(tentative_cd);	
	}
	
	
	 apply_effects_p2m(attack_index, target_monster){ 
		var attack = this.player.skills[attack_index]
		var attack_name = attack.name;
		//self 
		for(var i=0; i<attack.self_effects.length;i++){
			var effect = attack.self_effects[i]
			this.add_effect(this.player_effects, effect);
	//		console.log("adding effect " + effect.name  + " at tick " + this.current_ticks);
		}
		
		//enemy monster
		for(var i=0; i<attack.target_effects.length;i++){
			var effect = attack.target_effects[i]
			this.add_effect(target_monster.effects, effect); 
		}
		
		//all 
		for(var i=0; i<attack.global_effects.length;i++){
			for(var j=0; j<this.fighting_monsters.length;j++){
					var effect = attack.global_effects[i]
					var monster = this.fighting_monsters[j];
					this.add_effect(monster.effects, effect); 
			}
			
		}
		// extra code goes here!
	}
	
	//attack is a monster_skill instance, since there are no indices for monste skills
	//target_index is either "player", or the index of a monster
	 does_monster_attack_succeed(attack, target_index){  
		var has_other_effect = this.has_other_effect
		
		if(has_other_effect("player", "immune")){
			return false;
		}
			return true;			
	}
	
	
	 calculate_damage_m2p(attack, attacking_monster){
			
			var is_damage = (attack.damage > 0);
			
			var tentative_damage = attack.damage*attacking_monster.attack;
			if(is_damage){
				tentative_damage -= this.player_defense;
				tentative_damage = Math.max(0, tentative_damage);
			}
			// go through every monster effect and see if that changes damage dealt.
			
			//default effects:
			if(is_damage){
				tentative_damage = this.multiply_through_effects(tentative_damage, this.player_effects.defense)
			}
			
			tentative_damage = this.multiply_through_effects(tentative_damage, attacking_monster.effects.attack)
									
			
				for(var i=0;i<attacking_monster.effects.other.length;i++){
					var effect = attacking_monster.effects.other[i];
					
					// (monster's) effects, well , effect starts here.
				}
				
				// same for player
				for(var i=0;i<this.player_effects.other.length;i++){
					var effect = this.player_effects.other[i];	
					// (player's) effects, well , effect starts here.
				}
			return Math.floor(tentative_damage);
	}
	
	 calculate_damage_m2m(attack, attacking_monster, target_monster_index){
			var is_damage = (attack.damage > 0);
			 var target_monster = this.fighting_monsters[target_monster_index];
			if(target_monster == undefined){
				throw "calculate_damage_m2m target  undefined";
			}
			var tentative_damage = attack.damage*attacking_monster.attack;
			if(is_damage){
				tentative_damage -= target_monster.defense;
			}			
			// go through every monster effect and see if that changes damage dealt.
			// don't want defense to reduce healing
				
			if(is_damage){
				tentative_damage = this.multiply_through_effects(tentative_damage, target_monster.effects.defense)
			}
			tentative_damage = this.multiply_through_effects(tentative_damage, attacking_monster.attack)
			
			
				
					
		// non-default effects 
				for(var i=0;i<attacking_monster.effects.other.length;i++){
					var effect = attacking_monster.effects.other[i];
					
					// (monster's) effects, well , effect starts here.
				}
				
				// same for player
				for(var i=0;i<this.player_effects.other.length;i++){
					var effect = this.player_effects.other[i];	
					// (player's) effects, well , effect starts here.
				}
			return Math.floor(tentative_damage);
	}
	
	 calculate_delay_m2p(attack, attacking_monster){
		var tentative_delay = attack.delay; 				
		
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
			return Math.floor(tentative_delay);	
	}
	
	 apply_effects_m2p(attack, attacking_monster){
		//self 
		for(var i=0; i<attack.self_effects.length;i++){
			var effect = attack.self_effects[i]
			this.add_effect(attacking_monster.effects, effect);
		}
		
		//player
		for(var i=0; i<attack.target_effects.length;i++){
			var effect = attack.target_effects[i]
			this.add_effect(this.player_effects, effect);
		}
		
		//all 
		for(var i=0; i<attack.global_effects.length;i++){
			for(var j=0; j<this.fighting_monsters.length;j++){
					var effect = attack.global_effects[i]
					var monster = this.fighting_monsters[j];
					this.add_effect(monster.effects, effect);
			}
		}
	}
	 apply_effects_m2m(attack, attacking_monster, target_monster_index){
		var target_monster = this.fighting_monsters[target_monster_index];
		if(target_monster == undefined){
			throw "apply_effects_m2m target  undefined";
		}
		//self 
		for(var i=0; i<attack.self_effects.length;i++){
			var effect = attack.self_effects[i]
			this.add_effect(attacking_monster.effects, effect);
		}
		
		//target
		for(var i=0; i<attack.target_effects.length;i++){
			var effect = attack.target_effects[i]
			this.add_effect(target_monster, effect);
		}
		
		//all 
		for(var i=0; i<attack.global_effects.length;i++){
			for(var j=0; j<this.fighting_monsters.length;j++){
					var effect = attack.global_effects[i]
					var monster = this.fighting_monsters[j];
					this.add_effect(monster.effects, effect);
			}
		}
	}
	add_effect(current_effects, new_effect){
		if(new_effect.duration == 0){
			throw "effect with duration 0";
		}
		switch(new_effect.name){
			case "attack":
			case "defense":
			case "poison":
			case "speed":
			case "mana":
				current_effects[new_effect.name].push(Object.assign(new effect(), new_effect));
			break;
			default:
				current_effects["other"].push(Object.assign(new effect(), new_effect));
			
		}
	}
	
	decrement_effect_duration(effects){
	//	console.log(effects.name)
	//	console.log(JSON.stringify(effects));
		var keys = Object.keys(effects);
		var expired_effects = [];
		for(var x of keys){
			if(x == "name"){
				continue;
			}
			// decrement each one, backwards.
			for(var i=effects[x].length-1; i >=0 ; i--){
				effects[x][i].duration -= 1;
				if(effects[x][i].duration < 0){
					throw "effect duration negative";
				}			
				if(effects[x][i].duration == 0){
					// delete this effect
					expired_effects.push(effects[x][i]);
					effects[x].splice(i, 1)
				}

			}
		}
		return expired_effects;
	}

	//when multiple effects expire, these will be called in order of decreasing index;
	 player_effect_expire(effect){
		if(effect.name == "delay damage"){
			this.player_hp -= Math.floor(effect.strength);		 	
		}
	}
	 monster_effect_expire(monster, effect){
		if(effect.name == "delay damage"){
			monster.hp -= Math.floor(effect.strength);
		}
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
			// cooldown
			
			if(this.cooldowns[this.currently_queued_attack] != 0){
				var attack_succeeds = false;
			} else {
				var mana_cost = this.calculate_mana_cost(this.currently_queued_attack, target_monster)
				if(mana_cost > this.player_mana){
					var attack_succeeds = false;
				} else {
					var attack_succeeds = this.does_attack_succeed(this.currently_queued_attack, target_monster);
				}
			}
			// attacks can go wrong;
			
				
			if(attack_succeeds){ // attack succeeds.
				
				//calculate the damage it does:
				
				var damage = this.calculate_damage_p2m(this.currently_queued_attack, target_monster)
				var cd = this.calculate_delay_p2m(this.currently_queued_attack, target_monster)
				this.cooldowns[this.currently_queued_attack] = this.calculate_cd_p2m(this.currently_queued_attack, target_monster);
				this.player_mana -= mana_cost;
				this.player_current_cd = Math.floor(cd);
				target_monster.hp -= Math.floor(damage);
				this.apply_effects_p2m(this.currently_queued_attack, target_monster);

					
			}
		}
		
		for (var z=0;z<fighting_monsters.length;z++){
	// monster attacks-------------------
			var current_monster = fighting_monsters[z];
			if(current_monster.current_delay != 0){
				continue;
			}
			
			var monster_attack = compute_attack_pattern(current_monster, this, z);
			if(monster_attack == undefined){
				continue;
			}
			var monster_attack_target = monster_attack["target"];
			monster_attack = monster_attack["skill"];
			
			//this is damage, delay, effect
			if(isNaN(current_monster.current_delay)){
				throw "monster's delay is NaN";
			}
			
			if(current_monster.current_delay == 0 && monster_attack != null){
				// attack using given attack;

				
				var attack_succeeds = this.does_monster_attack_succeed(monster_attack.name, monster_attack_target);
				
				// attacks can go wrong;
				

				if(attack_succeeds){// monster attack succeeds.

					var delay = this.calculate_delay_m2p(monster_attack, current_monster);
					current_monster.current_delay = Math.floor(delay);
					// target is player
					if(monster_attack_target == "player"){ 
						var damage = this.calculate_damage_m2p(monster_attack, current_monster);						
						this.player_hp -= Math.floor(damage);
						//apply effects
						this.apply_effects_m2p(monster_attack, current_monster);
					}
					// traget is another monster
					if(monster_attack_target != "player"){ 
					// delay done the same way as monster to player.
						var damage = this.calculate_damage_m2p(monster_attack, current_monster, monster_attack_target);
						fighting_monsters[monster_attack_target].hp -= Math.floor(damage);
						//apply effects
						this.apply_effects_m2m(monster_attack, current_monster, monster_attack_target);
					}
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
		// then, poison
		for(var effect of this.player_effects["poison"]){
			this.player_hp -= effect.strength;
		}
		for(var monster of this.fighting_monsters){
			for(var effect of monster.effects["poison"]){
				monster.hp -= effect.strength;
			}
		}
		
		// handle all effects, backwards so that removing effects doesn't mess up rest of the list.
		var result = this.decrement_effect_duration(this.player_effects);
		for(var effect of result){
			this.player_effect_expire(effect);
		}

		//monsters : kth monster: 
		for (var k=fighting_monsters.length-1;k>=0; k--){
			var this_monster = this.fighting_monsters[k];
			var result = this.decrement_effect_duration(this_monster.effects);	
			for(var effect of result){
				this.monster_effect_expire(this_monster, effect);
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
		
		// delays go down
		for (var k=0;k<fighting_monsters.length; k++){
			fighting_monsters[k].current_delay = Math.max(fighting_monsters[k].current_delay-1, 0);
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


