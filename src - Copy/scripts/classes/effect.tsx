//"attack, defense, poison, speed (player only), mana (player only) , other

class effect{
	constructor(name,duration,strength, params=[]){
    this.name = name;
    this.duration = duration;
    this.strength = strength;
	this.params = params;
	}
}
export default effect; 
