import React from 'react';
import game from './scripts/classes/game';
import controller from './controller';
import D_Combat from "./scripts/display/D_Combat";
import * as U from "./scripts/utilities";
import * as T from "./scripts/tables";
import D_Fight_end from "./scripts/display/D_Fight_end";
import D_Inventory from "./scripts/display/D_Inventory";
import D_Dungeon from "./scripts/display/D_Dungeon";
import D_Dungeon_Info from "./scripts/display/D_Dungeon_Info";
import D_Dungeon_End from "./scripts/display/D_Dungeon_End";
import D_Town from "./scripts/display/D_Town";
import D_Skills from "./scripts/display/D_Skills";
import D_Quest_Giver from "./scripts/display/D_Quest_Giver";
import D_Current_quests from "./scripts/display/D_Current_quests";


import item from "./scripts/classes/item";
import currency_obj from "./scripts/typedefs/currency_obj";
import I_Combat from "./scripts/instances/I_Combat";
import I_Dungeon from "./scripts/instances/I_Dungeon";
import town from "./scripts/classes/town";
import {quest} from "./scripts/classes/quest";

import * as fs from "./scripts/typedefs/stack_frame";

const _ = require("lodash");
// this is the view!


		
class App2 extends React.Component {
	game:game;
	controller:controller;
	interface_stack:string[];
	props:any;
	constructor(props : any){
		super(props)
		this.props = props;
		console.log("app2 ctor called" + Object.keys(this.props));
		this.game = this.props.game;
		this.controller =  new controller(this.game, this);
		// @ts-ignore
		window.controller = this.controller;
		// @ts-ignore
		window.view = this;
		// @ts-ignore
		window.game = this.game;
		document.addEventListener("mousedown", this.controller.handleClickDown);
		document.addEventListener("mouseup", this.controller.handleClickUp);
		document.addEventListener("keydown", this.controller.handleKeyDown);
		this.interface_stack = ["game"];
		// *interface* variables go here.
	}
	// interface stuff goes here
	inv_selected : number;
	equip_selected : number;
	
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
	selected_skill : number;
	selected_equip_skill : number;
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
			// @ts-ignore
			return <div> <input type="text" id="code" /> <button onClick={function(){controller.load_test_case(document.getElementById('code').value); controller.rerender();}} id="load_button">Load test </button> </div>;
		}
		
		var stack = this.interface_stack;
		var interface_state = stack[stack.length-1]; 
		//we're in the game
		if(interface_state == "game"){
			// we're fighting someone?
			if(state.name == "fighting"){
				return (<D_Combat combat={ state.combat_instance as I_Combat}/>);			
			} else if (state.name == "fight end"){
			var state2 = state as fs.stack_frame_fight_end;
			return <D_Fight_end items={state2.items_dropped} selected={state2.selected } chosen = {state2.chosen} inventory_empty = {_.countBy(game.inventory, _.isUndefined)["true"]} currency={state2.currency}/> 
			} else if (state.name == "dungeon"){
				if(state.dismissed == false){ 
					return <D_Dungeon_Info dungeon_instance={state.dungeon_instance as I_Dungeon}/>
				} else {
					return <D_Dungeon dungeon_instance={state.dungeon_instance as I_Dungeon}/>
				}
			} 
			else if(state.name == "dungeon end"){
				return <D_Dungeon_End dungeon_instance={state.dungeon_instance as I_Dungeon} />
			}
			else if (state.name == "town"){
				return <D_Town town={state.town as town}/>
			}
			else if (state.name == "quest giver"){
				var quests = state.quests as quest[];
				quests = quests.filter(function(quest){return !game.has_quest(quest.name)});
				return <D_Quest_Giver name={state.quest_giver_name as string} quests={quests as quest[]}/>
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
