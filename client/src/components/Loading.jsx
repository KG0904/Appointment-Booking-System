import { FaHeartbeat } from 'react-icons/fa';

const Loading = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center animate-pulse-slow shadow-2xl shadow-primary-500/30">
                    <FaHeartbeat className="text-white text-2xl" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 animate-ping opacity-20" />
            </div>
            <p className="text-gray-400 font-medium animate-pulse">Loading...</p>
        </div>
    );
};

export default Loading;
