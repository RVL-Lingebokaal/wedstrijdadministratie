import { ChangeEvent, useCallback, useRef } from "react";

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
      <button onClick={memoizedOnClick}>Upload bestand</button>
      {/*<button*/}
      {/*  type="file"*/}
      {/*  accept=".xml"*/}
      {/*  ref={hiddenFileInput}*/}
      {/*  onChange={uploadedFile}*/}
      {/*/>*/}
    </>
  );
}
