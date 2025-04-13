'use client'
import { useUser } from '@clerk/nextjs';
import React from 'react';
import { FaUserGraduate, FaEnvelope } from 'react-icons/fa';

const UserInfoCard = () => {
    const { user } = useUser();

    if (!user) return null;

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
            <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                <FaUserGraduate className="text-blue-400" />
                معلومات الطالب
            </h3>
            <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <img
                        src={user.imageUrl || '/default-avatar.png'}
                        alt="profile"
                        className="w-12 h-12 rounded-full border-2 border-blue-500"
                    />
                    <div>
                        <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                        <div className="flex items-center gap-2 text-gray-400">
                            <FaEnvelope className="text-sm" />
                            <span className="text-sm">{user.primaryEmailAddress?.emailAddress}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoCard;
