import React from 'react';
import {Router} from 'react-router-dom';
import './App.scss';
import {Footer} from 'components';
import Main from 'containers/Main';

function App() {
  return (
    <div className="App page page_view_all-screen">
      <Main/>
      <Footer/>
    </div>
  );
}

export default App;
