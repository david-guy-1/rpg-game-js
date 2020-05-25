import React from 'react';
import item_class from "../classes/item.js";
import * as U from "../utilities.js";
import * as T from "../tables.js";
class DC_currency extends React.Component {
	constructor(props){
		super(props);
		this.props = props; // props is a currency object
	}
	render(){
		var currency = this.props.currency;
		return <ul>
			{function(){
				
				var list = [];
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
 