import dungeon from "../classes/dungeon.js";
import * as data from "../data/data.js"
import item from "../classes/item.js";
import monster from "../classes/monster.js";
export function town_click(town, progress, index){
	// "index" is which rectangle was clicked
	//returns an object with a "type" key
	
	// if type is "dungeon", then there must be a dungeon instance in the key "dungeon", NOT an I_Dungeon instance
	
	// if type is "items", then there must be a list of items in the key "items". 
	
	// if type is "fight", then there must be a list of monsters in the key "monsters"
	
	// town1, no items
	if(town.name == "town1" && index == 0 && progress.town1_items == undefined){
		progress.town1_items = true;
		return {type:"item", items:data.make_items()};
	}
	
	if(town.name == "town1" && index == 2 && progress.town1_dungeon == undefined){
		progress.town1_dungeon = true;
		return {type:"dungeon", dungeon:data.make_dungeon_2()};
	}
	return {type:"nothing"};
}