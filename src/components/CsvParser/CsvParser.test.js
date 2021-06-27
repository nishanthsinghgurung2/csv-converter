import { fireEvent, render, waitFor } from "@testing-library/react";
import CsvParser from "./CsvParser";

test("check if csv file is successfully uploaded", async () => {
  const rows = [
    "TimeZone=UTC, , , , ",
    "ISIN,DummyCol,CFICode,Venue,AlgoParams",
    "DE000ABCDEFG,blah,FFICSX,XEUR,InstIdentCode:DE000ABCDEFG|;InstFullName:DAX|;InstClassification:FFICSX|;NotionalCurr:EUR|;PriceMultiplier:20.0|;UnderlInstCode:DE0001234567|;UnderlIndexName:DAX PERFORMANCE-INDEX|;OptionType:OTHR|;StrikePrice:0.0|;OptionExerciseStyle:|;ExpiryDate:2021-01-01|;DeliveryType:PHYS|",
    "PL0ABCDEFGHI,blah,FFICSX,WDER,InstIdentCode:PL0ABCDEFGHI|;InstFullName:Wig 20 Index|;InstClassification:FFICSX|;NotionalCurr:PLN|;PriceMultiplier:25.0|;UnderlInstCode:PL9991234567|;UnderlIndexName:WIG20 PLN|;OptionType:OTHR|;StrikePrice:0.0|;OptionExerciseStyle:|;ExpiryDate:2021-01-01|;DeliveryType:PHYS|",
  ];
  const file = new File([rows.join("\n")], "some.csv", { type: "text/csv" });
  const { getByText, getByTestId } = render(<CsvParser />);
  const formElement = getByTestId("csv-file-upload");
  Object.defineProperty(formElement, "files", { value: [file] });
  fireEvent.drop(formElement);
  const fileSuccessfullyUploadedText =
    "Congratulations! File successfully uploaded, enriched and ready to be downloaded";
  await waitFor(() => getByText(fileSuccessfullyUploadedText));

  expect(getByText(fileSuccessfullyUploadedText)).toBeInTheDocument();
});

test("check if uploaded file contents are enriched properly", async () => {
  const rows = [
    "TimeZone=UTC, , , , ",
    "ISIN,DummyCol,CFICode,Venue,AlgoParams",
    "DE000ABCDEFG,blah,FFICSX,XEUR,InstIdentCode:DE000ABCDEFG|;InstFullName:DAX|;InstClassification:FFICSX|;NotionalCurr:EUR|;PriceMultiplier:20.0|;UnderlInstCode:DE0001234567|;UnderlIndexName:DAX PERFORMANCE-INDEX|;OptionType:OTHR|;StrikePrice:0.0|;OptionExerciseStyle:|;ExpiryDate:2021-01-01|;DeliveryType:PHYS|",
    "PL0ABCDEFGHI,blah,FFICSX,WDER,InstIdentCode:PL0ABCDEFGHI|;InstFullName:Wig 20 Index|;InstClassification:FFICSX|;NotionalCurr:PLN|;PriceMultiplier:25.0|;UnderlInstCode:PL9991234567|;UnderlIndexName:WIG20 PLN|;OptionType:OTHR|;StrikePrice:0.0|;OptionExerciseStyle:|;ExpiryDate:2021-01-01|;DeliveryType:PHYS|",
  ];
  const file = new File([rows.join("\n")], "some.csv", { type: "text/csv" });
  const { getByTestId } = render(<CsvParser />);
  const formElement = getByTestId("csv-file-upload");
  Object.defineProperty(formElement, "files", { value: [file] });
  fireEvent.drop(formElement);
  await waitFor(() => getByTestId("enriched-0"));

  expect(getByTestId("enriched-0").innerHTML).toEqual(
    `DE000ABCDEFG - FFICSX - XEUR - 20.0`
  );
});

test("check if the enriched csv data can be downloaded", async () => {
  const rows = [
    "TimeZone=UTC, , , , ",
    "ISIN,DummyCol,CFICode,Venue,AlgoParams",
    "DE000ABCDEFG,blah,FFICSX,XEUR,InstIdentCode:DE000ABCDEFG|;InstFullName:DAX|;InstClassification:FFICSX|;NotionalCurr:EUR|;PriceMultiplier:20.0|;UnderlInstCode:DE0001234567|;UnderlIndexName:DAX PERFORMANCE-INDEX|;OptionType:OTHR|;StrikePrice:0.0|;OptionExerciseStyle:|;ExpiryDate:2021-01-01|;DeliveryType:PHYS|",
    "PL0ABCDEFGHI,blah,FFICSX,WDER,InstIdentCode:PL0ABCDEFGHI|;InstFullName:Wig 20 Index|;InstClassification:FFICSX|;NotionalCurr:PLN|;PriceMultiplier:25.0|;UnderlInstCode:PL9991234567|;UnderlIndexName:WIG20 PLN|;OptionType:OTHR|;StrikePrice:0.0|;OptionExerciseStyle:|;ExpiryDate:2021-01-01|;DeliveryType:PHYS|",
  ];
  const file = new File([rows.join("\n")], "some.csv", { type: "text/csv" });
  const { getByText, getByTestId } = render(<CsvParser />);
  const formElement = getByTestId("csv-file-upload");
  Object.defineProperty(formElement, "files", { value: [file] });
  fireEvent.drop(formElement);
  await waitFor(() => getByText("Download Enriched CsvFile"));

  expect(getByText("Download Enriched CsvFile")).toBeInTheDocument();
});

test("check if csv file upload error message is thrown for invalid file upload", async () => {
  const file = new File([], "some.png");
  const { getByText, getByTestId } = render(<CsvParser />);
  const formElement = getByTestId("csv-file-upload");
  Object.defineProperty(formElement, "files", { value: [file] });
  fireEvent.drop(formElement);
  await waitFor(() =>
    getByText("Invalid file type. Please upload only csv files")
  );

  expect(
    getByText("Invalid file type. Please upload only csv files")
  ).toBeInTheDocument();
});
