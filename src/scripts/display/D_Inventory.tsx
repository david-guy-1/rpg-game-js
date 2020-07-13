import React from 'react';
import * as U from "../utilities";
import * as T from "../tables";
import DC_item_icon from "./DC_item_icon";
import DC_currency from "./DC_currency";
import {game_context} from "../../AppContext";
import item from "../classes/item";
import currency_obj from "../typedefs/currency_obj"
import DC_item from "./DC_item";

class D_Inventory extends React.Component {
	props : {items : (item | undefined)[], equip : (item | undefined)[] , currency : currency_obj, selected_item : number, selected_equip : number };
	constructor(props : {items : (item | undefined)[], equip : (item | undefined)[] , currency : currency_obj, selected_item : number, selected_equip : number }){
		super(props );
		this.props = props; // props is a combat instance
	}
	render(){
		var items = this.props.items;
		var equip = this.props.equip;
		var currency = this.props.currency;
		var c = T.display_constants;
		var selected_item = this.props.selected_item;
		var selected_equip = this.props.selected_equip;
		console.log(equip[selected_equip])
		console.log(items[selected_item]);
	    return <game_context.Consumer>{function(this : D_Inventory, {game, view, controller}){ return (
		<div>
		  
		  <div id="instructions" style={{"position":"absolute", "top":10,"left":500}} >{T.instructions_text["inventory"]}</div>
		  
			  { /*render inventory icons*/ }
		  
		  <div style={{"position":"absolute", "top":c.inventory_top_left[1],"left":c.inventory_top_left[0], "backgroundColor":"#333333" , "width":c.inventory_box_width*(c.inventory_rows+0.2), "height":c.inventory_box_height * (c.inventory_cols+0.2), }}>
			 {// render boxes..
				function(){
					var components : any[]= [];
					for(var i=0; i<c.inventory_rows; i++){
						for(var j=0; j<c.inventory_cols;j++){
							//render row i, col j at position (width *j, height * i)
							var d = c.inventory_cols*i+j; // d is item index
							components.push(<div style={{"position":"absolute", "top":c.inventory_box_width *i,"left":c.inventory_box_height * j}}
							onClick = {function(this:number){view.inv_selected=this;controller.rerender()}.bind(d)}>
							<DC_item_icon item={items[d]} selected={d == selected_item} /> 
							</div>);
							}
						}
					return components;
				}()  
			 }
		   </div>
		
		{ /* render equipped items */ }
		
		  <div style={{"position":"absolute", "top":c.equip_top_left[1],"left":c.equip_top_left[0], "backgroundColor":"#333333" , "width":c.inventory_box_width*(1.2), "height":c.inventory_box_height * (c.equip_items+0.2), }}>
		{// render boxes.
				function(){
					var components : any[] = [];
					for(var i=0; i<c.equip_items; i++){
							components.push(<div style={{"position":"absolute", "top":c.inventory_box_width *i,"left":0}}
							onClick = {function(this : number){view.equip_selected=this;controller.rerender()}.bind(i)}
							>
							<DC_item_icon item={equip[i]} selected={i == selected_equip} /> 
							</div>);
					}		
					return components;
				}()  
			}
		   </div>
		   
		   { /*details for the items */}
		<h1 style={{"position":"absolute", "top":c.inventory_details_top_left[1]-60,"left":c.inventory_details_top_left[0]}}>Selected: </h1>
		
		{ items[selected_item] ==undefined ? undefined :   <div style={{"position":"absolute", "top":c.inventory_details_top_left[1],"left":c.inventory_details_top_left[0]}}><DC_item item={items[selected_item] as item}></DC_item> </div> }
		
		<h1 style={{"position":"absolute", "top":c.equip_details_top_left[1]-60,"left":c.equip_details_top_left[0]}}>Currently equipped: </h1>
		
		{ equip[selected_equip] ==undefined ? undefined :   <div style={{"position":"absolute", "top":c.equip_details_top_left[1],"left":c.equip_details_top_left[0]}}><DC_item item={equip[selected_equip] as item}></DC_item> </div>}
		
		{ /*buttons for equipping and going back */}
		<button style={{"position":"absolute", "top":c.inventory_equip_top_left[1],"left":c.inventory_equip_top_left[0], "width":c.inventory_equip_width, "height":c.inventory_equip_height,"backgroundColor":"lightgreen"} as React.CSSProperties} onClick={function(){game.equip_item(view.inv_selected, view.equip_selected); controller.rerender();}}> <h2 style={{"textAlign":"center"}} > Equip item</h2></button>
		
		<button style={{"position":"absolute", "top":c.inventory_back_top_left[1],"left":c.inventory_back_top_left[0], "width":c.inventory_back_width, "height":c.inventory_back_height,"backgroundColor":"lightblue"}} onClick={function(){view.leave_inventory(); controller.rerender();}}> <h2 style={{"textAlign":"center"}} > Go back</h2></button>
		

		
		 { /*currency */}
		 
		<div style={{"position":"absolute", "top":c.inventory_currency_top_left[1],"left":c.inventory_currency_top_left[0]}}>
			<DC_currency currency = {currency} />
			</div>
		</div>
	    );
		}.bind(this)}</game_context.Consumer>
	}
}

export default D_Inventory;
