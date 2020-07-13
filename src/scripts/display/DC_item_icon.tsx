import React from 'react';
import item_class from "../classes/item";
import * as U from "../utilities";
import * as T from "../tables";
import item from "../classes/item"

class DC_item_icon extends React.Component {
	props :{item ? : item, selected : boolean}
	constructor(props : {item ? : item, selected : boolean}){
		super(props);
		this.props = props; // props is a combat instance
	}
	render(){

		var item = this.props.item;
		//U.assert(item == undefined || item instanceof item_class);
		var c = T.display_constants;
		var selected = this.props.selected
		var pad = c.inventory_padding;
		var string = T.images_lst[item == undefined ? "no_item" : item.name];
		

	    return (
		<div>
		
		
		<img  src={require("../../images/" + string )  } style={{"width":c.inventory_box_width-2*pad,"height":c.inventory_box_height-2*pad, "position":"absolute","top":pad,left:pad, "border":selected? "5px solid red" : "5px solid black"}} />
		
		</div>
	    );
	}
}

export default DC_item_icon;


/*

src={require("../../images/" + T.images_lst[item == undefined ? "no_item" : item.name])}


*/
