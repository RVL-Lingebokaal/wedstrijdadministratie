'use client';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Button } from '../button/button';
import React from 'react';

interface ConfirmModalProps {
  onClose: () => void;
  text: string;
  title: string;
  onClick: () => void;
}

export function ConfirmModal({
  onClose,
  text,
  title,
  onClick,
}: ConfirmModalProps) {
  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="mx-auto max-w-sm rounded bg-white p-6">
          <DialogTitle className="text-2xl text-black mb-3">
            {title}
          </DialogTitle>
          <Description className="mb-3">{text}</Description>
          <div className="flex justify-between">
            <Button
              onClick={onClose}
              name="Annuleren"
              color="white"
              type="button"
            />
            <Button onClick={onClick} name="Oke" color="primary" />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
