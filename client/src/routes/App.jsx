import React from 'react';
import IndexLink from 'react-router/lib/IndexLink';
import Link from 'react-router/lib/Link';

import Icon from '../components/Icon';

const App = ({children}) => (
	<div className="container-fluid">
		<div className="row">
			<div className="col-sm-12">
				<nav className="navbar navbar-fixed-top navbar-dark bg-inverse" style={{background: '#83bf88'}}>
					<IndexLink to="/" className="navbar-brand"><Icon name="logo" /> F8 WebScraper</IndexLink>
					<ul className="nav navbar-nav">
						<li className="nav-item">
							<IndexLink to="/" className="nav-link" activeClassName="active">Main</IndexLink>
						</li>
						<li className="nav-item">
							<Link to="/nerdy" className="nav-link" activeClassName="active">Nerdy</Link>
						</li>
					</ul>
				</nav>
				{children}
			</div>
		</div>
	</div>
);

export default App;