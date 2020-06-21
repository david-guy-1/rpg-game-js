import monster from "../classes/monster.js";
import dungeon_entity from "../classes/dungeon_entity.js";
import dungeon from "../classes/dungeon.js";
import monster_generator from "./G_Monster.js";
import * as U from "../utilities.js";
//monster_generator(difficulty, attack_adjust = 1, defense_adjust = 1, hp_adjust = 1, flags = [],attack_pattern = "basic attack"
//constructor(name, description,end_display,rows,cols,walls,entities,player_start_x,player_start_y,locks, keys, params){

function dungeon_generator(name, difficulty, seed, wall_density, enemy_density, key_limit , rows, cols){
	U.assert(U.check_type(arguments, ["string", "number", "string", "number", "number", "number", "number", "number"], "dungeon generator type error"))
	var walls = new Set();
	var occupied = new Set(["0 0"]); // occupied places, as strings
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
				if(down_wall && !(x == 0 && y == 0)){
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
		counter ++;
		// replace a frontier wall with a lock and key
		
		/*
		var cofrontier = U.bfs(rows, cols, walls, rows-1, cols-1)[1];
		if(U.intersect(frontier, cofrontier).size != 0){
			var removed_wall = U.choice(U.intersect(frontier, cofrontier), "removing wall " + seed + counter);
		} else {
			if(frontier.size <= cofrontier.size){
				var removed_wall = U.choice(frontier, "removing wall " + seed + counter);
			}else{
				var removed_wall = U.choice(cofrontier, "removing wall " + seed + counter);
			}
		}*/
		
		var removed_wall = U.choice(frontier, "removing wall " + seed + counter);
		// remove the wall 
		walls.delete(removed_wall);
		// should we add a lock and key?
		if(U.minus(reachable, occupied).size != 0 && occupied.size < key_limit + 1){
			var key_location = U.choice(U.minus(reachable, occupied) , "adding key " + seed + counter);
			locks.push(removed_wall);
			occupied.add(key_location);
			keys.push([parseInt(key_location.split(" ")[0]),parseInt(key_location.split(" ")[1])]); 
		} else {
			console.log("B")
		}
		
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

					var monster = monster_generator(
						difficulty,
						1 + U.rand(seed + "monster attack " + x + " " + y)*0.1,
						1 + U.rand(seed + "monster def " + x + " " + y)*0.1,
						1 + U.rand(seed + "monster hp " + x + " " + y)*0.1,
					);
					
			//		console.log(monster);
					entities.push([x, y, new dungeon_entity("monster",
					//monster_generator(difficulty, attack_adjust = 1, defense_adjust = 1, hp_adjust = 1, flags = [],attack_pattern = "basic attack"
					[monster])])
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
