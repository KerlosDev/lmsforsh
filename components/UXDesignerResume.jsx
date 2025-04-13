import { motion } from 'framer-motion';
import { useState } from 'react';

const UXDesignerResume = () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-5xl mx-auto mb-20"
            >
                <div className="text-center">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Jane Designer
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">UI/UX Designer & Design Systems Specialist</p>
                </div>
            </motion.section>

            {/* About Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto mb-20 p-8 bg-white rounded-2xl shadow-lg"
            >
                <h2 className="text-3xl font-semibold mb-6">About Me</h2>
                <p className="text-gray-600 leading-relaxed">
                    Passionate UI/UX designer with 5+ years of experience crafting intuitive digital experiences.
                    Specialized in design systems, user research, and creating beautiful, functional interfaces.
                </p>
            </motion.section>

            {/* Skills Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto mb-20"
            >
                <h2 className="text-3xl font-semibold mb-8">Skills & Tools</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['Figma', 'Adobe XD', 'Sketch', 'Design Systems', 'User Research', 'Prototyping', 'UI Design', 'UX Design'].map((skill) => (
                        <motion.div
                            key={skill}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                        >
                            <span className="text-gray-800">{skill}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Projects Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto mb-20"
            >
                <h2 className="text-3xl font-semibold mb-8">Featured Projects</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {[1, 2].map((project) => (
                        <motion.div
                            key={project}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl overflow-hidden shadow-lg"
                        >
                            <div className="h-48 bg-gray-200"></div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">Project {project}</h3>
                                <p className="text-gray-600">A brief description of the project and your role in it.</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Experience Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto mb-20"
            >
                <h2 className="text-3xl font-semibold mb-8">Experience</h2>
                <div className="space-y-8">
                    {[
                        { role: 'Senior UI/UX Designer', company: 'Tech Corp', period: '2020 - Present' },
                        { role: 'UI Designer', company: 'Design Agency', period: '2018 - 2020' },
                    ].map((job, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ x: 10 }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-xl font-semibold">{job.role}</h3>
                            <p className="text-purple-600 mt-1">{job.company}</p>
                            <p className="text-gray-500 mt-1">{job.period}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center"
            >
                <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
                <div className="flex justify-center space-x-6">
                    {['Email', 'LinkedIn', 'Dribbble', 'Behance'].map((platform) => (
                        <motion.a
                            key={platform}
                            whileHover={{ scale: 1.1 }}
                            href="#"
                            className="text-purple-600 hover:text-purple-700 transition-colors"
                        >
                            {platform}
                        </motion.a>
                    ))}
                </div>
            </motion.section>
        </div>
    );
};

export default UXDesignerResume;