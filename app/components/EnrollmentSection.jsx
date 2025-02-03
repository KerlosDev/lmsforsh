'use client'
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaBookOpenReader } from "react-icons/fa6";
import GlobalApi from '../api/GlobalApi';
import { BsPatchCheckFill } from "react-icons/bs";



const EnrollmentSection = ({ courseInfo }) => {

    const { user } = useUser()
    const [EnrollDAta, setEnrollData] = useState([])

    useEffect(() => {
        user?.primaryEmailAddress?.emailAddress && EnrooolUser(user?.primaryEmailAddress?.emailAddress)
    }, [user?.primaryEmailAddress?.emailAddress])

    const EnrooolUser = () => {
        GlobalApi.EnrollmentUsers(user?.primaryEmailAddress?.emailAddress).then(res => {

            setEnrollData(res.userEnrolls)
        })
    }



    const filteredcourse = EnrollDAta.filter(item => item?.course?.nicknameforcourse === courseInfo.nicknameforcourse)


    const isCourseFound = filteredcourse.length > 0;

    return (
        <div>
            {courseInfo.isfree ?
                (<div className={`   h-fit max-sm:w-fit  bg-gradient-to-tr shadow-2xl max-sm:mx-0 p-5 m-5 from-green-400 to-green-500 rounded-2xl `}>

                    <h2 className='  flex justify-center m-auto  font-arabicUI3 bg-white p-5 text-green-500/90 rounded-2xl text-5xl'> انضم دلوقتي </h2>

                    <h4 className=' text-white m-auto flex justify-center text-4xl my-4 '>الكورس مجاني</h4>


                </div>) :

                (
                    <div className={`   h-fit max-sm:w-full  bg-gradient-to-tr shadow-2xl max-sm:mx-0 p-5 m-5 from-green-400 to-green-500 rounded-2xl `}>

                        {user ? (
                            isCourseFound ? (
                                <h2 className=' text-white drop-shadow-2xl cursor-default flex justify-center text-2xl text-center m-auto  font-arabicUI3 md:text-4xl'>
                                    <span className=' p-6 rounded-2xl text-green-500 block w-full bg-white m-auto text-center'>
                                        {isCourseFound ? <span className=' flex gap-5'><BsPatchCheckFill />تم الاشتراك</span> : "  اشترك دلوقتي"}
                                    </span>
                                </h2>
                            ) : (<Link href={`/payment/${courseInfo.nicknameforcourse}`} >
                                <h2 className=' text-white flex drop-shadow-2xl justify-center   text-2xl text-center m-auto  font-arabicUI3 md:text-4xl'>
                                    <span className=' p-6 rounded-2xl text-green-500  block w-full bg-white m-auto text-center'>
                                        {isCourseFound ? <span className=' flex gap-5'><BsPatchCheckFill />تم الاشتراك</span> : "  اشترك دلوقتي"}
                                    </span>
                                </h2>
                            </Link>)

                        ) : (

                            <Link href='/sign-in' >
                                <h2 className=' text-white flex justify-center m-auto  font-arabicUI3 text-3xl'>
                                    <span className=' p-6 rounded-2xl text-green-500 block w-full bg-white m-auto text-center'>اشترك دلوقتي</span>
                                </h2>
                            </Link>
                        )}




                        {!isCourseFound && (
                            <h2  className=' text-white flex justify-center m-auto  font-arabicUI3 text-3xl my-5'>
                                <span>جنيه</span>
                                {courseInfo.price}بـــ
                            </h2>

                        )}



                    </div>
                )
            }
        </div>
    )
}

export default EnrollmentSection