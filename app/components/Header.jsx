'use client'
import React from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { UserButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { PiStudentBold } from "react-icons/pi";

const Header = () => {
    const { user } = useUser()
    const router = useRouter()

    const handleSignUp = () => {
        router.push("/sign-up")
    }
    const handleSignIn = () => {
        router.push("/sign-in")
    }

    return (
        <div className="flex flex-col  md:flex-row items-center justify-between gap-4 p-4">
            
            {/* Theme Toggle */}

            
            <div className="flex  items-center  gap-4">
                <ThemeToggle />
                <Link href="/subscriptions">
                    <h5 className="flex text-7xl justify-center mr-5 drop-shadow-xl dark:text-white text-slate-850">
                        <PiStudentBold />
                    </h5>
                </Link>

                {/* User Section */}
                {user ? (
                    <div className="flex  items-center place-items-center gap-4">
                        <div className='  place-items-center scale-150'>
                            <div className="  flex  scale-150">
                                <UserButton className=" scale-150" />
                            </div>

                        </div>

                    
                    </div>
                ) : (
                    <div className="flex flex-wrap  justify-center gap-4">

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Sign In Button */}
                            <div className="flex items-center bg-red-500 max-sm:text-xl text-3xl p-4 h-16 rounded-xl text-white font-arabicUI shadow-xl shadow-red-600/40 outline-dashed outline-red-500 outline-offset-4">
                                <button onClick={handleSignIn}>تسجيل الدخول</button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 448 512">
                                    <path
                                        fill="#fff"
                                        d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16v-24c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16v-40c0-29.8 20.4-54.9 48-62v-57.1q-9-.9-18.3-.9h-91.4q-9.3 0-18.3.9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7zM144 448a24 24 0 1 0 0-48a24 24 0 1 0 0 48"
                                    />
                                </svg>
                            </div>
                            {/* Sign Up Button */}
                            <div className="flex items-center justify-between bg-blue-500 max-sm:text-xl text-white text-3xl p-4 h-16 rounded-xl font-arabicUI shadow-xl shadow-blue-600/40 outline-dashed outline-blue-400 outline-offset-4">
                                <button onClick={handleSignUp}>انشاء حساب</button>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    viewBox="0 0 36 36"
                                >
                                    <path
                                        fill="#fff"
                                        d="M32.16 19.63A5.55 5.55 0 0 0 27.42 17H10.06a4.36 4.36 0 0 1-3.67-2a4.07 4.07 0 0 1-.19-4.13l3.62-7l1.42 1.63l-2.74 5.3l8.84-5.66a.91.91 0 0 1 1 1.53l-10.5 6.71a2 2 0 0 0 .24.52a2.28 2.28 0 0 0 1.65 1l8.38-5.4a.91.91 0 0 1 1 1.52L13 14.94h7.8l2.41-4.82a5.6 5.6 0 0 0-5-8.12H9a1 1 0 0 0-.9.56l-4.22 8.33a5.6 5.6 0 0 0 5 8.12h7.65l-3.43 6.87a5.6 5.6 0 0 0 5 8.12h9.28a1 1 0 0 0 .93-.65l4.14-8.24a5.58 5.58 0 0 0-.29-5.48m-14.41 5.94a.91.91 0 0 1 .25-1.26l6-3.88A.91.91 0 1 1 25 22l-6 3.88a.91.91 0 0 1-1.26-.27ZM29 24.34l-9 5.78a.91.91 0 1 1-1-1.53l9-5.78a.91.91 0 1 1 1 1.53"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Section */}
            <Link href='/' className=''>
                <div className=' max-md:hidden flex place-items-center  dark:text-slate-400 text-4xl   p-3 pb-6 rounded-t-2xl  rounded-l-2xl drop-shadow-slate'>


                    <svg className="block animate-pulse  mr-3 -mb-3  dark:hidden" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                        <path fill="#1e293b" d="M2 12c0-4.714 0-7.07 1.464-8.535c1.177-1.177 2.93-1.408 6.017-1.454v2.05c0 .556-.476.998-.96 1.273c-.915.518-1.56 1.706-1.56 2.757a2.519 2.519 0 1 0 5.039 0a2.519 2.519 0 0 0 5.038 0c0-1.051-.644-2.24-1.559-2.757c-.484-.275-.96-.717-.96-1.273V2.01c3.088.046 4.84.277 6.016 1.454C22 4.929 22 7.286 22 12s0 7.071-1.465 8.536c-1.171 1.171-2.914 1.406-5.978 1.452v-2.003c0-.557.476-.999.96-1.273c.915-.518 1.559-1.706 1.559-2.758a2.519 2.519 0 0 0-5.038 0a2.519 2.519 0 0 0-5.038 0c0 1.052.644 2.24 1.558 2.758c.485.274.961.716.961 1.273v2.005c-3.111-.045-4.873-.273-6.055-1.454C2 19.07 2 16.714 2 12" />
                    </svg>
                    <svg className="hidden animate-pulse  mr-3 -mb-3  dark:block" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                        <path fill="#94a3b8" d="M2 12c0-4.714 0-7.07 1.464-8.535c1.177-1.177 2.93-1.408 6.017-1.454v2.05c0 .556-.476.998-.96 1.273c-.915.518-1.56 1.706-1.56 2.757a2.519 2.519 0 1 0 5.039 0a2.519 2.519 0 0 0 5.038 0c0-1.051-.644-2.24-1.559-2.757c-.484-.275-.96-.717-.96-1.273V2.01c3.088.046 4.84.277 6.016 1.454C22 4.929 22 7.286 22 12s0 7.071-1.465 8.536c-1.171 1.171-2.914 1.406-5.978 1.452v-2.003c0-.557.476-.999.96-1.273c.915-.518 1.559-1.706 1.559-2.758a2.519 2.519 0 0 0-5.038 0a2.519 2.519 0 0 0-5.038 0c0 1.052.644 2.24 1.558 2.758c.485.274.961.716.961 1.273v2.005c-3.111-.045-4.873-.273-6.055-1.454C2 19.07 2 16.714 2 12" />
                    </svg>
                    <h2 className=" dark:text-slate-400 font-arabicUI text-4xl text-slate-800 ">احمد السيد</h2>
                </div>
            </Link>
        </div>
    )
}

export default Header
