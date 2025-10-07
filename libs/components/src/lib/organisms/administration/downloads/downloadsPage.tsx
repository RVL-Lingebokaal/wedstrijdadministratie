import { DownloadButtonAll } from './downloadButtonAll';
import { DownloadButtonsKamprechters } from './downloadButtonsKamprechters';
import { WedstrijdIdProps } from '@models';

export function DownloadsPage({ wedstrijdId }: WedstrijdIdProps) {
  return (
    <div className="px-4">
      <h1 className="font-bold text-2xl pb-3">Downloads</h1>
      <div className="flex flex-col gap-y-3">
        <DownloadButtonAll wedstrijdId={wedstrijdId} />
        <DownloadButtonsKamprechters wedstrijdId={wedstrijdId} />
      </div>
    </div>
  );
}
