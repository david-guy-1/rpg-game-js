import React from 'react';
import App2 from './App2';
import game from './scripts/classes/game';
import controller from './controller';
import game_context from "./AppContext";


		
class App extends React.Component {
	game:game;
	view_ref:any;
	state:any;
	constructor(props : any){
		super(props)
		this.game = new game();
		this.view_ref = React.createRef();
		this.state = {goal:"not done"};
		
	}
	render(){
		
	return <game_context.Provider value={this.state}> <App2 game={this.game} ref={this.view_ref} /> </game_context.Provider>

	}
	componentDidMount(){
		// needs to be setState so that the App2 will have provided values
		this.setState ({"game":this.game, "view":this.view_ref.current, "controller": this.view_ref.current.controller, "goal":"done"});
	}
	
}

export default App;
