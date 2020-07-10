// refresh the this.browser and enter the test name

class X{
	constructor(browser){
		this.browser = browser;
	}
	async refresh(test_name){
		var currentURL = this.browser.getCurrentUrl(); 
		this.browser.get(currentURL); 
		this.browser.navigate().refresh();
		await this.sleep(300);
		this.browser.findElement({ id: "code" }).sendKeys(test_name);
		this.browser.findElement({ id: "load_button" }).click();
		await this.sleep(300);
	}


  sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//mouse click
 async  click(x,y){
	           this.browser.actions({bridge: true})
				.move({x:x, y:y}) 
                .click( undefined).perform(); // start a dungeon
	await this.sleep(200);
}
//keyboard press
//use things like webdriver.Key.RIGHT
 async  press(key){
				this.browser.actions({bridge: true})
				.sendKeys(key)
				.perform();
				await this.sleep(100);
}

// go through an entire attack sequence. This pauses the script 
 async  attack_sequence(seq){
	//seq is an object (tick number -> key to press);
	// will press the key at the given time
	var state;
	var tick_counter= -1;
	while(true){
		await this.browser.executeScript("return window.game.game_state()").then((x) => state = x);
		
		if(state.name != "fighting"){
			return;
		}
		var game_counter;
		game_counter = state.combat_instance.current_ticks;
		
		Object.keys(seq).forEach(function(x){
			if(x > tick_counter && x <= game_counter){
				this.press(seq[x]);
			}
		}.bind(this))
		tick_counter = game_counter;
	}
}

// while in combat : tick n times 
//returns before and after combat instances. 
// this.browser.executeScript clones the returned value, so this is safe.
 async  tick_times(n){
	var game;
	var state1;
	var state2;
	await this.browser.executeScript("return window.game.game_state().combat_instance").then(function(x){state1 = x});
	await this.browser.executeScript("return window.game").then((x) => game = x);
	
	for(var i=0; i<n && await this.browser.executeScript("return window.game.game_state().name;") == "fighting"; i++){
		await this.browser.executeScript("window.game.fight_tick();")
	}
	await this.browser.executeScript("window.controller.rerender()");
	await this.browser.executeScript("return window.game.game_state().combat_instance").then(function(x){state2 = x});
	return {"before":state1, "after":state2};
}


// returns the difference (after - before) in monster HP between two combat instances (I_Combat instances)
  get_damage_between_instances(inst1, inst2, monster_index){
	return inst2.fighting_monsters[monster_index].hp - inst1.fighting_monsters[monster_index].hp
}

}

module.exports = {X}
//module.exports = {refresh,sleep,click,press,attack_sequence,tick_times,update_combat,get_damage_between_instances}