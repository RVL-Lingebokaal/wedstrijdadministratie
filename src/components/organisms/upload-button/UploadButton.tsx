import { ChangeEvent, useCallback, useRef } from "react";
import { Button } from "../../atoms/button/button";
import { useUploadFile } from "../../../hooks/useUploadFile";

export function UploadButton() {
  const { mutate, isLoading } = useUploadFile();
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const memoizedOnClick = useCallback(() => {
    if (hiddenFileInput?.current) {
      hiddenFileInput.current.click();
    }
  }, []);

  const uploadedFile = useCallback(
    ({ target: { files, validity } }: ChangeEvent<HTMLInputElement>) => {
      if (validity.valid && files) {
        void mutate({ file: files[0] });
      }
    },
    [mutate]
  );

  return (
    <>
      <Button
        onClick={memoizedOnClick}
        color="primary"
        name="Upload bestand"
        isLoading={isLoading}
      />
      <input
        type="file"
        accept="text/csv"
        ref={hiddenFileInput}
        onChange={uploadedFile}
        className="hidden"
      />
    </>
  );
}
