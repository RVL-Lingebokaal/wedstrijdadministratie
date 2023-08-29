import { useMutation } from "@tanstack/react-query";

export function useUploadFile() {
  return useMutation(["upload-bond-file"], async (args: { file: File }) => {
    const formData = new FormData();
    formData.set("file", args.file);

    const response = await fetch("/api/fileupload/bond", {
      method: "POST",
      body: formData,
    });
    const jsonResponse = await response.json();

    if (!response.ok) throw new Error("Could not upload file");

    return { success: true, count: jsonResponse.count };
  });
}
