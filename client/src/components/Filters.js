import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { DonationsContext } from '../context/DonationsContext'
import { FiltersContext } from '../context/FiltersContext'
import { NgosContext } from '../context/NgosContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { BiMap } from 'react-icons/bi'
// import StripeCheckout from 'react-stripe-checkout'
import CurrentAmount from '../components/CurrentAmount'
import Remaining from '../components/Remaining'
import Donations from '../components/Donations'
import DonationModal from './DonationModal'
import Goal from '../components/Goal'
import './Filters.css'

const Filters = () => {
  const { filters, setFilters } = useContext(FiltersContext) 
  const { goalAmount, totalAmount } = useContext(DonationsContext)
  const { token } = useContext(AuthContext);
  const { ngos, setNgos } = useContext(NgosContext)
  const [ setErrorMessage ] = useState('')
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ pageCount, setPageCount ] = useState(1)
  const [ currentAmount ] = useState(0)
  const navigate = useNavigate();

  // Stripe Payment
  const makePayment = token => {
    const body = {
      token, 
      currentAmount
    }
    const headers = {
      "Content-Type": "application/json"
    }
    return fetch('http://localhost:5000/api/payment', {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }).then(response => {
      console.log(response)
    })
    .catch(err => console.log(err));
  }

  // Pagination buttons
  const handlePrevious = () => {
    console.log('pre page')
    setCurrentPage(currentPage - 1);
  }

  const handleNext = () => {
    console.log('next page')
    setCurrentPage(currentPage + 1);
  }

  const handleAmountChange = (e) => {
    setFilters({ ...filters, amount: e.target.value});
    console.log(e.target.value)
  }

  const handleClearAmount = () => {
    currentAmount();
  }

  const handleRegionChange = (e) => {
    setFilters({ ...filters, region: e.target.value }); 
    // Only change value of region to the one user selected
  }

  const handleCauseChange = (e) => {
    setFilters({ ...filters, cause: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchFilteredNgos()
  }

  const handleNgoSelected = (id) => {
    navigate(`/info/${id}`)
    console.log(id)
  }

  const fetchAllNgos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ngos/', { headers: { Authorization: 'Bearer ' + token }})  
      setNgos(res.data);
      console.log(res.data);
    } catch (err) {
      setErrorMessage('Unable to fetch list of NGOs')
    } 
  };

  const fetchFilteredNgos = async () => {
    try {
      const location = filters.region 
      const cause = filters.cause 
      const res = await axios.get(`http://localhost:5000/api/ngos/${location}/${cause}`);    
      setNgos(res.data);
      console.log(res.data.location);
    } catch (err) {
      setErrorMessage('Unable to fetch results');
    }
  };

  useEffect(() => { 
    setPageCount(Math.ceil(ngos.length/4)); 
    }, [ngos.length]) 

  useEffect(() => {
    fetchAllNgos();
    }, []);

  return (
    <div>
      <Toaster position="top-center" toastOption={{ duration: 3000 }}/>
      <div className="stats">

        <Goal/>
        <Remaining/>
        <Donations/>

        <div className="todayContainer">
          <div className="today-text">Today's amount: </div>
          <div className="today-amount">${totalAmount}</div>
          <button className="clear-amount" onClick={handleClearAmount}>Reset</button>
        </div>

        <DonationModal/>
    
        {/* <div className="stripeContainer">
          <div className="stripe-text">Would you like to donate this amount?</div>
          <StripeCheckout // TEST CC: 4242 4242 4242 4242; 12/34; 123
            stripeKey="pk_test_51L1kSgAoNhpouPlcfYHS4qZk7puLHRnuQFurkS8DelIS2DvAgtPR5nM4DWIdI3rjZCUyhkg9USb34AEQBf2Zz32r00TiqYY6E9"
            token={makePayment}
            name="Your donation"
            amount={currentAmount * 100}
          />
        </div> */}
      </div>

      <h1>Find Nonprofits to donate to or volunteer events </h1>
      <div className="filters">

        <form className="dropdown">
          <select value={filters.amount} onChange={handleAmountChange}>  
          <option value="all"> --- Amount Needed --- </option>
          <option value="$10-$25">$10.00 - $25.00</option>
          <option value="$25-$40">$25.00 - $40.00</option>
          <option value="$40-$55">$40.00 - $55.00</option>                        
          <option value="$55-$75">$55.00 - $75.00</option>                        
          </select>
        </form>
    
        <form className="dropdown">
          <select value={filters.hours} onChange={handleRegionChange}>  
          <option value="all"> --- Time --- </option>
          <option value="event">Upcoming Event</option>
          <option value="weekly">Every Week</option>
          <option value="monthly">Once a Month</option> 
          </select>
        </form>

        <form className="dropdown">
          <select value={filters.cause} onChange={handleCauseChange}>
          <option value="all"> --- All Causes --- </option>
          <option value="animals">Animals</option>
          <option value="children & youth">Children & Youth</option>
          <option value="education & literacy">Education & Literacy</option>
          <option value="environment">Environment</option>
          <option value="health & medicine">Health & Medicine</option>
          <option value="sports & recreation">Sports & Recreation</option>
          </select>
        </form>
        
        <button className="searchBtn" onClick={handleSubmit}>Search</button>
    
        <div className="pagination">
          <button disabled={currentPage === 1} className="previous" onClick={handlePrevious}>Previous</button>
          <p>{currentPage} / {pageCount}</p>
          <button disabled={currentPage === pageCount} className="next" onClick={handleNext}>Next</button> 
        </div>

      </div>

      <div className="display">
        <div className="results-container">
          {ngos?.slice((currentPage - 1) * 5, currentPage * 5).map((ngo, idx) => {
            return (
              <div className="display-container">
                <div key={idx} className="row">
                <button className="infoBtn" onClick={() => handleNgoSelected(ngo._id)}>
                  {ngo.name}</button>
        
                <div className="rightside">
                  <CurrentAmount/>
                </div>          
              </div> 
            </div> 
            )
          })}
        </div> 
      </div>  
    </div>
    )
  }

export default Filters;








