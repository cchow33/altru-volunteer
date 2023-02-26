import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeQuery, search, causeFilter, regionFilter, donationTypeFilter } from '../redux/actions'
import './Filters.css'
import axios from 'axios';

const Filters = () => {
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');

  // const [cause, setCause] = useState('');
  // const [region, setRegion] = useState('');
  // const [donate, setDonate] = useState('');
  // const [page, setPage] = useState(1);
  const dispatch = useDispatch();  
  const filters = useSelector(state => state.filters);
  
  // Handle input change
  const handleChange = (e) => {
    setInput(e.target.value);
  }

  // Handle input submit
  const handleSubmit = (e) => {
    dispatch(setQuery(e.target.value))
    setInput('');
    console.log('Submit button clicked by user')
  }

  return (
    <main>
      <div className="search">
        <input 
          type="text" 
          value={query} 
          placeholder="Search for an organization"/>
          onChange={handleChange} 
        <button type="submit" onClick={handleSubmit}>Search</button>
      </div>

      <form>
        <select> 
          <option value="">Causes</option>  
          <option value="Animal">Animal</option>
          <option value="Water">Water</option>
          <option value="Hunger">Hunger</option>
        </select>
      </form>
    
      <form>
        <select> 
          <option value="">Women's Rights</option>  
          <option value="Animal">Education</option>
          <option value="Water">Gender-based Violence</option>
          <option value="Hunger">Micro-finance</option>
          <option value="Hunger">Under representation</option>
        </select>
      </form>

      <form>
        <select> 
          <option value="">Region</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Africa">Africa</option>
        </select>
      </form>

      <form>
        <select> 
          <option value="">Donate</option>
          <option value="volunteer">Volunteer</option>
          <option value="either">Either</option>
          <option value="both">Both</option>
        </select>
      </form>
       

    </main>
    );
  };

export default Filters;