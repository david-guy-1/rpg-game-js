import React from 'react';
import * as U from "../utilities.tsx";
import * as T from "../tables.tsx";
import {game_context} from "../../AppContext.tsx";

class DC_quest extends React.Component {
	static contextType = game_context;
	constructor(props){
		super(props);
		this.props = props; // props : quest and width
		
	}
	render(){
	var quest = this.props.quest;	
	var index = this.props.index;
	
	return <game_context.Consumer>{function({game, view, controller}){
	return	<div style={{width:this.props.width, height:50 , border:"2px solid black", padding:5, "background-color":(quest.state == 3 ? "00ff00" : (index%2==0? "#ffffee" : "#eeffff"))}}>
		<b> {quest.name}</b> {quest.description} <br />
		
		{ /*button to accept */ function(){if(quest.state == 1){
		return <button onClick ={function(){controller.handleQuestButtonClick(quest,index); controller.rerender()}}>Accept</button> }}()}
		
		{ /*progress tracker */ function(){if(quest.state == 2 && quest.type == "kill"){
		return <span>{quest.data.current + "/" + quest.data.count} </span>  }}()}
		
	</div>}.bind(this)
	}</game_context.Consumer> // there msut be nothing at all between the curly bracket and closing tag.

	}
	
}

DC_quest.contextType = game_context;

export default DC_quest;

