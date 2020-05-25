//screen limits:
//vertical : 750, horizontal: 1600

export var display_constants  = {
	// in combat:
	
	//monsters:
	"monster_screen_top_left":[50,20],
	"monster_width":230,
	"icon_height":130,
	"name_height":50,
	"attack_indicator_top_left":[140, 20],
	"attack_indicator_width":60,
	"attack_indicator_height":60,
	"hp_height":30,
	"effects_height":60,
	"hp_bar_height":15,
	"monsters_top_left":[40,40], // the div containing the boxes for the monsters, relative to monster_screen_top_left
	"monsters_gap":50,
	
	// skills (in combat)
	"skill_width" : 180,
	"skill_height" :50,
	"skill_gap":0,
	"skill_top_left":[100, 390],
	"skill_internal_padding":3,

	//player health bar
	"player_health_bar_top_left" : [100, 514],
	"player_health_bar_width":700,
	"player_health_bar_height":12,

	// player stats
	"player_stats_top_left":[100, 530],
	"player_stats_full_width":700,
	"player_stats_full_height":120,
	// player stats individual boxes 
	"player_stats_width":100,
	"player_stats_height":50,
	//ticks at top left
	"ticks_top_left":[10, 60],
	

	//fight end
	"fight_end_icon_top_left":[470, 50],
	"fight_end_item_top_left":[470, 150],
	"fight_end_win_top_left":[30,30],
	"fight_end_item_drop_counter_top_left":[100,100],
	"fight_end_item_drop_counter_width":200,
	"fight_end_item_chosen_counter_top_left":[100,320],
	"fight_end_item_chosen_counter_width":200,
	"fight_end_item_inv_counter_top_left":[100,410],
	"fight_end_item_inv_counter_width":200,
	"fight_end_chosen_indicator_top_left":[50,570],
	"fight_end_chosen_indicator_width":200,
	"fight_end_inv_full_top_left":[100,150],
	"fight_end_inv_full_width":300,
	
	"fight_end_left_button_top_left":[475,467],
	"fight_end_right_button_top_left":[623,467],
	"fight_end_select_button_top_left":[543,467],
	"fight_end_back_button_top_left":[543,547],
	"fight_end_buttons_width":60,
	"fight_end_buttons_height":60,
	
	"fight_end_currency_top_left" : [781, 104],
	

	//dungeon description sizes:
	"dungeon_name_top_left" :[100,50],
	"dungeon_name_width":500,
	"dungeon_name_height":60,
	"dungeon_desc_top_left":[100,150],
	"dungeon_desc_width":700,
	"dungeon_desc_height":500,
	"dungeon_start_top_left":[100,600],
	"dungeon_start_width":600,
	"dungeon_start_height":100,
	
	//dungeon  
	"skills_button_top_left" : [50, 50],
	"inv_button_top_left" : [250, 50],
	"skills_button_width":100,
	"skills_button_height":70,
	"inv_button_width":130,
	"inv_button_height":70,
	"dungeon_top_left":[100,100],
	"dungeon_width":500,
	"dungeon_height":600,
	"dungeon_cell_width":50,
	"dungeon_cell_height":50,
	"dungeon_coords":[100,100],
	
	// inventory stuff:
	
	"inventory_rows":6,
	"inventory_cols":6, // keep synchronized with inventory's number of items
	"inventory_box_width":80,
	"inventory_box_height":80,
	"inventory_top_left":[10,50],
	"inventory_padding":10, //padding goes inside of image
	"inventory_equip_top_left":[520,448],
	"inventory_equip_width":218,
	"inventory_equip_height":87,
	"inventory_back_top_left":[945,463],
	"inventory_back_width":218,
	"inventory_back_height":87,
	"equip_top_left":[770,50],
	"equip_items":6, // keep synchronized with game's number of equipped items
	
	"inventory_details_top_left":[520,120],
	"equip_details_top_left":[950, 120],
	
	"inventory_currency_top_left":[105,567],
	// skills :
	"skill_names_top_left":[100,100],
	"skill_table_rows":3,
	"skill_table_cols":7,
	"skill_name_width":70,
	"skill_name_height":100,
	"skill_desc_top_left":[650,60],
	"skill_desc_equip_top_left":[1000,60],
	"equipped_skills_top_left":[100,520],
	"skills_equip_top_left":[462,470],
	"skills_equip_width":168,
	"skills_equip_height":87,
	"skills_back_top_left":[462,570],
	"skills_back_width":168,
	"skills_back_height":87,
	"skill_desc_width":300,
	"skill_desc_height":500,
	
	
}

export var images_lst = { // images for all things: monsters, items, etc.
	"goblin":"temp.jpg",
	"skeleton":"temp2.jpg",
	"test_skeleton":"temp2.jpg",
	"test":"temp2.jpg",
	"temp_monster":"temp3.jpg",
	"boss":"boss.jpg",
	"generated":"generated.jpg",
	
	
	
	"sword of undead fighting":"sword_of_undead.jpg",
	"sword":"sword.jpg",
	"epic sword":"epic_sword.jpg",
	"enchanted sword":"epic_sword.jpg",
	"useless item":"useless_item.jpg",
	"ring of health":"ring_of_health.jpg",
	"no_item":"no_item.jpg",
	
}

