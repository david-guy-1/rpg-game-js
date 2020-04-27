import * as U from "../utilities.js";
class dungeon_entity{// rows, cols, entities_table, player_start_x, player_start_y, start_fn, move_fn - no need for end_fn
    constructor(type, data){
		this.type = type;
		U.assert(["monster", "item"].indexOf(type) != -1);
		
		// if monster : list of monsters 
		// if item : list of items
		// if lock: nothing (no need for corresponding key, it will automatically be set)
		// if key : corresponding lock
		switch (type){
			case "monster":
				this.monsters = data;
			break;
			case "item":
				this.items = data;
			break;

			default:
				throw new ReferenceError("invalid type : " + type.toString())
			break;
		}
	}
}

export default dungeon_entity;
