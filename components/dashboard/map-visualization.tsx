"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
// Leaflet imports
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
// Fix for default marker icon issue in Leaflet + Webpack/Next.js
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function MapVisualization() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions((data.transactions || []).filter((tx: any) => tx.lat && tx.lng));
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
          </div>
          <span className="text-base md:text-lg font-semibold">Transaction Map</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>
          ) : (
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <MarkerClusterGroup>
                {transactions.map((tx) => (
                  <Marker key={tx.id} position={[tx.lat, tx.lng]}>
                    <Popup>
                      <div>
                        <strong>{tx.location || "Unknown"}</strong>
                        <br />
                        ₹{tx.amount}
                        <br />
                        Status: {tx.status}
                        <br />
                        Device: {tx.device}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
