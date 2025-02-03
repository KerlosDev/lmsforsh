'use client'
import React, { useState } from 'react'

const AdminContent = () => {
  const [nameofCourse, setNameOfcourse] = useState('')
  
  const handlenameCourse = (e) => {
    setNameOfcourse(e.target.value)
  }
  const handleClick = () => {
    console.log(nameofCourse)
  }
  return (
    <div className=' m-5 p-5 font-arabicUI3 rounded-xl backdrop-blur-3xl bg-white/5 border-4 col-span-5'>
      <h2 className=' text-5xl text-white'>اضافة كورس جديد</h2>
      <div className=' grid rtl-grid grid-cols-5 '>
        <div className=' col-span-2 bg-white rounded-lg p-5 m-6'>
          <h5 className=' text-3xl text-blue-950'>اسم الكورس</h5>
          <input value={nameofCourse} onChange={(e)=>{handlenameCourse(e)}} className=' bg-blue-950 text-2xl my-2 mx-auto  text-right flex justify-center  text-white p-3 rounded-xl w-5/6' type="text" />
       
          <button onClick={handleClick} className=' bg-blue-950 text-white p-4 text-3xl mx-auto flex justify-center my-6 rounded-xl'>اضافة الكورس</button>
        </div>
      </div>
    </div>
  )
}

export default AdminContent