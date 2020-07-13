/*
to add a test:

"dungeon_test": "mocha src/scripts/test/dungeon_test.tsx",
then do "npm run dungeon_test"

note that asserts are not included in selenium , they are in node!

https://www.selenium.dev/selenium/docs/api/javascript/index.html

and "describe" is in mocha

*/
import * as U from '../utilities.tsx';
import I_Combat from '../instances/I_Combat.tsx';
import I_Dungeon from '../instances/I_Dungeon.tsx';
import playerC from '../classes/playerC.tsx';
import monster from '../classes/monster.tsx';
import player_skill from '../classes/player_skill.tsx';
import effect from '../classes/effect.tsx';
import town from '../classes/town.tsx';
import item from "../classes/item.tsx";
import dungeon from "../classes/dungeon.tsx"
import dungeon_entity from "../classes/dungeon_entity.tsx"
import * as data from "../data/data.tsx";
import monster_generator from '../generators/G_Monster.tsx';
import monster_generator_3 from '../generators/G_Monster_3.tsx';
import dungeon_generator from "../generators/G_Dungeon.tsx";


export function test_fight(game){
				
		var basic_attack = new player_skill("basic attack", 100, 40, 0, [], [], [], "A basic attack");
		var protect = new player_skill("protect", 0, 40, 30, [new effect("immune", 40, 0, "player"), new effect("protect cd", 5000, 0, "player") ], [], [], "makes yourself temporarily immune to damage for 40 ticks. 5000 ticks cooldown");
		game.player = new playerC(5, 10, 1000, 1000, U.fillArray(undefined, 6), [basic_attack,protect ]);
		
		
		
		var item1 = new item("enchanted sword", 1000, 0, 0, 0, "A sword that does a ton of damage");
		var item2 = new item("sword of undead fighting", 3, 0, 0,0, "Must be equipped to use the smite undead skill");

		var monster1 = new monster("goblin", 10, 0,100, [], "",[] , {"gold":10});
		var monster2 = new monster("skeleton", 20, 0,2000, ['undead'],"" , [item1, item2] , {})
		var monster3 = new monster("test", 0, 0,2000, [],"", [], {"gold":31} );
		 monster1.effects.push(new effect("alice", 100, 10, "monster", []));
		monster3.hp = 1000;
		
		var monster4 = new monster("test", 0, 0,2000, [],"", [] , {"gold":25});
		var monster5 = new monster("test", 0, 0,2000, [],"", [] , {"gold":12});
		
		var inst = new I_Combat(game.player, [monster1, monster2,monster3, monster4, monster5], []);
		game.player.hp = 9999999;
		game.start_fight(inst);
	}
	// same as the dungeon one
export function	test_fight_2(game){
		// equip items
		var items = data.make_items();
		game.player.items[0] = items[0];
		game.player.items[1] = items[1];
		game.player.items[2] = items[2];		
		//make monsters;
		var monsters = data.make_monsters();
		//equip skills
		game.skill_pool = data.make_skills();
		game.player.skills[0] = game.skill_pool[0];
		game.player.skills[1] = game.skill_pool[1];
		game.player.skills[2] = game.skill_pool[2];
		game.player.skills[3] = game.skill_pool[1];
		game.player.skills[4] = game.skill_pool[2];
		game.player.skills[5] = game.skill_pool[1];
		game.player.skills[6] = game.skill_pool[2];
		game.player.skills[7] = game.skill_pool[1];
		game.player.skills[8] = game.skill_pool[2];
		game.player.skills[9] = game.skill_pool[1];
		game.player.skills[10] = game.skill_pool[2];
		//start a fight!
		game.start_fight(new I_Combat(game.player, monsters, undefined));
	}
export function	test_fill_inventory(game){
		var blanks = U.count(game.inventory, undefined);
		for(var i = 0; i < blanks; i++){
			game.give_item(new item("useless item", 0, 0, 0, 0, "A completely useless item"));
		}
	}
export function	test_dungeon(game){
		/*
		<ul>
		<li>go to the key to open the door. equip all 3 items, and use them to kill the monsters.</li>
		<li>Note that the skeleton does a one-shot at 100 ticks. Use protect to defend against that.</li>
		<li>The smite undead monster requires the monster to be undead, and also for you to have a sword of undead fighting.</li>
		<li>You also need the ring of health to survive their attacks.</li>
		</ul>
		*/
		
		game.skill_pool = data.make_skills();
		var dungeon_inst = data.make_dungeon();
		
		game.enter_dungeon(dungeon_inst);
	}
export function	test_town(game){
		game.skill_pool = data.make_skills();
		
		game.enter_town(data.make_town_by_name("town1"));
	}
export function	test_town_quest(game){
		var items = data.make_items();
		var skills = data.make_skills();
		game.player.items[0] = items[0];
		game.player.skills[0] = skills[0];
		game.enter_town(data.make_town_by_name("town2"));
	}
export function	test_show_dungeons(game){
		
		game.parameter = 0;
		game.seed = prompt();
		setInterval(function(game){
		game.parameter += 1;
		console.log(game.seed + game.parameter);
		game.enter_dungeon(dungeon_generator("name", 10, game.seed + game.parameter,0.8 , 0.2, 4, 10, 10))
		game.dismiss();
		window.controller.rerender();
		}.bind(game), 1000);
		
	}
export function	test_generated_dungeon(game){
		var items = data.make_items();
		var skills = data.make_skills();
		items[0].attack = 7500;
		game.player.items[0] = items[0];
		game.player.items[1] = items[2];
		game.player.skills[0] = skills[0];
		game.player.skills[1] = skills[3];
		game.player.skills[2] = skills[4];
		game.seed = prompt();
		
		game.enter_dungeon(dungeon_generator("name", 10, game.seed ,0.8 , 0.2,4 , 10, 10))
		game.dismiss();
		
		
		 
	}
	
export function	test_effects_fight(game){
		game.player.skills = data.make_effect_skills();
		game.player.items = data.make_items();
		var monster = data.make_defending_monster();
		game.start_fight(new I_Combat(game.player, [monster], undefined));
	}

export function test_requirements(game){
	game.player.skills = data.make_requirement_skills();
	game.inventory = data.make_requirement_items();
	var dungeon  = data.make_right_dungeon(9,9);
	for(var i=1; i<6; i++){
		for(var j=1; j<6; j++){
			dungeon.entities.push([i, j, new dungeon_entity("monster", data.make_requirement_monsters()	)]);
		}
	}
	dungeon.description = `Skills can only be used if certain requirements are met <br />
	To use the sun attack, the amulet of the sun must be equipped <br />
	To use the smite undead skill, the monster must be undead and you must equip the sword of undead fighting <br />
	To use the sunburn skill, the monster must first be hit by the sun attack<br />
	To use banish the night, the monster must be a night monster <br />
	`
	game.enter_dungeon(dungeon);
	
}
export function test_typescript(game){
	var monster = monster_generator_3();
	game.start_fight(new I_Combat(game.player, [monster], undefined))
}

