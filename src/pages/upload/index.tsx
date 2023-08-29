import { UploadButton } from "../../components/organisms/upload-button/UploadButton";

export default function Upload() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-primary mb-2">Upload</h1>
        <p>Upload hier het bestand van de bond.</p>
      </div>
      <UploadButton />
    </div>
  );
}
