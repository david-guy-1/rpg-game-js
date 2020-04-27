
import playerC from './playerC.js';
import monster from './monster.js';
import player_skill from './player_skill.js';
import effect from '../classes/effect.js';
import town from './town.js';
import I_Combat from '../instances/I_Combat.js';
import I_Dungeon from '../instances/I_Dungeon.js';
import item from "./item.js";
import dungeon from "./dungeon.js"
import dungeon_entity from "./dungeon_entity.js"
import * as dm from "../logic/dungeon_mechanics.js"
import * as U from '../utilities.js';
import monster_generator from '../generators/G_Monster.js';
import * as data from "../data/data.js";
// might need more imports

//game should not call any controller methods, at all

/*
 item: constructor(name,attack,defense,hp,mana,description){
 monster: constructor(name,attack,defense,hp,flags,attack_pattern,drops){
 monster_skill:  constructor(name,damage,cd,self_effects,target_effects,global_effects){
 player_skill:constructor(name,damageMult,cd,mana,self_effects,target_effects,global_effects,description){ 
effect: constructor(name,duration,strength, target, params){
player: constructor(attack,defense,hp,mana, items=[], skills =[]){
*/
class game {
	constructor(){
		this.inventory = U.fillArray(undefined, 36);
		this.game_stack = [];
		this.skill_pool = [];

		this.player = new playerC(5, 10, 1000, 1000, U.fillArray(undefined, 6), []);
		
		
	}
	// utilities:
	game_state(){
		return this.game_stack[this.game_stack.length-1];
	}
	give_item(item){
		for(var i=0; i<this.inventory.length;i++){
			if(this.inventory[i] == undefined){
				// add in an item
				this.inventory[i] = item;
				break;
			}
		}
	}
	equip_item(x,y){ // attempt to swap item x in inventory with item y in equips
		var item = this.player.items[y];
		var inv_item = this.inventory[x];
		this.player.items[y] = inv_item;
		this.inventory[x] = item;
	}	
	equip_skill(x,y){ // attempt to equip skill x in skill pool with y in equipped skills
		var player = this.player;
		var skill = this.skill_pool[x];
		if(skill == undefined){ // un-equipping always works
			player.skills[x] = undefined; 
		} else { // now skill is defined
			//check if skill is duplicated
			for(var i=0; i<10;i++){
				if(player.skills[i] != undefined && player.skills[i].name == skill.name){
					//fail, duplicate skill
					return;
				}
			}
			player.skills[y] = skill;			
		}
	}
	// fight commands:
	start_fight(combat_instance){
		this.combat_instance = combat_instance; 
		this.game_stack.push("fighting");
		this.combat_instance.fight_begin(0,0);
		this.items_type = "fight"; // so that when items are collected, we'd know if it was from a fight or from chest.
	}
	fight_tick(){
		U.assert(this.game_state() == "fighting");
		this.combat_instance.fight_tick();
			// fight is over now!
		if(this.combat_instance.fight_ended){
			// player wins
			if(this.combat_instance.fight_result == "player wins"){
				var items_dropped = this.combat_instance.items_dropped
				this.combat_instance = undefined;
				this.game_stack.pop();
				this.start_fight_end(items_dropped);
				
				
			}
			// player loses. 
			else if (this.combat_instance.fight_result == "player loses"){
				this.game_stack[this.game_stack.length-1] = "player loses";				
			}
		}
	}
	
	// fight end commands:
	start_fight_end(items){
		this.game_stack.push("fight end");
		
		this.items_dropped = items;
		this.chosen = U.fillArray(false, items.length);
		this.selected = 0;		
	}
	
