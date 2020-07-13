import item from "./item"
import currency_obj from "../typedefs/currency_obj";

export class shop{
	items : item[];
	prices : currency_obj[];
	
	constructor(items : item[], prices : currency_obj[]){
		this.items = items;
		this.prices = prices;
	}
}

export default shop;