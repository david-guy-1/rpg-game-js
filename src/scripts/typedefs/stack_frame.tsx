import item from "../classes/item";
import currency_obj from "./currency_obj";
import I_Combat from "../instances/I_Combat";
import I_Dungeon from "../instances/I_Dungeon";
import town from "../classes/town";
import {quest} from "../classes/quest";

export interface  stack_frame {
	"name":string;
	// fighting:
	combat_instance ? :  I_Combat ; 
	
	//fight end
	
	items_dropped ? :  item[] 
	chosen ? :  boolean[] ;
	selected ?:  number;
	currency ?:  currency_obj

	// dungeon:
	dismissed ?:  boolean;
	dungeon_instance ?:  I_Dungeon;

	// town:
	town ?:   town;
	
	// quest giver
	quest_giver_name ?:   string;
	quests ?:   quest[];
}

// subtypes 

export interface  stack_frame_fighting extends stack_frame  {
	combat_instance : I_Combat;
}

export interface  stack_frame_fight_end extends stack_frame  {
	items_dropped : item[] 
	chosen : boolean[] ;
	selected : number;
	currency : currency_obj

}

export interface  stack_frame_dungeon extends stack_frame  {
	dismissed : boolean;
	dungeon_instance : I_Dungeon;
}

export interface  stack_frame_town extends stack_frame {
	town :  town;
}

export interface  stack_frame_quest_giver extends stack_frame  {
	quest_giver_name :  string;
	quests : quest[]
}



export default stack_frame;