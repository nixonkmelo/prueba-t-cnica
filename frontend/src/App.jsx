import { useState, useEffect } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./App.css";

// Leaflet por defecto no encuentra los íconos de los marcadores en React.
//  Esto soluciona ese problema configurando manualmente las imágenes.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


function App() {
  const [vehicles, setvehicles] = useState([]);
  const [segundosDesdeActualizacion, setSegundosDesdeActualizacion] = useState(0);
  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/vehicles");
      setvehicles(response.data);
      setSegundosDesdeActualizacion(0);
    } catch (error) {
      console.error("Error coneccion al backend:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    const intervalo = setInterval(() => {
      fetchVehicles();
    }, 5000);

    return () => clearInterval(intervalo);

  }, []);

  useEffect(() => {
    const contador = setInterval(() => {
      setSegundosDesdeActualizacion((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(contador);

  }, []);


  const getClaseEstado = (status) => {
    if (status === "en movimiento") return "estado-movimiento";
    if (status === "detenido") return " estado-detenido";
    if (status === "sin señal") return "estado-sinseñal";
    return "";
  };

  return (
    <div>
      <h1>Sistema de monitoreo GPS</h1>
      <p>Ultima actualización: hace {segundosDesdeActualizacion} segundos</p>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID  vehiculo</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Ultima transmisión</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.vehicle_id}>
              <td>{v.vehicle_id}</td>
              <td>{v.last_lat}</td>
              <td>{v.last_lng}</td>
              <td>{v.last_seen}</td>
              <td>
                <span className={`estado-badge ${getClaseEstado(v.status)}`}>
                  {v.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Mapa de vehículo</h2>
      <MapContainer
        center={[4.7110, -74.0721]}
        zoom={12}
        className="mapa-contenedor"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {vehicles.map((v) => (
          <Marker key={v.vehicle_id} position={[v.last_lat, v.last_lng]}>
            <Popup>
              <strong>{v.vehicle_id}</strong>
              <br />
              estado:{v.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;