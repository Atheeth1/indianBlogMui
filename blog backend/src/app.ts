import express from 'express';
import { config } from 'dotenv';    
import { connectToDatabase } from './utils/connection';
import { graphqlHTTP } from 'express-graphql';
import schema from "./handlers/handlers";

//dot env configuration
config();
const app=express();

app.use("/graphql",graphqlHTTP({schema: schema,graphiql:true}));

connectToDatabase().then(()=>{
app.listen(process.env.PORT,()=>
console.log(`server running on Port ${process.env.PORT}`));
}).catch(err=>console.log(err));