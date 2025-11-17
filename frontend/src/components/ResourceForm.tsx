import React, { useState, useEffect } from 'react';
import { Ambulance, Doctor, ResourceType } from '../types';
import { Input } from './ui/Input';
import { Textarea } from './ui/Input';
import { Button } from './ui/Button';
import { Navigation, MapPin } from 'lucide-react';
import styled from 'styled-components';

const Form = styled.form.withConfig({
  shouldForwardProp: () => true,
})`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LocationStatus = styled.div<{ $error?: boolean }>`
  font-size: 13px;
  color: ${({ $error }) => ($error ? '#eb5757' : 'rgba(55, 53, 47, 0.65)')};
  margin-top: 4px;
`;

interface ResourceFormProps {
  type: ResourceType;
  initialData?: Ambulance | Doctor | null;
  onSubmit: (data: Partial<Ambulance | Doctor>) => void;
  formRef?: React.RefObject<HTMLFormElement>;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({
  type,
  initialData,
  onSubmit,
  formRef,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    image: '',
    phone: '',
    specialization: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

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

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);
    setAddressLoading(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Update coordinates first
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lon.toFixed(6),
        }));

        setLocationLoading(false);
        setAddressLoading(true);

        // Get address from coordinates
        try {
          const address = await reverseGeocode(lat, lon);
          if (address) {
            setFormData((prev) => ({
              ...prev,
              location: address,
            }));
          }
        } catch (error) {
          // Address fetch failed, but coordinates are still set
          console.error('Failed to get address:', error);
        } finally {
          setAddressLoading(false);
        }
      },
      (error) => {
        setLocationError(error.message || 'Failed to get location');
        setLocationLoading(false);
        setAddressLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        location: initialData.location || '',
        latitude: initialData.latitude?.toString() || '',
        longitude: initialData.longitude?.toString() || '',
        image: initialData.image || '',
        phone: initialData.phone || '',
        specialization: type === 'doctors' ? (initialData as Doctor).specialization || '' : '',
      });
    }
  }, [initialData, type]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.latitude.trim()) {
      newErrors.latitude = 'Latitude is required';
    } else if (isNaN(parseFloat(formData.latitude)) || parseFloat(formData.latitude) < -90 || parseFloat(formData.latitude) > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    if (!formData.longitude.trim()) {
      newErrors.longitude = 'Longitude is required';
    } else if (isNaN(parseFloat(formData.longitude)) || parseFloat(formData.longitude) < -180 || parseFloat(formData.longitude) > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData: Partial<Ambulance | Doctor> = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      image: formData.image || undefined,
      phone: formData.phone || undefined,
    };

    if (type === 'doctors' && formData.specialization) {
      (submitData as Partial<Doctor>).specialization = formData.specialization;
    }

    onSubmit(submitData);
  };

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        placeholder={type === 'ambulances' ? 'Ambulance Service Name' : 'Doctor Name'}
      />
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
        placeholder="Enter description"
      />
      <Input
        label="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        error={errors.location}
        placeholder="Address or location"
      />
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#37352f' }}>Coordinates</label>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={getCurrentLocation}
            disabled={locationLoading || addressLoading}
          >
            <Navigation size={14} style={{ marginRight: '4px' }} />
            {locationLoading ? 'Getting location...' : addressLoading ? 'Getting address...' : 'Get Current Location'}
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            error={errors.latitude}
            placeholder="e.g., 40.7128"
          />
          <Input
            label="Longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            error={errors.longitude}
            placeholder="e.g., -74.0060"
          />
        </div>
        {locationError && (
          <LocationStatus $error>
            <MapPin size={12} style={{ marginRight: '4px', display: 'inline' }} />
            {locationError}
          </LocationStatus>
        )}
        {!locationError && formData.latitude && formData.longitude && (
          <LocationStatus>
            <MapPin size={12} style={{ marginRight: '4px', display: 'inline' }} />
            {addressLoading ? 'Fetching address...' : `Location set: ${formData.latitude}, ${formData.longitude}`}
          </LocationStatus>
        )}
      </div>
      {type === 'doctors' && (
        <Input
          label="Specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          placeholder="e.g., Cardiology, General Practice"
        />
      )}
      <Input
        label="Phone (Optional)"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="Contact phone number"
      />
      <Input
        label="Image URL (Optional)"
        type="url"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        placeholder="https://example.com/image.jpg"
      />
    </Form>
  );
};

