import { ShoppingBag, Phone, Mail, MapPin, Globe, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                
                {/* Brand Section */}
                <div className="space-y-6">
                    <Link to="/" className="text-2xl font-black text-white flex items-center gap-3">
                        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg ring-4 ring-indigo-500/20">
                            <ShoppingBag size={24} />
                        </div>
                        दिनेश बर्तन भंडार
                    </Link>
                    <p className="text-sm leading-relaxed text-gray-400 font-medium">
                        Shadi, party aur kisi bhi event ke liye behtareen quality ke bartan kiraye (किराये) par milte hain. Cleaning aur hygiene hamari zimmedari.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition text-white"><Globe size={18} /></a>
                        <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition text-white"><Send size={18} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Explore</h3>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link to="/" className="hover:text-indigo-400 transition">Home</Link></li>
                        <li><Link to="/utensils" className="hover:text-indigo-400 transition">Bartan Stock</Link></li>
                        <li><Link to="/register" className="hover:text-indigo-400 transition">Join Community</Link></li>
                        <li><Link to="/login" className="hover:text-indigo-400 transition">Login</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6 tracking-wide">User Services</h3>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link to="/my-bookings" className="hover:text-indigo-400 transition">Booking Status</Link></li>
                        <li><Link to="/cart" className="hover:text-indigo-400 transition">Shopping Bag</Link></li>
                        <li><a href="#" className="hover:text-indigo-400 transition">Help & Support</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Sampark Karein</h3>
                    <ul className="space-y-4 text-sm font-medium">
                        <li className="flex gap-3 items-center">
                            <Phone size={18} className="text-indigo-500" /> +91 95460 52856
                        </li>
                        <li className="flex gap-3 items-center">
                            <Mail size={18} className="text-indigo-500" /> dineshbartan@gmail.com
                        </li>
                        <li className="flex gap-3 items-start leading-relaxed">
                            <MapPin size={18} className="text-indigo-500 mt-1 shrink-0" />
                            Chainpur Hata, Bihar
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-6 border-t border-gray-800 mt-16 pt-8 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                &copy; {new Date().getFullYear()} दिनेश बर्तन भंडार. Developed with Excellence.
            </div>
        </footer>
    );
};

export default Footer;
