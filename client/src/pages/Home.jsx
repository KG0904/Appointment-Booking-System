import { Link } from 'react-router-dom';
import { FaUserMd, FaCalendarCheck, FaCreditCard, FaShieldAlt, FaClock, FaStar, FaHeartbeat, FaArrowRight } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const features = [
    { icon: <FaUserMd />, title: 'Expert Doctors', desc: 'Access top specialists across 20+ medical fields with verified credentials.' },
    { icon: <FaCalendarCheck />, title: 'Easy Booking', desc: 'Book appointments in seconds with our intuitive scheduling system.' },
    { icon: <FaCreditCard />, title: 'Secure Payments', desc: 'Pay consultation fees safely online with Stripe integration.' },
    { icon: <FaShieldAlt />, title: 'Data Privacy', desc: 'Your medical data is encrypted and protected with enterprise security.' },
    { icon: <FaClock />, title: '24/7 Access', desc: 'Browse doctors and manage appointments anytime, anywhere.' },
    { icon: <FaStar />, title: 'Trusted Reviews', desc: 'Make informed decisions with ratings from real patients.' },
];

const specializations = [
    'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Dentistry',
];

const Home = () => {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                            <FaHeartbeat className="text-accent-400" /> Trusted by 10,000+ patients
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                            Your Health,
                            <br />
                            <span className="text-accent-400">Our Priority</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                            Find the best doctors, book appointments instantly, and take control of your healthcare journey — all in one platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/doctors" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-bold py-3.5 px-8 rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                                <FiSearch /> Find a Doctor
                            </Link>
                            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold py-3.5 px-8 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all">
                                Get Started <FaArrowRight className="text-sm" />
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="#f8fafc" />
                    </svg>
                </div>
            </section>

            {/* Stats */}
            <section className="py-4 -mt-4 relative z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { num: '500+', label: 'Doctors' },
                            { num: '10K+', label: 'Patients' },
                            { num: '25K+', label: 'Appointments' },
                            { num: '20+', label: 'Specializations' },
                        ].map((stat, i) => (
                            <div key={i} className="card text-center py-6 px-4 hover:-translate-y-1">
                                <p className="text-2xl md:text-3xl font-extrabold gradient-text">{stat.num}</p>
                                <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                            Why Choose <span className="gradient-text">MediBook</span>?
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            We make healthcare accessible, affordable, and convenient for everyone.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="card p-7 group hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Specializations */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                            Browse by <span className="gradient-text">Specialization</span>
                        </h2>
                        <p className="text-gray-500">Find the right specialist for your needs</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {specializations.map((spec, i) => (
                            <Link key={i} to={`/doctors?specialization=${spec}`}
                                className="card p-5 text-center group hover:-translate-y-1 cursor-pointer">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center text-2xl mb-3 group-hover:from-primary-100 group-hover:to-purple-100 transition-all">
                                    🩺
                                </div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">{spec}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="card p-10 md:p-14 bg-gradient-to-br from-primary-600 to-purple-700 border-none">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                            Ready to Book Your Appointment?
                        </h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto">
                            Join thousands of patients who trust MediBook for their healthcare needs.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-bold py-3.5 px-8 rounded-xl hover:bg-gray-100 transition-all">
                                Create Account
                            </Link>
                            <Link to="/doctors" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold py-3.5 px-8 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all">
                                Browse Doctors
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
