/**
 * Dependency Modules
 */
var assert = require("assert").strict;
require("geckodriver");


const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');



// Application Server
const serverUri = "http://localhost:3000/#";
const appTitle = "React App";

/**
 * Config for Chrome browser
 * @type {webdriver}
 */
var test_unit =  require('./test_utils.js').X;


var browser = new webdriver.Builder()
	.usingServer()
	.withCapabilities({ browserName: "chrome" })
	.build();

var TU = new test_unit(browser)




function logTitle() {
	
	return new Promise((resolve, reject) => {
		browser.getTitle().then(function(title) {
			resolve(title);
		});
	});
}



//mouse click



// test cases start here 



describe("Home Page", function() {
	it("Should start the browser", function() {
		this.timeout(0);
		return new Promise((resolve, reject) => {
			browser
				.get(serverUri)
				.then(() => resolve())
		});
	});

});


describe("load Dungeon", function() {
	before(async function(){
		await TU.refresh("town")
	});
	it("Should have instructoins", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			await TU.sleep(200);
			browser
				.findElement({ id: "instructions" })
				.then(elem => resolve())
			.catch(err => reject(err));
		});
	});
	
	it("Should be able to show the \"collect items\" screen when clicked on", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
	
				await TU.click(311, 316);
				//get game state
				var state=0;
				await browser.executeScript("return window.game.game_state()").then((x) => state = x);
				//verify everything is good
				assert.strictEqual(state.name, "fight end");
				assert.strictEqual(state.items_dropped.length, 3);
				assert.strictEqual(state.items_dropped[0].name, "enchanted sword");
				assert.strictEqual(state.items_dropped[1].name, "sword of undead fighting");
				assert.strictEqual(state.items_dropped[2].name, "ring of health");
				
				
				
				resolve(1);
			
		})
	});


	it("Should be able to select all items", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
				//find the elements to select
				var RElem;
				var selectElem;
				var leaveElem;
				await TU.sleep(200);
				await browser.findElement({ xpath: "//h2[text()[contains(., \"R\")]]" }).then((x) => RElem =x);
				await browser.findElement({ xpath: "//p[text()[contains(., \"deselect\")]]" }).then((x) => selectElem =x);	
				await browser.findElement({ xpath: "//button[text()[contains(., \"Go back\")]]" }).then((x) => leaveElem =x);	
				
				//click to move right.
				await RElem.click();
				//we should have moved right.
				await browser.executeScript("return window.game.game_state()").then(
				(x) => assert.strictEqual(x.selected, 1));
				
				//click to deselect.
				await selectElem.click();
				//we should have deselected it.
				await browser.executeScript("return window.game.game_state()").then(
				(x) => assert.strictEqual(x.chosen[1], false));

				//click to select again.
				await selectElem.click();
				//we should have selected it again.
				await browser.executeScript("return window.game.game_state()").then(
				(x) => assert.strictEqual(x.chosen[1], true));
				
				////click to leave .
				await leaveElem.click();
				
				//verify items are in inventory
				await browser.executeScript("return window.game").then(
				function(game){
					assert.strictEqual(game.game_stack[0].name , "town")
					assert.strictEqual(game.inventory[0].name , "enchanted sword");
					assert.strictEqual(game.inventory[1].name , "sword of undead fighting");
				    assert.strictEqual(game.inventory[2].name , "ring of health");
					assert.strictEqual(game.progress.town1_items, true);
					assert.strictEqual(game.currency.gold, 12); // 12 gold from the item stash in town
				});
				

				resolve(1);
			
		})
	});
	it("Should not be able to get the items again", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			await TU.click(311, 316);
			//try clicking on it again, it should not work
			await browser.executeScript("return window.game.game_state()").then(function(state){
				assert.strictEqual(state.name, "town");
			});
			resolve(1);
		});
	});
	it("Should be able to load a dungeon when I click on it", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
	
				await TU.click(893, 254);
				//get game state
				var state=0;
				await browser.executeScript("return window.game.game_state()").then((x) => state = x);
				//verify everything is good
				assert.strictEqual(state.name, "dungeon");
				var dungeon_inst = state.dungeon_instance;
				assert.strictEqual(dungeon_inst.dungeon.name, "Tutorial Dungeon");	
				assert.strictEqual(state.dismissed, false);
				// 5 entitites left
				assert.strictEqual(state.dungeon_instance.entities.length, 4);				
				resolve(1);
			
		})
	});
	it("Should be able to dismiss the dungeon when space is pressed", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			//press space

			await TU.press(" "); 
			//get the state
			var state=0;
			await browser.executeScript("return window.game.game_state()").then((x) => state = x);
			
			assert.strictEqual(state.dismissed, true);	
			resolve(1);
		});
	});
	it("Should be able to equip items", function(){
			this.timeout(0);
			return new Promise(async function(resolve ,reject){
				//click the inventory
				await browser.findElement({ xpath: "//h2[text()[contains(., \"Inventory\")]]" }).then((x) => x.click());
				//game stack should still be dungeon
				await browser.executeScript("return window.game.game_state()").then((state) =>  assert.strictEqual(state.name, "dungeon"));
				//but view stack should be inventory
				await browser.executeScript("return window.view.interface_stack").then((state) =>  assert.deepStrictEqual(state, ["game", "inventory"]));
				
				// check how much gold we have
				await browser.findElement({ xpath: "//li[text()[contains(., \"gold\")]]" }).then((x) => x.getText()).then(function(x){
					assert.strictEqual("gold : "  + (12), x);
				});
				
				// now let's equip items
				for(var i=0; i<3;i++){
					await TU.press("e")
					await TU.press("d")
					await TU.press("f")
				} 
				await TU.press(" ");
				
				// ending
				var game, state;
				await browser.executeScript("return window.game.game_state()").then((x) => state = x);
				await browser.executeScript("return window.game").then((x) => game = x);
				
				// items should be gone
				assert.strictEqual(game.inventory[0], null);
				assert.strictEqual(game.inventory[1], null);
				assert.strictEqual(game.inventory[2], null);				
				
				// player should have items
				assert.strictEqual(game.player.items[0].name, "enchanted sword");
				assert.strictEqual(game.player.items[1].name, "sword of undead fighting");
				assert.strictEqual(game.player.items[2].name, "ring of health");
				
				resolve(1);
			});
	});
	
	it("Should be able to equip skills", function(){
			this.timeout(0);
			return new Promise(async function(resolve ,reject){
				//click the skills
				await browser.findElement({ xpath: "//h2[text()[contains(., \"Skills\")]]" }).then((x) => x.click());
				//game stack should still be dungeon
				await browser.executeScript("return window.game.game_state()").then((state) =>  assert.strictEqual(state.name, "dungeon"));
				//but view stack should be skills
				await browser.executeScript("return window.view.interface_stack").then((state) =>  assert.deepStrictEqual(state, ["game", "skills"]));
				
				// now let's equip skills
				
				await TU.press("e")
				await TU.press("s")
				await TU.press(webdriver.Key.RIGHT)
				await TU.press("e")
				await TU.press("d")
				await TU.press(webdriver.Key.RIGHT)
				await TU.press("e")
				await TU.press(" ");
				
				// ending
				var game, state;
				await browser.executeScript("return window.game.game_state()").then((x) => state = x);
				await browser.executeScript("return window.game").then((x) => game = x);
				
				// skill pool should stay
				assert.strictEqual(game.skill_pool[0].name, "basic attack");
				assert.strictEqual(game.skill_pool[1].name, "smite undead");
				assert.strictEqual(game.skill_pool[2].name, "protect");				
				// player should have items
				assert.strictEqual(game.player.skills[0].name, "basic attack");
				assert.strictEqual(game.player.skills[1].name, "smite undead");
				assert.strictEqual(game.player.skills[2].name, "protect");
				
				resolve(1);
			});
	});
	
	
	it("Should be able to start fighting when pressing right twice", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			//press space
		await TU.sleep(200);
			await TU.press("D");
			await TU.press("D");	
			await TU.sleep(200);
			//get the state
			var state=0;
			await browser.executeScript("return window.game.game_state()").then((x) => state = x);
			assert.strictEqual(state.name, "fighting");	
			resolve(1);
		});
	});
	
	it("Should be able to complete the fight, this is the trivial fight so should end immediately", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			await TU.press(" ");
			// fight ends immediately
			await browser.executeScript("return window.game.game_state()").then((x) => assert.strictEqual(x.name, "fight end"));
			// click the leave button
			await browser.findElement({ xpath: "//button[text()[contains(., \"Go back\")]]" }).then((x) =>  x.click());
			await TU.sleep(100);
			// we should be in the dungeon again
			await browser.executeScript("return window.game.game_state()").then(function(state){
				assert.strictEqual(state.dungeon_instance.entities.length, 3);						
				assert.strictEqual(state.name, "dungeon")
			});
			// 4 entitites left
			resolve(1);
		});
	});
	
	it("Should be able to go to, and complete the next fight", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
				// move to the next fight
				await TU.press("a");
				await TU.press("a");
				await TU.press("s");
				await TU.press("s");
				await TU.press("d");
				await TU.press(" ");
				//start the fight
				await TU.attack_sequence({60: "d", 90:"a", 220:"s", 350:"a"})
				// when the fight is over, get the item
				await TU.press(" ")
				
				//assertions:
				await browser.executeScript("return window.game").then(function(game){
					// the useless item should be in the inventory
					assert.strictEqual(game.inventory[0].name, "useless item"); 
					// we should be in the dungeon
					var state = game.game_stack[game.game_stack.length-1];
					assert.strictEqual(state.name, "dungeon") 
					// 3 entities, since one spawned
					assert.strictEqual(state.dungeon_instance.entities.length, 3)
					//check that boss has been added
					assert.strictEqual(state.dungeon_instance.added_boss, true);
					// check currency
					assert.strictEqual(game.currency.gold, 10+32+1+12); 
				});
				
				resolve(1);
		});
	});
	it("Should be able to go to the key", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			//check that the lock has not been opened yet
			var inst;
			await browser.executeScript("return window.game.game_state().dungeon_instance").then((x) => inst = x);
			assert.strictEqual(inst.unlocked[0], false);
			// move to the key
			await TU.press("s");
			await TU.press("s");
			
			//we are now on the key, check that the lock has been opened
			await browser.executeScript("return window.game.game_state().dungeon_instance").then((x) => inst = x);
			assert.strictEqual(inst.unlocked[0], true);			
			//move to the item;
			await TU.press("a");
			await TU.press("w");
			await TU.press("w");
			await TU.press("w");
			await TU.press("d");
			//check that we are there
			await browser.executeScript("return window.game.game_state()").then(function(x){ assert.strictEqual(x.name, "fight end")});
			
			//don't take the item, it's useless		
			await TU.press("q");
			await TU.press(" ");
			await browser.executeScript("return window.game").then(function(x){ 
				assert.strictEqual(x.inventory[1], null);
				//but we should still have the gold
				assert.strictEqual(x.currency.gold, 10+32+1+12+212); 
			});
			await browser.executeScript("return window.game.game_state()").then(function(x){ assert.strictEqual(x.name, "dungeon")});
			resolve(1);
		});
	})
	
	it("Should be able to open the inventory and see how much gold I have", function(){ 
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
				// click the inventory
				await browser.findElement({ xpath: "//h2[text()[contains(., \"Inventory\")]]" }).then((x) => x.click());
				
				// find the amount of gold 
				await browser.findElement({ xpath: "//li[text()[contains(., \"gold\")]]" }).then((x) => x.getText()).then(function(x){
					assert.strictEqual("gold : "  + (10+32+1+12+212), x);
				});
				
				// leave inventory
				
				await TU.press(" ");
				resolve(1);
		});
	});
	
	
	it("Should be able to clear the rest of the dungeon", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
				// move to the next fight
				await TU.press("a");
				await TU.press("s");
				await TU.press("d");
				await TU.press("d");
				await TU.press(" ");
				//start the fight
				await TU.attack_sequence({0:"a"})
				// when the fight is over, get the item
				await TU.press(" ")
				
				//assertions:
				await browser.executeScript("return window.game.game_state()").then(function(state){
					// 1 entity left
					assert.strictEqual(state.dungeon_instance.entities.length, 1)
				});
				await TU.press("s");
				await TU.press("d");
				await TU.press(" ");
				await TU.attack_sequence({1:"s"})				
				await TU.press(" ");
				// more assertions
				
				await browser.executeScript("return window.game.game_state()").then(function(state){
					// dungeon cleared!
					assert.strictEqual(state.dungeon_instance.entities.length, 0);
					
				});
				await browser.executeScript("return window.game").then(function(game){
					// check for gold one last time
					assert.strictEqual(game.currency.gold, 10+32+1+12+212+100+1); 
					
				});
				
				resolve(1);
		});
	});
	it("Should be able to finish the dungeon, and not go back", function(){
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			await TU.press("a");
			await browser.executeScript("return window.game.game_state()").then(function(state){
				// dungeon end
				assert.strictEqual(state.name, "dungeon end");
				//dungeon instance should still be there;
				assert.strictEqual(state.dungeon_instance.dungeon_over, true);
				assert.strictEqual(state.dungeon_instance.dungeon.name, "Tutorial Dungeon");				
			})
			// go back to town
			await TU.press("a");
			
			await browser.executeScript("return window.game").then(function(game){
				// dungeon end
				var state = game.game_stack[game.game_stack.length-1];
				assert.strictEqual(state.name, "town");
				//check progress
				assert.strictEqual(game.progress.town1_dungeon, true);
				
			})
			await TU.click(893, 254);			
			//try clicking on it again, it should not work
			await browser.executeScript("return window.game.game_state()").then(function(state){
				assert.strictEqual(state.name, "town");
			})
			resolve(1);
		});
	});
});




