import React from 'react';
import GoogleMapReact from 'google-map-react';

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
}

const MapComponent: React.FC<MapProps> = ({ children, center, zoom }) => {
  return (
    <>
      <GoogleMapReact
        yesIWantToUseGoogleMapApiInternals
        bootstrapURLKeys={{ key: 'AIzaSyCBtuU2hX_fJLSczcVSSbdze-KcyFhr0IY' }}
        defaultCenter={center}
        defaultZoom={zoom || 1}
        options={{ fullscreenControl: false }}
      >
        {children}
      </GoogleMapReact>
    </>
  );
};

export default MapComponent;
