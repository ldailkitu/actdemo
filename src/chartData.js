/* Chart data needed

* Time series:
1. 1 min
2. 15 min 
3. 1 hour
4. 6 hours
5. 1 day
6. 1 week

* Variants to show during time series:
a. 5 mins before control starts
  // Should see 10 mins of normal data
b. Control starts
  // Should see 15 mins of data plus line
c. Halfway through control 
  // Should see 15 mins of normal data, line, and then control data for half the time of the control
d. Control end
  // Should see 15 mins of normal data, line, and then control data for full time of control
e. 5 mins after control ends
  // Should see 15 mins of normal data, line, and then control data for full time of control, and then 5 mins of normal data
f 30 mins after control starts
  // Should see 15 mins of normal data, line, and then control data for full time of control, and then 15 mins of normal data

* Charts continuing Variant:
1. Stop at the end of the graph data
2. Continue to show data for 15+ minutes after the end of the graph data as long as it's before the 15 mins after control end
3. Continue to show data after the end of the graph data until the control length + 15 minutes

Separate color schemes to show
4. Shades of blue
5. Shades of blue and green
6. Slide show colors
7. Different but muted colors along kitu coloring
8. Same color
9. Random colors

Line Style:
10. Dash
11. Regular Line
12. Dot

Label Style:
13. horizontal
14. vertical label
15. no label but hover over shows

Plot band
16. Plot band during control with control length label
17. Plot band during control with no label but hoverable
18. Plot bands during control with no label but plot line labels
19. Plot bands during control with label and also plot line labels

Number examples
20. Very high numbers
21. Very low numbers
22. Negative numbers
23. Very high and very low numbers
24. Regular high and regular low numbers
25. Very high positive and high negative numbers

Time break:
26. Time break with high z-index
27. Time break with low z-index
28. Time break with high z-index and x-axis tick indicator
29. Time break with low z-index and x-axis tick indicator
*/

// Data series
// Base data series of first 15 minutes:
/*
const dataWithIds = [{
  id: 'Device 1',
  data: getRandomData([29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 210, 200, 205, 190, 215]),
},
{
  id: 'Device 2',
  data: getRandomData([50, 80, 120, 150, 180, 210, 240, 270, 300, 330, 320, 310, 325, 305, 335]),
},
{
  id: 'Device 3',
  data: getRandomData([100, 130, 160, 190, 220, 250, 280, 310, 340, 370, 360, 350, 365, 345, 375]),
},
{
  id: 'Device 4',
  data: getRandomData([60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 320, 310, 325, 305, 335]),
},
{
  id: 'Device 5',
  data: getRandomData([80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 340, 330, 345, 325, 355]),
},
{
  id: 'Device 6',
  data: getRandomData([120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 380, 370, 385, 365, 395]),
},
{
  id: 'Device 7',
  data: getRandomData([140, 170, 200, 230, 260, 290, 320, 350, 380, 410, 400, 390, 405, 385, 415]),
},
{
  id: 'Device 8',
  data: getRandomData([160, 190, 220, 250, 280, 310, 340, 370, 400, 430, 420, 410, 425, 405, 435]),
},
{
  id: 'Device 9',
  data: getRandomData([180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 440, 430, 445, 425, 455]),
},
{
  id: 'Device 10',
  data: getRandomData([200, 230, 260, 290, 320, 350, 380, 410, 440, 470, 460, 450, 465, 445, 475]),
}];
*/

const veryHighPositiveNumbers = Array.from({length: 15}, () => Math.floor(Math.random() * (9090909090 - 35353535 + 1)) + 35353535);
veryHighPositiveNumbers.sort((a, b) => a - b);
const veryHighNegativeNumbers = veryHighPositiveNumbers.map(num => -num);

const veryLowPositiveNumbers = Array.from({ length: 15 }, () => Math.random() * (0.00001 - 0.000000001) + 0.000000001);
veryLowPositiveNumbers.sort((a, b) => a - b);
const regularNumbers = Array.from({ length: 15 }, () => Math.floor(Math.random() * (460 - 60 + 1)) + 60);
regularNumbers.sort((a, b) => a - b);
const negativeRegularNumbers = regularNumbers.map(num => -num);

