// src/components/Navbar.js
import React, { useState } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { useSearchParams} from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const NavBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {query,setQuery,setFilter}=useSearch();
 
  const [localQuery, setLocalQuery] = useState(query);
  const [filterHair,setFilterHair] = useState('');
  const [filterEyes,setFilterEyes] = useState('');
  const [filterRace,setFilterRace] = useState('');

  const updateQueryParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value)
    params.set('page', 1)
    setSearchParams(params, {replace: true})
  }

  const handleSearch = (event) => {
    event.preventDefault();
    if (localQuery.trim() !== '') {
      setQuery(localQuery.trim())
      updateQueryParams('query', localQuery.trim())
    } else {
      updateQueryParams('query', '')
    }
  };

  const handleFilter = (event) => {
    event.preventDefault();
  
    const parts = [];
  
    if (filterHair.trim() !== '') {
      parts.push(`hair:${filterHair.trim()}`);
    }
  
    if (filterEyes.trim() !== '') {
      parts.push(`eyes:${filterEyes.trim()}`);
    }
    if (filterRace.trim() !== ''){
      parts.push(`race:${filterRace.trim()}`)
    }
  
    const filterString = parts.join(',');
  
    setFilter(filterString); 
    updateQueryParams('filter', filterString);
  };
  

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      
        <Navbar.Brand href="/" className="fw-bold text-primary fs-4">FBI Wanted List</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="d-flex flex-column w-100 gap-3">

            {/* Top nav + search */}
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <Nav className="me-auto d-flex gap-3">
                <Nav.Link href="/" className="text-dark fw-medium">Home</Nav.Link>
                <Nav.Link href="/wanted-list" className="text-dark fw-medium">Wanted List</Nav.Link>
              </Nav>

              <Form className="d-flex mt-2 mt-md-0" onSubmit={handleSearch}>
                <FormControl
                  type="search"
                  placeholder="Search Wanted Persons"
                  className="me-2 rounded-pill"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  style={{ minWidth: '200px' }}
                />
                <Button variant="outline-success" type="submit" className="rounded-pill">
                  Search
                </Button>
              </Form>
            </div>

            {/* Filter form */}
            <div className="bg-light p-3 rounded shadow-sm">
              <Form className="d-flex flex-wrap gap-3 align-items-end justify-content-between" onSubmit={handleFilter}>
                <div className="d-flex flex-column">
                  <Form.Label className="fw-semibold">Hair</Form.Label>
                  <FormControl
                    type="text"
                    placeholder="e.g. black"
                    value={filterHair}
                    onChange={(e) => setFilterHair(e.target.value)}
                  />
                </div>

                <div className="d-flex flex-column">
                  <Form.Label className="fw-semibold">Eyes</Form.Label>
                  <FormControl
                    type="text"
                    placeholder="e.g. brown"
                    value={filterEyes}
                    onChange={(e) => setFilterEyes(e.target.value)}
                  />
                </div>

                <div className="d-flex flex-column">
                  <Form.Label className="fw-semibold">Race</Form.Label>
                  <FormControl
                    type="text"
                    placeholder="e.g. white"
                    value={filterRace}
                    onChange={(e) => setFilterRace(e.target.value)}
                  />
                </div>

                <Button variant="secondary" type="submit" className="rounded-pill px-4">
                  Filter
                </Button>
              </Form>
            </div>
          </div>
        </Navbar.Collapse>
      
    </Navbar>

  );
};

export default NavBar;


