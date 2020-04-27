import React from 'react';
import * as U from "../utilities.js";
import * as T from "../tables.js";
class DC_skill_desc extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props : item is a single item
	}
	render(){

		var skill= this.props.skill;
	if(skill == undefined){
		return <div>error</div>;
	}
	return ( 
	<div>


	
	{ /* box */}
	<div style={{"position":"absolute","border":"1px solid black","width":210,"height":200, "padding":"2px"}}>
	Damage: +{skill.damage}%  <br />
	Cooldown: +{skill.cd}  <br />
	Mana: +{skill.mana}  <br />
	
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
