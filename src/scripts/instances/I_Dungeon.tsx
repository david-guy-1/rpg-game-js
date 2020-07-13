import * as U from "../utilities"
import * as dm from "../logic/dungeon_mechanics";
import dungeon_entity from "../classes/dungeon_entity";
import dungeon from "../classes/dungeon";
const _ = require("lodash")

class I_Dungeon{
	dungeon : dungeon ;
	player_x : number;
	player_y : number;
	unlocked : boolean[];
	entities : [number, number, dungeon_entity][];
	
	constructor(dungeon : dungeon){
		//DO NOT MUTATE!!!
		this.dungeon = dungeon;
		this.player_x = dungeon.player_start_x;
		this.player_y = dungeon.player_start_y;
		//top left is 0,0
		this.entities = [];
		//add in entities
		for(var i=0; i<dungeon.entities.length; i++){
			var ent = dungeon.entities[i];
			this.add_entity(ent[0], ent[1], ent[2]);
		}// current table of entities in world. This allows mutating. 
		
		// entities must be (x,y, dungeon_entity)
		this.unlocked = U.fillArray(false, dungeon.locks.length);
		
	}
	 has_wall(x1 : number, y1 : number, x2 : number, y2 : number) : boolean{
		// returns whether or not there is a wall between the given cells
		// this includes going off the map, or locked doors
		
		//requires one of the coordinates to be the same, and the other to differ by one.
		var dungeon = this.dungeon;
		var unlocked = this.unlocked;
		
		U.assert( (x1 == x2 && ((y1 -y2) == 1 || (y1 -y2) == -1)) ||
		(y1 == y2 && ((x1 -x2) == 1 || (x1 -x2) == -1)));
 		
		if(x1 > x2 || y1 > y2){
			return this.has_wall(x2, y2, x1, y1); 
		} // so now the first coordinate is smaller;
		if(x1 < 0 || y1 < 0 || x2 >= dungeon.cols || y2 >= dungeon.rows){
			return true;
		}
		//for each wall, check if it will block us
		for(var i=0; i<dungeon.walls.length; i++){
			var wall = dungeon.walls[i];
			if(wall[0] == x1 && wall[1] == y1){
				if((wall[2] == "down" && x1 == x2) || (wall[2] == "right" && y1 == y2)){
					return true;
				}
			}	
		}
		//check locks as well
		for(var i=0; i<dungeon.locks.length;i++){
			if(unlocked[i]){
				continue;
			}
			var wall = dungeon.locks[i];
			if(wall[0] == x1 && wall[1] == y1){
				if((wall[2] == "down" && x1 == x2) || (wall[2] == "right" && y1 == y2)){
					return true;
				}
			}	
		}
		return false;
	}

	 move_player(direction : string) : boolean{ // direction is "up", "down", "left", "right"
	 // tries to move in a direction. if no wall, return true. otherwise, return false 
		switch(direction){
			case "left":
				var vertical = 0;
				var horizontal = -1;
				break;
			case "right":
				var vertical = 0;
				var horizontal = 1;
				break;
			case "up":
				var vertical = -1;
				var horizontal = 0;
				break;
			case "down":
				var vertical = 1; 
				var horizontal = 0;
				break;
			default:
				alert("error" + direction);
				return false;
			}
		// if moving into a wall:
		var wall = this.has_wall(this.player_x, this.player_y,  this.player_x+horizontal, this.player_y +vertical);
		
		if(!wall){
			this.player_y += vertical;
			this.player_x += horizontal;
			return true;
		}
		return false; 
	}
	 unlock_door(i){
		this.unlocked[i] = true;
	}
	 lock_door(i){
		this.unlocked[i] = false;
	}
	 toggle_door(i){
		this.unlocked[i] = !this.unlocked[i];
	}
	 add_entity(x,y,entity){ // needs to have coordinates as well
		this.entities.push([x,y, _.clone(entity)]);
	}
	 remove_entity_by_location(x : number,y : number) : void{
		for(var i=0; i<this.entities.length; i++){
			var entity = this.entities[i];
			if(entity[0] == x && entity[1] == y){
				this.entities.splice(i, 1);
				break;
			}
		}
	}
	get_entity_at_location(x : number,y : number ) :(dungeon_entity | undefined){
		for(var i=0; i<this.entities.length; i++){
			var entity = this.entities[i];
			if(entity[0] == x && entity[1] == y){
				return this.entities[i][2];
				break;
			}
		}
		return undefined;
	}
	//returns the dungeon entity the player is on, or undefined
	player_on() : (dungeon_entity | undefined){
		for(var i=0; i<this.entities.length; i++){
			var entity = this.entities[i];
			if(entity[0] == this.player_x && entity[1] == this.player_y){
				return entity[2];
				break;
			}
		}
		return undefined;
	}
	//returns the index of the key that the player is on, or "undefined"
	key_on() : (number | undefined){
		for(var i=0; i<this.dungeon.keys.length; i++){
			var key = this.dungeon.keys[i];
			if(key[0] == this.player_x && key[1] == this.player_y){
				return i;
				break;
			}
		}
		return undefined;
		
	}
}


export default I_Dungeon;




