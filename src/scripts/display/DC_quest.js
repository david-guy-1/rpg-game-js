import React from 'react';
import * as U from "../utilities.js";
import * as T from "../tables.js";
class DC_quest extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props : quest and width
	}
	render(){
	var quest = this.props.quest;	
	var index = this.props.index;
	return <div style={{width:this.props.width, height:50 , border:"2px solid black", padding:5, "background-color":(quest.state == 3 ? "00ff00" : (index%2==0? "#ffffee" : "#eeffff"))}}>
		<b> {quest.name}</b> {quest.description} <br />
		
		{ /*button to accept */ function(){if(quest.state == 1){
		return <button onClick ={function(){global.g.game.accept_quest(quest); global.g.controller.rerender()}}>Accept</button> }}()}
		
		{ /*progress tracker */ function(){if(quest.state == 2 && quest.type == "kill"){
		return <span>{quest.data.current + "/" + quest.data.count} </span>  }}()}
	</div>
	}
}

export default DC_quest;

