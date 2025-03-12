import app from "./src";
import dotenv from 'dotenv';
import path from "path";
dotenv.config({path: path.resolve(__dirname, '.env')});


const PORT = process.env.PORT || 8000;



app.listen(PORT, ()=>{
    console.log(`Server started at ${PORT}`);
});