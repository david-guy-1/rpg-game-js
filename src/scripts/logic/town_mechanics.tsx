import dungeon from "../classes/dungeon";
import * as data from "../data/data"
import item from "../classes/item";
import monster from "../classes/monster";
import dungeon_generator from "../generators/G_Dungeon";
import town from "../classes/town";
import currency_obj from "../typedefs/currency_obj"

type town_click_output  = {
	"type":string;
	"dungeon" ? : dungeon;
	"items" ? : item[];
	"currency" ? : currency_obj;
	"monsters" ? : monster[];
	"name" ? : string;
}

export function town_click(town : town, progress : any, index : number) : town_click_output{
	// "index" is which rectangle was clicked
	//returns an object with a "type" key
	
	// if type is "dungeon", then there must be a dungeon instance in the key "dungeon", NOT an I_Dungeon instance
	
	// if type is "items", then there must be a list of items in the key "items". 
	
	// if type is "fight", then there must be a list of monsters in the key "monsters"
	

	// if type is "quest giver" then there must be a name of a quest giver in the key "name";
	
	// town1, no items
	if(town.name == "town1"){		
		if(index == 0 && progress.town1_items == undefined){
			progress.town1_items = true;
			return {type:"item", items:data.make_items(), currency:{"gold":12}};
		}
		if(index == 2 && progress.town1_dungeon == undefined){
			progress.town1_dungeon = true;
			return {type:"dungeon", dungeon:data.make_dungeon_2()};
		}
	}
	
	// town 2 : can keep on fighting
	if(town.name == "town2"){
		if(index == 0){
			return {type:"quest giver", name:"quester1"}
		}
		if(index == 1){
			return {type:"fight", monsters : [data.make_weak_monster()]};
		}
		if(index == 2){
			return {type:"dungeon", dungeon : dungeon_generator("name", 100, "ABCD",0.4,  0.3, undefined, 4, 7)};
		}
	}
	return {type:"nothing"};
}
