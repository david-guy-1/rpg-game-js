import * as U from "../utilities";
import item from "./item";
import monster from "./monster";

import currency_obj from "../typedefs/currency_obj";

type data_obj = {"items" : item[], "currency":currency_obj};

class dungeon_entity{// rows, cols, entities_table, player_start_x, player_start_y, start_fn, move_fn - no need for end_fn
    
	type : string;
	items : undefined | item[] 
	currency : undefined | currency_obj
	monsters : undefined | monster[];
	
	constructor(type : string, data :  data_obj | undefined | monster[]){
		this.type = type;
		U.assert(["monster", "item"].indexOf(type) != -1);
		
		// if monster : list of monsters 
		// if item : object with keys "items", "currency". "items is a list of items, and "currency" is an object of currency to gain
		// if lock: nothing (no need for corresponding key, it will automatically be set)
		// if key : corresponding lock
		switch (type){
			case "monster":
				this.monsters = data as monster[];
			break;
			case "item":
				this.items = (data as data_obj).items as item[];
				this.currency = (data as data_obj).currency as currency_obj;
			break;

			default:
				throw new ReferenceError("invalid type : " + type.toString())
			break;
		}
	}
}

export default dungeon_entity;
