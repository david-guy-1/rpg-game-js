import monster from '../classes/monster.js';
import item from "../classes/item.js";
import dungeon_entity from "../classes/dungeon_entity.js"
import dungeon from "../classes/dungeon.js"
import player_skill from '../classes/player_skill.js';
import monster_generator from "../generators/G_Monster.js"
import effect from '../classes/effect.js';
import town from '../classes/town.js';
export function make_dungeon(){
	
		var monster1 = new monster("goblin", 1000, 0,10000, [], "",[] );
		var itemDrop1 = new item("useless item", 0, 0, 0, 0, "A completely useless item");
		var monster2 = new monster("test_skeleton", 2000, 0,12000000, ['undead'],"" , [itemDrop1] )
		var monster3 = new monster("test", 0, 0,2000, [],"", [] );
		var monster4 = monster_generator(1.1, 1,1,1,[],"poison attack");

		
		var item1 = new item("enchanted sword", 2000, 0, 0, 0, "A sword that does a ton of damage");
		var item2 = new item("sword of undead fighting", 3, 0, 0,0, "Must be equipped to use the smite undead skill");
		var item3 = new item("ring of health", 0, 0, 100000,0, "A ring that gives huge health boost");
		
		var item_entity = new dungeon_entity("item", [item1, item2, item3]);
		
		var monster_entity = new dungeon_entity("monster", [monster1, monster2, monster3]);
		
		var monster_entity2 = new dungeon_entity("monster", [monster4]);
		
		
		var dungeon_inst = new dungeon("Tutorial Dungeon" , `<ul>
		<li>go to the key to open the door. equip all 3 items, use all 3 skills, and use them to kill the monsters.</li>
		<li>Note that the skeleton does a one-shot at 100 ticks. Use protect to defend against that.</li>
		<li>The smite undead monster requires the monster to be undead, and also for you to have a sword of undead fighting.</li>
		<li>You also need the ring of health to survive their attacks.</li>
		</ul>` , 5, 6, 
		[[3,2,"down"], [1,1,"right"], [1, 0, "down"], [1, 1, "down"]], //walls
		[[1,1,item_entity], [1,2,monster_entity], [2,2,monster_entity2]], // entities
		0, 0,
		[[0,1, "right"]], [[1,4]]//locks and keys

		);
		return dungeon_inst;		
}

export function make_skills(){
			var basic_attack = new player_skill("basic attack", 1, 40, 0, [], [], [], "A basic attack");

		var smite_undead = new player_skill("smite undead",3000, 40, 20, [], [], [], "An attack that deals massive damage to undead monsters. Requires the target to be undead and an anti-undead weapon equipped");
		
		var protect = new player_skill("protect", 0, 40, 30, [new effect("immune", 40, 0, "player"), new effect("protect cd", 5000, 0, "player") ], [], [], "makes yourself temporarily immune to damage for 40 ticks. 5000 ticks cooldown");
		
		return [basic_attack, smite_undead, protect ];
}

export function make_town(){
	return new town("town1", [make_dungeon()], [], []);
}