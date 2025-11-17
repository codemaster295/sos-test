import React, { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ambulanceApi, doctorApi } from '../lib/api';
import { Ambulance, Doctor, ResourceType } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { ResourceForm } from './ResourceForm';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ResourceType;
  resource?: Ambulance | Doctor | null;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  type,
  resource,
}) => {
  const queryClient = useQueryClient();
  const api = type === 'ambulances' ? ambulanceApi : doctorApi;
  const isEdit = !!resource;
  const formRef = useRef<HTMLFormElement>(null);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Ambulance | Doctor>) => api.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Ambulance | Doctor> }) =>
      api.update(id, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
      onClose();
    },
  });

  const handleSubmit = (data: Partial<Ambulance | Doctor>) => {
    if (isEdit && resource) {
      updateMutation.mutate({ id: resource.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          formRef.current?.requestSubmit();
        }}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit ${type.slice(0, -1)}` : `Add New ${type.slice(0, -1)}`}
      footer={footer}
    >
      {isLoading ? (
        <LoadingSpinner message="Saving..." />
      ) : (
        <ResourceForm
          type={type}
          initialData={resource}
          onSubmit={handleSubmit}
          formRef={formRef}
        />
      )}
    </Modal>
  );
};

