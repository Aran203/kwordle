

const validateWord = async(request, resp) => {

    try {
        const {word} = request.body
        

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
    validateWord
}