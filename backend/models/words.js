import mongoose from 'mongoose';

const wordOfDaySchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Word = mongoose.model('WordOfDay', wordOfDaySchema);

export default Word;