/*
function getRandomData(dataArray) {
  const median = Math.floor(dataArray.length / 2);
  const medianValue = dataArray[median];
  const min = medianValue - 15;
  const max = medianValue + 15;
  return dataArray.map(() => Math.floor(Math.random() * (max - min + 1)) + min);
}
*/
// Returns object
// const dataObjByIds = {
//   // Convert array of objects to object of objects
//   ...dataWithIds.reduce((acc, obj) => {
//     acc[obj.id] = obj;
//     return acc;
//   }, {})
// };

// Returns object
// const getBaseDataById = (id) => dataObjByIds[id];

// Gets base 15 minutes plus whatever else is needed via params
// Returns array
const getAllDataById = (id, controlLength, totalMinutesToShow, variantType) => {
  const fullDataArray = [];
  // const baseDataArray = getBaseDataById(id).data;
  // const createNewArrayOfNumbers = 
  let numbersToUse = regularNumbers;
  if (variantType === 'Variant 20') {
    numbersToUse = veryHighPositiveNumbers;
  } else if (variantType === 'Variant 21') {
    numbersToUse = veryLowPositiveNumbers;
  } else if (variantType === 'Variant 22') {
    numbersToUse = negativeRegularNumbers;
  } else if (variantType === 'Variant 23') {
    numbersToUse = veryLowPositiveNumbers.slice(0, 7).concat(veryHighPositiveNumbers.slice(0, 8));
  } else if (variantType === 'Variant 24') {
    numbersToUse = negativeRegularNumbers.slice(0,7).concat(regularNumbers.slice(0, 8));
  } else if (variantType === 'Variant 25') {
    numbersToUse = veryHighNegativeNumbers.slice(0, 7).concat(veryHighPositiveNumbers.slice(0, 8));
  }
  let baseLengthToShow = totalMinutesToShow < 15 ? numbersToUse.slice(0, totalMinutesToShow) : numbersToUse;
  if (variantType >= 20) {
    return null;
  } else {
  fullDataArray.push(...baseLengthToShow);

  // Create other data using the other parameters
  if (totalMinutesToShow > 15) {
    // Show control data
    const lastNumber = baseLengthToShow[baseLengthToShow.length - 1];
    const reducedNumber = lastNumber * 0.25;
    const numbersNeeded = Math.ceil(totalMinutesToShow) - 15 - controlLength > 0 ? controlLength : Math.ceil(totalMinutesToShow) - 15;
    const controlDataArray = Array(numbersNeeded).fill(reducedNumber);
    fullDataArray.push(...controlDataArray);
  }

  // Add data after control ends
  if (totalMinutesToShow > (15 + controlLength)) {
    const remainingTimeToShow = totalMinutesToShow - 15 - controlLength;
    const lastNumber = baseLengthToShow[baseLengthToShow.length - 1];
    const rangeStart = lastNumber * .8;
    const rangeEnd = lastNumber * 1.2;
    const additionalDataArray = Array(Math.ceil(remainingTimeToShow)).fill().map(() => Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart);
    fullDataArray.push(...additionalDataArray);
  }
  return fullDataArray;
}
}

const getColors = (deviceId, variantType) => {
    if (variantType === 'Variant 5') {
      return variant5Colors[deviceId - 1];
      } else if (variantType === 'Variant 6') {
      return variant6Colors[deviceId - 1];
      } else if (variantType === 'Variant 7') {
      return variant7Colors[deviceId - 1];
    } else if (variantType === 'Variant 8') {
      return variant8Colors[deviceId - 1];
    } else if (variantType === 'Variant 9') {
      return undefined;
    } else if (!variantType || variantType === 'Variant 4') {
      return variant4Colors[deviceId - 1];
    } else {
      return variant4Colors[deviceId - 1];
    }
}

