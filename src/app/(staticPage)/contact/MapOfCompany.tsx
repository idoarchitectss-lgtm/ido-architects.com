import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 16.0400097,
  lng: 108.1825492,
};

const MapOfCompany = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    // googleMapsApiKey: 'AIzaSyCZ6mTEn1LbSRXjl7QF2H01rm3V3ZL0pnM',
    // libraries:['maps'],
    language:'en',
    version:'weekly',


  })
  const [map, setMap] = useState<any>(null)

  const onLoad = React.useCallback(function callback(map:any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map:any) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <div className='w-100vw'>

    <GoogleMap
      mapContainerClassName='w-100vw'
      mapContainerStyle={containerStyle}
      center={center}
      zoom={100}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      { /* Child components, such as markers, info windows, etc. */ }
      <></>
    </GoogleMap>
      </div>
) : <></>
}


export default MapOfCompany