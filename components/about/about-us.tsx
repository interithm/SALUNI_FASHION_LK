import React from 'react';
import Image from 'next/image';
import { Mail, Instagram } from 'lucide-react';
import profile from '../../assests/images/profile.jpg'; // Fixed typo

const AboutPage = () => {
    const skills = [
        "Frontend Development",
        "React.js",
        "Next.js",
        "Tailwind CSS",
        "UI/UX Design"
    ];

    const socialLinks = [
        { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/saluni_vishara", label: "Instagram" },
        { icon: <Mail className="w-5 h-5" />, href: "mailto:your.email@example.com", label: "Email" }
    ];

    return (
        <section className="min-h-screen  bg-white text-gray-800">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid items-center grid-cols-1 gap-12 md:grid-cols-2">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                Hey 👋 I&apos;m <span className="text-blue-500">Saluni Vishara</span>
                            </h1>
                            <div className="h-1 w-20 bg-blue-500" />
                        </div>

                        <div className="space-y-6">
                            <p className="text-lg leading-relaxed text-gray-600">
                                A passionate individual with a love for creativity and design. I specialize in crafting meaningful and engaging experiences that leave a lasting impression.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">Let&apos;s Connect</h3>
                            <div className="flex items-center space-x-4">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-600 transition-colors duration-200 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600"
                                        aria-label={link.label}
                                    >
                                        {link.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Image Section */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-72 h-72 bg-blue-100 rounded-full blur-3xl" />
                        </div>
                        <div className="relative">
                            <Image
                                className="relative object-cover w-full max-w-lg mx-auto rounded-2xl shadow-lg"
                                src={profile}
                                alt="Saluni Vishara"
                                width={500}
                                height={500}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPage;
