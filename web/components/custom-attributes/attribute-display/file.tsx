import { useCallback, useState } from "react";

import { useRouter } from "next/router";

// react-dropzone
import { useDropzone } from "react-dropzone";
// services
import fileService from "services/file.service";
// hooks
import useToast from "hooks/use-toast";
// icons
import { getFileIcon } from "components/icons";
// helpers
import { getFileExtension, getFileName } from "helpers/attachment.helper";
// types
import { Props } from "./types";
import useWorkspaceDetails from "hooks/use-workspace-details";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const CustomFileAttribute: React.FC<Props & { value: string | undefined }> = (props) => {
  const { attributeDetails, onChange, value } = props;

  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { workspaceDetails } = useWorkspaceDetails();

  const { setToastAlert } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles[0] || !workspaceSlug) return;

      const extension = getFileExtension(acceptedFiles[0].name);

      if (!attributeDetails.extra_settings?.file_formats?.includes(`.${extension}`)) {
        setToastAlert({
          type: "error",
          title: "Error!",
          message: `File format not accepted. Accepted file formats- ${attributeDetails.extra_settings?.file_formats?.join(
            ", "
          )}`,
        });
        return;
      }

      const formData = new FormData();
      formData.append("asset", acceptedFiles[0]);
      formData.append(
        "attributes",
        JSON.stringify({
          name: acceptedFiles[0].name,
          size: acceptedFiles[0].size,
        })
      );
      setIsUploading(true);

      fileService
        .uploadFile(workspaceSlug.toString(), formData)
        .then((res) => {
          const imageUrl = res.asset;

          onChange(imageUrl);

          if (value && value !== "" && workspaceDetails)
            fileService.deleteFile(workspaceDetails.id, value);
        })
        .finally(() => setIsUploading(false));
    },
    [
      attributeDetails.extra_settings?.file_formats,
      onChange,
      setToastAlert,
      value,
      workspaceDetails,
      workspaceSlug,
    ]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading,
  });

  const fileError =
    fileRejections.length > 0
      ? `Invalid file type or size (max ${MAX_FILE_SIZE / 1024 / 1024} MB)`
      : null;

  return (
    <div className="flex-shrink-0 truncate space-y-1">
      {value && value !== "" && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 p-1 rounded border border-custom-border-200 text-xs truncate"
        >
          <span className="flex-shrink-0 h-6 w-6">{getFileIcon(getFileExtension(value))}</span>
          <span className="truncate">{getFileName(value)}</span>
        </a>
      )}
      <div
        {...getRootProps()}
        className={`flex items-center justify-center border-2 border-dashed text-custom-primary bg-custom-primary/5 text-xs rounded-md px-2.5 py-0.5 cursor-pointer ${
          isDragActive ? "bg-custom-primary/10 border-custom-primary" : "border-custom-border-200"
        } ${isDragReject ? "bg-red-500/10" : ""}`}
      >
        <input {...getInputProps()} />
        <span className="flex items-center gap-2">
          {isDragActive ? (
            <p>Drop here...</p>
          ) : fileError ? (
            <p className="text-center text-red-500">{fileError}</p>
          ) : isUploading ? (
            <p className="text-center">Uploading...</p>
          ) : (
            <p className="text-center">Upload {value && value !== "" ? "new " : ""}file</p>
          )}
        </span>
      </div>
    </div>
  );
};
