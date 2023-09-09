import { Dialog } from "@headlessui/react";
import { Button } from "../button/button";

interface ErrorModalProps {
  onClose: () => void;
  text: string;
}

export default function ErrorModal({ onClose, text }: ErrorModalProps) {
  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-2xl text-red-600 mb-3">
            ! Let op
          </Dialog.Title>
          <Dialog.Description className="mb-3">{text}</Dialog.Description>
          <Button onClick={onClose} name="Oke" color="error" />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
