import React from 'react';
import * as U from "../utilities.tsx";
import * as T from "../tables.tsx";
class DC_item extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props : item is a single item
	}
	render(){

		var item= this.props.item;
	return ( 
	<div>


	
	{ /* box */}
	<div style={{"position":"absolute","border":"1px solid black","width":210,"height":300, "padding":"2px"}}>
	Attack: +{item.attack}  <br />
	Defense: +{item.defense}  <br />
	HP: +{item.hp}  <br />
	{item.description}  <br />	
	</div>
	</div>
		)
	}
}

export default DC_item;


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
