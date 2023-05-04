import { useEffect, useState, useRef } from "react";

import { useDropzone } from "react-dropzone";

// icons
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { FolderPlusIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { Input, Spinner } from "components/ui";

const DUMMY_CSV = `id,name,age,active
1,"John - Test",20,TRUE
2,,30,TRUE
3,Jim,40,FALSE
4,Joe,50,FALSE
5,Jane,50,TRUE
6,Jill,70,TRUE
7,Joy,80,TRUE
8,Joyce,90,FALSE
9,Joyce,100,TRUE
10,Joyce,110,TRUE
11,Joyce,120,TRUE
12,,130,FALSE
13,Joyce,140,TRUE
14,Joyce,150,TRUE
15,,160,TRUE
16,Joyce,170,FALSE
17,Joyce,180,TRUE
18,,190,TRUE
19,,200,FALSE
20,Joyce,210,FALSE
21,Joyce,220,TRUE
22,Joe,230,TRUE
23,,240,FALSE`;

const csvOrExcelToJson = (csv: string) => {
  const lines = csv.split(/\r\n|\n/);

  const result = [];

  const headers = lines[0].split(/,|;|\t|\|/);

  for (let i = 1; i < lines.length; i++) {
    const obj: any = {};
    const currentLine = lines[i].split(/,|;|\t|\|/);

    for (let j = 0; j < headers.length; j++) {
      if (currentLine[j]?.toUpperCase() === "TRUE" || currentLine[j]?.toUpperCase() === "FALSE") {
        obj[headers[j]] = currentLine[j] === "TRUE";
      } else if (
        !isNaN(Number(currentLine[j])) &&
        currentLine[j] !== "" &&
        currentLine[j] !== null &&
        currentLine[j] !== undefined
      ) {
        obj[headers[j]] = Number(currentLine[j]);
      } else {
        obj[headers[j]] = currentLine[j] || null;
      }
    }

    result.push(obj);
  }

  return result;
};

const Testings = () => {
  const invalidItems = useRef<any[]>([]);

  const [data, setData] = useState<any>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");

  const [csvInput, setCsvInput] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setCsvInput(acceptedFiles[0]);
    },
  });

  useEffect(() => {
    if (csvInput) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = csvOrExcelToJson(reader.result as string);

        setData(
          csvData.map((item) => ({
            ...item,
            isInValid: Object.values(item).some((value) => value === null),
          }))
        );
      };
      reader.readAsText(csvInput);
    }
  }, [csvInput]);

  if (csvInput === null)
    return (
      <div className="container mx-auto flex h-screen items-center justify-center py-10">
        <button
          type="button"
          {...getRootProps()}
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <input {...getInputProps()} />
          <FolderPlusIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
          <span className="mt-2 block text-sm font-semibold text-gray-900">
            {isDragActive
              ? "Drop the files here ..."
              : "Drag and drop a CSV file here, or click to select a file"}
          </span>
        </button>
      </div>
    );

  //   useEffect(() => {
  //     const data = csvOrExcelToJson(DUMMY_CSV).map((item) => ({
  //       ...item,
  //       isInValid: Object.values(item).some((value) => value === null),
  //     }));

  //     setData(data);
  //   }, []);

  const filterData =
    searchInput && searchInput.length > 0
      ? data?.filter((item: any) => item?.name?.toLowerCase().includes(searchInput.toLowerCase()))
      : data;

  if (!data)
    return (
      <div className="container mx-auto flex h-screen items-center justify-center py-10">
        <Spinner />
      </div>
    );

  const jumpToInvalid = (direction: "up" | "down" = "down") => {
    const tableContainer = document.getElementById("table-container") as HTMLElement;

    const currentScrollPosition = tableContainer.scrollTop;

    const currentId = invalidItems.current.find(
      (item) => item.offsetTop > currentScrollPosition
    )?.id;

    const invalidItem = invalidItems.current.find((item) => item.id === currentId);

    if (!invalidItem) return;

    const index = invalidItems.current.indexOf(invalidItem);

    const nextInvalidItem =
      direction === "down" ? invalidItems.current[index + 1] : invalidItems.current[index - 1];

    if (!nextInvalidItem) return;

    const nextInvalidItemId = nextInvalidItem.id;

    const nextInvalidItemElement = document.getElementById(nextInvalidItemId) as HTMLElement;

    if (!nextInvalidItemElement) return;

    nextInvalidItemElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    nextInvalidItemElement.classList.add("animate-pulse");
    nextInvalidItemElement.classList.add("bg-gray-200");
    setTimeout(() => {
      nextInvalidItemElement.classList.remove("animate-pulse");
      nextInvalidItemElement.classList.remove("bg-gray-200");
    }, 1000);
  };

  if (!filterData) return <Spinner />;

  return (
    <div className="container mx-auto h-screen py-10">
      <div className="mt-8 flow-root h-full">
        <div className="-mx-4 -my-2 flex h-full flex-col overflow-x-auto px-10 sm:-mx-6 lg:-mx-8">
          <div className="space-y-2">
            <Input
              id="search"
              name="search"
              type="text"
              autoComplete="off"
              value={searchInput}
              placeholder="Search"
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="relative flex h-full min-w-full gap-2 overflow-auto py-2 align-middle">
            <div id="table-container" className="flex-1 overflow-auto">
              <table className="w-full divide-y divide-gray-300 border">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map(
                      (key, index) =>
                        key !== "isInValid" && (
                          <th
                            key={index}
                            scope="col"
                            className={`sticky top-0 z-10 bg-white bg-opacity-75 py-3.5 text-left text-sm font-semibold capitalize text-gray-900 backdrop-blur backdrop-filter ${
                              index === 0 ? "pl-4 pr-3" : "px-3 sm:pl-0"
                            }`}
                          >
                            {key}
                          </th>
                        )
                    )}
                    <th
                      scope="col"
                      className="sticky top-0 z-10 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-0"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filterData.map((row: any, index: number) => (
                    <tr
                      id={row.id}
                      ref={(el) => {
                        if (row.isInValid && el) invalidItems.current.push(el);
                      }}
                      key={index}
                    >
                      {Object.keys(row).map(
                        (key, jIndex) =>
                          key !== "isInValid" && (
                            <td
                              key={jIndex}
                              className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium ${
                                jIndex ? "text-gray-500 sm:pl-0" : "text-gray-900"
                              }`}
                            >
                              {editIndex === index && key !== "id" ? (
                                typeof row[key] === "boolean" ? (
                                  <div className="flex items-center">
                                    <input
                                      id={key}
                                      name={key}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      checked={row[key]}
                                      onChange={(e) => {
                                        const value = e.target.checked;
                                        setData((prev: any[]) =>
                                          prev.map((item, i) =>
                                            i === index ? { ...item, [key]: value } : item
                                          )
                                        );
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <Input
                                    id={key}
                                    name={key}
                                    type={typeof row[key] === "number" ? "number" : "text"}
                                    autoComplete="off"
                                    value={row[key] ?? ""}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isInValid = key === "name" ? value === "" : false;
                                      setData((prev: any[]) =>
                                        prev.map((item, i) =>
                                          i === index ? { ...item, [key]: value, isInValid } : item
                                        )
                                      );

                                      if (!isInValid) {
                                        const invalidItem = invalidItems.current.find(
                                          (item) => parseInt(item.id) === parseInt(row.id)
                                        );
                                        if (invalidItem) {
                                          invalidItems.current.splice(
                                            invalidItems.current.indexOf(invalidItem),
                                            1
                                          );
                                        }
                                      }
                                    }}
                                  />
                                )
                              ) : typeof row[key] === "boolean" ? (
                                row[key] ? (
                                  <CheckIcon className="h-5 w-5 text-green-500" />
                                ) : (
                                  <XMarkIcon className="h-5 w-5 text-red-500" />
                                )
                              ) : (
                                row[key] ?? "-"
                              )}
                            </td>
                          )
                      )}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-2">
                        <button
                          onClick={() => {
                            if (editIndex === index) setEditIndex(null);
                            else setEditIndex(index);
                          }}
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {editIndex === index ? (
                            <>
                              Done<span className="sr-only">, Done</span>
                            </>
                          ) : (
                            <>
                              Edit<span className="sr-only">, Edit</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
                onClick={() => jumpToInvalid("up")}
              >
                <ChevronUpIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
                onClick={() => jumpToInvalid("down")}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div>
            <div className="my-5 space-y-2">
              <p>
                <span className="font-semibold">Total Invalid:</span>{" "}
                {data.filter((item: any) => item.isInValid).length}
              </p>
              <p>
                <span className="font-semibold">Total Count:</span> {data.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testings;

// const handleDownload = (fileType: "csv" | "xlsx") => {
//   const csv = convertToCSVOrExcel(data, fileType);

//   const blob = new Blob([csv], {
//     type:
//       fileType === "csv"
//         ? "text/csv;charset=utf-8;"
//         : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
//   });

//   const link = document.createElement("a");
//   const url = URL.createObjectURL(blob);
//   link.setAttribute("href", url);
//   link.setAttribute("download", `data.${fileType}`);
//   link.style.visibility = "hidden";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   URL.revokeObjectURL(url);
// };

// const convertToCSVOrExcel = (data: any, fileType: "csv" | "xlsx" = "csv") => {
//   const headers = Object.keys(data[0]);

//   const divider = fileType === "csv" ? "," : "\t";

//   let csv = headers.join(divider);

//   csv += "\r\n";

//   for (const item of data) {
//     csv += Object.values(item).join(divider);
//     csv += "\r\n";
//   }

//   return csv;
// };
