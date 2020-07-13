/**
 * Dependency Modules
 */
 

var assert = require("assert").strict;
require("geckodriver");


const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

var test_unit =  require('./test_utils.tsx').X;


// Application Server
const serverUri = "http://localhost:3000/#";
const appTitle = "React App";

/**
 * Config for Chrome browser
 * @type {webdriver}
 */

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


// test cases start here 

// update our local version of instance and game.


// while in combat : get the combat instance and put it in a global variable
 async function update_combat(){
	await browser.executeScript("return window.game.game_state().combat_instance").then(function(x){inst = x});
	await browser.executeScript("return window.game").then(function(x){game = x});
}


describe("load effects", function() {
	// global variables : intended!
	before(async function() {

		await TU.refresh("effects test");
		
	});
	beforeEach(async function(){
		await update_combat();
	})
	it("Should have a game and instance", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			assert.notEqual(inst, undefined);
			assert.notEqual(game, undefined);
			resolve(1);
			// put stuff here, end
		});
	});

	it("calculate the base damage and defense", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			// global varaibles, intended.
			player_atk  = game.player.attack+2000+3; //items form data's make_items
			player_def  = game.player.defense;
			//make_defending_monster
			monster_atk = 300
			monster_def = 25;

			// put stuff here, end
			resolve(0);
		});
	});
	
	it("should take damage from a basic attack", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			var data = await TU.tick_times(1);
			await update_combat();
			// get current ticks
			assert.strictEqual(inst.current_ticks, 1);
			
			// get monster hp
			var monster = inst.fighting_monsters[0];
			// no effects just yet, and we've used a basic attack multiplier = 1
			// so just our damage * 1 - their defense
			assert.strictEqual(monster.max_hp - monster.hp , player_atk - monster_def);
			// monster also attacked us
			assert.strictEqual(inst.player_max_hp - inst.player_hp , monster_atk - player_def);
			
			
			// put stuff here, end
			resolve(0);
		});
	});
	
	it("should apply a poison effect", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			await TU.tick_times(5);
			// make sure our mana is full
			assert.strictEqual(inst.player_mana, 1000);
			// now we do a poison attack!
			await browser.executeScript("window.game.set_currently_queued_attack(1)");
			var data = await TU.tick_times(1);
			// poison attack costs 30 mana
			assert.strictEqual(data.after.player_mana, 970);
			// cooldown of poison is 100, and drops once on the turn poison was used
			assert.strictEqual(data.after.cooldowns[1], 99);
			
			
			// we attacked. damage mult = 0.3;
			var damage_dealt = Math.floor(player_atk * 0.3 - monster_def) + 5; // +5 for poison, it ticked once
			/*
			console.log(old_hp);
			console.log(damage_dealt);
			console.log(new_hp);
			*/
			assert.strictEqual(-damage_dealt , TU.get_damage_between_instances(data.before, data.after, 0));
		
			// put stuff here, end
			resolve(0);
		});
	});
	it("should keep on ticking for more damage", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			// now see poison damage tick
			
			var data = await TU.tick_times(1);
			var old_hp = data.before.fighting_monsters[0].hp;
			var new_hp = data.after.fighting_monsters[0].hp;
			assert.strictEqual(old_hp - 5, new_hp);
			// and cooldowns
			assert.strictEqual(data.after.cooldowns[1], 98);
			// put stuff here, end
			resolve(0);
		});
	});

	it("monster should take less damage after using a defensive ability", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			// tick a couple of times
			await TU.tick_times(32);
			await update_combat();
			// do an attack
			await browser.executeScript("window.game.set_currently_queued_attack(0)");
			var data = await TU.tick_times(1);
			
			// basic attack (multiplier = 1) , but monster takes half damage, but monster is still poisoned
			var damage_dealt = Math.floor((player_atk - monster_def)*0.5 + 5)
			assert.strictEqual(-damage_dealt , TU.get_damage_between_instances(data.before, data.after, 0));
		// put stuff here, end
			resolve(0);
		});
	});

	it("empower should increase damage ", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			
			await TU.tick_times(30);
			await browser.executeScript("window.game.set_currently_queued_attack(2)");
			await TU.tick_times(20);
			// empower should be used now
			await update_combat();
			//should have an empower effect
			assert.strictEqual(inst.player_effects.attack[0].name,"attack")
			assert.strictEqual(inst.player_effects.attack[0].duration,180); // 20 ticks passed since we used it
			// now do a basic attack
			await browser.executeScript("window.game.set_currently_queued_attack(0)");
			// tick once
			var data = await TU.tick_times(1);
			// 1.4 damage, still poisoned, defensive ability dropped
			var damage_dealt = Math.floor((player_atk - monster_def)*1.4 + 5)
			assert.strictEqual(-damage_dealt , TU.get_damage_between_instances(data.before, data.after, 0));
			
			// put stuff here, end
			resolve(0);
		});
	});

	it("should be able to combine both empower and monster defense", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			await browser.executeScript("window.game.set_currently_queued_attack(2)");
			// we are at tick 92 right now. We need basic attack to be up (39 cd right now)
			// and the monster is using defensive (130 - 180)
			// so we go to tick 140
			await TU.tick_times(140 - 92);
			await update_combat(); 
			await browser.executeScript("window.game.set_currently_queued_attack(0)");
			
			// get HP difference again
			var data = await TU.tick_times(1);
			// combine both empower and monster defense. 
			var damage_dealt = Math.floor((player_atk - monster_def)*1.4*0.5)
			assert.strictEqual(-damage_dealt , TU.get_damage_between_instances(data.before, data.after, 0));
			
			// put stuff here, end
			resolve(0);
		});
	});
	
	it("haste should reduce cooldowns", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			await browser.executeScript("window.game.set_currently_queued_attack(4)");
			await TU.tick_times(2);
			await update_combat();
			// make sure we have the speed boost
			assert.strictEqual(inst.player_effects.speed[0].name,"speed")
			assert.strictEqual(inst.player_effects.speed[0].duration,249); // 20 ticks passed since 
			// wait for cd for basic attack to expire
			await TU.tick_times(39);
			await browser.executeScript("window.game.set_currently_queued_attack(0)");
			await TU.tick_times(1);
			await update_combat();
			// now the cd for basic attack should be 19 (40 * 0.5 - 1)
			assert.strictEqual(inst.cooldowns[0], 19);
			// put stuff here, end
			await TU.tick_times(19); 
			// now basic attack , monster should take damage.
			
			
			var data = await TU.tick_times(1);
			// empower is up, monster defense is not up. 
			var damage_dealt = Math.floor((player_atk - monster_def)*1.4);
			assert.strictEqual(-damage_dealt , TU.get_damage_between_instances(data.before, data.after, 0));
			
			
			resolve(0);
		});
	});
	
	it("poison attack should fail if not enough mana", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			//set the mana to 0
			await browser.executeScript("window.game.game_state().combat_instance.player_mana = 0");
			
			await TU.tick_times(5);
			// now do a poison attack
			await browser.executeScript("window.game.set_currently_queued_attack(1)");
			var data = await TU.tick_times(1);
			await update_combat();
			
			// poison attack should not be on cooldown
			assert.strictEqual(inst.cooldowns[1], 0);
			// monster should not be poisoned and not take damage
			
			var data = await TU.tick_times(1);
			assert.strictEqual(0 , TU.get_damage_between_instances(data.before, data.after, 0));

			// put stuff here, end
			resolve(0);
		});
	});
	it("attacks that don't cost mana should still succeed", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			await TU.tick_times(20); // after this we are on tick 230
			await browser.executeScript("window.game.set_currently_queued_attack(0)");
			await update_combat();
			
			
			var data = await TU.tick_times(1);
			// empower is up, monster defense is not up.
			// monster uses defense on turn 230, but I_Combat processes player 
			// attacks before monster attacks
			var damage_dealt = Math.floor((player_atk - monster_def)  * 1.4);
			assert.strictEqual(-damage_dealt , TU.get_damage_between_instances(data.before, data.after, 0));

			
			// put stuff here, end
			resolve(0);
		});
	});
	
	it("should apply a manaless buff when manaless is used", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			await TU.tick_times(9); // tick 240 now
			await browser.executeScript("window.game.set_currently_queued_attack(3)");
			var data = await TU.tick_times(1); 
			await update_combat();
			assert.strictEqual(inst.player_effects.mana[0].name, "mana");
			// put stuff here, end
			resolve(0);
		});
	});
	
	it("poison should succeed now that manaless is used", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			await TU.tick_times(9);
			await browser.executeScript("window.game.set_currently_queued_attack(1)");
			await TU.tick_times(5);
			// now monster should be poisoned;
			await update_combat();
			var data = await TU.tick_times(1);
			// empower is up, monster defense is not up. 
			var damage_dealt = 5;
			assert.strictEqual(-damage_dealt , TU.get_damage_between_instances(data.before, data.after, 0));



			// put stuff here, end
			resolve(0);
		});
	});

	
	it("repeating pattern", function() {
		this.timeout(0);
		return new Promise(async function(resolve, reject) {
			// put stuff here
			
			// put stuff here, end
			resolve(0);
		});
	});
});




