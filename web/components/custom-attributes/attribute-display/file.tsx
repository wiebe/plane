import { useCallback, useState } from "react";

import { useRouter } from "next/router";

// react-dropzone
import { useDropzone } from "react-dropzone";
// services
import fileService from "services/file.service";
// hooks
import useToast from "hooks/use-toast";
import useWorkspaceDetails from "hooks/use-workspace-details";
// icons
import { getFileIcon } from "components/icons";
import { X } from "lucide-react";
// helpers
import { getFileExtension } from "helpers/attachment.helper";
// types
import { ICustomAttribute } from "types";
// constants
import { MAX_FILE_SIZE } from "constants/workspace";

type Props = {
  attributeDetails: ICustomAttribute;
  className?: string;
  issueId: string;
  projectId: string;
  value: string | undefined;
  onChange: (val: string | undefined) => void;
};

export const CustomFileAttribute: React.FC<Props> = (props) => {
  const { attributeDetails, className = "", onChange, value } = props;

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

  const handleRemoveFile = () => {
    if (!workspaceDetails || !value || value === "") return;

    onChange(undefined);
    fileService.deleteFile(workspaceDetails.id, value);
  };

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
        <div className="group flex items-center justify-between gap-2 p-1 rounded border border-custom-border-200 text-xs truncate w-min max-w-full whitespace-nowrap">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 flex-grow truncate"
          >
            <span className="flex-shrink-0 h-5 w-5">{getFileIcon(getFileExtension(value))}</span>
            <span className="truncate">
              {value.split("/")[value.split("/").length - 1].split("-")[1]}
            </span>
          </a>
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 grid place-items-center flex-shrink-0"
            onClick={handleRemoveFile}
          >
            <X size={12} strokeWidth={1.5} />
          </button>
        </div>
      )}
      <div
        {...getRootProps()}
        className={`flex items-center bg-custom-background-80 text-xs rounded px-2.5 py-0.5 cursor-pointer truncate w-min max-w-full whitespace-nowrap ${
          isDragActive ? "bg-custom-primary-100/10" : ""
        } ${isDragReject ? "bg-red-500/10" : ""} ${className}`}
      >
        <input className="flex-shrink-0" {...getInputProps()} />
        <span className={`flex-grow truncate text-left ${fileError ? "text-red-500" : ""}`}>
          {isDragActive
            ? "Drop here..."
            : fileError
            ? fileError
            : isUploading
            ? "Uploading..."
            : `Upload ${value && value !== "" ? "new " : ""}file`}
        </span>
      </div>
    </div>
  );
};
