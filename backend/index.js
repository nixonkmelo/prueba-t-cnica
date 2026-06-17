// importar dependencias express y cors
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use (cors());
app.use(express.json());

const vehiculo = new Map();


// ─── FUNCIÓN HELPER: Calcular estado del vehículo ───────────────
function calcularEstado(vehiculo){
    const ahora = Date.now();
    const ultimaVez = new Date(vehiculo.last_seen).getTime();
    const diferencia = ahora-ultimaVez;

    if (diferencia >120000){
        return "sin señal"
    }

    const latCambio = Math.abs(vehiculo.last_lat - (vehiculo.prev_lat || vehiculo.last_lat));
    const lngCambio = Math.abs(vehiculo.last_lng - (vehiculo.prev_lng || vehiculo.last_lng));
    const seMueve = latCambio >0.0001 || lngCambio >0.0001;

    if (diferencia < 60000 && seMueve){
        return "en movimiento";
    }
    return "detenido";
}

// ─── ENDPOINT 1: Consultar todos los vehículos ──────────────────

app.get("/vehicles", (req, res)=>{
    const lista = Array.from(vehiculo.values()).map(v => ({
        vehicle_id: v.vehicle_id,
        last_lat: v.last_lat,
        last_lng: v.last_lng,
        last_seen: v.last_seen,
        status : calcularEstado(v), 

    }));
    res.status(200).json(lista);
});

// ─── ENDPOINT 2: Recibir coordenadas GPS ────────────────────────
app.post("/gps",(req, res)=>{
    const {vehicle_id, lat, lng, timestamp} = req.body;

    if (!vehicle_id || vehicle_id.trim()===""){
        return res.status(400).json({error: "el id del vehiculo es obligatorio"});
    }

    if (lat===null || lat===undefined || lat < -90 || lat > 90){
        return res.status(400).json({error: "la latitud no esta en el rango requerido que es de -90 a 90"});
    }

    if (lng===null || lng===undefined || lng < -180 || lng > 180){
        return res.status(400).json({error: "la longitud no esta en el rango requerido que es de -180 a 180"});
    }

    if (!timestamp || isNaN(new Date(timestamp).getTime())){
        return res.status(400).json({error: "la fecha es obligatoria y debe estar en el formato requerido"});
    } 

    const existente = vehiculo.get(vehicle_id);

    vehiculo.set(vehicle_id, {
        vehicle_id,
        last_lat: lat,
        last_lng: lng,
        last_seen: timestamp,
        prev_lat: existente ? existente.last_lat: lat,
        prev_lng: existente ? existente.last_lng: lng
    });

    return res.status(201).json({message:"cordenadas guardadas correctamente", vehicle_id});

});

// ─── ENDPOINT 3: Eliminar un vehículo ───────────────────────────
app.delete("/vehicles/:id",(req,res)=>{

    const {id} = req.params;

    if (!vehiculo.has(id)){
        return res.status(404).json({error: "vehiculo no encontrado"});
    }

    vehiculo.delete(id);

    return res.status(200).json({menssage: "el vehiculo se elimino correctamente"});
});




app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});