	finished_items(){
		for(var i=0; i<this.items_dropped.length; i++){
			if(this.chosen[i]){
				this.give_item(this.items_dropped[i]);
			}
		}
		if(this.items_type == "fight"){
			dm.dungeon_fight_ended(this.dungeon_instance);
		} else if(this.items_type == "chest"){
			dm.dungeon_chest_collected(this.dungeon_instance);
		}
		
		this.items_type = undefined;
		this.game_stack.pop();
	}
	//dungeon commands
	enter_dungeon(dungeon){
		//do NOT mutate the dungeon at all. note that combat clones the monsters, so we can call it.
		this.game_stack.push("dungeon");
		this.dungeon_instance = new I_Dungeon(dungeon);
		this.dismissed = false;
		dm.dungeon_begin(this.dungeon_instance);
	}
	dismiss(){
		this.dismissed = true;
	}
	undismiss(){
		this.dismissed = false;
	}
	player_pressed_button(code){ // player pressed a button in the dungeon. check things.
		if(this.game_state() == "dungeon"){
			/*
			when the user preses a button in a dungeon, this happens:
			1. the controller's handleKeyDown function is called, 
			2. if the press is WASD, handleKeyDown calls I_Dungeon's move_player, even if it goes into a walls
			3. If not a wall, move_player calls dm.dungeon_moved
			4. Regardless of walls, handleKeyDown calls this function (game.player_pressed_button)
			5. player_pressed_button checks if there is an entity on where the player moved to. If so, remove it first, then activate it.
			6. player_pressed_button checks if a key has been stepped on. If so, unlocks the corresponding door first, then calls dungeon_door_unlockeds
			7. without waiting for the entity to finish, determines if dungeon should end, and if no event triggered and we should end, ends the dungeon.
			8. After the entity is finished and items have already been added to inventory, dm.dungeon_fight_ended or dm.dungeon_chest_collected is called, if applicable.
			*/
			var d  = this.dungeon_instance;
			if(d.player_on() != undefined){
				var entity = d.player_on();
				d.remove_entity_by_location(d.player_x, d.player_y);
				if(entity.type == "monster"){
					this.start_fight(new I_Combat(this.player, entity.monsters, d));
				}
				if(entity.type == "item"){
					this.items_type = "chest"; 
					this.start_fight_end(entity.items);
				}
			}
			if(d.key_on() != undefined){
				d.unlock_door(d.key_on());
				dm.dungeon_door_unlocked(this.dungeon_instance);
			}
			if(dm.dungeon_end(d) && this.game_state() == "dungeon"){
				this.game_stack.pop(); // leave dungeon
			}
		}
	}
	// town commands
	enter_town(town){
		this.game_stack.push("town");
		this.town = town;
	}
	//shop commands 
	
	enter_shop(shop){
		alert("not implemented");
	}
	
	// quest giver commands
	enter_quest_giver(){
		alert("not implemented");
	}
	
	//test cases
	test_fight(){
				
		var basic_attack = new player_skill("basic attack", 100, 40, 0, [], [], [], "A basic attack");
		var protect = new player_skill("protect", 0, 40, 30, [new effect("immune", 40, 0, "player"), new effect("protect cd", 5000, 0, "player") ], [], [], "makes yourself temporarily immune to damage for 40 ticks. 5000 ticks cooldown");
		this.player = new playerC(5, 10, 1000, 1000, U.fillArray(undefined, 6), [basic_attack,protect ]);
		
		
		
		var item1 = new item("enchanted sword", 1000, 0, 0, 0, "A sword that does a ton of damage");
		var item2 = new item("sword of undead fighting", 3, 0, 0,0, "Must be equipped to use the smite undead skill");

		var monster1 = new monster("goblin", 10, 0,100, [], "",[] );
		var monster2 = new monster("skeleton", 20, 0,2000, ['undead'],"" , [item1, item2] )
		var monster3 = new monster("test", 0, 0,2000, [],"", [] );
		 monster1.effects.push(new effect("alice", 100, 10, "monster", []));
		monster3.hp = 1000;
		
		var monster4 = new monster("test", 0, 0,2000, [],"", [] );
		var monster5 = new monster("test", 0, 0,2000, [],"", [] );
		
		var inst = new I_Combat(this.player, [monster1, monster2,monster3, monster4, monster5], []);
		this.player.hp = 9999999;
		this.start_fight(inst);
	}
	test_fill_inventory(){
		var blanks = U.count(this.inventory, undefined);
		for(var i = 0; i < blanks; i++){
			this.give_item(new item("useless item", 0, 0, 0, 0, "A completely useless item"));
		}
	}
	test_dungeon(){
		/*
		<ul>
		<li>go to the key to open the door. equip all 3 items, and use them to kill the monsters.</li>
		<li>Note that the skeleton does a one-shot at 100 ticks. Use protect to defend against that.</li>
		<li>The smite undead monster requires the monster to be undead, and also for you to have a sword of undead fighting.</li>
		<li>You also need the ring of health to survive their attacks.</li>
		</ul>
		*/
		
		this.skill_pool = data.make_skills();
		var dungeon_inst = data.make_dungeon();
		
		this.enter_dungeon(dungeon_inst);
	}
	test_town(){
		this.enter_town(data.make_town());
	}
	game_start_up(){
		console.log("testing");
		setTimeout( () => {window.controller.game.test_town();window.controller.rerender();}, 100);
	}
}


export default game;


	// testing:
	/*

	 test commands:
	 
test fight:

window.controller.game.test_fight(); window.controller.game_change();


test fight with full inventory;

window.controller.game.test_fill_inventory(); window.controller.game.test_fight(); window.controller.game_change();

test dungeon: 

window.controller.game.test_dungeon();window.controller.rerender();

	*/