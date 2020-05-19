import monster from '../classes/monster.js';
import item from "../classes/item.js";
import dungeon_entity from "../classes/dungeon_entity.js"
import dungeon from "../classes/dungeon.js"
import player_skill from '../classes/player_skill.js';
import monster_generator from "../generators/G_Monster.js"
import effect from '../classes/effect.js';
import town from '../classes/town.js';
import * as T from "../tables.js";


//a sampling of items. 
export function make_items(){
		var item1 = new item("enchanted sword", 2000, 0, 0, 0, "A sword that does a ton of damage");
		var item2 = new item("sword of undead fighting", 3, 0, 0,0, "Must be equipped to use the smite undead skill");
		var item3 = new item("ring of health", 0, 0, 100000,0, "A ring that gives huge health boost");
		return [item1, item2, item3];
}

// a sampling of monsters. including item drops, undead, and poison attack
export function useless_item(){
	return new item("useless item", 0, 0, 0, 0, "A completely useless item");
}
export function make_monsters(){
		var monster1 = new monster("goblin", 1000, 0,10000, [], "",[] );
		var itemDrop1 = useless_item();
		var monster2 = new monster("test_skeleton", 2000, 0,12000000, ['undead'],"" , [itemDrop1] )
		var monster3 = new monster("test", 0, 0,2000, [],"", [] );
		var monster4 = monster_generator(1.1, 1,1,1,[],"poison attack");
		return [monster1, monster2, monster3, monster4]
}

// a "tutorial" dungeon with keys, a chest, a generated monster, and a boss
export function make_dungeon(){
		var item_entity = new dungeon_entity("item", [useless_item()]);		
		var monster_entity = new dungeon_entity("monster", make_monsters());
		var monster_entity2 = new dungeon_entity("monster", [make_monsters()[3]]);
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

		);
		return dungeon_inst;		
}

//same as dungeon 1, but useless item
export function make_dungeon_2(){
	var dungeon_inst = make_dungeon();
	dungeon_inst.entities.splice(0, 1);
	var item_entity = new dungeon_entity("item", [useless_item()])
	dungeon_inst.entities.push([1,1,item_entity]);
	return dungeon_inst;
}	

// a dungeon where you win by moving right.

export function make_right_dungeon(){
		return new dungeon("Walk right" , `Just walk right` ,
		`
		You walked right!<br /> <h1>Good for you!</h1> <br />
		`
		,
		5, 6, 
		[], //walls
		[], // entities
		0, 0, //starting location
		[],[]//locks and keys
		//no params
		);
}
export function make_skills(){
			var basic_attack = new player_skill("basic attack", 1, 40,40 ,0, [], [], [], "A basic attack");

		var smite_undead = new player_skill("smite undead",300, 4,4, 20, [], [], [], "An attack that deals massive damage to undead monsters. Requires the target to be undead and an anti-undead weapon equipped");
		
		var protect = new player_skill("protect", 0,5000, 40, 30, [new effect("immune", 40, 0, "player")], [], [], "makes yourself temporarily immune to damage for 40 ticks. 5000 ticks cooldown");
		
		return [basic_attack, smite_undead, protect ];
}


export function make_town(){
	return new town("town1", [make_dungeon()], [], []);
}

export function make_town_by_name(name){
	return new town(name, T.town_data[name].rectangles); 
}

export function make_right_town(){
	return new make_town_by_name("town1");
}