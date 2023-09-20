import { useCallback, useState } from "react";

import { useRouter } from "next/router";

// mobx
import { useMobxStore } from "lib/mobx/store-provider";
import { observer } from "mobx-react-lite";
// react-dropzone
import { useDropzone } from "react-dropzone";
// services
import fileService from "services/file.service";
// hooks
import useWorkspaceDetails from "hooks/use-workspace-details";
import useToast from "hooks/use-toast";
// components
// ui
import { Loader, Tooltip } from "components/ui";
// icons
import { Plus, Trash2, X } from "lucide-react";
import { getFileIcon } from "components/icons";
// helpers
import { getFileExtension } from "helpers/attachment.helper";
// types
import { ICustomAttribute } from "types";

type Props = {
  entityId: string;
  issueId: string;
  onChange: (attributeId: string, val: string | string[] | undefined) => void;
  projectId: string;
  values: { [key: string]: string[] };
};

type FileUploadProps = {
  attributeDetails: ICustomAttribute;
  className?: string;
  issueId: string;
  projectId: string;
  value: string | undefined;
  onChange: (val: string | undefined) => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const UploadFile: React.FC<FileUploadProps> = (props) => {
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
      {value && value !== "" ? (
        <div className="group flex items-center justify-between gap-1.5 h-10 px-2.5 rounded border border-custom-border-200 text-xs truncate w-full">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 flex-grow truncate"
          >
            <span className="flex-shrink-0 h-6 w-6 grid place-items-center border border-custom-border-200 p-1 rounded-sm">
              {getFileIcon(getFileExtension(value))}
            </span>
            <span className="truncate">
              {value.split("/")[value.split("/").length - 1].split("-")[1]}
            </span>
          </a>
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 grid place-items-center flex-shrink-0"
            onClick={handleRemoveFile}
          >
            <Trash2 size={12} strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex items-center text-xs rounded cursor-pointer truncate w-full ${
            isDragActive ? "bg-custom-primary-100/10" : ""
          } ${isDragReject ? "bg-red-500/10" : ""} ${className}`}
        >
          <input className="flex-shrink-0" {...getInputProps()} />
          <div
            className={`border border-dashed flex items-center gap-1.5 h-10 px-2.5 rounded text-custom-text-400 w-full ${
              fileError ? "border-red-500" : "border-custom-primary-100"
            }`}
          >
            <span className="bg-custom-primary-100/10 rounded-sm text-custom-primary-100 h-4 w-4 grid place-items-center">
              <Plus size={10} strokeWidth={1.5} />
            </span>
            {isDragActive ? (
              <span>Drop here</span>
            ) : fileError ? (
              <span>File error</span>
            ) : isUploading ? (
              <span>Uploading...</span>
            ) : (
              <span>Drag and drop files</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const CustomAttributesFileUploads: React.FC<Props> = observer((props) => {
  const { entityId, onChange, issueId, projectId, values } = props;

  const { customAttributes } = useMobxStore();

  const attributes = customAttributes.entityAttributes[entityId] ?? {};

  const fileUploadFields = Object.values(attributes).filter((a) => a.type === "file");

  return (
    <>
      {customAttributes.fetchEntityDetailsLoader ? (
        <Loader className="space-y-3.5">
          <Loader.Item height="35px" />
          <Loader.Item height="35px" />
          <Loader.Item height="35px" />
        </Loader>
      ) : (
        <div>
          <h5 className="text-sm">File uploads</h5>
          <div className="mt-3.5 grid grid-cols-3 gap-4">
            {Object.entries(fileUploadFields).map(([attributeId, attribute]) => (
              <div key={attributeId}>
                <Tooltip tooltipContent={attribute.display_name} position="top-left">
                  <p className="text-xs text-custom-text-300 truncate">{attribute.display_name}</p>
                </Tooltip>
                <div className="flex-shrink-0 mt-2">
                  <UploadFile
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val) => onChange(attribute.id, val)}
                    projectId={projectId}
                    value={values[attribute.id]?.[0] ? values[attribute.id]?.[0] : undefined}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
});
