import React from 'react';
import * as U from "../utilities.tsx";
import * as T from "../tables.tsx";
import Dungeon from "../classes/dungeon.tsx";

class D_Dungeon_Info extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props : "dungeon" : a I_Dungeon instance
		this.data = React.createRef();
	
		// x and y : the person's start and end location
		// cleared: list of locations (x,y) pairs, that are cleared. 
	}
	render(){
		var c = T.display_constants;
		var dungeon = this.props.dungeon_instance.dungeon;
		return (<div>
		<div style={{"position":"absolute", "top":c.dungeon_name_top_left[1],"left":c.dungeon_name_top_left[0], "width":c.dungeon_name_width, height:c.dungeon_name_height}}><h1>
			{dungeon.name}
		</h1></div>
		
		<div ref={this.data} style={{"position":"absolute", "top":c.dungeon_desc_top_left[1],"left":c.dungeon_desc_top_left[0], "width":c.dungeon_desc_width, "height":c.dungeon_desc_height}}>

		</div>
		
		<div style={{"position":"absolute", "top":c.dungeon_start_top_left[1],"left":c.dungeon_start_top_left[0], "width":c.dungeon_start_width, "height":c.dungeon_start_height}}>
		<h1> Press Space to begin</h1>
		
		</div></div> )
	}
	
	componentDidMount(){
		var dungeon = this.props.dungeon_instance.dungeon;
		this.data.current.innerHTML = dungeon.description;
	}

}

export default D_Dungeon_Info;


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
