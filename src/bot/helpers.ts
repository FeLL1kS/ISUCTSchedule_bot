export const formKeyboard = (data: Array<string>, rowLength: number = 1) => {
  let resultArray: Array<Array<{text: string}>> = [];
  resultArray.push([]);
  let rowNumber = 0;
  data.map(key => {
    if(resultArray[rowNumber].length < rowLength) {
      resultArray[rowNumber].push( { text: key } )
    } else {
      rowNumber++;
      resultArray.push([]);
      resultArray[rowNumber].push( { text: key } )
    }
  })
  return resultArray;
}