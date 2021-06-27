import React from "react";
import "./CsvParser.css";
import { CSVLink } from "react-csv";
import useCsvParser from "./useCsvParser";

const CsvParser = () => {
  const {
    fileRejections,
    enrichedCsv,
    getRootProps,
    getInputProps,
    isFileUploaded,
  } = useCsvParser();

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div className="invalid-file" key={file.path}>
      {errors.map((e) => (
        <div key={e.code}>{e.message}</div>
      ))}
    </div>
  ));

  const fileUploaded = () => {
    return (
      <>
        <div className="file-upload-success" data-testid="file-upload-successful">
          Congratulations! File successfully uploaded, enriched and ready to be
          downloaded
        </div>
        <div>
          <h6>Uploaded file contents</h6>
          <ul className="enriched-csv-contents">
            <li>
              <strong>ISIN - CFICode - Venue - ContractSize</strong>
            </li>
            {enrichedCsv &&
              enrichedCsv.map((enrichedCsvRowData, index) => (
                <li data-testid={`enriched-${index}`} key={`enriched-${index}`}>
                  {enrichedCsvRowData.ISIN} - {enrichedCsvRowData.CFICode} -{" "}
                  {enrichedCsvRowData.Venue} - {enrichedCsvRowData.ContractSize}
                </li>
              ))}
          </ul>
        </div>
      </>
    );
  };

  return (
    <div className="csv-parser-container">
      <div className="csv-parser" {...getRootProps()}>
        <input data-testid="csv-file-upload" {...getInputProps()} />
        <p>Drop 'n' Drop some files here or click to upload</p>
      </div>
      {isFileUploaded ? fileUploaded() : null}
      {fileRejectionItems}
      {isFileUploaded && enrichedCsv.length > 0 ? (
        <CSVLink data-testid="enriched-csv-download" data={enrichedCsv}>
          Download Enriched CsvFile
        </CSVLink>
      ) : null}
    </div>
  );
};

export default CsvParser;
