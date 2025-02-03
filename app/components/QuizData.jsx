'use client'
import GlobalApi from '@/app/api/GlobalApi'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BiSolidPencil } from "react-icons/bi";

import Swal from "sweetalert2";
import ProgCircle from './ProgCircle';

const QuizData = ({ params }) => {

    const { user } = useUser(); // Get the user from Clerk
    const { quizid } = React.use(params);
    const email = user?.primaryEmailAddress?.emailAddress;
    const [enrolquiz, setEnrolQuiz] = useState([]);
    const [activeIndex, setActiveINdex] = useState(0);
    const [actind4quiz, setActive4quiz] = useState(0);
    const [answersofQuiz, setAnserofQuiz] = useState([]); // Answers state
    const [next, setNext] = useState(false);
    const [showResults, setShowResults] = useState(false); // State to toggle between quiz and results
    const [score, setScore] = useState(0); // State for the score
    const [rightAns, setRightAns] = useState([])

    // Function to fetch quiz data
    const quizdata = (email, quizId) => {
        GlobalApi.getQuizDataWithEnroll(email, quizId).then((req) => {
            setEnrolQuiz(req.userEnrolls[0].course.quiz[0]);
        });
    };

    // Load answers from localStorage when component mounts
    useEffect(() => {
        if (email && quizid) {
            quizdata(email, quizid);
        }

        // Load answers from localStorage
        const storedAnswers = localStorage.getItem(`quizAnswers_${quizid}`);
        if (storedAnswers) {
            setAnserofQuiz(JSON.parse(storedAnswers)); // Parse and set the saved answers
        }
    }, [user, quizid]);

    const handleClickNumber = (index) => {
        setActiveINdex(index);
        setActive4quiz(0);

        // Check if the user is on the last question
        if (index === enrolquiz?.question?.length - 1) {
            setNext(true); // Set next to true when on the last question
        } else {
            setNext(false); // Set next to false for all other questions
        }
    };

    const handleChooseAnserw = (number) => {
        setActive4quiz(number);

        // Translate the answer to the corresponding option
        let transAns;
        if (number === 1) transAns = "A";
        else if (number === 2) transAns = "B";
        else if (number === 3) transAns = "C";
        else if (number === 4) transAns = "D";

        // Store the selected answer
        answerStorage(transAns);
    };

    const answerStorage = (transAns) => {
        // Store the selected answer in the answers array by activeIndex (question index)
        const updatedAnswers = [...answersofQuiz];
        updatedAnswers[activeIndex] = transAns;

        // Update the state with the selected answer for the current question
        setAnserofQuiz(updatedAnswers);

        // Save the answers to localStorage
        localStorage.setItem(`quizAnswers_${quizid}`, JSON.stringify(updatedAnswers));
    };


    // Check for pre-selected answers when rendering the options
    const isAnswerSelected = (index) => {
        return answersofQuiz[index];
    };




    const calculateScore = () => {
        let calculatedScore = 0;

        enrolquiz?.question?.forEach((item, index) => {
            if (answersofQuiz[index] === item.trueChoisevip.toUpperCase()) {
                calculatedScore += 1;
            }
        });

        setScore(calculatedScore); // Update the state (for UI purposes)
        return calculatedScore; // Return the score immediately for use
    };


    const trueChoices = enrolquiz?.question?.map((item) => item.trueChoisevip.toUpperCase()) || [];





    const results = trueChoices.map((answer, index) => {
        return answersofQuiz[index] === answer; // Returns true if correct, false otherwise
    });




    const results2 = trueChoices.map((answer, index) => {
        return answer; // Returns true if correct, false otherwise
    });



    const handleSumbit = () => {
        Swal.fire({
            title: "متاكد انك عاوز تسلم الامتحان ؟",
            text: "! مش هتقدر تعدل الاجابات تاني",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "تسليم الامتحان",
        }).then((result) => {
            if (result.isConfirmed) {
                const finalScore = calculateScore(); // Calculate the score immediately

                // Save the grade to the server
                const saveGrade = async () => {
                    try {
                        const response = await GlobalApi.SaveGradesOfQuiz(
                            email, user?.fullName, finalScore, enrolquiz.quiztitle, enrolquiz?.question?.length

                        );


                        // Notify the user of successful submission
                        Swal.fire({
                            title: "تم التسليم بنجاح!",
                            text: "انا فخور بيك انك حاولت مهما كانت النتيجة",
                            icon: "success",
                        });

                        setShowResults(true); // Show results page
                    } catch (error) {
                        console.error("Failed to save grades:", error);

                        Swal.fire({
                            title: "خطأ!",
                            text: "حدث خطأ أثناء حفظ النتائج. حاول مرة أخرى لاحقًا.",
                            icon: "error",
                        });
                    }
                };

                saveGrade(); // Call the save grade function
            }
        });
    };





    return (
        <div>
            {!showResults ? (
                <div className='bg-blod2-image cursor-default bg-cover rounded-xl max-sm:p-4 p-8 max-sm:m-2 m-4'>
                    <div className='backdrop-blur-2xl p-3 px-8 rounded-xl outline-dashed outline-white outline-2'>
                        <div className='flex justify-end'>
                            <h4 className='text-right max-sm:text-2xl font-arabicUI3 text-6xl bg-white/10 p-4 w-fit rounded-md justify-start flex text-white'>
                                <BiSolidPencil /> {enrolquiz.quiztitle}
                            </h4>
                        </div>
                        <div>
                            <div className='mt-10 grid grid-cols-11 max-md:grid-cols-4 max-sm:grid-cols-3 max-lg:grid-cols-5 max-xl:grid-cols-7 gap-3'>
                                {enrolquiz?.question?.map((item, index) => (
                                    <h2
                                        onClick={() => handleClickNumber(index)}
                                        className={`mb-7 max-sm:text-2xl cursor-pointer font-arabicUI3 text-4xl p-4 rounded-lg text-center hover:bg-white/40 duration-500 transition active:ring-4 select-none ${activeIndex === index ? "bg-gray-800 text-white scale-125 max-sm:m-0 h-fit mx-4" : "bg-white text-gray-800"}`}
                                        key={index}>
                                        {index + 1}
                                    </h2>
                                ))}
                            </div>
                            <h2 className={`mb-7 cursor-pointer font-arabicUI3 text-4xl max-sm:mt-6 p-4 rounded-lg max-sm:text-2xl text-center hover:bg-white/40 duration-500 transition active:ring-4 select-none bg-white text-gray-800`}>
                                {enrolquiz?.question && enrolquiz?.question[activeIndex] ? enrolquiz?.question[activeIndex]?.qus : 'No question available'}
                            </h2>
                            <div className='grid max-md:grid-cols-1 grid-cols-2'>
                                <h2 onClick={() => handleChooseAnserw(1)} className={`mb-7 cursor-pointer max-sm:text-2xl font-arabicUI3 text-4xl m-3 p-4 rounded-lg text-center hover:bg-white/40 duration-500 transition active:ring-4 select-none bg-gray-800 ${actind4quiz === 1 || isAnswerSelected(activeIndex) === "A" ? "bg-green-400 text-gray-800" : ""} text-white`}>
                                    {enrolquiz?.question && enrolquiz?.question[activeIndex] ? enrolquiz?.question[activeIndex]?.opationA : 'No question available'}
                                </h2>
                                <h2 onClick={() => handleChooseAnserw(2)} className={`mb-7 cursor-pointer  max-sm:text-2xl font-arabicUI3 text-4xl m-3 p-4 rounded-lg text-center hover:bg-white/40 duration-500 transition active:ring-4 select-none bg-gray-800 ${actind4quiz === 2 || isAnswerSelected(activeIndex) === "B" ? "bg-green-400 text-gray-800" : ""} text-white`}>
                                    {enrolquiz?.question && enrolquiz?.question[activeIndex] ? enrolquiz?.question[activeIndex]?.opationB : 'No question available'}
                                </h2>
                                <h2 onClick={() => handleChooseAnserw(3)} className={`mb-7 cursor-pointer max-sm:text-2xl  font-arabicUI3 text-4xl m-3 p-4 rounded-lg text-center hover:bg-white/40 duration-500 transition active:ring-4 select-none bg-gray-800 ${actind4quiz === 3 || isAnswerSelected(activeIndex) === "C" ? "bg-green-400 text-gray-800" : ""} text-white`}>
                                    {enrolquiz?.question && enrolquiz?.question[activeIndex] ? enrolquiz?.question[activeIndex]?.opationC : 'No question available'}
                                </h2>
                                <h2 onClick={() => handleChooseAnserw(4)} className={`mb-7 cursor-pointer max-sm:text-2xl font-arabicUI3 text-4xl m-3 p-4 rounded-lg text-center hover:bg-white/40 duration-500 transition active:ring-4 select-none bg-gray-800 ${actind4quiz === 4 || isAnswerSelected(activeIndex) === "D" ? "bg-green-400 text-gray-800" : ""} text-white`}>
                                    {enrolquiz?.question && enrolquiz?.question[activeIndex] ? enrolquiz?.question[activeIndex]?.opationD : 'No question available'}
                                </h2>

                            </div>
                            <div className='flex gap-3'>
                                <h2 onClick={() => {
                                    if (activeIndex < enrolquiz?.question?.length - 1) {
                                        setActiveINdex(activeIndex + 1);
                                        setActive4quiz(0);
                                    } else {
                                        setNext(true);
                                    }
                                }} className={`mb-7 cursor-pointer max-sm:text-2xl max-sm:p-4 w-fit font-arabicUI3 text-5xl m-3 p-8 mx-auto rounded-lg text-center hover:bg-white/40 duration-500 transition active:ring-4 select-none bg-white text-gray-800`}>
                                    {!next ? "السوال التالي" : "الأسئلة خلصت"}
                                </h2>

                                {next && (
                                    <h4 onClick={() => handleSumbit()} className={`mb-7 max-sm:p-2  max-sm:text-2xl cursor-pointer w-fit font-arabicUI3 text-5xl m-3 p-8 mx-auto rounded-lg text-center hover:bg-white/40 duration-500 transition active:ring-4 select-none bg-green-400 text-gray-800`}>
                                        تسليم الامتحان
                                    </h4>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='bg-blod2-image cursor-default bg-cover rounded-xl p-8 m-4'>
                    <div className=' backdrop-blur-3xl rounded-xl  p-6'>
                        <h1 className='font-arabicUI3 text-6xl max-sm:text-3xl text-center text-white'>نتيجتك: {score}/{enrolquiz?.question?.length}</h1>

                        <div className=' m-6'>
                            <ProgCircle nsaba={(score / enrolquiz?.question?.length) * 100}></ProgCircle>

                        </div>

                        <div className=' grid max-sm:grid-cols-1 grid-cols-3'>
                            {enrolquiz?.question?.map((item, index) => (
                                <div key={index}>
                                    <h2
                                        onClick={() => handleClickNumber(index)}
                                        className={` cursor-pointer max-sm:text-lg font-arabicUI3 m-5 text-4xl p-4 rounded-lg text-center hover:bg-white/40 duration-500 transition h-fit active:ring-4 select-none  bg-white text-gray-800 `}
                                    >
                                        {item.qus}
                                    </h2>
                                    {(trueChoices[index] === "A" || answersofQuiz[index] === "A") && (
                                        <h2
                                            onClick={() => handleClickNumber(index)}
                                            className={` cursor-pointer font-arabicUI3 m-5 text-xl p-4 rounded-lg text-center hover:bg-white/40 duration-500 transition h-fit active:ring-4 select-none ${trueChoices[index] === "A" ? "bg-green-500 text-white " : "bg-red-500 text-white"}`}
                                        >
                                            {item.opationA}
                                        </h2>
                                    )}
                                    {(trueChoices[index] === "B" || answersofQuiz[index] === "B") && (
                                        <h2
                                            onClick={() => handleClickNumber(index)}
                                            className={` cursor-pointer font-arabicUI3 m-5 text-xl p-4 rounded-lg text-center hover:bg-white/40 duration-500 transition h-fit active:ring-4 select-none ${trueChoices[index] === "B" ? "bg-green-500 text-white " : "bg-red-500 text-white"}`}
                                        >
                                            {item.opationB}
                                        </h2>
                                    )}
                                    {(trueChoices[index] === "C" || answersofQuiz[index] === "C") && (
                                        <h2
                                            onClick={() => handleClickNumber(index)}
                                            className={` cursor-pointer font-arabicUI3 m-5 text-xl p-4 rounded-lg text-center hover:bg-white/40 duration-500 transition h-fit active:ring-4 select-none ${trueChoices[index] === "C" ? "bg-green-500 text-white " : " bg-red-500 text-white"}`}
                                        >
                                            {item.opationC}
                                        </h2>
                                    )}
                                    {(trueChoices[index] === "D" || answersofQuiz[index] === "D") && (
                                        <h2
                                            onClick={() => handleClickNumber(index)}
                                            className={` cursor-pointer font-arabicUI3 m-5 text-xl p-4 rounded-lg text-center hover:bg-white/40 duration-500 transition h-fit active:ring-4 select-none ${trueChoices[index] === "D" ? "bg-green-500 text-white " : " bg-red-500 text-white"}`}
                                        >
                                            {item.opationD}
                                        </h2>)}


                                </div>


                            ))}

                        </div>


                        <Link href='/'>
                            <div className=' text-7xl max-sm:text-2xl text-white p-5 flex justify-center mx-auto m-6 font-arabicUI2 bg-white/20 w-fit  rounded-xl outline-1 outline-white outline-dashed'>
                                <h1>الصفحة الرئيسية</h1>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizData;
