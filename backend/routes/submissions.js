import Submission from '../models/submissions.js'; 


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

export {
    addSubmission
} 
