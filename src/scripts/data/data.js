import monster from '../classes/monster.js';
import item from "../classes/item.js";
import dungeon_entity from "../classes/dungeon_entity.js"
import dungeon from "../classes/dungeon.js"
import player_skill from '../classes/player_skill.js';
import monster_generator from "../generators/G_Monster.js"
import effect from '../classes/effect.js';
import monster_skill from '../classes/monster_skill.js';
import town from '../classes/town.js';
import * as T from "../tables.js";

// monster's constructor:

//name,attack,defense,hp,flags,attack_pattern,drops, currency_drops

//a sampling of items. 
export function make_items(){
		var item1 = new item("enchanted sword", 2000, 0, 0, 0, "A sword that does a ton of damage");
		var item2 = new item("sword of undead fighting", 3, 0, 0,0, "Must be equipped to use the smite undead skill", {"undead fighting" : 1});
		var item3 = new item("ring of health", 0, 0, 100000,0, "A ring that gives huge health boost");
		return [item1, item2, item3];
}

// a sampling of monsters. including item drops, undead, and poison attack
export function useless_item(){
	return new item("useless item", 0, 0, 0, 0, "A completely useless item");
}
export function make_monsters(){
		var monster1 = new monster("goblin", 1000, 0,10000, "",[] , {"gold":10});
		var itemDrop1 = useless_item();
		var monster2 = new monster("test_skeleton", 2000, 0,12000000, "" , [itemDrop1] , {"gold":32}, {"undead":1})
		var monster3 = new monster("test", 0, 0,2000);
		var monster4 = monster_generator(1.1, 1,1,1,"poison attack");
		return [monster1, monster2, monster3, monster4]
}
export function make_weak_monster(){
	return new monster("goblin", 10, 0, 2000);
}
// makes a monster that , on every tick that is 0 mod 50, attacks.
// and on (30 mod 100), puts a defensive buff (-50% damage for 50 ticks);


export function make_defending_monster(){
	var monster_skill_attack = new monster_skill("attack", 1, 30, [], [], []);
	var monster_skill_defend = new monster_skill("defend", 0, 0, [new effect("defense", 50, 0.5)], [], []);
	var defensive_monster = new monster("defensive monster", 300, 25, 100000,  {"priority queue":[[monster_skill_attack,50, "player"],[monster_skill_defend, 100, "self"]]}, [], {"gold":30},{});
	return defensive_monster;
	
}
// a "tutorial" dungeon with keys, a chest, a generated monster, and a boss
export function make_dungeon(){
		var item_entity = new dungeon_entity("item", {"items":[useless_item()], "currency":{gold:23} });		
		var monster_entity = new dungeon_entity("monster", make_monsters());
		var monster_entity2 = new dungeon_entity("monster", [make_monsters()[3]]); // generated monster 
		var monster_entity3 = new dungeon_entity("monster", []);
		
		var dungeon_inst = new dungeon("Tutorial Dungeon" , `<ul>
		<li>go to the key to open the door. equip all 3 items, use all 3 skills, and use them to kill the monsters.</li>
		<li>Note that the skeleton does a one-shot at 100 ticks. Use protect to defend against that.</li>
		<li>The smite undead monster requires the monster to be undead, and also for you to have a sword of undead fighting.</li>
		<li>You also need the ring of health to survive their attacks.</li>
		</ul>` ,
		`
		You did it! <br /> Press any key to go back.
		`
		,
		5, 6, 
		[[3,2,"down"], [1,1,"right"], [1, 0, "down"], [1, 1, "down"]], //walls
		[[1,1,item_entity], [1,2,monster_entity], [2,2,monster_entity2],[2,0,monster_entity3]], // entities
		0, 0,
		[[0,1, "right"]], [[1,4]]//locks and keys
		, {}
		);
		return dungeon_inst;		
}

//same as dungeon 1, but useless item
export function make_dungeon_2(){
	var dungeon_inst = make_dungeon();
	// remove the original entity and replace it with a new one
	dungeon_inst.entities.splice(0, 1);
	var item_entity = new dungeon_entity("item", {items:[useless_item()], "currency":{"gold":212}})
	dungeon_inst.entities.push([1,1,item_entity]);
	return dungeon_inst;
}	

// a dungeon where you win by moving right.

