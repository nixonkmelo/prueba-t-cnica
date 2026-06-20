const fetch= require("node-fetch");
const API_URL= "http://localhost:3000/gps";

const vehiculos= [
    {id: "v001",lat:4.62,lng:-74.27,estatico:false},
    {id: "v002",lat:4.68,lng:-73.99,estatico:false},
    {id: "v003",lat:4.73,lng:-74.10,estatico:true},
];

console.log("simulador iniciado");

async function enviarCoordenadas(vehiculo) {
  const esInvalido= Math.random()<0.10;
  
  if(!vehiculo.estatico){
    vehiculo.lat+=(Math.random()-0.5)*0.001;
    vehiculo.lng+=(Math.random()-0.5)*0.001;
  }

  const payload= esInvalido
  ?{
    vehicle_id: vehiculo.id, 
    lat: 999,
    lng: vehiculo.lng,
    timestamp: new Date().toISOString(),
  }

  :{
    vehicle_id: vehiculo.id, 
    lat: vehiculo.lat,
    lng: vehiculo.lng,
    timestamp: new Date().toISOString(), 
  };
  try{
    const response= await fetch(API_URL, {
     method: "POST",
     headers:{"Content-Type":"application/json"},
     body:JSON.stringify(payload),   
    });

    const data= await response.json();
    if(response.status===201){
       console.log(`${vehiculo.id} Enviado correctamente`);
    }
    else{
        console.log(`${vehiculo.id} Error en el envio,${response.status}: ${data.error}`);  
    }
  } catch(error){
    console.error("error en la conexión", error.menssage);
  }

 
}

 setInterval(()=>{
    vehiculos.forEach((vehiculo)=>{
        enviarCoordenadas(vehiculo);
    });
  },4000);