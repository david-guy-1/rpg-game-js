import React from 'react';
import item_class from "../classes/item";
import * as U from "../utilities";
import * as T from "../tables";
import currency_obj from "../typedefs/currency_obj"


class DC_currency extends React.Component {
	props : {currency:currency_obj}
	constructor(props : {currency:currency_obj}){
		super(props);
		this.props = props; // props is a currency object
	}
	render(){
		var currency = this.props.currency;
		return <ul>
			{function(){
				
				var list : any[]= [];
				Object.keys(currency).forEach(function(type){
					list.push(<li>{type} : {currency[type]}</li>)
				});
				return list;
			}()
			}
		</ul>  
	}
}

export default DC_currency;
 