export function make_right_dungeon(i=5, j=6){
		return new dungeon("Walk right" , `Just walk right` ,
		`
		You walked right!<br /> <h1>Good for you!</h1> <br />
		`
		,
		i, j, 
		[], //walls
		[], // entities
		0, 0, //starting location
		[],[]//locks and keys
		//no params
		);
}
export function make_skills(){
			var basic_attack = new player_skill("basic attack", 1, 40,40 ,0, [], [], [], "A basic attack");

		var smite_undead = new player_skill("smite undead",300, 4,4, 20, [], [], [], "An attack that deals massive damage to undead monsters. Requires the target to be undead and an anti-undead weapon equipped", {"require item with tag":["undead fighting"], "require monster tag":["undead"]});
		
		var protect = new player_skill("protect", 0,5000, 40, 30, [new effect("immune", 40, 0, "player")], [], [], "makes yourself temporarily immune to damage for 40 ticks. 5000 ticks cooldown");
		
		var quick_attack = new player_skill("quick attack", 0.9 ,25, 5, 0, [], [], [], "attack faster than usual, but with less damage");
	
		var strong_attack = new player_skill("strong attack", 1.3 ,40, 40, 30, [], [], [], "a strong attack, but costs mana");
		
		return [basic_attack, smite_undead, protect, quick_attack, strong_attack ];
}


// make skills that have effects

//	"attack, defense, poison, speed (player only), mana (player only) , other

//constructor for player_skill : (name,damageMult,cd,delay,mana,self_effects,target_effects,global_effects,description){
export function make_effect_skills(){
	var basic_attack = new player_skill("basic attack", 1, 40,2 ,0, [], [], [], "A basic attack");
	
	var poison_attack = new player_skill(
		"poison attack",
		0.3,
		100,
		5,
		30,
		[],
		[new effect("poison", 100, 5)],
		[],
		"An attack that poisons for 100 ticks"
	)

	var empower = new player_skill(
		"empower",
		0,
		500,
		5,
		20,
		[new effect("attack", 200, 1.4)],
		[],
		[],
		"Increases damage for 200 ticks"
	)	
	
	var manaless = new player_skill(
		"manaless",
		0,
		500,
		5,
		0,
		[new effect("mana", 250, 0)],
		[],
		[],
		"Attacks don't cost mana for 250 ticks"
	)	
	
	var haste = new player_skill(
		"haste",
		0,
		500,
		5,
		0,
		[new effect("speed", 250, 0.5)],
		[],
		[],
		"Cooldowns halved for 250 ticks"
	)	
	return [basic_attack , poison_attack, empower, manaless, haste];
}

export function make_requirement_monsters(){
	var goblin = new monster("goblin", 250,25,300000,"",[], {},{});
	var skeleton = new monster("skeleton", 750,25,600000,"",[], {},{"undead":1});
	var night_monster = new monster("night monster", 1250,25,780000,"",[], {},{"night":1});
	return [goblin, skeleton, night_monster];
}

export function make_requirement_skills(){
	var basic_attack = new player_skill("basic attack", 1, 40,2 ,0, [], [], [], "A basic attack");
	//{"require item with tag":["undead fighting"], "require monster tag":["undead"]});
	var smite_undead = make_skills()[1];
	smite_undead.damageMult = 3.5; // should not be instant kills
	//require item
	var sun_attack = new player_skill(
		"sun attack",3.0,25,3,40,[],[new effect("sunlit", 100, 0)],[], "Makes the enemy sunlit. Requires an amulet of the sun",{"require item" : ["amulet of the sun"]});
		
	var sunburn = new player_skill("sunburn",10,65,1,0,[],[],[],"massive damage, but requires the monster to be sunlit",  {"require other effect":["sunlit"]});
	
	var banish_the_night = new player_skill("banish the night",2.5,43,1,0,[],[new effect("attack", 200, 0.6), new effect("poison", 200, 20)],[],"poisons and weakens target monster. Requires the monster to be a night monster",  {"require monster tag":["night"]})
	
	var instant_kill = new player_skill("instant kill", 99999 ,100, 0, 0, [], [], [], "instant kill, for debugging purposes");
	
	var mana_restore = new player_skill("mana restore", 0,100, 0, -750, [], [], [], "restore some mana");
	return [basic_attack, smite_undead, sun_attack, sunburn, banish_the_night, instant_kill, mana_restore];
}

export function make_requirement_items(){
	var undead_sword = make_items()[1];
	var amulet_of_the_sun = new item("amulet of the sun", 2500, 20, 1000, 0, "A powerful amulet that enables the sun attack");
	var great_shield = new item("great shield", 0, 2500, 1000000, 0, "A shield for not taking damage");
	return [undead_sword, amulet_of_the_sun, great_shield];
}

export function make_town_by_name(name){
	return new town(name, T.town_data[name].rectangles); 
}

export function make_right_town(){
	return new make_town_by_name("town1");
}