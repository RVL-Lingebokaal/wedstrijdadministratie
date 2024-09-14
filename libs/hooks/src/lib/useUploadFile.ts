'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation(
    ['upload-bond-file'],
    async (args: { file: File }) => {
      const formData = new FormData();
      formData.set('file', args.file);

      const response = await fetch('/api/fileupload', {
        method: 'POST',
        body: formData,
      });
      const jsonResponse = await response.json();

      if (!response.ok) throw new Error('Could not upload file');

      return { success: true, count: jsonResponse.count };
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: ['get-counts', 'get-teams'],
        }),
    }
  );
}
