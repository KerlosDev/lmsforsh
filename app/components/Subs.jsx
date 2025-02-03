'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import GlobalApi from '../api/GlobalApi';
import Link from 'next/link';
import QuizV from './QuizV';

const Subs = () => {
    const { user } = useUser();
    const [EnrollDAta, setEnrollData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            EnrooolUser(user.primaryEmailAddress.emailAddress);
        }
    }, [user]);

    const EnrooolUser = async (email) => {
        setIsLoading(true);
        try {
            const res = await GlobalApi.EnrollmentUsers(email);
            setEnrollData(res.userEnrolls || []);
        } catch (error) {
            console.error('Error fetching enrollment data:', error);
            setEnrollData([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='m-5  bg-brain-image bg-cover  p-4 rounded-xl bg-center'>
            <div className='p-5'>
                <div className='cursor-default backdrop-blur-xl bg-black/20 rounded-xl w-fit m-auto outline-dashed outline-2 outline-white p-5'>
                    <h4 className='m-auto flex justify-center  max-sm:text-xl text-center font-arabicUI2 text-white text-5xl'>
                        الكورسات اللي انت مشترك فيها
                    </h4>
                </div>

                {isLoading ? (
                    <h4 className='font-arabicUI3 backdrop-blur-xl p-5 m-6 rounded-2xl border w-fit flex justify-center mx-auto text-white text-5xl'>
                        جاري التحميل...
                    </h4>
                ) : EnrollDAta.length > 0 ? (
                    <div
                        className='grid gap-6  grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 rtl-grid'
                    
                    >
                        {EnrollDAta.map((item) => (
                            <div
                                key={item?.course?.nicknameforcourse}
                                className='m-5 max-sm:my-5 max-sm:m-0 h-fit backdrop-blur-2xl shadow-white/10 outline-dashed outline-white outline-2 shadow-xl p-5 rounded-xl'
                            >
                                <div>
                                    <h4 className='font-arabicUI2 text-white text-4xl mb-4'>
                                        {item?.course?.nameofcourse}
                                    </h4>
                                    <p className='font-arabicUI3 text-white/80 text-sm'>
                                        {item?.course?.description}
                                    </p>
                                    <div className='text-white font-arabicUI2 my-4 text-3xl bg-white/10 p-2 w-fit rounded-xl outline-dashed outline-white outline-2 shadow-white/10 shadow-xl m-auto flex justify-center'>
                                        <Link href={`/Courses/${item?.course?.nicknameforcourse}`}>
                                            <h1>فتح الكورس</h1>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h4 className='font-arabicUI3 backdrop-blur-xl max-sm:text-xl  text-center p-5 m-6 rounded-2xl border w-fit flex justify-center mx-auto text-white text-5xl'>
                        انت مش مشترك فكورسات للاسف
                    </h4>
                )}

                {!isLoading && EnrollDAta.length > 0 && <QuizV />}
            </div>
        </div>
    );
};

export default Subs;
