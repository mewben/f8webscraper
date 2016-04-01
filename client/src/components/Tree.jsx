import React, { Component, PropTypes } from 'react';

import Branch from './Branch';

class Tree extends Component {

	static propTypes = {
		branches: PropTypes.object,
		level: PropTypes.number
	};

	render() {
		let { branches, level } = this.props;

		if (branches.size === 0) {
			return null;
		}

		return (
			<ul className="tree">
				{branches.map((item, i) => {
					return (
						<Branch
							key={i}
							level={level}
							id={item.get('Id')}
							name={item.get('Name')}
							activated_at={item.get('ActivatedAt')}
							dr={item.get('Children')}
						/>
					);
				})}
			</ul>
		);
	}
}

export default Tree;