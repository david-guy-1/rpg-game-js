import React from 'react';
import * as U from "../utilities";
import * as T from "../tables";
import player_skill from "../classes/player_skill"

class DC_skill_desc extends React.Component {
	props : {skill: player_skill | undefined}
	constructor(props : {skill: player_skill | undefined}){
		super(props);
		this.props = props; // props : item is a single item
	}
	render(){
	var c = T.display_constants;
		var skill= this.props.skill;
	if(skill == undefined){
		return <div>error</div>;
	}
	return ( 
	<div>


	
	{ /* box */}
	<div style={{"position":"absolute","border":"1px solid black","width":c.skill_desc_width,"height":c.skill_desc_height, "padding":"2px"}}>
	<h3>{skill.name}</h3>
	Damage: {skill.damageMult}  <br />
	Cooldown: {skill.cd}  <br />
	Mana: {skill.mana}  <br />
	Delay: {skill.delay}  <br />
	{skill.description}  <br />	
	</div>
	</div>
		)
	}
}

export default DC_skill_desc;


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
