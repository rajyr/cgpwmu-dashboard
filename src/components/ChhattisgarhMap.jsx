import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ChhattisgarhMap = ({ metricData = {}, metricType = 'waste' }) => {
    const [geoData, setGeoData] = useState(null);
    const [locationStats, setLocationStats] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const geoPaths = [
                    `${import.meta.env.BASE_URL}data/chhattisgarh.geojson`,
                    'data/chhattisgarh.geojson',
                    '/cgpwmu/data/chhattisgarh.geojson'
                ];
                const locPaths = [
                    `${import.meta.env.BASE_URL}data/locationData.json`,
                    'data/locationData.json',
                    '/cgpwmu/data/locationData.json'
                ];

                let geojson = null;
                for (const p of geoPaths) {
                    try {
                        const res = await fetch(p);
                        if (res.ok) { geojson = await res.json(); break; }
                    } catch (e) {}
                }

                let locData = null;
                for (const p of locPaths) {
                    try {
                        const res = await fetch(p);
                        if (res.ok) { locData = await res.json(); break; }
                    } catch (e) {}
                }

                if (geojson) setGeoData(geojson);
                
                if (locData) {
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
                }
            } catch (error) {
                console.error("Error loading map data:", error);
            }
        };

        fetchData();
    }, []);

    const getColor = (val) => {
        if (!val || val === 0) return '#fee2e2'; // Light Red for no data
        if (val < 10) return '#dbeafe';
        if (val < 50) return '#93c5fd';
        if (val < 100) return '#3b82f6';
        if (val < 500) return '#1d4ed8';
        return '#1e3a8a'; // Darkest Blue
    };

    const style = (feature) => {
        const districtName = feature.properties.district;
        const val = metricData[districtName] || 0;
        return {
            fillColor: getColor(val),
            weight: 1,
            opacity: 1,
            color: '#ffffff',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    const onEachFeature = (feature, layer) => {
        const districtName = feature.properties.district;
        const stats = locationStats[districtName];
        const metricVal = metricData[districtName] || 0;

        let popupContent = `<div class="p-1"><h3 class="font-bold text-gray-800 text-sm mb-1">${districtName}</h3>`;
        popupContent += `<p class="text-xs font-bold text-blue-600 mb-2">${metricType === 'waste' ? 'Waste Gen:' : 'Revenue:'} ${metricType === 'waste' ? metricVal.toFixed(1) + ' Kg' : '₹' + metricVal.toLocaleString()}</p>`;
        
        if (stats) {
            popupContent += `<p class="text-[10px] text-gray-400 m-0 uppercase font-bold tracking-tighter mb-1">Coverage</p>`;
            popupContent += `<p class="text-xs text-gray-600 m-0">Blocks: <strong>${stats.blocks}</strong></p>`;
            popupContent += `<p class="text-xs text-gray-600 m-0">GPs: <strong>${stats.gps}</strong></p>`;
            popupContent += `<p class="text-xs text-gray-600 m-0">Villages: <strong>${stats.villages}</strong></p></div>`;
        } else {
            popupContent += `<p class="text-xs text-red-500 m-0">Stats not available</p></div>`;
        }

        layer.bindPopup(popupContent);
        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 2,
                    color: '#1d4ed8',
                    dashArray: '',
                    fillOpacity: 0.9
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
                    fillOpacity: 0.7
                });
            }
        });
    };

    return (
        <div className="w-full h-[400px] z-0 rounded-xl overflow-hidden shadow-sm border border-gray-100 relative bg-gray-50">
            <MapContainer
                center={[21.2787, 81.8661]}
                zoom={6}
                scrollWheelZoom={false}
                zoomControl={true}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={style}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default ChhattisgarhMap;
