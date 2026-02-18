const mode=localStorage.getItem("mode");
let options=document.getElementsByClassName("option");
const list = document.getElementById("options");
const selected=document.getElementById("selected");
const listcity=document.getElementById("optionsCity");
if(mode=="dark")changecolor();
const weather=document.getElementById("weather");
weather.classList.add("active");
function changecolor(){
    document.body.classList.toggle("dark");
    localStorage.setItem("mode",document.body.className);

    
}
const country= document.getElementById("options");
async function  loadcountry() {
  const res = await fetch("/countries",{method:"post"});
  const data = await res.json();
  console.log(data.length);
  for(let i=0;i<data.length;i++){
    country.innerHTML+=` <li>${data[i]}
            </li>`;
};
}
loadcountry();


function showcountry(){
  list.classList.toggle("show");
}
function showcity(){
  listcity.classList.toggle("show");
}
let slice=0;
list.addEventListener("click", async(e) => {
    listcity.innerHTML="";
    slice=0;
    selected.textContent=e.target.textContent;
    document.getElementById("selectedcity").innerHTML="Select City";
    const response=await fetch("/cities",{
      method:"post",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        "country":e.target.textContent,
        "slice":slice

      })
      
    })

    const data=await response.json();
    const cities=document.getElementById("optionsCity");
    for(let i=1;i<data.length;i++){  
      cities.innerHTML+=` <li>${data[i]}
              </li>`;
    }
  });
listcity.addEventListener("scroll",async()=>{
  const height=listcity.scrollHeight;
  const client=listcity.clientHeight;
  const current=listcity.scrollTop;
  
  if(current+client>=height/2){
    slice++;
    const response=await fetch("/cities",{
      method:"post",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        "slice":slice,
        "country":selected.textContent
      })

    })
    const data=await response.json();
    for(let i=1;i<data.length;i++){  
      listcity.innerHTML+=` <li>${data[i]}
              </li>`;
    }
  }
})
document.addEventListener("click",(e)=>{
    if(!selected.contains(e.target)){
        list.classList.remove("show");
        
      }
      if(!document.getElementById("selectedcity").contains(e.target)){
        listcity.classList.remove("show");
      }

})
listcity.addEventListener("click",(e)=>{
  const text=document.getElementById("selectedcity");
  text.innerHTML=e.target.textContent;
})
//for search for weather
document.getElementById("search-btn").addEventListener("click",async()=>{
  const selectedcity=document.getElementById("selectedcity").innerHTML;
  const coldweather=document.getElementById("coldweather");
  const hotweather=document.getElementById("hotweather");
  const normalweather=document.getElementById("normalweather");
  const notfoundweather=document.getElementById("not-found-weather");
  //make every pic and text disapear to put the new one
  coldweather.style.display="none";
  hotweather.style.display="none";
  normalweather.style.display="none";
  notfoundweather.style.display="none";
  let state=document.querySelectorAll("#state p");
  state[0].innerHTML= "";
  state[1].innerHTML= "";
  state[2].innerHTML= "";
  state[3].innerHTML= "";
  //end for make every pic and text disappear to put the new one

  const res=await fetch("/currweather",{
    method:"post",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      "city":selectedcity,
      "country":document.getElementById("selected").innerHTML
      
    })
  })
  const data=await res.json();
  if(data.cod=="404"){
    notfoundweather.style.display="block";
    return;
  }
  // console.log(state);
  setTimeout(() => {
    if(data.main.temp<15){
    coldweather.style.display="block";

  }
  else if(data.main.temp>25){
    hotweather.style.display="block";

  }
  else{
    normalweather.style.display="block";

  }
  state[0].innerHTML= `country :${document.getElementById("selected").innerHTML} , ${selectedcity} `;
 
  state[1].innerHTML= `weather-degree :${data.main.temp} c `;
  state[2].innerHTML= `feels-like :${data.main.feels_like} c `;
  state[3].innerHTML=`weather across day ${data.main.temp_min} / ${data.main.temp_max}c`;
    
  }, 100);
  //if data not found
})
