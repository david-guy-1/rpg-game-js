import * as U from "../utilities.tsx";
class dungeon_entity{// rows, cols, entities_table, player_start_x, player_start_y, start_fn, move_fn - no need for end_fn
    constructor(type, data){
		this.type = type;
		U.assert(["monster", "item"].indexOf(type) != -1);
		
		// if monster : list of monsters 
		// if item : object with keys "items", "currency". "items is a list of items, and "currency" is an object of currency to gain
		// if lock: nothing (no need for corresponding key, it will automatically be set)
		// if key : corresponding lock
		switch (type){
			case "monster":
				this.monsters = data;
			break;
			case "item":
				this.items = data.items;
				this.currency = data.currency
			break;

			default:
				throw new ReferenceError("invalid type : " + type.toString())
			break;
		}
	}
}

export default dungeon_entity;
