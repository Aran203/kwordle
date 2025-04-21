import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const BACKEND_URL = import.meta.env.VITE_API_URL

type LetterStatus = "correct" | "present" | "absent";
type ColoredLetter = { letter: string; status: LetterStatus };

function processGuess(guess: string[], word: string): ColoredLetter[] {
    return guess.map((letter, i) => {
        if (letter === word[i].toLowerCase()) {
            return { letter, status: "correct" };
        } else if (word.toLowerCase().includes(letter)) {
            return { letter, status: "present" };
        } else {
            return { letter, status: "absent" };
        }
    });
}

export default function HomePage() {
    const [wordOfDay, setWordOfDay] = useState<string>("Kohli")
    const [validWord, setValidWord] = useState<boolean>(true)

    // const [numGuesses, setNumGuesses] = useState<number | null>(null)
    const [bouncedh, setBouncedh] = useState<number | null>(null);

    const [guessed, setGuessed] = useState<boolean>(false)
    const [shakeRow, setShakeRow] = useState(false)
    const [showMessage, setShowMessage] = useState(false)

    const { user, isSignedIn } = useUser();


    const [guesses, setGuesses] = useState<ColoredLetter[][]>([]);
    const [currentGuess, setCurrentGuess] = useState<string[]>([]);


    const guessMessages: Record<number, string> = {
        1: "MIND-READER?",
        2: "TOO EASY!",
        3: "NICE GUESS!",
        4: "GOOD STUFF!",
        5: "CLOSE CALL!",
        6: "PHEW!"
    };


    useEffect(() => {
        const fetchWord = async() => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/getWordOfDay`)
                
                if (!response.ok){
                    const errorMessage = await response.text()
                    throw new Error(errorMessage)
                }
    
                const data = await response.json()
                setWordOfDay(data)
            } catch (err) {
                console.log(err)
            }
        }

        fetchWord()
    }, [])

    // useEffect(() => {
    //     console.log(wordOfDay)
    // }, [wordOfDay])

    
    useEffect(() => {
        if (guesses.length >= 6 || guessed) return;

        const handleKeyDown = async(e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            if (key === "backspace") {
                setCurrentGuess((prev) => prev.slice(0, -1));

            } else if (key === "enter") {
                let valid = true

                try {
                    const response = await fetch(`${BACKEND_URL}/api/validate_word`,  {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({word: currentGuess.join("")})
                        }
                    )

                    const data = await response.json();
                    
                    if (data === "invalid"){
                        valid = false
                    }

                } catch (err) {
                    
                }

                if (currentGuess.length === 5 && valid) {
                    const colored = processGuess(currentGuess, wordOfDay);

                    if (currentGuess.join("") === wordOfDay.toLowerCase()) {
                        setGuessed(true);
                        // setNumGuesses(guesses.length)

                        setShowMessage(true);
                        setBouncedh(guesses.length);
                        setTimeout(() => setShowMessage(false), 2500); 
                        setTimeout(() => setBouncedh(null), 2500); 
                    }

                    if (isSignedIn && user?.id) {
                        try {
                            await fetch(`${BACKEND_URL}/api/submit`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    user: user.id,
                                    guess: currentGuess.join(""),
                                    isCorrect: currentGuess.join("") === wordOfDay.toLowerCase()
                                }),
                            });
                        } catch (err) {
                            console.error("Error submitting guess:", err);
                        }
                    }
                
                    setGuesses((prev) => [...prev, colored]);
                    setCurrentGuess([]);
                } else {

                    if (!valid) {
                        setValidWord(false);
                        setTimeout(() => setValidWord(true), 1000); 
                    }

                    setShakeRow(true);
                    setTimeout(() => setShakeRow(false), 600);
                }

            } else if (/^[a-z]$/.test(key)) {
                if (currentGuess.length < 5) {
                    setCurrentGuess((prev) => [...prev, key]);
                }

            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentGuess, guesses]);



    return (
        <div className="flex flex-col items-center mt-20 relative">
            {guesses.map((guess, i) => {
                const isBouncing = bouncedh === i;
                return <WordleRow key={i} letters={guess} bounce={isBouncing} />;            
            })}

            {guesses.length < 6 && (
                <WordleRow letters={currentGuess} shake={shakeRow}/>
            )}
            {Array.from({ length: 6 - guesses.length - 1 }).map((_, i) => (
                <WordleRow key={`empty-${i}`} letters={[]} />
            ))}

            {!guessed && guesses.length == 6 && (
                <div className="absolute -top-16 bg-black text-white px-4 py-2 rounded shadow-lg text-md font-semibold">
                    {wordOfDay.toUpperCase()}
                </div>
            )}

            {showMessage && (
                <div className="absolute -top-16 bg-black text-white px-4 py-2 rounded shadow-lg text-md font-semibold">
                    {guessMessages[guesses.length]}
                </div>
            )}

            {!validWord && (
                <div className="absolute -top-16 bg-black text-white px-4 py-2 rounded shadow-lg text-md font-semibold">
                    Not a valid word
                </div>
            )}

            {guessed && (
                <div className=" mt-2 text-black px-4 py-4 rounded shadow-sm text-md font-semibold">
                    THANKS FOR PLAYING! SEE YOU TOM
                </div>
            )}

            

        </div>
    );
}

const WordleTile = ({letter, status}: { letter: string; status?: LetterStatus}) => {
    const getBgColor = () => {
        switch (status) {
            case "correct":
                return "bg-green-500 text-white border-green-500";
            case "present":
                return "bg-yellow-500 text-white border-yellow-500";
            case "absent":
                return "bg-gray-400 text-white border-gray-400";
            default:
                return "border-slate-300";
        }
    };

    return (
        <div
            className={`w-14 h-14 border-2 flex items-center justify-center text-3xl font-bold uppercase rounded-sm
            ${status ? "" : letter ? "border-slate-900" : ""} ${getBgColor()} ${letter ? "animate-pop" : ""}`}
        >
            {letter}
        </div>
    );
};

const WordleRow = ({ letters, shake = false, bounce = false}: { letters: (ColoredLetter | string)[]; shake?: boolean; bounce?: boolean}) => {
    return (
        <div
            className={`flex gap-1 justify-center mb-1.5 ${
                shake ? "animate-shake" : ""} ${bounce ? "animate-bounce" : ""}
            }`}
        >
            {Array.from({ length: 5 }).map((_, i) => {
                const letterObj = letters[i];
                if (typeof letterObj === "string") {
                    return <WordleTile key={i} letter={letterObj} />;
                } else {
                    return (
                        <WordleTile
                            key={i}
                            letter={letterObj?.letter || ""}
                            status={letterObj?.status}
                        />
                    );
                }
            })}
        </div>
    );
};


