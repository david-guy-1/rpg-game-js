import React from 'react';
import App2 from './App2.js';
import game from './scripts/classes/game.js';
import controller from './controller.js';
import game_context from "./AppContext.js";


		
class App extends React.Component {
	constructor(props){
		super(props)
		this.game = new game();
		this.view_ref = React.createRef();
		this.state = {goal:"not done"};
		
	}
	render(){
		
	return <game_context.Provider value={this.state}> <App2 game={this.game} ref={this.view_ref} /> </game_context.Provider>

	}
	componentDidMount(){
		this.setState ({"game":this.game, "view":this.view_ref.current, "controller": this.view_ref.current.controller, "goal":"abc"});
	}
	
}

export default App;
