import React from 'react';
import Link from 'react-router/lib/Link';
import IndexLink from 'react-router/lib/IndexLink';

import Icon from '../components/Icon';

let mainmenu = [{
	title: 'Dashboard',
	link: '/',
	icon: 'dashboard',
	index: true
}, {
	title: 'Packages',
	link: '/packages',
	icon: 'group'
}, {
	title: 'Encashments',
	link: '/encashments',
	icon: 'style'
}, {
	title: 'Network',
	link: '/network',
	icon: 'carousel'
}, {
	title: 'Purchase History',
	link: '/purchase-history',
	icon: 'subject'
}];

let settings = [{
	title: 'My Account',
	link: '/profile',
	icon: 'style'
}, {
	title: 'Logout',
	link: '/logout',
	icon: 'power'
}];
const SideNav = ({profile}) => (
	<div id="sidenav">
		<header className="company">
			<h2 className="logo">Ascentso</h2>
		</header>
		<section className="profile">
			<div className="media">
				<div className="media-left">
					<div className="circle">
						<Icon name="person" size="18" />
					</div>
				</div>
				<div className="media-body">
					<h4 className="media-heading cap">{profile.get('Name')}</h4>
					<div className="detail"><Icon name="online" size="8" /> Member ID: {profile.get('Id')}</div>
				</div>
			</div>
		</section>
		<div className="scrollable">
			<section>
				<h5>VIRTUAL OFFICE</h5>
				<ul className="nav nav-pills nav-stacked">
					{mainmenu.map((item, key) => {
						if (item.index) {
							return (
								<li key={key} className="nav-item">
									<IndexLink
										to={item.link}
										className="nav-link"
										activeClassName="active"
									>
										<Icon name={item.icon} size="16" /> {item.title}
									</IndexLink>
								</li>
							);
						} else {
							return (
								<li key={key} className="nav-item">
									<Link
										to={item.link}
										className="nav-link"
										activeClassName="active"
									>
										<Icon name={item.icon} size="16" /> {item.title}
									</Link>
								</li>
							);
						}
					})}
				</ul>
			</section>
			<section>
				<h5>SETTINGS</h5>
				<ul className="nav nav-pills nav-stacked">
					{settings.map((item, key) => {
						return (
							<li key={key} className="nav-item">
								<Link
									to={item.link}
									className="nav-link"
									activeClassName="active"
								>
									<Icon name={item.icon} size="16" /> {item.title}
								</Link>
							</li>
						);
					})}
				</ul>
			</section>
		</div>
	</div>
);

export default SideNav;