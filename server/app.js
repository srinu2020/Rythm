const express=require('express')
 
const app=express()
const cors=require('cors')

const port=process.env.PORT||8080
 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(require('./router/users'))
app.use(require('./router/group'))
app.use(require('./router/message'))
app.use(require('./router/song'))
 
app.listen(port,()=>{
   console.log(`server is connected at port ${port}`); 
})


 

