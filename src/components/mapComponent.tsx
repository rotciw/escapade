import React from 'react';
import GoogleMapReact, { ClickEventValue } from 'google-map-react';

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (e: ClickEventValue) => void;
}

const MapComponent: React.FC<MapProps> = ({ children, center, zoom, onMarkerClick }) => {
  return (
    <>
      <GoogleMapReact
        yesIWantToUseGoogleMapApiInternals
        bootstrapURLKeys={{ key: 'AIzaSyCBtuU2hX_fJLSczcVSSbdze-KcyFhr0IY' }}
        defaultCenter={{ lat: 0, lng: 50 }}
        center={center}
        defaultZoom={zoom || 1}
        onClick={onMarkerClick}
        options={{ fullscreenControl: false, clickableIcons: false }}
      >
        {children}
      </GoogleMapReact>
    </>
  );
};

export default MapComponent;
