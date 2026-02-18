
import express, { urlencoded } from "express";
import core from "cors";
import path from "path";
import { fileURLToPath } from "url";
//codes
//pta000
//pta-11 
// pta 

const exp=express();
exp.use(core());
exp.use(express.json());
const __filename = fileURLToPath(import.meta.url); //get path of this file
const __dirname = path.dirname(__filename); //get path of folder of this file

exp.use(express.static(path.join(__dirname, "public"))); 
exp.post("/currweather",  async(req, res) => {
  const countryreq=await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(req.body.country.trim())}`);
  const countryres=await countryreq.json();
  const countrycode=encodeURIComponent((countryres[0].cca2).trim());
  const city = encodeURIComponent(req.body.city.trim());
  // console.log(city);

  const f=  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${countrycode}&appid=fba3872307bce35b38a01a89864f5acf&units=metric`);
  const data=  await f.json();
  res.json(data);
  
});
//return page home
exp.get("/home",(req,res)=>{
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "public", "Home.html"));
  
})
//return weather page
exp.get("/weather",(req,res)=>{
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "public", "weather.html"));
  
})
//get countries around the world
exp.post("/countries",async(req,res)=>{

  // console.log("countries works");
  const countries=await fetch("https://api.countrystatecity.in/v1/countries",{method:"get",headers:{"X-CSCAPI-KEY":"c353f0c0145da7e23b074d002383a634af45b7362bba0f31a1c73064fbf493c0",}}
  )
  const data=await countries.json()
  let countriesName=[];
  // console.log(data.length);
  for(let i=0;i<data.length;i++){
    countriesName.push(data[i].name);
  }
  res.json(countriesName);
})


let cacheCountry=[];
let prevCountry;
//get city by passing country in body 
exp.post("/cities",async(req,res)=>{
  const country=(req.body.country);
  let city;
  // console.log(typeof country);
  if(cacheCountry.length!=0||prevCountry!=country){
    const cities=await fetch("https://countriesnow.space/api/v0.1/countries/cities",{method:"post",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({"country":encodeURIComponent(country.trim())}),
    })
    city=await cities.json();
    cacheCountry=city.data;
    cacheCountry=cacheCountry.sort();
  }
  const slice=req.body.slice;
  prevCountry=country;
  res.send(cacheCountry.slice(Math.min(slice*25,cacheCountry.length),Math.min(slice*25+25),cacheCountry));
  

})

exp.listen(8080, () => {
  
  console.log("Server running on 8080");
});

