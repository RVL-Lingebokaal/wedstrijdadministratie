'use client';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Button } from '../button/button';
import React, { FormEvent } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormModalProps<T extends FormEvent<HTMLFormElement>> {
  onClose: () => void;
  onSubmit: (val: T) => void;
  title: string;
  children: React.ReactNode;
  description?: string;
  panelClassNames?: string;
}

export function FormModal<T extends FormEvent<HTMLFormElement>>({
  onClose,
  onSubmit,
  title,
  children,
  description,
  panelClassNames,
}: FormModalProps<T>) {
  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <form
        onSubmit={onSubmit}
        className="fixed inset-0 flex w-screen items-center justify-center"
      >
        <DialogPanel
          className={twMerge(
            'mx-auto max-w-md rounded bg-white p-6',
            panelClassNames
          )}
        >
          <DialogTitle className="text-2xl mb-3">{title}</DialogTitle>
          {description && (
            <Description className="mb-3">{description}</Description>
          )}
          <div className="mb-4">{children}</div>
          <div className="flex justify-between">
            <Button
              onClick={onClose}
              name="Annuleren"
              color="white"
              type="button"
            />
            <Button name="Bevestigen" color="primary" type="submit" />
          </div>
        </DialogPanel>
      </form>
    </Dialog>
  );
}
