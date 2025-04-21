import {BarChart2} from "lucide-react"
import Login from "./Login"
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";


interface NavItemProps {
    icon: React.ReactNode
    label: string
    onClick?: () => void
}


export default function Navbar() {
    
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">KWORDLE</h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        <NavItem icon={<BarChart2 className="w-5 h-5" />} label="Statistics" />
                        {/* <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" /> */}
                        
                        {/* <div className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                           
                        </div> */}
                        <Login/>
                                            
                    </div>

                </div>
            </div>
        </nav>
    )
}


  
const NavItem = ({ icon, label }: NavItemProps) => {
return (
    <button
    // onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
    >
    {icon}
    <span className="hidden md:inline">{label}</span>
    </button>
)
}