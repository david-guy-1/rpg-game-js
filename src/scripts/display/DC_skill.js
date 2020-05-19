import React from 'react';
import {display_constants  as c} from "../tables.js";

class DC_skill extends React.Component{
	constructor(props){
		super(props);
		this.props = props; 
	}
	render(){
		var skill = this.props.skill;
		var chosen = this.props.selected;
		var id = this.props.id;
		var cd = this.props.cooldown;
		var attacks_labels = ["A","S","D","F","G","Z","X","C","V","B"];
		return <div style={
			{"position":"absolute",
			"width":c.skill_width + "px",
			"height":c.skill_height + "px",	
			"top":( (id>4? c.skill_height : 0)) + "px",
			"left":(  (id%5) * (c.skill_width+2*c.skill_internal_padding+1)) + "px",
			"border":"1px solid black",
			"padding":c.skill_internal_padding + "px",
			"background-color":(chosen? "#ffaaaa" : "#ffffff"),
		} }
		><span style={{"background-color":(cd == 0 ? "#ffffff" : "#777777")}}>{attacks_labels[id]}: </span> {skill.name} {cd}<br />Mana : {skill.mana} , cd : {skill.cd}</div>
	}
}

export default DC_skill;
