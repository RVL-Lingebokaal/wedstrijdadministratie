import { useCallback } from 'react';

interface UseDownloadProps {
  url: string;
  fileName: string;
}

export function useDownload({ url, fileName }: Partial<UseDownloadProps>) {
  return useCallback(
    async (props?: Partial<UseDownloadProps>) => {
      if (!props?.url && !url) {
        throw new Error('No url provided');
      }

      const response = await fetch(props?.url ?? url ?? '');
      const blob = await response.blob();

      // Create a URL for the file
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = props?.fileName ?? fileName ?? '';
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    [url, fileName]
  );
}
