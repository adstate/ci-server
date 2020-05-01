import React from 'react';
import './App.scss';
import {Footer} from 'components';
import Main from 'containers/Main';

const App: React.FC = () => {
  return (
    <div className="App page page_view_all-screen">
      <Main/>
      <Footer/>
    </div>
  );
}

export default App;
