import React, { useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import { ResourceList } from '../components/ResourceList';
import { ResourceModal } from '../components/ResourceModal';
import { Button } from '../components/ui/Button';
import { Ambulance, Doctor, ResourceType } from '../types';
import { MapPin, Plus, Navigation, LogOut, User, Search, X } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 96px 24px;
`;

const Header = styled.div`
  margin-bottom: 48px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  color: #37352f;
  margin-bottom: 4px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: rgba(55, 53, 47, 0.65);
  margin-top: 4px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 3px;
  background-color: rgba(55, 53, 47, 0.06);
  color: rgba(55, 53, 47, 0.65);
  font-size: 14px;
`;

const RoleBadge = styled.span<{ $isAdmin: boolean }>`
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $isAdmin }) => ($isAdmin ? 'rgba(46, 170, 220, 0.2)' : 'rgba(55, 53, 47, 0.08)')};
  color: ${({ $isAdmin }) => ($isAdmin ? '#2eaadc' : 'rgba(55, 53, 47, 0.65)')};
`;

const LocationCard = styled.div`
  margin-bottom: 32px;
  background: #ffffff;
  border: 1px solid rgba(55, 53, 47, 0.09);
  border-radius: 3px;
  padding: 16px;
  transition: all 0.15s ease;

  &:hover {
    border-color: rgba(55, 53, 47, 0.16);
    box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px;
  }
`;

const LocationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #37352f;
`;

const LocationContent = styled.div`
  font-size: 14px;
  color: rgba(55, 53, 47, 0.65);
  margin-bottom: 12px;
  min-height: 20px;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
`;

const Tabs = styled.div`
  display: flex;
  gap: 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#37352f' : 'rgba(55, 53, 47, 0.65)')};
  border-bottom: 2px solid ${({ $active }) => ($active ? '#37352f' : 'transparent')};
  margin-bottom: -1px;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    color: #37352f;
    background-color: rgba(55, 53, 47, 0.06);
    border-radius: 3px 3px 0 0;
  }
`;

const FiltersContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(55, 53, 47, 0.03);
  border: 1px solid rgba(55, 53, 47, 0.09);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 36px 8px 34px;
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 3px;
  font-size: 14px;
  font-family: inherit;
  background-color: #ffffff;
  color: #37352f;
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: #37352f;
    box-shadow: 0 0 0 1px #37352f;
  }

  &::placeholder {
    color: rgba(55, 53, 47, 0.4);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(55, 53, 47, 0.4);
  pointer-events: none;
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  border-radius: 3px;
  cursor: pointer;
  color: rgba(55, 53, 47, 0.4);
  transition: all 0.15s ease;

  &:hover {
    background-color: rgba(55, 53, 47, 0.08);
    color: #37352f;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #37352f;
`;

const FilterButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const FilterButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 4px;
  padding: 4px 8px;
  background-color: #37352f;
  color: #ffffff;
  font-size: 12px;
  border-radius: 3px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 1000;

  ${FilterButtonWrapper}:hover & {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #37352f;
  }
`;

const HelperText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(55, 53, 47, 0.65);
  padding: 6px 8px;
  background-color: rgba(55, 53, 47, 0.04);
  border-radius: 3px;
  border: 1px solid rgba(55, 53, 47, 0.09);
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid ${({ $active }) => ($active ? '#37352f' : 'rgba(55, 53, 47, 0.16)')};
  background-color: ${({ $active }) => ($active ? '#37352f' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'rgba(55, 53, 47, 0.65)')};
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ $active }) => ($active ? '#2e2d29' : 'rgba(55, 53, 47, 0.06)')};
    border-color: ${({ $active }) => ($active ? '#2e2d29' : 'rgba(55, 53, 47, 0.24)')};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ClearFiltersButton = styled(Button)`
  align-self: flex-start;
`;

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResourceType>('ambulances');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Ambulance | Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [radiusFilter, setRadiusFilter] = useState<number | null>(null); // null = no filter, number = radius in km
  const { latitude, longitude, address, error: locationError, loading: locationLoading, requestLocation } = useLocation();
  const { user, logout, isAdmin } = useAuth();

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAdd = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const handleEdit = (resource: Ambulance | Doctor) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  };

  const handleTabChange = (tab: ResourceType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleRadiusChange = (radius: number | null) => {
    setRadiusFilter(radius);
    setPage(1);
    // If radius is set and we don't have location, request it
    if (radius !== null && (!latitude || !longitude)) {
      requestLocation();
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRadiusFilter(null);
    setPage(1);
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>SOS Emergency Services</Title>
          <Subtitle>Find nearby ambulances and doctors in your area</Subtitle>
        </HeaderLeft>
        <HeaderActions>
          <UserInfo>
            <User size={14} />
            <span>{user?.email}</span>
            <RoleBadge $isAdmin={isAdmin}>{isAdmin ? 'Admin' : 'User'}</RoleBadge>
          </UserInfo>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut size={14} style={{ marginRight: '4px' }} />
            Logout
          </Button>
        </HeaderActions>
      </Header>

      <LocationCard>
        <LocationHeader>
          <MapPin size={16} />
          <span>Your Location</span>
        </LocationHeader>
        <LocationContent>
          {locationLoading ? (
            <span>{address ? 'Getting address...' : 'Getting your location...'}</span>
          ) : locationError ? (
            <span>{locationError}</span>
          ) : latitude && longitude ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {address && (
                <span style={{ fontWeight: 500, color: '#37352f' }}>{address}</span>
              )}
              <span style={{ fontSize: '13px', color: 'rgba(55, 53, 47, 0.65)' }}>
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </span>
            </div>
          ) : (
            <span>Location not available</span>
          )}
        </LocationContent>
        <Button variant="secondary" size="sm" onClick={requestLocation} disabled={locationLoading}>
          <Navigation size={14} style={{ marginRight: '4px' }} />
          {locationLoading ? (address ? 'Getting Address...' : 'Getting Location...') : 'Get My Location'}
        </Button>
      </LocationCard>

      <TabsContainer>
        <Tabs>
          <Tab $active={activeTab === 'ambulances'} onClick={() => handleTabChange('ambulances')}>
            Ambulances
          </Tab>
          <Tab $active={activeTab === 'doctors'} onClick={() => handleTabChange('doctors')}>
            Doctors
          </Tab>
        </Tabs>
        {isAdmin && (
          <Button variant="primary" size="sm" onClick={handleAdd}>
            <Plus size={14} style={{ marginRight: '4px' }} />
            New {activeTab === 'ambulances' ? 'Ambulance' : 'Doctor'}
          </Button>
        )}
      </TabsContainer>

      <FiltersContainer>
        <SearchWrapper>
          <SearchIcon size={16} />
          <SearchInput
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
          {searchQuery && (
            <ClearSearchButton
              onClick={() => {
                setSearchQuery('');
                setPage(1);
              }}
              type="button"
            >
              <X size={14} />
            </ClearSearchButton>
          )}
        </SearchWrapper>
        <FilterGroup>
          <FilterLabel>Filter by distance:</FilterLabel>
          <FilterButtonsContainer>
            <FilterButtons>
              <FilterButton
                $active={radiusFilter === null}
                onClick={() => handleRadiusChange(null)}
              >
                All
              </FilterButton>
              <FilterButtonWrapper>
                <FilterButton
                  $active={radiusFilter === 10}
                  onClick={() => handleRadiusChange(10)}
                  disabled={!latitude || !longitude}
                  title={!latitude || !longitude ? 'Please enable location access first by clicking "Get My Location" above' : ''}
                >
                  Within 10km
                </FilterButton>
                {(!latitude || !longitude) && (
                  <Tooltip>Enable location access first</Tooltip>
                )}
              </FilterButtonWrapper>
              <FilterButtonWrapper>
                <FilterButton
                  $active={radiusFilter === 20}
                  onClick={() => handleRadiusChange(20)}
                  disabled={!latitude || !longitude}
                  title={!latitude || !longitude ? 'Please enable location access first by clicking "Get My Location" above' : ''}
                >
                  Within 20km
                </FilterButton>
                {(!latitude || !longitude) && (
                  <Tooltip>Enable location access first</Tooltip>
                )}
              </FilterButtonWrapper>
              <FilterButtonWrapper>
                <FilterButton
                  $active={radiusFilter === 50}
                  onClick={() => handleRadiusChange(50)}
                  disabled={!latitude || !longitude}
                  title={!latitude || !longitude ? 'Please enable location access first by clicking "Get My Location" above' : ''}
                >
                  Within 50km
                </FilterButton>
                {(!latitude || !longitude) && (
                  <Tooltip>Enable location access first</Tooltip>
                )}
              </FilterButtonWrapper>
            </FilterButtons>
            {(!latitude || !longitude) && (
              <HelperText>
                <MapPin size={14} />
                <span>Click "Get My Location" above to enable distance filters</span>
              </HelperText>
            )}
          </FilterButtonsContainer>
        </FilterGroup>
        {(searchQuery || radiusFilter !== null) && (
          <ClearFiltersButton variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </ClearFiltersButton>
        )}
      </FiltersContainer>

      <ResourceList
        type={activeTab}
        page={page}
        onPageChange={setPage}
        onEdit={handleEdit}
        searchQuery={debouncedSearchQuery}
        radiusFilter={radiusFilter}
      />

      <ResourceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={activeTab}
        resource={editingResource}
      />
    </Container>
  );
};
