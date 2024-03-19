import { forwardRef, useEffect } from "react";
// hooks
import { useEditorMarkings } from "src/hooks/use-editor-markings";
import { getEditorClassNames, useReadOnlyEditor } from "@plane/editor-document-core";
// components
import { PageRenderer } from "src/ui/components/page-renderer";
import { IssueWidgetPlaceholder } from "../extensions/widgets/issue-embed-widget";
// types
import { DocumentDetails } from "src/types/editor-types";

interface IDocumentReadOnlyEditor {
  value: string;
  noBorder: boolean;
  borderOnFocus: boolean;
  customClassName: string;
  onActionCompleteHandler: (action: {
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }) => void;
  tabIndex?: number;
  documentDetails: DocumentDetails;
}

interface DocumentReadOnlyEditorProps extends IDocumentReadOnlyEditor {
  forwardedRef?: React.Ref<EditorHandle>;
}

interface EditorHandle {
  clearEditor: () => void;
  setEditorValue: (content: string) => void;
}

const DocumentReadOnlyEditor = (props: DocumentReadOnlyEditorProps) => {
  const {
    noBorder,
    borderOnFocus,
    customClassName,
    value,
    documentDetails,
    forwardedRef,
    onActionCompleteHandler,
    tabIndex,
  } = props;
  const { updateMarkings } = useEditorMarkings();

  const editor = useReadOnlyEditor({
    value,
    forwardedRef,
    extensions: [IssueWidgetPlaceholder()],
  });

  useEffect(() => {
    if (editor) {
      updateMarkings(editor.getHTML());
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const editorClassNames = getEditorClassNames({
    noBorder,
    borderOnFocus,
    customClassName,
  });

  return (
    <div className="h-full w-full frame-renderer">
      <PageRenderer
        tabIndex={tabIndex}
        onActionCompleteHandler={onActionCompleteHandler}
        updatePageTitle={() => Promise.resolve()}
        readonly
        editor={editor}
        editorClassNames={editorClassNames}
        documentDetails={documentDetails}
      />
    </div>
  );
};

const DocumentReadOnlyEditorWithRef = forwardRef<EditorHandle, IDocumentReadOnlyEditor>((props, ref) => (
  <DocumentReadOnlyEditor {...props} forwardedRef={ref} />
));

DocumentReadOnlyEditorWithRef.displayName = "DocumentReadOnlyEditorWithRef";

export { DocumentReadOnlyEditor, DocumentReadOnlyEditorWithRef };
