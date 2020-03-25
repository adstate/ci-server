import React from 'react';
import './App.scss';
import {Header, Footer, Main} from 'components';

function App() {
  return (
    <div className="App page page_view_all-screen">
      <Header title="School CI Server"></Header>
      <Main/>
      <Footer/>
    </div>
  );
}

export default App;