// Shades of blue
const variant4Colors = [
  'rgba(0, 255, 255, 1)',
  '#003153',
  'rgba(137, 207, 240, 1)',
  'rgba(0, 0, 255, 1)',
  'rgba(0, 255, 255, 1)',
  '#003153',
  'rgba(137, 207, 240, 1)',
  'rgba(0, 0, 255, 1)',
  'rgba(0, 255, 255, 1)',
  '#003153'
];

// Shades of blue and green
const variant5Colors = [
  'rgba(0, 255, 255, 1)',
  'rgba(127, 255, 212, 1)',
  '#003153',
  'rgba(9, 121, 105, 1)',
  'rgba(137, 207, 240, 1)',
  'rgba(34, 139, 34, 1)',
  'rgba(0, 0, 255, 1)',
  'rgba(50, 205, 50, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(0,158,96, 1)'
];

// Slide show colors
const variant6Colors = [
  '#636363',
  '#997300',
  '#255e91',
  '#43682b',
  '#698ed0',
  '#f1975a',
  '#b7b7b7',
  '#ffcd33',
  '#7cafdd',
  '#8cc168',
];

// Kitu Colors
const variant7Colors = [
  '#026892',
  '#52C3E8',
  '#061E37',
  '#8DBACD',
  '#25B794',
  '#F7A8A6',
  '#C0D730',
  '#D1E069',
  '#FCDC4E',
  '#FEEFAE',

];

const variant8Colors = [
  'rgba(0, 255, 255, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 255, 255, 1)',
]

export const baseData = (controlLength, totalMinutesToShow, variantType) => ([
  {
    name: 'Device 1',
    data: getAllDataById('Device 1', controlLength, totalMinutesToShow, variantType),
   color: getColors(1, variantType),
    fillOpacity: 1 // Set the fill opacity to 1 for Device 1
  },
  {
    name: 'Device 2',
    data: getAllDataById('Device 2', controlLength, totalMinutesToShow, variantType),
   color: getColors(2, variantType),
    fillOpacity: 1 // Set the fill opacity to 1 for Device 2
  },
  {
    name: 'Device 3',
    data: getAllDataById('Device 3', controlLength, totalMinutesToShow, variantType),
   color: getColors(3, variantType),
    fillOpacity: 1 // Set the fill opacity to 1 for Device 3
  },
  {
    name: 'Device 4',
    data: getAllDataById('Device 4', controlLength, totalMinutesToShow, variantType),
   color: getColors(4, variantType),
    fillOpacity: 1 // Set the fill opacity to 1 for Device 4
  },
  {
    name: 'Device 5',
    data: getAllDataById('Device 5', controlLength, totalMinutesToShow, variantType),
   color: getColors(5, variantType),
    fillOpacity: 1 // Set the fill opacity to 1 for Device 5
  },
  {
    name: 'Device 6',
    data: getAllDataById('Device 6', controlLength, totalMinutesToShow, variantType),
   color: getColors(6, variantType),
    fillOpacity: 1 // Set the fill opacity to 1 for Device 6
  },
  {
    name: 'Device 7',
    data: getAllDataById('Device 7', controlLength, totalMinutesToShow, variantType),
   color: getColors(7, variantType),
    fillOpacity: 1 // Set the fill opacity to 1 for Device 7
  },
  {
    name: 'Device 8',
    data: getAllDataById('Device 8', controlLength, totalMinutesToShow, variantType),
   color: getColors(8, variantType),
    fillOpacity: 1 // Set the fill opacity to 1 for Device 8
  },
  {
    name: 'Device 9',
    data: getAllDataById('Device 9', controlLength, totalMinutesToShow, variantType),
   color: getColors(9, variantType),
    fillOpacity: 1 // Set the fill opacity to 1 for Device 9
  },
  {
    name: 'Device 10',
    data: getAllDataById('Device 10', controlLength, totalMinutesToShow, variantType),
   color: getColors(10, variantType),
    fillOpacity: 1 // Set the fill opacity to 1 for Device 10
  },
]);