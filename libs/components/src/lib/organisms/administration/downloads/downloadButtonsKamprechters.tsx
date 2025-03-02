import { useDownload } from '@hooks';
import { Button } from '@components/server';

export function DownloadButtonsKamprechters() {
  const downloadKamprechters = useDownload({});

  return (
    <div className="flex gap-x-3">
      {[1, 2, 3].map((value) => {
        return (
          <Button
            key={value}
            onClick={() =>
              downloadKamprechters({
                url: `/api/downloads/kamprechter?heat=${value}`,
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
