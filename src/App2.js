import React from 'react';
import game from './scripts/classes/game.js';
import controller from './controller.js';
import D_Combat from "./scripts/display/D_Combat.js";
import * as U from "./scripts/utilities.js";
import * as T from "./scripts/tables.js";
import D_Fight_end from "./scripts/display/D_Fight_end.js";
import D_Inventory from "./scripts/display/D_Inventory.js";
import D_Dungeon from "./scripts/display/D_Dungeon.js";
import D_Dungeon_Info from "./scripts/display/D_Dungeon_Info.js";
import D_Dungeon_End from "./scripts/display/D_Dungeon_End.js";
import D_Town from "./scripts/display/D_Town.js";
import D_Skills from "./scripts/display/D_Skills.js";
import D_Quest_Giver from "./scripts/display/D_Quest_Giver.js";
import D_Current_quests from "./scripts/display/D_Current_quests.js";

// this is the view!


		
class App2 extends React.Component {
	constructor(props){
		super(props)
		console.log("app2 ctor called" + Object.keys(this.props));
		this.game = this.props.game;
		this.controller =  new controller(this.game, this);
		window.controller = this.controller;
		window.view = this;
		window.game = this.game;
		document.addEventListener("mousedown", this.controller.handleClickDown);
		document.addEventListener("mouseup", this.controller.handleClickUp);
		document.addEventListener("keydown", this.controller.handleKeyDown);
		this.interface_stack = ["game"];
		// *interface* variables go here.
	}
	// interface stuff goes here
	go_to_inventory(){
		this.interface_stack.push("inventory");
		this.inv_selected = 0;
		this.equip_selected = 0;
	}
	move_inventory(x){
		var limit  = T.display_constants.inventory_rows * T.display_constants.inventory_cols;
		var cols = T.display_constants.inventory_cols;
		switch(x){
			case "left":
				this.inv_selected -=1;
				if(this.inv_selected < 0){
					this.inv_selected = limit-1;
				}
			break;
			case "right":
				this.inv_selected +=1;
				if(this.inv_selected > limit-1){
					this.inv_selected = 0;
				}
			break;
			case "up":
				this.inv_selected -=cols;
				if(this.inv_selected < 0){
					this.inv_selected += limit;
				}
			break;
			case "down":
				this.inv_selected +=cols;		
				if(this.inv_selected > limit-1){
					this.inv_selected -= limit;
				}				
			break;
		}
	}
	move_equip(x){
		var items = T.display_constants.equip_items;
		switch(x){
			case "up":
					this.equip_selected -=1;
					if(this.equip_selected < 0){
						this.equip_selected = items-1;
					}
			break;
			case "down":
					this.equip_selected +=1;
					if(this.equip_selected >= items){
						this.equip_selected = 0;
					}			
			break;
		}
	}
	leave_inventory(){
		this.interface_stack.pop();
	}
	//skills
	go_to_skills(){
		this.interface_stack.push("skills");
		this.selected_skill = 0;
		this.selected_equip_skill = 0;
	}
	move_equipped_skill(x){
		if( "ASDFGZXCVB".indexOf(x) != -1){
			this.selected_equip_skill = "ASDFGZXCVB".indexOf(x);
		}
	}
	move_skill(x){
		var limit  = T.display_constants.skill_table_rows * T.display_constants.skill_table_cols;
		var cols = T.display_constants.skill_table_cols;
		switch(x){
			case "left":
				this.selected_skill -=1;
				if(this.selected_skill < 0){
					this.selected_skill = limit-1;
				}
			break;
			case "right":
				this.selected_skill +=1;
				if(this.selected_skill > limit-1){
					this.selected_skill = 0;
				}
			break;
			case "up":
				this.selected_skill -=cols;
				if(this.selected_skill < 0){
					this.selected_skill += limit;
				}
			break;
			case "down":
				this.selected_skill +=cols;		
				if(this.selected_skill > limit-1){
					this.selected_skill -= limit;
				}				
			break;
		}
	}
	leave_skills(){
		this.interface_stack.pop();
	}
	
	go_to_quests(){
		this.interface_stack.push("quests");
	}
	leave_quests(){
		this.interface_stack.pop();
	}
	render(){
		

		var game = this.game;
		var controller = this.controller;

		var state = game.game_state();

		
		if(game.game_state() == undefined){
			return <div> <input type="text" id="code" /> <button onClick={function(){game.load_test_case(document.getElementById('code').value); controller.rerender();}} id="load_button">Load test </button> </div>;
		}
		
		var stack = this.interface_stack;
		var interface_state = stack[stack.length-1];
		//we're in the game
		if(interface_state == "game"){
			// we're fighting someone?
			if(state.name == "fighting"){
				return (<D_Combat combat={ state.combat_instance }/>);			
			} else if (state.name == "fight end"){
			return <D_Fight_end items={state.items_dropped} selected={state.selected} chosen = {state.chosen} inventory_empty = {U.count(game.inventory, undefined)} currency={state.currency}/>
			} else if (state.name == "dungeon"){
				if(state.dismissed == false){
					return <D_Dungeon_Info dungeon_instance={state.dungeon_instance}/>
				} else {
					return <D_Dungeon dungeon_instance={state.dungeon_instance}/>
				}
			}
			else if(state.name == "dungeon end"){
				return <D_Dungeon_End dungeon_instance={state.dungeon_instance} />
			}
			else if (state.name == "town"){
				return <D_Town town={state.town}/>
			}
			else if (state.name == "quest giver"){
				var quests = state.quests;
				quests = quests.filter(function(quest){return !game.has_quest(quest.name)});
				return <D_Quest_Giver name={state.quest_giver_name} quests={quests}/>
			}
		} else if (interface_state == "inventory"){
		return <D_Inventory items={game.inventory} equip={game.player.items} selected_item = {this.inv_selected} selected_equip ={this.equip_selected} currency = {game.currency}/>
		} else if (interface_state == "skills"){
			return <D_Skills skills={game.skill_pool} equip={game.player.skills} selected_skill = {this.selected_skill} selected_equip ={this.selected_equip_skill} />
		} else if (interface_state == "quests"){
			return <D_Current_quests quests={game.quests} />
		} 
		return (<div> {JSON.stringify(game.game_stack)} </div>);
	}
	
	componentDidMount(){
	//	this.game.game_start_up();
	}
	full_debug(){
		console.log("model")
		console.log(JSON.stringify(this.game))
		console.log("view")
		console.log(JSON.stringify(this))
		console.log("controller")
		console.log(JSON.stringify(this.controller))
		
	}

	
}

export default App2;
