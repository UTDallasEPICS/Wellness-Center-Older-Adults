import React from 'react';
import GoogleMapReact from 'google-map-react';

const RideMap = ({ pickupAddress, dropoffAddress, finalAddress }) => {
  const defaultProps = {
    center: {
      lat: 33.1984, // McKinney, TX latitude
      lng: -96.6156, // McKinney, TX longitude
    },
    zoom: 11,
  };

  // Function to geocode addresses (you'll need to implement this)
  const geocodeAddress = async (address) => {
    // Replace with your geocoding logic (using Google Maps API or another service)
    // For now, return a placeholder
    return { lat: 33.1984, lng: -96.6156 }; // Placeholder: McKinney, TX coordinates
  };

  const renderMarkers = async ({ map, maps }) => {
    if (!maps) return; // Ensure maps object is available

    try {
      // Geocode addresses to get coordinates
      const pickupCoords = await geocodeAddress(pickupAddress);
      const dropoffCoords = await geocodeAddress(dropoffAddress);
      const finalCoords = await geocodeAddress(finalAddress);

      // Create markers
      new maps.Marker({
        position: pickupCoords,
        map,
        title: 'Pickup',
      });
      new maps.Marker({
        position: dropoffCoords,
        map,
        title: 'Dropoff',
      });
      new maps.Marker({
        position: finalCoords,
        map,
        title: 'Final Destination',
      });
    } catch (error) {
      console.error('Error geocoding or rendering markers:', error);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIHaveAccessToGoogleMaps
        onGoogleApiLoaded={renderMarkers}
      />
    </div>
  );
};

export default RideMap;