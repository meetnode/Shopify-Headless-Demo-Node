const mongoose = require('mongoose')

const connection = async () => {
    await mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log(`Database connected successfully`))
        .catch((err) => console.log(err.message))
}

module.exports = connection