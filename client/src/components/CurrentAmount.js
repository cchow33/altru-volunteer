import React, { useState, useContext, useEffect } from 'react'
import { DonationsContext } from '../context/DonationsContext'
import toast, { Toaster } from 'react-hot-toast'

const CurrentAmount = () => {
  // const [total, setTotal] = useState(0)
  const [amount, setAmount] = useState('$0')
  const [todaysAmount, setTodaysAmount] = useState(0)
  const [otherAmount, setOtherAmount] = useState(0)
  // const { currentAmount, setCurrentAmount, setTotalAmount, totalAmount } = useContext(DonationsContext)

  const addAmount = (e) => {
    const clickedAmount = Number(e.target.value);
    console.log(e.target.value)
    toast.success(`$${clickedAmount} added`)
    // setTotal(total + clickedAmount)
    setTodaysAmount(todaysAmount + clickedAmount)
  }

  const handleOtherAmount = (e) => {
    console.log('Other amount is: ', e.target.value)
    setOtherAmount(e.target.value)
  }

  const saveAmount = (e) => {
    console.log('Saving amount', todaysAmount, e.target.value)
  }

  useEffect(() => {
    // setTotalAmount(totalAmount + total) 
    setTodaysAmount(todaysAmount + amount) 
    // setTotalAmount((prev) => {
    //   return prev + total 
    // })
    // setTotalAmount(totalAmount + total) * alt to lines 19-20 (from Context)
  }, [amount])

  return (
    <div>
      <div className="rightside">
        <button className="" value="10" onClick={addAmount}>$10</button>
        <button className="" value="25" onClick={addAmount}>$25</button>
        <button className="" value="50" onClick={addAmount}>$50</button>
        
        <input 
          type="text" 
          className="choose-amount" 
          placeholder="Other amount"
          value={otherAmount} 
          onChange={handleOtherAmount}
          >
        </input>

        <button onClick={saveAmount}>Save</button>
      </div>
    </div>
  )
}

export default CurrentAmount
