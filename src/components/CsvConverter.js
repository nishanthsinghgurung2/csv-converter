import react, { createRef, useState } from 'react';
import { CSVDownloader, CSVReader } from 'react-papaparse';
import { extractContractSize } from '../utils/utils';
const buttonRef = createRef();


const CsvConverter = () => {
    const [enrichedCsv, setEnrichedCsv] = useState([]);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [isFileRemoved, setIsFileRemoved] = useState(false);
    const [isFileUploadError, setIsFileUploadError] = useState(false);

    const handleOpenDialog = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (buttonRef.current) {
          buttonRef.current.open(e)
        }
      }
    
    const handleOnFileLoad = (data) => {
        console.log('--------File loaded-------------------')
        
        data.shift(); // Remove first row as it is not needed
        let isinColIndex = 0;
        let cfiCodeColIndex = 0;
        let venueColIndex = 0;
        let algoParamsColIndex = 0;
        
        const outputData = [];

        data && data.map((csvRowData, index) => {
            if(index === 0) {
                csvRowData && csvRowData?.data?.forEach((element, index) => {
                    if(element === 'ISIN') {
                        isinColIndex = index;
                    } else if ( element === 'Venue') {
                        venueColIndex = index;
                    } else if ( element === 'CFICode') {
                        cfiCodeColIndex = index;
                    } else if( element === 'AlgoParams') {
                        algoParamsColIndex = index;
                    }
                });
            } else {
                if(csvRowData?.data && !(csvRowData.data.length === 1 && csvRowData.data[0] === "")) {

                    outputData.push({
                        "ISIN": csvRowData.data[isinColIndex], 
                        "CFICode": csvRowData.data[cfiCodeColIndex],
                        "Venue": csvRowData.data[venueColIndex],
                        "ContractSize": extractContractSize(csvRowData.data[algoParamsColIndex]),
                    });
                }
            }
        });
        console.log(outputData);
        setEnrichedCsv(outputData);
        setIsFileUploaded(true);
        setIsFileRemoved(false);
        setIsFileUploadError(false);
        console.log('---------------------------')
      }
    
    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
        setIsFileUploadError(true);
        setIsFileUploaded(false);
        setIsFileRemoved(false);
      }
    
    const handleOnRemoveFile = (data) => {
        console.log('---------------------------')
        setIsFileRemoved(true);
        setIsFileUploaded(false);
        setIsFileUploadError(false);
        console.log('---------------------------')
      }
    
      const handleRemoveFile = (e) => {
        // Note that the ref is set async, so it might be null at some point
        if (buttonRef.current) {
          buttonRef.current.removeFile(e)
        }
      }
    
        return (
            <>
            <CSVReader
                ref={buttonRef}
                onFileLoad={handleOnFileLoad}
                onError={handleOnError}
                noClick
                noDrag
                onRemoveFile={handleOnRemoveFile}
            >
                {({ file }) => (
                <aside
                    style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: 10
                    }}
                >
                    <button
                    type='button'
                    onClick={handleOpenDialog}
                    style={{
                        borderRadius: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        width: '40%',
                        paddingLeft: 0,
                        paddingRight: 0
                    }}
                    >
                    Browse file
                    </button>
                    <div
                    style={{
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: '#ccc',
                        height: 45,
                        lineHeight: 2.5,
                        marginTop: 5,
                        marginBottom: 5,
                        paddingLeft: 13,
                        paddingTop: 3,
                        width: '60%'
                    }}
                    >
                    {file && file.name}
                    </div>
                    <button
                    style={{
                        borderRadius: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        paddingLeft: 20,
                        paddingRight: 20
                    }}
                    onClick={handleRemoveFile}
                    >
                    Remove
                    </button>
                </aside>
                )}
            </CSVReader>
            {isFileUploaded? <div style={{ color: 'green', padding: '20px'}}>Congratulations! File successfully uploaded, enriched and ready to be downloaded</div>: null}
            {isFileRemoved? <div style={{ color: 'green', padding: '20px'}}>File removed</div>: null}
            {isFileUploadError? <div style={{ color: 'red', padding: '20px'}}>Error uploading file. Please check if the file is in valid csv format.</div>: null}
            {isFileUploaded? <CSVDownloader
                data={enrichedCsv}
                type="button"
                filename={'DataExtractor_Example_Output'}
                bom={true}
            >
            Download
        </CSVDownloader>: null}
            
      </>
        );
};

export default CsvConverter;