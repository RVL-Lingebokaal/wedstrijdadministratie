import { StyledRadioGroup } from '@components';
import { useCallback, useState } from 'react';
import { Button } from '@components/server';
import { useUpdateTimeChoiceForEntireBlock } from '@hooks';
import { WedstrijdIdProps } from '@models';

export function CorrectionsUpdateChoiceForAll({
  wedstrijdId,
}: WedstrijdIdProps) {
  const [isA, setIsA] = useState(true);
  const [isStart, setIsStart] = useState(true);
  const [block, setBlock] = useState<number>(1);
  const { mutate } = useUpdateTimeChoiceForEntireBlock({ wedstrijdId });

  const onClick = useCallback(() => {
    mutate({ isA, isStart, block });
  }, [mutate, isA, isStart, block]);

  return (
    <div className="px-6 pb-6">
      <div>
        <p>
          Wil je voor 1 specifiek blok kiezen voor A of B tijden, selecteer dan
          eerst welke tijden en welk blok je wil gebruiken. Druk vervolgens op
          de knop om de wijziging door te voeren.
        </p>
      </div>
      <div className="pl-4 pt-4 grid grid-cols-1 w-2/5 gap-2">
        <StyledRadioGroup<boolean>
          items={[
            { label: 'A', value: true },
            { label: 'B', value: false },
          ]}
          selected={isA}
          onChange={setIsA}
        />
        <StyledRadioGroup<boolean>
          items={[
            { label: 'Start', value: true },
            { label: 'Finish', value: false },
          ]}
          selected={isStart}
          onChange={setIsStart}
        />
      </div>
      <div className="pl-4 pt-2 grid grid-cols-1 w-3/5 gap-2">
        <StyledRadioGroup<number>
          items={[
            { label: 'Blok 1', value: 1 },
            { label: 'Blok 2', value: 2 },
            { label: 'Blok 3', value: 3 },
          ]}
          selected={block}
          onChange={setBlock}
        />
      </div>
      <div className="pt-4">
        <Button name="Wijzig blok" color="secondary" onClick={onClick} />
      </div>
    </div>
  );
}
