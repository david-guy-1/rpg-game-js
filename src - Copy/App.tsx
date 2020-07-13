import React from 'react';
import App2 from './App2.tsx';
import game from './scripts/classes/game.tsx';
import controller from './controller.tsx';
import game_context from "./AppContext.tsx";


		
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
		// needs to be setState so that the App2 will have provided values
		this.setState ({"game":this.game, "view":this.view_ref.current, "controller": this.view_ref.current.controller, "goal":"done"});
	}
	
}

export default App;
