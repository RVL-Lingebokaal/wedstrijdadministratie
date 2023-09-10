import { Dialog } from "@headlessui/react";
import { Button } from "../button/button";
import React from "react";

interface ConfirmModalProps {
  onClose: () => void;
  text: string;
  title: string;
  onClick: () => void;
}

export default function ConfirmModal({
  onClose,
  text,
  title,
  onClick,
}: ConfirmModalProps) {
  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-2xl text-black mb-3">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mb-3">{text}</Dialog.Description>
          <div className="flex justify-between">
            <Button
              onClick={onClose}
              name="Annuleren"
              color="white"
              type="button"
            />
            <Button onClick={onClick} name="Oke" color="primary" />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
