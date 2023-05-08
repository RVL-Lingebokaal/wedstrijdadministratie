import { ChangeEvent, useCallback, useRef } from "react";
import { Button } from "@mui/material";
import { Upload } from "@mui/icons-material";
import { StyledFileInput } from "../../atoms/input/StyledInput";

export function UploadButton() {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const memoizedOnClick = useCallback(() => {
    if (hiddenFileInput?.current) {
      hiddenFileInput.current.click();
    }
  }, []);

  const uploadedFile = useCallback(
    ({ target: { files, validity } }: ChangeEvent<HTMLInputElement>) => {
      if (validity.valid && files) {
        console.log(files[0]);
      }
    },
    []
  );

  return (
    <>
      <Button
        startIcon={<Upload />}
        onClick={memoizedOnClick}
        variant="contained"
      >
        Upload bestand
      </Button>
      <StyledFileInput
        type="file"
        accept=".xml"
        ref={hiddenFileInput}
        onChange={uploadedFile}
      />
    </>
  );
}
