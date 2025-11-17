import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ambulanceApi, doctorApi } from '../lib/api';
import { Ambulance, Doctor, ResourceType } from '../types';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { MapPin, Phone, Trash2, Edit, Stethoscope, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ResourceCard = styled.div`
  display: flex;
  background: #ffffff;
  border: 1px solid rgba(55, 53, 47, 0.09);
  border-radius: 3px;
  overflow: hidden;
  transition: all 0.15s ease;
  cursor: pointer;

  &:hover {
    border-color: rgba(55, 53, 47, 0.16);
    box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px;
  }
`;

const ImageContainer = styled.div`
  width: 120px;
  min-width: 120px;
  height: 120px;
  background-color: rgba(55, 53, 47, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-right: 1px solid rgba(55, 53, 47, 0.09);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EmptyImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(55, 53, 47, 0.4);
`;

const CardContent = styled.div`
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardHeader = styled.div`
  margin-bottom: 8px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #37352f;
  margin-bottom: 4px;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 14px;
  color: rgba(55, 53, 47, 0.65);
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(55, 53, 47, 0.65);
  margin-top: 4px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(55, 53, 47, 0.09);
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(55, 53, 47, 0.09);
`;

const PaginationInfo = styled.span`
  font-size: 14px;
  color: rgba(55, 53, 47, 0.65);
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 6px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: rgba(55, 53, 47, 0.65);
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #37352f;
  margin-bottom: 4px;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: rgba(55, 53, 47, 0.65);
  margin-top: 4px;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 48px 24px;
  background: rgba(235, 87, 87, 0.1);
  border: 1px solid rgba(235, 87, 87, 0.2);
  border-radius: 3px;
`;

const ErrorTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #eb5757;
  margin-bottom: 8px;
`;

const ErrorDescription = styled.p`
  font-size: 14px;
  color: rgba(55, 53, 47, 0.65);
`;

interface ResourceListProps {
  type: ResourceType;
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (item: Ambulance | Doctor) => void;
  searchQuery?: string;
  radiusFilter?: number | null;
}

export const ResourceList: React.FC<ResourceListProps> = ({ 
  type, 
  page, 
  onPageChange, 
  onEdit, 
  searchQuery = '',
  radiusFilter = null 
}) => {
  const queryClient = useQueryClient();
  const { latitude, longitude } = useLocation();
  const { isAdmin } = useAuth();
  const api = type === 'ambulances' ? ambulanceApi : doctorApi;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [type, page, latitude, longitude, radiusFilter, searchQuery],
    queryFn: () =>
      api.getAll({
        page,
        limit: 10,
        latitude: radiusFilter !== null ? (latitude || undefined) : undefined,
        longitude: radiusFilter !== null ? (longitude || undefined) : undefined,
        radius: radiusFilter || undefined,
        search: searchQuery || undefined,
      }),
    retry: 1,
    retryDelay: 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading resources..." />;
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 
                         (error as any)?.response?.data?.error || 
                         (error as any)?.message || 
                         'Unknown error';
    return (
      <ErrorState>
        <ErrorTitle>Error loading {type}</ErrorTitle>
        <ErrorDescription>{errorMessage}</ErrorDescription>
        <ErrorDescription style={{ marginTop: '8px', fontSize: '13px' }}>
          Make sure the backend API is running on http://localhost:3001
        </ErrorDescription>
      </ErrorState>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState>
        <EmptyTitle>No {type} found</EmptyTitle>
        <EmptyDescription>
          {searchQuery || radiusFilter !== null
            ? 'Try adjusting your search or filters'
            : `Try adjusting your filters or add a new ${type.slice(0, -1)}`}
        </EmptyDescription>
      </EmptyState>
    );
  }

  return (
    <ListContainer>
      {data.data.map((item) => (
        <ResourceCard key={item.id} onClick={() => isAdmin && onEdit(item)}>
          <ImageContainer>
            {item.image ? (
              <img src={item.image} alt={item.title} />
            ) : (
              <EmptyImage>
                {type === 'ambulances' ? <Truck size={32} /> : <Stethoscope size={32} />}
              </EmptyImage>
            )}
          </ImageContainer>
          <CardContent>
            <CardHeader>
              <Title>{item.title}</Title>
              <Description>{item.description}</Description>
              <InfoRow>
                <MapPin size={14} />
                <span>{item.location}</span>
              </InfoRow>
              {item.phone && (
                <InfoRow>
                  <Phone size={14} />
                  <span>{item.phone}</span>
                </InfoRow>
              )}
              {type === 'doctors' && (item as Doctor).specialization && (
                <InfoRow>
                  <Stethoscope size={14} />
                  <span>{(item as Doctor).specialization}</span>
                </InfoRow>
              )}
            </CardHeader>
            {isAdmin && (
              <CardFooter>
                <div />
                <Actions onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                    <Edit size={14} style={{ marginRight: '4px' }} />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={14} style={{ marginRight: '4px' }} />
                    Delete
                  </Button>
                </Actions>
              </CardFooter>
            )}
          </CardContent>
        </ResourceCard>
      ))}

      <PaginationContainer>
        <PaginationInfo>
          Showing {data.data.length} {searchQuery || radiusFilter !== null ? 'filtered' : ''} of {data?.total || 0} {type}
          {radiusFilter !== null && latitude && longitude && ` (within ${radiusFilter}km)`}
        </PaginationInfo>
        <PaginationButtons>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={14} style={{ marginRight: '4px' }} />
            Previous
          </Button>
          <PaginationInfo style={{ margin: '0 12px' }}>
            Page {page} of {data?.totalPages || 1}
          </PaginationInfo>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(Math.min(data?.totalPages || 1, page + 1))}
            disabled={page >= (data?.totalPages || 1)}
          >
            Next
            <ChevronRight size={14} style={{ marginLeft: '4px' }} />
          </Button>
        </PaginationButtons>
      </PaginationContainer>
    </ListContainer>
  );
};