export var town_data = { // name of town -> object with keys  : image, dungeons,shops,quest_takers
	// image is a name, other 3 are quadruples indicating coordinates of rectangles we can click on. tlx, tly, brx, bry

	"town1": {"image":"town1.jpg", "rectangles":[[170,230,394,418, "blue"],[402,100,638,401, "green"],[846,169,1060,417, "red"]]},
	"town2": {"image":"town2.jpg", "rectangles":[[137,380,234,470, "blue"],[868,249,1067,427, "green"]]}

}

export var instructions_text = {"fight":"asdfgzxcvb: select attack, 12345: select enemy. you cannot run",
"dungeon":"wasd : move, q : go to inventory, e : go to skills, space : see description",
"inventory":"e : equip item, wasd : move inventory, rf: move equipped item, space: leave inventory",
"skills": "asdfgzxcvb : choose skill to swap out. arrow keys: select skill in skill pool, e : equip skill, Space : leave. You cannot equip a skill more than once",
"overworld":"wasd : move, z : go to skills, i : go to inventory",
"fight end":"as : scroll, q : toggle chosen, space: go back",
"town":"click on things.",

 }
 
 

 
 /*
//WARNING: make sure to properly clone these, we might run into problems since the game class stores pointers. We never want the pointers to point to the table entries, as they are supposed to be constant.

var skill_distances = {"basic attack":[0,150], "quick attack":[100,200], "smite undead":[200,250], "empower":[300,400]} // hash table - name of skill -> min distance, max distance.

var monsters_table = { 
"goblin":new monster("goblin", 10, 0,100, [], function(){return new monster_attack(1.0, 47, []) }, []),
"skeleton":new monster("skeleton", 20, 0,2000, ['undead'],function(){return new monster_attack(1.0, 47, [])} , [] ),
"test_monster":new monster("test", 0, 0,2000, [],function(){return new monster_attack(1.0, 47, [])}, [] ),
}

var attacks_table = { // based on level, default damage multiplier, default delay, default mana cost 
//always start with description since levels begin at 1.
    "basic attack":["A basic attack", [1.0,40,0], [1.2,40,0] , [1.3,40,0]],
	"quick attack":["An attack with a really low cooldown", [0.5,15,10], [0.6,14,10] , [0.7,13,10]],
	"smite undead":["An attack that deals massive damage to undead monsters. Requires the target to be undead and an anti-undead weapon equipped", [2.0,50,20], [2.5,45,20] , [3.0,40,20]],
	"empower":["Increases your damage and at higher levels, your attack speed", [0, 20, 20], [0, 20, 20]], // effects test.
}

var monster_attacks_table = { // same. except no longer based on level.  Also has applied effects "built in". 
// that is: name -> array (damage multiplier, delay, list of effects)
    "basic attack":[1.0, 47, []],
}

var effects_table = { // hash table : string (name of attack) -> array. Array is as follows:
    // The first index is the level. This returns a list of effects to be used. The effect itself is (player/monster, name, strength, duration)
	// so effects_table["empower"][2][1][1] is the name of the 1st effect that empower level 2 has, which is "hasted"
    "empower":[null, 
	[new effect("attack_mult",  120,1.2, "player"), new effect("empower cooldown", 0, 200, "player")], 
	[new effect("attack_mult",  120,1.4, "player"), new effect("empower cooldown", 150,0,  "player"), new effect("speed_mult",  120,0.8, "player")],
	]
}



standard_dungeon = null;
function create_standard_dungeon(){ // in a function just to avoid polluting the global namespace
	var monster_0 = create_monster("goblin");
	monster_0.drops.push(new item("epic sword", 90, 0, 0, 0, "An epic sword of epicness!"));
	monster_0.drops.push( new item("sword of undead fighting", 3, 0, 0,0, "Must be equipped to use the smite undead skill"));
	var monster_1 = create_monster("goblin");
	var monster_2 = create_monster("skeleton");
	monster_1.effects.push(new effect("a", 150, 10,"monster"));
	monster_1.effects.push(new effect("b", 75,10, "monster"));
	monster_1.effects.push(new effect("c", 300,10, "monster"));
	monster_1.effects.push(new effect("d", 200,10, "monster"));
	monster_2.effects.push(new effect("weakened bones", 300,20, "monster"));

	var standard_entities_table = {};
	standard_entities_table["1,2"] = ["monster", [monster_0]];
	standard_entities_table["2,2"] = ["monster", [monster_1, monster_2]];
	standard_dungeon = new dungeon(6,4,standard_entities_table,0,1,function(){}, function(){
		//does not have access to "this" or anything like that. have to read global vars.
		if(entities_table["2,2"] == undefined){
			dungeon_end();
		}
	}
	);
	
}	

*/