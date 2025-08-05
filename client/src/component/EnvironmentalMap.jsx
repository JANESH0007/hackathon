import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// --- Helper Functions (No changes here) ---
const getAqiInfo = (aqi) => {
    if (aqi === '-' || aqi === undefined) return { status: 'N/A', color: '#9CA3AF' };
    const val = parseInt(aqi);
    if (val <= 50) return { status: 'Good', color: '#22C55E' };
    if (val <= 100) return { status: 'Moderate', color: '#FBBF24' };
    if (val <= 150) return { status: 'Unhealthy for Sensitive', color: '#F97316' };
    if (val <= 200) return { status: 'Unhealthy', color: '#EF4444' };
    if (val <= 300) return { status: 'Very Unhealthy', color: '#A855F7' };
    return { status: 'Hazardous', color: '#881337' };
};

const createAqiIcon = (aqi) => {
    const aqiInfo = getAqiInfo(aqi);
    const iconHtml = `<div style="background-color: ${aqiInfo.color};" class="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-sm border-2 border-white shadow-lg">${aqi}</div>`;
    return L.divIcon({ html: iconHtml, className: 'bg-transparent border-0', iconSize: [40, 40], iconAnchor: [20, 20] });
};

// --- ZoneLayer and MapClickHandler components remain the same ---
const ZoneLayer = ({ selectedStation }) => {
    const map = useMap();
    useEffect(() => {
        if (!selectedStation) return;
        const aqiInfo = getAqiInfo(selectedStation.aqi);
        const zone = L.circle([selectedStation.lat, selectedStation.lon], {
            radius: 25000,
            color: aqiInfo.color,
            fillColor: aqiInfo.color,
            fillOpacity: 0.3,
            weight: 1,
        }).addTo(map);
        return () => { map.removeLayer(zone); };
    }, [selectedStation, map]);
    return null;
};

const MapClickHandler = ({ onDeselect }) => {
    useMapEvents({ click() { onDeselect(); } });
    return null;
};

// --- A more robust component to control the map's view and bounds ---
const MapController = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        // This ensures that when the center or zoom props change, the map flies smoothly to the new view.
        // This fixes the sequential search issue.
        map.flyTo(center, zoom, {
            animate: true,
            duration: 1.5
        });
    }, [center, zoom, map]);

    return null;
};


const EnvironmentalMap = ({ markers, isLoading, center, zoom }) => {
    const [selectedStation, setSelectedStation] = useState(null);

    // Define the geographical bounds for India
    const indiaBounds = [
        [5.9, 68.1], // South-West corner
        [35.5, 97.4]  // North-East corner
    ];

    if (isLoading) {
        return <div className="bg-white p-6 rounded-xl shadow-md text-center h-[600px] flex items-center justify-center">Loading Map & Environmental Data...</div>;
    }

    return (
        <div className="bg-white p-2 rounded-xl shadow-md h-[600px] relative">
            <MapContainer 
                center={center} 
                zoom={zoom} 
                scrollWheelZoom={true} // This enables touchpad zoom
                style={{ height: '100%', width: '100%', borderRadius: '10px' }}
                maxBounds={indiaBounds} // This locks the map view to India
                minZoom={4} // Prevents zooming out too far
            >
                <MapController center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {markers.map(marker => (
                    <Marker 
                        key={marker.uid} 
                        position={[marker.lat, marker.lon]} 
                        icon={createAqiIcon(marker.aqi)}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e);
                                setSelectedStation(marker);
                            },
                        }}
                    >
                        <Popup>
                           <div className="font-sans">
                                <h3 className="font-bold text-base mb-1">{marker.name}</h3>
                                <p className="text-sm">AQI: <span className="font-bold" style={{color: getAqiInfo(marker.aqi).color}}>{marker.aqi}</span></p>
                           </div>
                        </Popup>
                    </Marker>
                ))}

                <ZoneLayer selectedStation={selectedStation} />
                <MapClickHandler onDeselect={() => setSelectedStation(null)} />
            </MapContainer>
        </div>
    );
};

export default EnvironmentalMap;
