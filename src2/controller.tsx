import React from 'react';
import * as T from "./scripts/tables";
import * as TD from "./scripts/test/test_data";
class controller{
	// view is an App.tsx instance
	constructor(game, view){
		this.game = game;
		this.view = view;

		this.handleClickDown =this.handleClickDown.bind(this);
		this.handleClickUp =this.handleClickUp.bind(this);
		this.handleKeyDown =this.handleKeyDown.bind(this);
		this.game_stack = [];
		this.game_interval = undefined;
		this.fight_next_render = undefined;
		this.fight_framerate = 30;
	}
	// game_change is called when the game's status has changed, and needs to be handled controller-side.
	
	//note that the controller side should only call game's exposed functions. 
	set_fight_interval(){
		var game = this.game ;
		if(game.game_state().name == "fighting" && this.game_interval == undefined){
			this.fight_next_render = undefined;
			if(this.game_interval != undefined){
				throw "game interval not undefined";
			}
			this.game_interval = setInterval(() => {this.fight_tick()}, 1000/this.fight_framerate); 
			console.log(this.game_interval);
		}
		this.rerender();
	}
	
	// fighting:
	fight_tick(){
		var game = this.game;
		if(game.game_state().name == "fighting"){
			if(this.fight_next_render == undefined){
				game.fight_tick(); 
				this.rerender();
				this.fight_next_render = Date.now();
			} else {
				// compute how many times to re-render
				var now = Date.now();
				while(this.fight_next_render < now){
					game.fight_tick(); 
					if(game.combat_instance == undefined){ // if fight is over, don't continue
						break;
					}
					this.fight_next_render+= 1000/this.fight_framerate;
				}
				this.rerender();
			}
		} else {
		//	console.log("tick called without fighting" + this.game_interval);
			clearInterval(this.game_interval);
			this.game_interval = undefined;
		}
	}
	handleClickDown(e){
	//	console.log(e)
		
	}
	handleClickUp(e){
	//	console.log([e.pageX, e.pageY]);
		var game = this.game;
		if(game.game_state() == undefined){
			return; 
		}
		var rerender = this.rerender.bind(this);
		var state = game.game_state();
		var interface_stack = this.view.interface_stack;
		if(state.name == "town"){ // we're in a town, check where we clicked and if we clicked on something useful
			var town_coords = T.town_data[game.game_state().town.name];
			var index = 0;
			for (var rect of town_coords.rectangles){
				if(e.pageX > rect[0] && e.pageX < rect[2] && e.pageY > rect[1] && e.pageY < rect[3]){
					//record as clicked;
					game.town_clicked(index);
					break;
				}
				index += 1;
			}

			rerender();
		}
		
	}
	handleKeyDown(e){
	//	console.log(e.code);

		var game = this.game;
		if(game.game_state() == undefined){
			return; 
		}
		
		var rerender = this.rerender.bind(this);
		var state = game.game_state();
		var interface_stack = this.view.interface_stack;
		var interface_state = interface_stack[interface_stack.length-1];
		if(interface_state == "game"){
			// fighting an enemy right now
			if(state.name == "fighting"){
				this.set_fight_interval();
				var skillKeys = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB" ];
				if(skillKeys.indexOf(e.code) != -1){
					var index = skillKeys.indexOf(e.code);
					if(game.player.skills[index] != undefined){
						game.set_currently_queued_attack(index)
					}
				}
				var targetKeys = ["Digit1","Digit2","Digit3","Digit4","Digit5", ];
				if(targetKeys.indexOf(e.code) != -1){
					var index = targetKeys.indexOf(e.code);
					if(state.combat_instance.fighting_monsters[index] != undefined){
						game.set_currently_attacking_monster(index)
					}
				}
			}
			
			else if(state.name == "fight end"){
				if(e.code == "KeyA" && game.game_state().selected != 0){
					game.game_state().selected -= 1; 
					rerender();
				}
				if(e.code == "KeyS" && game.game_state().selected != game.game_state().items_dropped.length-1){
					game.game_state().selected += 1; 
					rerender();
				}
				if(e.code == "KeyQ" && game.game_state().chosen[game.game_state().selected] != undefined){
					game.game_state().chosen[game.game_state().selected]  = !game.game_state().chosen[game.game_state().selected] 
					rerender();
				}
				if(e.code == "Space"){
					game.finished_items();
					
					rerender();
				}
			} else if (state.name == "dungeon"){ // pressed a button in dungeon				
				switch(e.code){
					case "KeyW":
					case "ArrowUp":
						game.move_player_dungeon("up");
					break;
					case "KeyA":
					case "ArrowLeft":
						game.move_player_dungeon("left");
					break;
					case "KeyS":
					case "ArrowDown":
						game.move_player_dungeon("down");
					break;
					case "KeyD":
					case "ArrowRight":
						game.move_player_dungeon("right");
					break;
					case "Space":
					if(state.dismissed){
						game.undismiss();
					} else {
						game.dismiss();
					}
					break;
				}
				rerender();
			} else if (state.name == "town" || state == "dungeon"){
				if (e.code == "KeyQ"){
					this.view.go_to_inventory();
				}else if (e.code == "KeyE"){
					this.view.go_to_skills();
				}else if (e.code == "KeyR"){
					this.view.go_to_quests();
				}
				rerender();
			}
			else if (state.name == "dungeon end"){
				game.game_stack.pop();
				rerender();
			}
			else if (state.name == "quest giver"){
				if(e.code == "Space"){
					game.end_quest_giver();
					rerender();
				}
			}
		} else if (interface_state == "inventory"){
			var ro = this.view;
			switch(e.code){
				case "KeyW":
				case "ArrowUp":
					ro.move_inventory("up");
				break;
				case "KeyA":
				case "ArrowLeft":
					ro.move_inventory("left");				
				break;
				case "KeyS":
				case "ArrowDown":
					ro.move_inventory("down");				
				break;
				case "KeyD":
				case "ArrowRight":
					ro.move_inventory("right");
				break;
				case "KeyE":
					this.game.equip_item(ro.inv_selected, ro.equip_selected);
				break;
				case "KeyR":
					ro.move_equip("up");
				break;
				case "KeyF":
					ro.move_equip("down");
				break;
				case "Space":
					ro.leave_inventory();
				break;
			}
			rerender();
			//t : equip item, wasd : move inventory, ol: move equipped item, i: leave inventory
		} else if (interface_state == "skills"){
			var ro = this.view;
			switch(e.code){
				case "KeyA":
				case "KeyS":
				case "KeyD":
				case "KeyF":
				case "KeyG":
				case "KeyZ":
				case "KeyX":
				case "KeyC":
				case "KeyV":
				case "KeyB":
					ro.move_equipped_skill(e.code[3]);
				break;
				case "ArrowUp":
					ro.move_skill("up");				
				break;
				case "ArrowDown":
					ro.move_skill("down");				
				break;
				case "ArrowLeft":
					ro.move_skill("left");
				break;
				case "ArrowRight":
					ro.move_skill("right");
				break;
				case "KeyE":
					this.game.equip_skill(ro.selected_skill, ro.selected_equip_skill);
				break;
				case "Space":
					ro.leave_skills();
				break;
				//"asdfgzxcvb : choose skill to swap out. arrow keys: select skill in skill pool, e : switch skills, r : leave. You cannot equip a skill more than once"
			}
			rerender();
		}else if (interface_state == "quests"){
			if(e.code == "Space"){
				this.view.leave_quests();
				rerender();
			}
		}
	}
	handleQuestButtonClick(quest,index){
		this.game.accept_quest(quest)
	}
	rerender(){
		this.view.forceUpdate();
	}
	
	load_test_case(name){
		if(name == "town"){
			TD.test_town(this.game);
			
		}
		if(name == "town2"){
			TD.test_town_quest(this.game);
		}
		if(name == "show"){
			TD.test_show_dungeons(this.game);
		}
		if(name == "dungeon test"){
			TD.test_generated_dungeon(this.game);
		}
		if(name == "effects test"){
			TD.test_effects_fight(this.game);
		}
		if(name == "requirements test"){
			TD.test_requirements(this.game);
		}
		if(name == "typescript"){
			TD.test_typescript(this.game);
		}
		this.game.started = true;
		this.rerender();
	}
	
	
}

export default controller;
