import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiStar, FiClock, FiDollarSign } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';
import { getDoctors } from '../services/api';
import Loading from '../components/Loading';

const DoctorListing = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [searchParams] = useSearchParams();
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const specializations = [
        'All', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
        'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Dentistry', 'General',
    ];

    useEffect(() => {
        const spec = searchParams.get('specialization');
        if (spec) setSpecialization(spec);
    }, [searchParams]);

    useEffect(() => {
        fetchDoctors();
    }, [specialization, currentPage]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const params = { page: currentPage, limit: 9 };
            if (specialization && specialization !== 'All') params.specialization = specialization;
            if (search) params.search = search;
            const res = await getDoctors(params);
            setDoctors(res.data.doctors);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchDoctors();
    };

    return (
        <div className="min-h-screen bg-gray-50/50 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-700 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-white mb-2">Find Your Doctor</h1>
                    <p className="text-white/70">Browse our network of experienced specialists</p>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-xl">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or specialization..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm border-0 focus:ring-4 focus:ring-white/30 outline-none text-gray-800 placeholder:text-gray-400"
                            />
                        </div>
                        <button type="submit" className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-thin">
                    <FiFilter className="text-gray-400 flex-shrink-0" />
                    {specializations.map((spec) => (
                        <button
                            key={spec}
                            onClick={() => { setSpecialization(spec === 'All' ? '' : spec); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${(spec === 'All' && !specialization) || specialization === spec
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {spec}
                        </button>
                    ))}
                </div>

                {/* Doctor Cards */}
                {loading ? (
                    <Loading />
                ) : doctors.length === 0 ? (
                    <div className="text-center py-20">
                        <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Doctors Found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.map((doctor) => (
                                <Link key={doctor._id} to={`/doctors/${doctor._id}`} className="card group hover:-translate-y-1">
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-400/25">
                                                <span className="text-white text-xl font-bold">
                                                    {doctor.userId?.name?.charAt(0)?.toUpperCase() || 'D'}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                                                    Dr. {doctor.userId?.name || 'Unknown'}
                                                </h3>
                                                <p className="text-primary-600 text-sm font-medium">{doctor.specialization}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <FiStar className="text-amber-500 text-xs" />
                                                    <span className="text-xs text-gray-500">{doctor.rating || '4.5'} rating</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-4 line-clamp-2">{doctor.bio || 'Experienced medical professional dedicated to providing quality healthcare.'}</p>
                                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <FiClock className="text-accent-500" />
                                                <span>{doctor.experience} yrs exp</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm font-semibold text-accent-700 bg-accent-50 px-3 py-1 rounded-lg">
                                                <FiDollarSign />
                                                <span>₹{doctor.consultationFee}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-10">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === i + 1
                                                ? 'bg-primary-600 text-white shadow-lg'
                                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DoctorListing;
