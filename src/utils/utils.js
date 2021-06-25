export const extractContractSize = (algoParams) => {
    const priceMultiplierIndex = algoParams.indexOf('PriceMultiplier:');
    const stringStartsWithPriceMultiplier = algoParams.substring(priceMultiplierIndex);
    const contractSizeStartIndex = stringStartsWithPriceMultiplier.indexOf(':') + 1;
    const contractSizeEndIndex = stringStartsWithPriceMultiplier.indexOf('|');
    return stringStartsWithPriceMultiplier.substring(contractSizeStartIndex, contractSizeEndIndex);
};