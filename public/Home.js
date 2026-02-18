//for dark mode 
const mode=localStorage.getItem("mode");
if(mode=="dark")changecolor();

const home=document.getElementById("home");
home.classList.add("active");
const searchByCountry=document.getElementById("searchButton");
function changecolor(){
    document.body.classList.toggle("dark");
    localStorage.setItem("mode",document.body.className);

}
searchByCountry.addEventListener("click",async()=> {
  const country=document.getElementById("searchInput").value;
  
  console.log(country);
  try {
    const res = await fetch("http://localhost:5500/currweather", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "country":country
      })
    });
    const data = await res.json(); 
    console.log(data.main.temp);
    // Only parse JSON if you know it's JSON
    // const data = JSON.parse(text);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})




// https://api.openweathermap.org/data/2.5/weather?q=giza&appid=fba3872307bce35b38a01a89864f5acf&units=metric
// https://restcountries.com/v3.1/name/
// https://countriesnow.space/api/v0.1/countries/states