"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { Card } from "./ui/card";

const MediaUploadForm = () => {
  return (
    <Card className="p-4">
      <UploadDropzone
        className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-label:text-primary ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </Card>
  );
};

export default MediaUploadForm;
