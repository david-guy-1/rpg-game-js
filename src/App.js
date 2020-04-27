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
import D_Town from "./scripts/display/D_Town.js";
import D_Skills from "./scripts/display/D_Skills.js";
// this is the view!
class App extends React.Component {
	constructor(props){
		super(props)
		this.X = new game();
		this.controller = new controller(this.X, this);
		window.controller = this.controller;
		window.view = this;
		window.game = this.X;
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
	render(){
		

		var game = this.X;
		var state = game.game_state();
		var stack = this.interface_stack;
		var interface_state = stack[stack.length-1];
		
		//we're in the game
		if(interface_state == "game"){
			// we're fighting someone?
			if(state == "fighting"){
				return (<D_Combat combat={ game.combat_instance }/>);			
			} else if (state == "fight end"){
				return <D_Fight_end items={game.items_dropped} selected={game.selected} chosen = {game.chosen} inventory_empty = {U.count(game.inventory, undefined)}/>
			} else if (state == "dungeon"){
				if(game.dismissed == false){
					return <D_Dungeon_Info dungeon_instance={game.dungeon_instance}/>
				} else {
					return <D_Dungeon dungeon_instance={game.dungeon_instance}/>
				}
			}
			else if (state == "town"){
				return <D_Town town={game.town}/>
			}
		} else if (interface_state == "inventory"){
			return <D_Inventory items={game.inventory} equip={game.player.items} selected_item = {this.inv_selected} selected_equip ={this.equip_selected} />
		} else if (interface_state == "skills"){
			return <D_Skills skills={game.skill_pool} equip={game.player.skills} selected_skill = {this.selected_skill} selected_equip ={this.selected_equip_skill} />
		} 
		return (<div> nothing {game.game_stack.toString()} </div>);
	}
	
	componentDidMount(){
		this.X.game_start_up();
	}


	
}

export default App;
