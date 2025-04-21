import Submission from '../models/submissions.js'; 
import Word from '../models/words.js';


const addSubmission = async(req, res) => {
    const { user, guess, isCorrect } = req.body;

    try {
        const newSubmission = new Submission({
            user,
            guess,
            isCorrect,
        });

        await newSubmission.save();
        res.status(201).json(newSubmission);
    } catch (error) {
        res.status(400).json({ message: 'Error creating submission', error });
    }
}



const processGuess = (guess, word) => {
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

const getSubmisssions = async (req, res) => {
    const { user, date } = req.body;

    let word = await Word.findOne().sort({ date: -1 }).limit(1); 
    
    if (!word){
        res.status(200).json({})
    }

    if (!user || !date) {
        return res.status(400).json({ error: 'Missing user or date query parameter' });
    }

    const start = new Date(date);
    const end = new Date(date + "T23:59:59.999Z");


    try {
        const submissions = await Submission.find({
            user,
            guessDate: {
                $gte: start,
                $lte: end,
            },
        }).sort({ guessDate: 1 });

        word = word.word

        const prevs = submissions.map(submission => {
            const status = processGuess(submission.guess.split(''), word)
            return status
        })

        const solved = submissions.map(submissions => {
            return submissions.isCorrect
        })

        // console.log(submissions)
        // console.log(solved)
        // console.log(prevs)
        

        res.status(200).json({ submissions: prevs, status:  solved.some(value => value == true)});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve submissions' });
    }
};


const userStats = async(req, res) =>  {

    const { user } = req.body;

    if (!user) return res.status(400).json({ error: "Missing user ID" });

    try {
        const submissions = await Submission.find({ user });

        const solvedDates = new Set(
            submissions.filter((s) => s.isCorrect).map((s) => new Date(s.guessDate).toDateString())
        );

        let streak = 0;
        let current = new Date();
        current.setHours(0, 0, 0, 0);

        while (solvedDates.has(current.toDateString())) {
            streak++;
            current.setDate(current.getDate() - 1);
        }

        res.status(200).json({ solves: solvedDates.size, streak });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}



export {
    addSubmission, getSubmisssions, userStats
} 

