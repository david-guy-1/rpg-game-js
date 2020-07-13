/* 
struct code:

def struct(name,x):
    print("class " + name + "{")
    print("    constructor(" + ",".join(x) + "){")
    for i in x:
        print("        this." + i + " = " + i + ";")
    print("}")
    print("    clone(){")
    print("        return new " +name + "(" + ",".join(map(lambda y : "this."+y, x)) +");")
    print("    }")
    print("}")
	
struct ("item",("name", "attack", "defense", "hp", "mana", "description)"))

*/

class overworld_object{
	constructor(seed){
		this.seed = seed;
		this.quest_1 = [randint(700, 1200, seed + " quest item 1 x") , randint(700, 1200, seed + " quest item 1 y")];
		this.quest_2 = [randint(-1200, -700, seed + " quest item 2 x"), randint(-300, 300, seed + " quest item 2 y")];
		this.quest_3 = [randint(-1200, -700, seed + " quest item 3 x") , randint(700, 1200, seed + " quest item 3 y")];
		
		// skill dungeons
		// skills should have some kind of "distance" here.
		this.skills_list = Object.keys(attacks_table);
		this.skill_dungeons = [];
		for(var i=0; i<this.skills_list.length;i++){		
			var distances = skill_distances[this.skills_list[i]];
			var distance = randint(distances[0], distances[1], seed + this.skills_list[i] + " skill dungeon distance");
			this.skill_dungeons.push(point_on_circle(distance, seed + this.skills_list[i] + " skill dungeon"));
		}
		this.table_counter = 0;
		this.table_limit =  10000;
		this.table_1 = {};
		this.table_2 = {}; 
		
	} 
	add_to_table(key, value){ //adds an entry to the lookup table. If there are more than table_limit entries, then the table is moved to table_2,and table_2 is deleted. 
		if(this.table_1[key] == undefined){
			this.table_counter+=1;
		}
		this.table_1[key] = value;
		if(this.table_counter == this.table_limit){
			this.table_limit = 0;
			this.table_2 = this.table_1;
			this.table_1 = {};
		}
	
	}
	lookup_table(key){
		
		if(this.table_1[key] != undefined){
			return this.table_1[key];
		}
		if(this.table_2[key] != undefined){
			return this.table_2[key];
		}
		return undefined;
	}
	clear_item(x,y){
		this.cleared_list[x + "," + y] = 1;
	}
	special_table(value){
		// if spawning something:
		if(value < 0.7){ //70% chance to spawn a normal monster
			return "monster"
		} else if (value < 0.85){ // 15% chance to spawn a standard dungeon
			return "random dungeon";
		} else if (value < 0.9){ // 5% chance to spawn an epic dungeon
			return "epic dungeon";
		} else if (value < 0.95){ // 5% chance to spawn a boss
			return "boss";
		} else{ // 5% chance to spawn a gem bearer
			return "gem bearer"
		}
	}
	get_item(x, y){
		var seed = this.seed;
	//gets the item at this location
	// note that this can be overridden by, for example, quests or already clearing things.
		var key = x + ","+y;
		if(this.lookup_table(key) != undefined){
			return this.lookup_table(key);
		}
		
		if(x == this.quest_1[0] && y ==this.quest_1[1]){
			return "quest 1";
		}
		if(x == this.quest_2[0] && y ==this.quest_2[1]){
			return "quest 2";
		}	
		if(x == this.quest_3[0] && y ==this.quest_3[1]){
			return "quest 3";
		}
		for(var i=0; i<this.skills_list.length;i++){
			if(this.skill_dungeons[i][0] == x && this.skill_dungeons[i][1] == y){
				return "skill dungeon " + this.skills_list[i];
			}
		}
		// "generic" item
		var angle = (Math.atan2(y, x)+ 2*Math.PI)%(Math.PI*2);
		//calculate deviations - these are between -0.05 and 0.05
		//calculate the type of space we're in
		var dev = rand(seed + " deviation 1" + x + "," + y) * 0.1 - 0.05;
		
		if(0 + dev<= angle && angle <= 1 + dev){
			var type="desert,";
		}
		else if(1 + dev <= angle && angle <= 2.2+dev){
			var type="arena,";
		}
		else if(2.2 + dev <= angle && angle <= 3.4+dev){
			var type="cave,";
		}
		else if(3.4 + dev <= angle && angle <= 4.6+dev){
			var type="forest,";
		}
		else if(4.6 + dev <= angle && angle <= 2*Math.PI + dev){
			var type="graveyard,";
		} else{
			var type="desert,"
		}
		//special item?
		var special_item = rand(seed + x + "," + y + "special?");
		var chance_of_thing = 0.2;
		if(special_item < chance_of_thing){ // 30% chance to spawn something
			var return_value = type + this.special_table(special_item/chance_of_thing);
		}else{
			var return_value =  type + "nothing special";
		}
		this.add_to_table(key, return_value);
		return return_value;
	}

}

//struct ("item",("name", "attack", "defense", "hp", "mana", "description"))


//not quite struct("monster_attack", ["damage","cd","effects"])


//struct("effect",["name","duration","strength","target"])

//not quite struct("monster",["name","attack","defense","hp","flags","attack_pattern","drops"])



function generate_monster(type, difficulty, params, seed){
	var name = "name_" + seed;
	var attack = 10*difficulty;
	var defense = 5*difficulty;
	var hp = 20*difficulty;
	var generic_pattern = function(){
		if(type == "poisonous" && difficulty > 10){
			if(!has_effect("poison_cd")){
				return monster_attack(0.2, 20, [new effect( "poison", 100, 10, "player")]);
			}
		}
		return (1.0, 47, [])
	}
	var out_monster = new monster(name, attack, defense, hp, "",generic_pattern, []); 
	out_monster.difficulty = difficulty
}


   
