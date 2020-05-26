
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
import * as tm from "../logic/town_mechanics.js" 
import * as qm from "../logic/quest_mechanics.js";
import * as qgm from "../logic/quest_giver_mechanics.js";
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
		this.started = false;
		this.progress = {} // record completed dungeons, etc. 
		this.quests = []; // record quests (both completed and in progress)
		this.currency = {"gold":0}; // record amount of money of different types.

	}
	// utilities:
	game_state(){
		return this.game_stack[this.game_stack.length-1];
	}
	get_frame_with_name(name){
		for(var i=this.game_stack.length-1; i>=0; i--){
			if(this.game_stack[i].name == name){
				return this.game_stack[i];
			}
		}
		return undefined;
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
	has_quest(name){ //does the player have a quest with this name? (includes completed)
		var found = false;
		this.quests.forEach(function(x){
			if(x.name == name){
				found = true;
			}
		})
		return found;
	}

	// fight commands:
	start_fight(combat_instance){
		this.game_stack.push({name :"fighting",combat_instance :combat_instance});
		combat_instance.fight_begin(0,0);
	}
	fight_tick(){
		U.assert(this.game_state().name == "fighting");
		var inst = this.game_state().combat_instance;
		inst.fight_tick();
			// fight is over now!
		if(inst.fight_ended){
			// player wins
			if(inst.fight_result == "player wins"){
				var items_dropped = inst.items_dropped;
				this.start_fight_end(items_dropped,inst.currency_dropped);
				// fight win methods go here.
				qm.fight_ended(this.quests, inst.monster_list);
			}
			// player loses. 
			else if (inst.fight_result == "player loses"){
				this.player_lose();
			}
		}
	}
	// player lose commands
	player_lose(){
		this.game_stack.push({"name":"player loses"});
	}
	// fight end commands:
	
	start_fight_end(items, currency){
		U.addObject(this.currency, currency);
		this.game_stack.push({"name":"fight end", items_dropped : items, "chosen": U.fillArray(true, items.length), "selected":0, currency:currency})
	}
	select_item(){
		var frame_ = this.game_state();
		if(frame_.chosen[frame_.selected] != undefined){
			frame_.chosen[frame_.selected] = !frame_.chosen[frame_.selected]
		}
	}
	select_left(){
		var frame_ = this.game_state();
		if(frame_.selected != 0 ){
			frame_.selected -=1;
		}
	}
	select_right(){
		var frame_ = this.game_state();
		if(frame_.selected != frame_.items_dropped.length-1 ){
			frame_.selected +=1;
		}
	}
	
	finished_items(){
		var frame_ = this.game_state();

		var items_collected = [];
		// first, give the player the items.
		for(var i=0; i<frame_.items_dropped.length; i++){
			if(frame_.chosen[i]){
				this.give_item(frame_.items_dropped[i]);
				items_collected.push(frame_.items_dropped[i]);
			}
		}
		//then call functions related to getting items
		
		//quests
		qm.items_obtained(this.quests, items_collected);
		var type = this.get_frame_with_name("fighting"); // fight or chest?
		var di = this.get_frame_with_name("dungeon"); // get the dungeon if there is one
		
		if(di != undefined){ // if there is a dungeon, call the relevant functions
			di = di.dungeon_instance;
			if(type != undefined){
				dm.dungeon_fight_ended(di,this.progress); 
			} else{
				dm.dungeon_chest_collected(di,this.progress);
			}
		}
		
		if(type != undefined){
			this.game_stack.pop() // pop the fight as well;
		}
		this.game_stack.pop();
	}
	//dungeon commands
	enter_dungeon(dungeon){
		//do NOT mutate the dungeon at all. note that combat clones the monsters, so we can call it.
		this.game_stack.push({name:"dungeon", "dungeon_instance":new I_Dungeon(dungeon), "dismissed":false});
		dm.dungeon_begin(this.game_state().dungeon_instance,this.progress);

		qm.dungeon_entered(this.quests, dungeon);
	}
	dismiss(){
		this.game_state().dismissed = true;
	}
	undismiss(){
		this.game_state().dismissed = false;
	}
	player_pressed_button(code){ // player pressed a button in the dungeon. check things.
		if(this.game_state().name == "dungeon"){
			/*
			when the user preses a button in a dungeon, this happens:
			1. the controller's handleKeyDown function is called, 
			2. that function calls this function, which first calls I_Dungeon's move_player function
			3. If the move is successful, calls dm.dungeon_moved
			4. Then, checks if there is an entity on where the player moved to. If so, remove it first, then activate it.
			5. player_pressed_button checks if a key has been stepped on. If so, unlocks the corresponding door first, then calls dungeon_door_unlocked
			6. without waiting for the entity to finish, determines if dungeon should end, and if no event triggered and we should end, ends the dungeon.
			7. After the entity is finished and items have already been added to inventory, dm.dungeon_fight_ended or dm.dungeon_chest_collected is called, if applicable.
			*/
			var d  = this.get_frame_with_name("dungeon").dungeon_instance;
			
			// first, move player 
			var moved = false;
			if(code == "KeyW"){
				moved = d.move_player("up");
			} else if(code == "KeyA"){
				moved =d.move_player("left");
			} else if(code == "KeyS"){
				moved =d.move_player("down");
			} else if(code == "KeyD"){
				moved =d.move_player("right");
			} else if (code == "Space"){
				if(this.game_state().dismissed){
					this.undismiss();
				} else {
					this.dismiss();
				}
			}
			
			if(moved){
				dm.dungeon_moved(d, this.progress)
			}
				
			if(d.player_on() != undefined){
				var entity = d.player_on();
				d.remove_entity_by_location(d.player_x, d.player_y);
				if(entity.type == "monster"){
					this.start_fight(new I_Combat(this.player, entity.monsters, d));
				}
				if(entity.type == "item"){

					this.start_fight_end(entity.items, entity.currency);
				}
			}
			if(d.key_on() != undefined){
				d.unlock_door(d.key_on());
				dm.dungeon_door_unlocked(this.dungeon_instance,this.progress);
			}
			if(dm.dungeon_end(d,this.progress) && this.game_state().name== "dungeon"){
				this.game_stack[this.game_stack.length-1].name = "dungeon end"; // leave dungeon
				qm.dungeon_finished(this.game_state().dungeon_instance);
			}
		}
	}
	
	// town commands
	enter_town(town){
		this.game_stack.push({name:"town", town : town});
	}
	//entered a town
	town_clicked(index){
		var output = tm.town_click(this.game_state().town, this.progress, index);
		if(output.type == "dungeon"){
			this.enter_dungeon(output.dungeon);
		} else if (output.type == "item"){
			this.start_fight_end(output.items, output.currency);
		} else if (output.type == "fight"){
			this.start_fight(new I_Combat(this.player, output.monsters, undefined));
		} else if(output.type == "quest giver"){
			this.start_quest_giver(output.name);
		}
	}
	//quest commands
	start_quest_giver(name){
		var quests = qgm.decide_quests(name, this.progress);
		this.game_stack.push({name:"quest giver", quest_giver_name : name, quests: quests});
	}
	end_quest_giver(){
		this.game_stack.pop();
	}
	accept_quest(quest){
		if(!this.has_quest(quest.name)){
			quest.state  = 2;
			this.quests.push(quest);
		}
	}
	//shop commands 
	
	enter_shop(shop){
		alert("not implemented");
	}
	
	//test cases
	test_fight(){
				
		var basic_attack = new player_skill("basic attack", 100, 40, 0, [], [], [], "A basic attack");
		var protect = new player_skill("protect", 0, 40, 30, [new effect("immune", 40, 0, "player"), new effect("protect cd", 5000, 0, "player") ], [], [], "makes yourself temporarily immune to damage for 40 ticks. 5000 ticks cooldown");
		this.player = new playerC(5, 10, 1000, 1000, U.fillArray(undefined, 6), [basic_attack,protect ]);
		
		
		
		var item1 = new item("enchanted sword", 1000, 0, 0, 0, "A sword that does a ton of damage");
		var item2 = new item("sword of undead fighting", 3, 0, 0,0, "Must be equipped to use the smite undead skill");

		var monster1 = new monster("goblin", 10, 0,100, [], "",[] , {"gold":10});
		var monster2 = new monster("skeleton", 20, 0,2000, ['undead'],"" , [item1, item2] , {})
		var monster3 = new monster("test", 0, 0,2000, [],"", [], {"gold":31} );
		 monster1.effects.push(new effect("alice", 100, 10, "monster", []));
		monster3.hp = 1000;
		
		var monster4 = new monster("test", 0, 0,2000, [],"", [] , {"gold":25});
		var monster5 = new monster("test", 0, 0,2000, [],"", [] , {"gold":12});
		
		var inst = new I_Combat(this.player, [monster1, monster2,monster3, monster4, monster5], []);
		this.player.hp = 9999999;
		this.start_fight(inst);
	}
	// same as the dungeon one
	test_fight_2(){
		// equip items
		var items = data.make_items();
		this.player.items[0] = items[0];
		this.player.items[1] = items[1];
		this.player.items[2] = items[2];		
		//make monsters;
		var monsters = data.make_monsters();
		//equip skills
		this.skill_pool = data.make_skills();
		this.player.skills[0] = this.skill_pool[0];
		this.player.skills[1] = this.skill_pool[1];
		this.player.skills[2] = this.skill_pool[2];
		this.player.skills[3] = this.skill_pool[1];
		this.player.skills[4] = this.skill_pool[2];
		this.player.skills[5] = this.skill_pool[1];
		this.player.skills[6] = this.skill_pool[2];
		this.player.skills[7] = this.skill_pool[1];
		this.player.skills[8] = this.skill_pool[2];
		this.player.skills[9] = this.skill_pool[1];
		this.player.skills[10] = this.skill_pool[2];
		//start a fight!
		this.start_fight(new I_Combat(this.player, monsters, undefined));
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
		this.skill_pool = data.make_skills();
		
		this.enter_town(data.make_town_by_name("town1"));
	}
	test_town_quest(){
		var items = data.make_items();
		var skills = data.make_skills();
		this.player.items[0] = items[0];
		this.player.skills[0] = skills[0];
		this.enter_town(data.make_town_by_name("town2"));
	}
	load_test_case(name){
		if(name == "town"){
			this.test_town();
			
		}
		if(name == "town2"){
			this.test_town_quest();
		}
		this.started = true;
		global.g.controller.rerender();
	}

}


export default game;


	// testing:
	/*

	 test commands:
	 
test fight:

global.g.controller.game.test_fight(); global.g.controller.game_change();


test fight with full inventory;

global.g.controller.game.test_fill_inventory(); global.g.controller.game.test_fight(); global.g.controller.game_change();

test dungeon: 

global.g.controller.game.test_dungeon();global.g.controller.rerender();

	*/