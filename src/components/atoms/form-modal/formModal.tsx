import { Dialog } from "@headlessui/react";
import { Button } from "../button/button";
import React from "react";

interface FormModalProps {
  onClose: () => void;
  onSubmit: (val: any) => void;
  title: string;
  children: React.ReactNode;
}

export default function FormModal({
  onClose,
  onSubmit,
  title,
  children,
}: FormModalProps) {
  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <form
        onSubmit={onSubmit}
        className="fixed inset-0 flex w-screen items-center justify-center"
      >
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-2xl mb-3">{title}</Dialog.Title>
          <Dialog.Description className="mb-6">{children}</Dialog.Description>
          <div className="flex justify-between">
            <Button
              onClick={onClose}
              name="Annuleren"
              color="white"
              type="button"
            />
            <Button name="Bevestigen" color="primary" type="submit" />
          </div>
        </Dialog.Panel>
      </form>
    </Dialog>
  );
}
