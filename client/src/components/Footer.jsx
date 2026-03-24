import { FaHeartbeat, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                                <FaHeartbeat className="text-white text-lg" />
                            </div>
                            <span className="text-xl font-bold text-white">MediBook</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                            Book appointments with top doctors online. Find specialists, schedule visits,
                            and manage your health — all from the comfort of your home.
                        </p>
                        <div className="flex gap-3 mt-4">
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                                    <Icon className="text-sm" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
                            <li><Link to="/doctors" className="hover:text-primary-400 transition-colors">Find Doctors</Link></li>
                            <li><Link to="/register" className="hover:text-primary-400 transition-colors">Register</Link></li>
                            <li><Link to="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>📧 support@medibook.com</li>
                            <li>📞 +91 98765 43210</li>
                            <li>📍 New Delhi, India</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} MediBook. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
