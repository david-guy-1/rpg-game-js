
import * as U from '../utilities';
import item from "./item";
import effect_collection from "../typedefs/effect_collection";
import currency_obj from "../typedefs/currency_obj";

class monster{
	
	name : string ;
	attack : number ;
	 defense: number ;
	hp: number ;
	effects : effect_collection
	max_hp : number;
	attack_pattern : any;
	drops : item[]  ;
	 currency_drops : currency_obj ;
	 flags : any ;
	current_delay : number;
	last_used ?: (number | undefined) [];  // tick at when it last used an ability
	//used for "priority queue" in attack_patterns.tsx
	
     constructor(name : string ,attack : number , defense: number ,hp: number ,attack_pattern : any= ""  ,drops : item[] = [] , currency_drops : any= {} , flags : any = {} ){
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
        this.attack_pattern = attack_pattern; // only used in attack patterns.tsx, can be anything that can be JSONified.
		
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

