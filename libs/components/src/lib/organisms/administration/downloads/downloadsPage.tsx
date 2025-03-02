import { DownloadButtonAll } from './downloadButtonAll';
import { DownloadButtonsKamprechters } from './downloadButtonsKamprechters';

export function DownloadsPage() {
  return (
    <div className="px-4">
      <h1 className="font-bold text-2xl pb-3">Downloads</h1>
      <div className="flex flex-col gap-y-3">
        <DownloadButtonAll />
        <DownloadButtonsKamprechters />
      </div>
    </div>
  );
}
