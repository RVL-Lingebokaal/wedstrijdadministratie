'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_PARAMS } from '@utils';

export function useUploadFile(wedstrijdId: string) {
  const queryClient = useQueryClient();

  return useMutation(
    ['upload-bond-file'],
    async (args: { file: File }) => {
      const formData = new FormData();
      formData.set('file', args.file);

      const response = await fetch(
        `/api/wedstrijd/fileupload?${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const jsonResponse = await response.json();

      if (!response.ok) throw new Error('Could not upload file');

      return { success: true, count: jsonResponse.count };
    },
    {
      onSuccess: async () =>
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['get-counts'] }),
          queryClient.invalidateQueries({ queryKey: ['get-teams'] }),
        ]),
    }
  );
}
