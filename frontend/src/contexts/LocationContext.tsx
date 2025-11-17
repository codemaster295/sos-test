import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LocationState } from '../types';

interface LocationContextType extends LocationState {
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  try {
    // Using OpenStreetMap Nominatim API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SOS-Emergency-Services/1.0', // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      // Build a readable address string
      const addressParts = [];
      
      if (address.road) addressParts.push(address.road);
      if (address.house_number) addressParts.push(address.house_number);
      if (addressParts.length === 0 && address.suburb) addressParts.push(address.suburb);
      if (address.city || address.town || address.village) {
        addressParts.push(address.city || address.town || address.village);
      }
      if (address.state) addressParts.push(address.state);
      if (address.postcode) addressParts.push(address.postcode);
      if (address.country) addressParts.push(address.country);

      return addressParts.length > 0 ? addressParts.join(', ') : data.display_name || null;
    }

    return data.display_name || null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    address: null,
    error: null,
    loading: false,
  });

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        address: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      });
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // First set coordinates
        setLocation((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
          loading: true, // Keep loading while fetching address
        }));

        // Then fetch address
        try {
          const address = await reverseGeocode(lat, lon);
          setLocation({
            latitude: lat,
            longitude: lon,
            address: address,
            error: null,
            loading: false,
          });
        } catch (error) {
          // Address fetch failed, but coordinates are still set
          setLocation({
            latitude: lat,
            longitude: lon,
            address: null,
            error: null,
            loading: false,
          });
        }
      },
      (error) => {
        setLocation({
          latitude: null,
          longitude: null,
          address: null,
          error: error.message || 'Failed to get location',
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    // Optionally request location on mount
    // requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ ...location, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

