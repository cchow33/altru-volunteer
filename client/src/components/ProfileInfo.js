import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { BsPencil } from 'react-icons/bs'
import './ProfileInfo.css'

const Profile = () => {
  const { user } = useContext(AuthContext)
  const { id } = useParams(); 
  const [ email, setEmail ] = useState('')
  const [ openInput, setOpenInput ] = useState(false)

  const toggleInput = () => {
    setOpenInput(!openInput)
  }  
  
  const handleEdit = (e) => {
    setEmail(e.target.value)
  }

  const handleUpdate = (e) => {
    setEmail(e.target.value)
  }

  const handleSave = async (id, e) => {
    console.log(`New email ${email}`)
    console.log('editing email', email)
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }
      const res = await axios.put(
        `http://localhost:5000/api/auth/user/${id}`,
  
        { 
          email: `${email}`
        },
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    
    <div>  
      <h3>My Profile</h3>
      <div className="edit-row">    
        <div className="user-profile">  
          <p className="contact">Contact Details:</p>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>

        <button onClick={handleUpdate} className="edit-btn">Update</button>

        <div className="user-image">
          <div className="avatar"></div>
          <p>Update profile photo</p>
        </div>
      </div>

      <div className="email-row">
        <input type="text" 
          className="edit-input"
          placeholder="New email" 
          value={email}
          onChange={handleEdit}
        />
        <div className="save-email-btn" onClick={handleSave}>Save</div> 
      </div>

      <div className="following">
        <h3>Organizations followed:</h3>
 
        <div className="organizations">
          {Object.keys(user.following).map(follow => (
            <div follow={follow}>
              {user.following[follow]}
            </div>
          ))}

          </div>
      </div>
    </div>
  )
}

export default Profile

