import React from 'react';
import IndexLink from 'react-router/lib/IndexLink';

import ProcessForm from '../components/ProcessForm';

const Home = () => {

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <nav className="navbar navbar-fixed-top navbar-dark bg-inverse" style={{ background: '#83bf88' }}>
            <IndexLink to="/" className="navbar-brand">F8 WebScraper</IndexLink>
          </nav>
          <ProcessForm />
        </div>
      </div>
    </div>
  );
};

export default Home;