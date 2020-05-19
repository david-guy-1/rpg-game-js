//store all variables in dungeon instance.
import dungeon_entity from "../classes/dungeon_entity.js";
import monster from "../classes/monster.js";
import item from "../classes/item.js";


export function dungeon_begin(dungeon_inst, progress){
	if(dungeon_inst.dungeon.name == "Tutorial Dungeon"){
		dungeon_inst.added_boss = false;
		dungeon_inst.dungeon_over = false;
	}
}

export function dungeon_moved(dungeon_inst, progress){ // only called when the player has actually moved.

}
export function dungeon_fight_ended(dungeon_inst, progress){ 
	if(dungeon_inst.dungeon.name == "Tutorial Dungeon"){
		// if the monster at [1,2] has been defeated
		if(dungeon_inst.get_entity_at_location(1,2) == undefined && dungeon_inst.added_boss == false){
			dungeon_inst.added_boss = true;
			dungeon_inst.add_entity(3,3,new dungeon_entity("monster", [new monster(
			"boss", 1000, 0, 2000000, ["undead"], "", [])
			]));
		}  
		if(dungeon_inst.get_entity_at_location(3,3) == undefined && dungeon_inst.added_boss == true) {
			dungeon_inst.dungeon_over = true;
		}
	}

}

export function dungeon_chest_collected(dungeon_inst, progress){ 
	//alert("chest items collected!");
}
export function dungeon_door_unlocked(dungeon_inst, progress){ 
	//alert("chest items collected!");
}


export function dungeon_end(dungeon_inst, progress){ //called at every button press, return whether or not we should end the dungeon, called after dungeon_moved
	// note that this is called even if a fight begins, but is called on the first tick of the fight.
	
	if(dungeon_inst.dungeon.name == "Tutorial Dungeon"){
		return dungeon_inst.dungeon_over;
	}
	if(dungeon_inst.dungeon.name == "Walk right"){
		return dungeon_inst.player_x > 4;
	}
	return false;
}