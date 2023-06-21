const express = require("express")
const dbconnect = require("./database/index")
const {port} = require('./config/index')
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())

app.use(express.json())

app.use(router)
dbconnect()
app.use('/storage',express.static('storage'))
app.use(errorHandler)
app.listen(port, console.log(`Server is running on Port ${port}`))


// const port = 3000
// app.get('/',(res,req) =>{
//     req.send("Server accepting request")
// })

// app.get('/', (req,res) => res.json({msg:"Server accepting response hello"}))

