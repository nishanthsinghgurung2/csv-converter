import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import csv from "csv";

const extractContractSize = (algoParams) => {
  const priceMultiplierIndex = algoParams.indexOf("PriceMultiplier:");
  const stringStartsWithPriceMultiplier = algoParams.substring(priceMultiplierIndex);
  const contractSizeStartIndex = stringStartsWithPriceMultiplier.indexOf(":") + 1;
  const contractSizeEndIndex = stringStartsWithPriceMultiplier.indexOf("|");
  return stringStartsWithPriceMultiplier.substring(
    contractSizeStartIndex,
    contractSizeEndIndex
  );
};

const useCsvParser = () => {
  const [enrichedCsv, setEnrichedCsv] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isFileRemoved, setIsFileRemoved] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();

    reader.onload = () => {
      // Parse CSV file
      csv.parse(reader.result, (err, data) => {
        setIsFileUploaded(true);
        setIsFileRemoved(false);

        if (data && data.length > 0) {
          data.shift(); // Remove first row as it is not needed
        }

        let isinColIndex = 0;
        let cfiCodeColIndex = 0;
        let venueColIndex = 0;
        let algoParamsColIndex = 0;

        const outputData = [];

        data &&
          data.map((csvRowData, index) => {
            if (index === 0) {
              // Column heading row get index.
              csvRowData &&
                csvRowData?.forEach((element, index) => {
                  if (element === "ISIN") {
                    isinColIndex = index;
                  } else if (element === "Venue") {
                    venueColIndex = index;
                  } else if (element === "CFICode") {
                    cfiCodeColIndex = index;
                  } else if (element === "AlgoParams") {
                    algoParamsColIndex = index;
                  }
                });
            } else {
              if (csvRowData && csvRowData.length > 0) {
                outputData.push({
                  ISIN: csvRowData[isinColIndex],
                  CFICode: csvRowData[cfiCodeColIndex],
                  Venue: csvRowData[venueColIndex],
                  ContractSize: extractContractSize(csvRowData[algoParamsColIndex]),
                });
              }
            }
          });
        setEnrichedCsv(outputData);
      });
    };

    // read file contents
    acceptedFiles.forEach((file) => reader.readAsBinaryString(file));
  }, []);

  const csvFilesValidator = (file) => {
    if (file.type !== "text/csv") {
      setIsFileUploaded(false);
      setIsFileRemoved(false);
      return {
        code: "Invalid file type",
        message: "Invalid file type. Please upload only csv files",
      };
    }
  };

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    validator: csvFilesValidator,
  });
  return {
    fileRejections,
    enrichedCsv,
    getRootProps,
    getInputProps,
    isFileUploaded,
  };
};

export default useCsvParser;
