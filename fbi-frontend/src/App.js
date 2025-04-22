import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WantedList from './pages/WantedList';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/login/Login';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
   <Router>
    <SearchProvider>
    <Routes>
        <Route path= "/wanted-list" element= {<WantedList />} />
        <Route path = "/" element= {<Login />}/>  
    </Routes>
    </SearchProvider>
   </Router>
  );
}

export default App;
