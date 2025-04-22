import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getWantedList } from '../services/api';
import { Card, Button, Spinner, Modal } from 'react-bootstrap';
import NavBar from '../components/NavBar';
import { useSearch } from '../context/SearchContext';

const WantedList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [wanted, setWanted] = useState([]);
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true);
  const [personModal, setPersonModal] = useState({status:false});
  const page = searchParams.get('page') || 1;
  const {query, filter} = useSearch();
  const isLastPage = page >=(totalItems/20);


  function parseFilterAttributes(input) {
    const result = {};
    input.split(',').forEach(pair => {
      const [key, value] = pair.split(':').map(s => s.trim());
      if (key && value) {
        result[key] = value;
      }
    });
    return result;
  }

  useEffect(() => {
    const loadWanted = async () => {
      try {
        setLoading(true)
        // filter_example: hair:brown, eyes: brown
        const data = await getWantedList({ page, query, ...parseFilterAttributes(filter) });
        setWanted(data.items);
        setTotalItems(data.total);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadWanted();
  }, [page, query, filter]);

  

  async function handleNextPage(){    
    if (!isLastPage) {
      const params = new URLSearchParams(searchParams);
      params.set('page', parseInt(page)+1)
      setSearchParams(params)
    }
  }

  if (loading) {
    return (<div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" />
    </div>
    );
  };

  return (
    <div className='container-fluid'>
      <div className='mb-5'>
        <NavBar/>
      </div>
      <div className='container'>
      <div className='d-flex justify-content-end'>
      <Button variant="success" onClick={()=>{handleNextPage()}} disabled={isLastPage}>Next page</Button>
      </div>
      <div className='row'>
        {wanted.map((person) => (
          <div className='col-12 col-md-4 my-2'>
            <Card className='shadow-sm h-100 d-flex flex-column'>
              <Card.Img variant="top" src={person.images?.[0]?.original || ''} style={{height:'250px', objectFit:'contain'}} />
              <Card.Body>
                <Card.Title>{person.title}</Card.Title>
                <Card.Text>{person.description?.substring(0, 100)}...</Card.Text>
                <Button variant="primary" onClick={()=>{setPersonModal({status:true,data:person})}}>View More</Button>
              </Card.Body>
            </Card>
          </div>)
        )}
      </div>    
      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={personModal.status}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{personModal.data?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Card className="shadow-sm">
        <Card>
          <Card.Img variant="top" src={personModal.data?.images?.[0]?.original || ''} style={{height:'500px', objectFit:'contain'}} />
          <Card.Body>
          <p className='fw-bold'>Description: <span className='fw-normal'>{personModal.data?.description}</span></p>
            <p className='fw-bold'>Gender: <span className='fw-normal'> {personModal.data?.sex}</span></p>
            <p className='fw-bold'>Height: <span className='fw-normal'>{personModal.data?.height}</span></p>
            <p className='fw-bold'>Hair: <span className='fw-normal'>{personModal.data?.hair}</span></p>
            <p className='fw-bold'>Eyes: <span className='fw-normal'>{personModal.data?.eyes}</span></p>
            <p className='fw-bold'>Date of Birth: <span className='fw-normal'>{personModal.data?.dates_of_birth_used?.[0]}</span></p>
            <p className='fw-bold'>Place of Birth: <span className='fw-normal'>{personModal.data?.place_of_birth}</span></p>
            <p className='fw-bold'>NCIC: <span className='fw-normal'>{personModal.data?.ncic}</span></p>
            <p>Download files:
              {personModal.data?.files.map((file, index) => (
                <div key={index}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </div>
              ))}
            </p>
          </Card.Body>
        </Card>
      </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={()=>setPersonModal({status:false})}>Close</Button>
      </Modal.Footer>
    </Modal>
    </div>
    </div>
  );
};

export default WantedList;
