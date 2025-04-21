import { signInWithGoogle, auth } from "../firebase-config";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";

export default function Login() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
        });
        return unsubscribe;
    }, []);

    return (
        <div>
            {user ? (
                <div className="flex flex-row">
                    <div className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors mr-4">
                        <User/>
                        <p> {user.displayName}</p>
                    </div>
                    <button
                        onClick={() => auth.signOut()}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    <User/>
                    <button onClick={signInWithGoogle}>Sign in</button>
                </div>
            )}
        </div>
    );
}
