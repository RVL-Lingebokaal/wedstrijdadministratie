import { useDownload } from '@hooks';
import { Button } from '@components/server';
import { QUERY_PARAMS } from '@utils';
import { WedstrijdIdProps } from '@models';

export function DownloadButtonsKamprechters({ wedstrijdId }: WedstrijdIdProps) {
  const downloadKamprechters = useDownload({});

  return (
    <div className="flex gap-x-3">
      {[1, 2, 3].map((value) => {
        return (
          <Button
            key={value}
            onClick={() =>
              downloadKamprechters({
                url: `/api/downloads/kamprechter?${QUERY_PARAMS.heat}=${value}&${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
                fileName: `kamprechtersHeat${value}.xlsx`,
              })
            }
            name={`Kamprechters heat ${value}`}
            color="secondary"
            classNames="w-fit"
          />
        );
      })}
    </div>
  );
}
