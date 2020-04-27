import * as U from "../utilities.js"
class dungeon{// rows, cols, entities_table, player_start_x, player_start_y, start_fn, move_fn - no need for end_fn

// start and move fn's can be blank for now, or treat them as params. TODO: implement them. 
// entities table : list of triples: (x,y, dungeon_entity)
// walls and locks: list of triples : (x, y, right/down)
// keys: just coordinates. the ith key opens the ith lock 
    constructor(name, description,rows,cols,walls,entities,player_start_x,player_start_y,locks, keys, params){
		this.name = name;
		this.description =  description;//description can be html code but not jsx
        this.rows = rows;
        this.cols = cols;
		this.walls = walls;
        this.entities = entities;
        this.player_start_x = player_start_x;
        this.player_start_y = player_start_y;
        this.locks = locks; 
        this.keys = keys; 
		this.params = params; // make start and move functions here. 
	}
}

export default dungeon;
