import Word from '../models/words.js';


const getWordOfDay = async (req, res) => {
    try {
        let word = await Word.findOne().sort({ date: -1 }).limit(1); 
        const today = new Date().toISOString().slice(0, 10); 

        if (!word || word.date.toISOString().slice(0, 10) !== today) {
            // const response = await fetch("https://random-word-api.herokuapp.com/word?number=1&length=5");
            const response = await fetch("https://random-word-api.vercel.app/api?words=1&length=5")
            
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            
            const [data] = await response.json();  

            word = new Word({ word: data });

            await word.save();  
        }

        res.status(200).json(word.word);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching word of the day');
    }
};


const validateWord = async(req, resp) => {

    try {
        const {word} = req.body
        
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

        if (!response.ok) {
            const errorMessage = await response.text()
            throw new Error(errorMessage)
        }

        resp.status(201).send("valid")
    } catch (error) {
        resp.status(201).send(JSON.stringify("invalid"))
    }

}

export {
    validateWord, getWordOfDay
}