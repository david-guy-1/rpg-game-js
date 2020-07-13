import * as U from "../utilities"
import dungeon_entity from "./dungeon_entity";

type on_dungeon_entity = [number, number, dungeon_entity];
type wall = [number, number, string];
type coord = [number, number];

class dungeon{// rows, cols, entities_table, player_start_x, player_start_y, start_fn, move_fn - no need for end_fn
//  description : HTML code showing what will be displayed when dungeon begins
// end_display : HTML code shown when dungeon ends
// start and move fn's can be blank for now, or treat them as params. TODO: implement them. 
// entities table : list of triples: (x,y, dungeon_entity)
// walls and locks: list of triples : (x, y, right/down)
// keys: just coordinates. the ith key opens the ith lock 
		name : string;
		 description : string;
		end_display : string ;
		rows : number;
		cols : number ;
		walls: wall[];
		entities : on_dungeon_entity[];
		player_start_x : number ;
		player_start_y : number ;
		locks : wall[];
		 keys : coord[];
		 flags : object;
		 
 
    constructor(name : string, description : string,end_display : string ,rows : number,cols : number ,walls: wall[],entities : on_dungeon_entity[],player_start_x : number ,player_start_y : number ,locks : wall[], keys : coord[], flags : object ={} ){
		this.name = name;
		this.description =  description;//description can be html code but not jsx
		this.end_display = end_display;
        this.rows = rows;
        this.cols = cols;
		this.walls = walls;
        this.entities = entities;
        this.player_start_x = player_start_x;
        this.player_start_y = player_start_y;
        this.locks = locks; 
        this.keys = keys; 
		this.flags = flags; // make stuff here
	}
	has_flag(flag_name){
		return this.flags[flag_name] != undefined
	}
	get_flag(flag_name){
		return this.flags[flag_name];
	}
}

export default dungeon;
