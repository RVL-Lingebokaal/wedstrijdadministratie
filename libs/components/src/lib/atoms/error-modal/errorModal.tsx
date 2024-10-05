'use client';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Button } from '../button/button';

interface ErrorModalProps {
  onClose: () => void;
  text: string;
}

export function ErrorModal({ onClose, text }: ErrorModalProps) {
  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="mx-auto max-w-sm rounded bg-white p-6">
          <DialogTitle className="text-2xl text-red-600 mb-3">
            ! Let op
          </DialogTitle>
          <Description className="mb-3">{text}</Description>
          <Button onClick={onClose} name="Oke" color="error" />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
