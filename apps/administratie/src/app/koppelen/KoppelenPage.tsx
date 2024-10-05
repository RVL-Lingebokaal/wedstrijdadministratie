'use client';
import { useState } from 'react';
import { Field, RadioGroup } from '@headlessui/react';

export function KoppelenPage() {
  const [isA, setIsA] = useState(true);

  return (
    <div className="flex">
      <div className="w-full">
        <RadioGroup value={isA} onChange={setIsA}>
          <Field></Field>
        </RadioGroup>
      </div>
    </div>
  );
}
