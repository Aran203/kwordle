import { useState } from "react";
import { BarChart2 } from "lucide-react";
import Login from "./Login";
import StatisticsModal from "./Stats";
import { getAuth } from "firebase/auth";


const BACKEND_URL = import.meta.env.VITE_API_URL


export default function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState({ solves: 0, streak: 0 });
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const fetchStats = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/stats`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user: currentUser?.uid }),
            });
            const data = await res.json();
            setStats({ solves: data.solves, streak: data.streak });
        } catch (err) {
            console.error("Error fetching stats", err);
        }
    };

    const openModal = () => {
        fetchStats();
        setIsModalOpen(true);
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            KWORDLE
                        </h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        <NavItem
                            icon={<BarChart2 className="w-5 h-5" />}
                            label="Statistics"
                            onClick={openModal}
                        />
                        <Login />
                    </div>
                </div>
            </div>

            <StatisticsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                stats={stats}
            />
        </nav>
    );
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

const NavItem = ({ icon, label, onClick }: NavItemProps) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
    >
        {icon}
        <span className="hidden md:inline">{label}</span>
    </button>
);
