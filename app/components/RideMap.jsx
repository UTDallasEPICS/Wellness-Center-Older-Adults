"use client";
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { GoogleMap, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';

const RideMap = ({ pickupAddress, dropoffAddress }) => {
    const [directions, setDirections] = useState(null);
    const mapRef = useRef(null);

    const center = useMemo(() => ({ lat: 33.1984, lng: -96.6156 }), []); // McKinney, TX

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ['places', 'routes'],
    });

    useEffect(() => {
        if (isLoaded && pickupAddress && dropoffAddress) {
            const directionsService = new window.google.maps.DirectionsService();
            const request = {
                origin: pickupAddress,
                destination: dropoffAddress,
                travelMode: window.google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`Directions request failed due to ${status}`);
                }
            });
        }
    }, [isLoaded, pickupAddress, dropoffAddress]);

    const options = useMemo(
        () => ({
            zoom: 11,
            center: center,
        }),
        [center]
    );

    if (loadError) return <div>Error loading maps!</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                options={options}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
            >
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            polylineOptions: { strokeColor: '#FF0000' },
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
};

export default RideMap;