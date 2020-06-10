import monster from "../classes/monster.js";
import dungeon_entity from "../classes/dungeon_entity.js";
import dungeon from "../classes/dungeon.js";
import monster_generator from "./G_Monster.js";
import * as U from "../utilities.js";
//monster_generator(difficulty, attack_adjust = 1, defense_adjust = 1, hp_adjust = 1, flags = [],attack_pattern = "basic attack"
//constructor(name, description,end_display,rows,cols,walls,entities,player_start_x,player_start_y,locks, keys, params){

function dungeon_generator(name, difficulty, seed, wall_density, enemy_density, rows, cols){
	var walls = new Set();
	var occupied = new Set(); // occupied places, as strings
	var entities = [];
	var locks =[];
	var keys = [];
	
	// add walls
	for(var x=0; x < cols; x++){
		for(var y=0; y < rows; y++){
			// try to add a wall
			if(U.rand(seed + " " + x + " " + y) < wall_density){
				var wall_determiner = U.rand(seed + " " + x + " " + y + "right wall")
				var right_wall = (x < cols-1 && wall_determiner < 0.66)
				var down_wall = (y < rows-1 && wall_determiner > 0.33);
				if(right_wall){
					walls.add([x, y, "right"])
					
				}
				if(down_wall){
					walls.add([x, y, "down"])
				}
			}
			
		}
	}
	
	// check if the end is reachable.
	var result = U.bfs(rows, cols,walls,0, 0)
	var reachable = result[0];
	var frontier = result[1];
	var counter  = 0;
	while( !reachable.has((cols-1) + " " + (rows-1) )){
		// replace a frontier wall with a lock and key
		var removed_wall = U.choice(frontier, "removing wall " + seed + counter);
		var key_location = U.choice(reachable, "adding key " + seed + counter);
		walls.delete(removed_wall);
		locks.push(removed_wall);
		occupied.add(key_location);
		keys.push([parseInt(key_location.split(" ")[0]),parseInt(key_location.split(" ")[1])]); 
		U.choice(frontier, "removing wall " + seed + counter);
		counter ++;
		result = U.bfs(rows, cols,walls,0, 0)
	    reachable = result[0];
		frontier = result[1];
	}
	
	// add enemies
	
		
	for(var x=0; x < cols; x++){
		for(var y=0; y < rows; y++){
			// try to add an enemy
				if(!occupied.has(x + " " + y) && U.rand(seed + " enemy " + x + " " + y) < enemy_density){
				// cannot put enemy on bottom right or top left
				if(x == cols-1 && y == rows-1){
					continue;
				}
				if(x == 0 && y == 0){
					continue;
				}
					
					console.log(monster_generator(
						difficulty,
						1 + U.rand("monster attack " + x + " " + y)*0.1,
						1 + U.rand("monster def " + x + " " + y)*0.1,
						1 + U.rand("monster hp " + x + " " + y)*0.1,
					))
					
					
					entities.push([x, y, new dungeon_entity("monster",
					//monster_generator(difficulty, attack_adjust = 1, defense_adjust = 1, hp_adjust = 1, flags = [],attack_pattern = "basic attack"
					[monster_generator(
						difficulty,
						1 + U.rand("monster attack " + x + " " + y)*0.1,
						1 + U.rand("monster def " + x + " " + y)*0.1,
						1 + U.rand("monster hp " + x + " " + y)*0.1,
					)])])
					occupied.add(x + " " + y);
				}
			
		}
	}
	
	
	return new dungeon(name, "generated","You cleared the generated dungeon",rows,cols,
	[...walls],
	entities,
	0,0,
	locks,keys,
	["generated"])
}

export default dungeon_generator; 


//attack_adjust = 1, defense_adjust = 1, hp_adjust = 1, flags = [],attack_pattern = "basic attack"
