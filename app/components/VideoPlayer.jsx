import React from 'react'

const VideoPlayer = ({ videoinfo }) => {

    
    return (
        <div>
            <video
                width={1000}
                className='my-6 rounded-2xl shadow-black shadow-xl'
                height={500}
                controls
            >
                <source
                    type='video/mp4'
                    src={videoinfo}
                />
                Your browser does not support the video tag.
            </video>

        </div>
    )
}

export default VideoPlayer