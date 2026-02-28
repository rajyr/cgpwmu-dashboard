import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ChhattisgarhMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [locationStats, setLocationStats] = useState({});

    // Fix for Leaflet default icon issues in React
    useEffect(() => {
        // We do not need markers for now, just the GeoJSON polygons.
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [geoRes, locRes] = await Promise.all([
                    fetch('/data/chhattisgarh.geojson'),
                    fetch('/data/locationData.json')
                ]);

                const geojson = await geoRes.json();
                const locData = await locRes.json();

                // Calculate village counts per district
                const stats = {};
                Object.entries(locData).forEach(([districtKey, blocks]) => {
                    let villageCount = 0;
                    let gpCount = 0;
                    let blockCount = Object.keys(blocks).length;

                    Object.values(blocks).forEach(gps => {
                        gpCount += Object.keys(gps).length;
                        Object.values(gps).forEach(villages => {
                            villageCount += villages.length;
                        });
                    });

                    stats[districtKey] = {
                        blocks: blockCount,
                        gps: gpCount,
                        villages: villageCount
                    };
                });

                setLocationStats(stats);
                setGeoData(geojson);
            } catch (error) {
                console.error("Error loading map data:", error);
            }
        };

        fetchData();
    }, []);

    const onEachFeature = (feature, layer) => {
        const districtName = feature.properties.district;
        const stats = locationStats[districtName];

        let popupContent = `<div class="p-1"><h3 class="font-bold text-gray-800 text-sm mb-1">${districtName}</h3>`;
        if (stats) {
            popupContent += `<p class="text-xs text-gray-600 m-0">Blocks: <strong>${stats.blocks}</strong></p>`;
            popupContent += `<p class="text-xs text-gray-600 m-0">Gram Panchayats: <strong>${stats.gps}</strong></p>`;
            popupContent += `<p class="text-xs text-gray-600 m-0">Villages: <strong>${stats.villages}</strong></p></div>`;
        } else {
            popupContent += `<p class="text-xs text-red-500 m-0">Data not found</p></div>`;
        }

        layer.bindPopup(popupContent);
        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 2,
                    color: '#1d4ed8',
                    dashArray: '',
                    fillOpacity: 0.9,
                    fillColor: '#60a5fa'
                });
                layer.bringToFront();
            },
            mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 1,
                    opacity: 1,
                    color: '#ffffff',
                    dashArray: '3',
                    fillOpacity: 0.6,
                    fillColor: '#3b82f6'
                });
            }
        });
    };

    const mapStyle = {
        fillColor: '#3b82f6', // Tailwind blue-500
        weight: 1,
        opacity: 1,
        color: '#ffffff',
        dashArray: '3',
        fillOpacity: 0.6
    };

    return (
        <div className="w-full h-[400px] z-0 rounded-xl overflow-hidden shadow-sm border border-gray-100 relative">
            <MapContainer
                center={[21.2787, 81.8661]}
                zoom={6}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={mapStyle}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default ChhattisgarhMap;
