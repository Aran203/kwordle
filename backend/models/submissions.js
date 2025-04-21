import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true, 
    },
    guess: {
        type: String,
        required: true, 
    },
    isCorrect: {
        type: Boolean,
        default: false, 
    },
    guessDate: {
        type: Date,
        default: Date.now, 
    },
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
