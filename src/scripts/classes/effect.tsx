//"attack, defense, poison, speed (player only), mana (player only) , other

class effect{
	name : string;
	duration : number;
	strength : number ;
	 params : object ;
	constructor(name : string,duration : number,strength : number , params : any ={}){
    this.name = name;
    this.duration = duration;
    this.strength = strength;
	this.params = params;
	}
}
export default effect; 
