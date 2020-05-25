import React from 'react';
import * as U from "../utilities.js";
import * as T from "../tables.js";
import DC_item from "./DC_item.js";
import DC_currency from "./DC_currency.js";
import DC_item_icon from "./DC_item_icon.js";
class D_Fight_end extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props : items is a list of items
		// "selected" is the index of the currently selected item (the one being displayed).
		// chosen is an array of booleans indicating which items are selected for taking
		// inventory_empty is the number of empty inventory slots
		// "currency" is an object representing the currency gained.
		this.move_left = this.move_left.bind(this);
		this.move_right = this.move_right.bind(this);
		this.select_item = this.select_item.bind(this);
		this.render = this.render.bind(this);
	}
	move_left(){
		global.g.game.select_left();
		global.g.controller.rerender();
		
	}
	select_item(){
		global.g.game.select_item();
		global.g.controller.rerender();

	}
	move_right(){
		global.g.game.select_right();
		global.g.controller.rerender();
		
	}
	
	render(){
		var chosen = this.props.chosen;
		var items = this.props.items;
		var currency =this.props.currency;
		var selected = this.props.selected;
		var inventory_empty = this.props.inventory_empty;
		//console.log(combat);
	var c = T.display_constants;
	return ( 
	<div>
		  <div id="instructions" style={{"position":"absolute", "top":10,"left":500}} >{T.instructions_text["fight end"]}</div>

	{/* right side display of the item itself.*/}
	
	<div style={{"position":"absolute", "top":c.fight_end_icon_top_left[1],"left":c.fight_end_icon_top_left[0]}}>
			<DC_item_icon item={items[selected]} selected={false} /> 
							</div>
	
	
	{
		function(){
			
			if(items.length == 0){
				return <div></div>;
			} else {
				return <div style={{"position":"absolute","top":c.fight_end_item_top_left[1],"left":c.fight_end_item_top_left[0]}}><DC_item item={items[selected]} /></div>
			}
		}()
	}
	<h1 style={{"position":"absolute", "top":c.fight_end_win_top_left[1],"left":c.fight_end_win_top_left[0]}}>You win!</h1>
	
	{/* header: number of items dropped */}	
	<h1 id="item_counter" style={{"position":"absolute","top":c.fight_end_item_drop_counter_top_left[1],"left":c.fight_end_item_drop_counter_top_left[0],"width":c.fight_end_item_drop_counter_width}}>{items.length == 0 ? "There are no item drops" : "Drop " + (selected+1) + " of " + items.length}</h1>
	
	{/* number of items chosen */}
	<h1 id="chosen_counter" style={{"position":"absolute","top":c.fight_end_item_chosen_counter_top_left[1],"left":c.fight_end_item_chosen_counter_top_left[0],"width":c.fight_end_item_chosen_counter_width}}>{ U.count(chosen,true) + " items chosen"}</h1>

	{/* number of items in inventory */}
	<h1 id="inventory_counter" style={{"position":"absolute","top":c.fight_end_item_inv_counter_top_left[1],"left":c.fight_end_item_inv_counter_top_left[0],"width":c.fight_end_item_inv_counter_width}}>{inventory_empty + " empty inventory slots"}</h1>

	{/* whether or not an item is chosen */}	
	<h1 id="chosen_indicator" style={{"position":"absolute","top":c.fight_end_chosen_indicator_top_left[1],"left":c.fight_end_chosen_indicator_top_left[0],"width":c.fight_end_chosen_indicator_width}}>{ chosen[selected] ? "chosen" : "not chosen"}</h1>
	
	{/* currency gained */}
	<div style= {{"position":"absolute","top":c.fight_end_currency_top_left[1],"left":c.fight_end_currency_top_left[0]  }}>
	Currency obtained: <br />
	<DC_currency currency={currency} />
	</div>

	{	
		// warning if inventory is full
	function(){
		if(U.count(chosen, true) > inventory_empty){
			return <h1 style={{"position":"absolute", "top":c.fight_end_inv_full_top_left[1],"left":c.fight_end_inv_full_top_left[0], width:c.fight_end_inv_full_width}}>Warning: not enough spaces in inventory</h1>
		} else {
			return "";
		}
	}()
	}
	
	{/* Arrows */}	
	{ function() {
		if(items.length == 0){
			return <div></div>
		} else {
			return <div>
			<button style={{"position":"absolute", "top":c.fight_end_left_button_top_left[1],"left":c.fight_end_left_button_top_left[0], width:c.fight_end_buttons_width,height:c.fight_end_buttons_height, "background-color":"lightblue",}} onClick ={this.move_left}> <h2 style={{"text-align":"center"}}> L </h2> </button>
			
			<button style={{"position":"absolute", "top":c.fight_end_select_button_top_left[1],"left":c.fight_end_select_button_top_left[0], width:c.fight_end_buttons_width,height:c.fight_end_buttons_height,"background-color":"lightyellow",}} onClick ={this.select_item}><p style={{"text-align":"center"}}>  {chosen[selected]? "deselect" : "select"} </p> </button>
			
			<button style={{"position":"absolute", "top":c.fight_end_right_button_top_left[1],"left":c.fight_end_right_button_top_left[0], width:c.fight_end_buttons_width,height:c.fight_end_buttons_height,"background-color":"lightgreen",}} onClick ={this.move_right}> <h2 style={{"text-align":"center"}}> R </h2> </button>
			</div>
		}
	}.bind(this)()
	}
	<button style={{"position":"absolute", "top":c.fight_end_back_button_top_left[1],"left":c.fight_end_back_button_top_left[0], width:c.fight_end_buttons_width,height:c.fight_end_buttons_height}} onClick ={function(){global.g.game.finished_items(); global.g.controller.rerender()}}> Go back </button>
	
	</div>
		)
	}
}

export default D_Fight_end;


/* 
def process(string):
    s = "{{\""
    s += string.replace(":","\":\"").replace(";","\",\"")
    #optional: repalce numbers
    for i in "0123456789":
        s = s.replace("\"" + i, i)
        s = s.replace(i + "\"" , i) 
    s=s[0:len(s)-2] + "}}"
    print(s)
*/
