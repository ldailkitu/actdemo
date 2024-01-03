import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './App.css'
import { baseData } from './chartData';
import { useState } from 'react';
import variant15Image from '/1hourchart-actdemo-modified.jpg';
import variant17Image from '/variant17chart-actdemo-modified.jpg';

const getChartInfo = {
    yAxisLabel: 'Power Output (W)',
    getSeriesData: (controlLength, totalTime, variantType) => baseData(controlLength, totalTime, variantType),
    getXAxisCategories: (xAxisTime) => {
      const startTime = new Date();
      startTime.setHours(13, 0, 0, 0); // Set the start time to 01:00pm
      const xAxisCategories = [];

      for (let i = 0; i < xAxisTime; i++) {
        const time = new Date(startTime.getTime() + i * 60000); // Add i minutes to the start time
        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        xAxisCategories.push(formattedTime);
      }

      return xAxisCategories;
    }
};

const {
  title,
  getXAxisCategories,
  yAxisLabel,
  getSeriesData,
} = getChartInfo;
const options = (controlLength, totalTime, variantType) => {
  const seriesData = getSeriesData(controlLength, totalTime, variantType);
  const longerTime = controlLength > totalTime ? controlLength : totalTime

  const getMax = (variantType) => {
    if (variantType === 'Variant 1') {
      return undefined;
    } else if (variantType === 'Variant 2') {
      // 15 minutes after control start or 15 minutes after current data (whatever is greater)
      const fifteenMinutesAfterControlStart = 30;
      const fifteenMinutesAfterCurrentData = seriesData[0].data.length + 15;
      const maxTime = fifteenMinutesAfterControlStart > fifteenMinutesAfterCurrentData ? fifteenMinutesAfterControlStart : fifteenMinutesAfterCurrentData;

      return maxTime < (controlLength + 30) ? maxTime : (controlLength + 30);
    } else if (variantType === 'Variant 3') {
      return controlLength + (15*2);
    }
  }
  const xAxisLength = getMax(variantType);

  const getDashStyle = () => {
    if (variantType === 'Variant 10') {
      return 'dash';
    } else if (variantType === 'Variant 12') {
      return 'dot';
    } else {
      return 'solid';
    }
  }

  const getLabelStyle = (isStart) => {
    const labelStyle = {
      text: isStart ? 'Control Start&nbsp;&nbsp;' : 'Control End&nbsp;&nbsp;', // label text
    };
      if (variantType === 'Variant 14') { // vertical label
      return {
        ...labelStyle,
        align: 'left', // label alignment
        textAlign: 'left',
        verticalAlign: 'top', // label vertical alignment
        rotation: 90, // label rotation angle
        x: !isStart ? -12 : 5
      };
    } else if (variantType === 'Variant 15') { // no label but hover
      return null;
    } else if (variantType === 'Variant 16') {
      return null;
    } else if (!variantType || variantType === 'Variant 13') {
      return {
        ...labelStyle,
        align: 'right', // label alignment
        verticalAlign: 'top', // label vertical alignment
        rotation: 0 // label rotation angle
      };
    } else {
      return {
      ...labelStyle,
      align: 'right', // label alignment
      verticalAlign: 'top', // label vertical alignment
      rotation: 0 // label rotation angle
    }
  }
  }

  const getPlotBands = () => {
    if (variantType === 'Variant 16' || variantType === 'Variant 17' || variantType === 'Variant 18' || variantType === 'Variant 19') {
      const times = getXAxisCategories(longerTime + 1);
      let finalTime = times[14 + controlLength - 1];
      if (!finalTime) {
        finalTime = times[times.length - 1];
      }
      
      return {
        from: 15,
        to: 15 + controlLength - 1 > times.length ? times.length - 1 : 15 + controlLength - 1,
        color: "#dbffcd",
        zIndex: -1,
        label: {
          formatter: () => {
            if (variantType === 'Variant 16' || variantType === 'Variant 19') {
              return 'Control Active';
            }
          }
        }
      }
    }
  };

  const getLineColor = () => {
    if (variantType === 'Variant 16' || variantType === 'Variant 17' || variantType === 'Variant 18' || variantType === 'Variant 19') {
      return 'gray';
    }
    else {
      return 'black';
    }
  }

  const getPlotLines = () => {
    if (variantType === 'Variant 16' || variantType === 'Variant 17') {
      return null;
    }
    return {
    plotLines: [{
      value: 15, // x-axis tick index where the line should be placed
      dashStyle: getDashStyle(), // line style
      color: getLineColor(), // line color
      width: 2, // line width,
      zIndex: 5, // line z-index
      label: {
        ...getLabelStyle(true)
      },
      style: {
        backgroundColor: '#52C3E8'
      },
    },
    {
      value: 15 + controlLength - 1, // x-axis tick index where the line should be placed
      dashStyle: getDashStyle(), // line style
      color: getLineColor(), // line color
      width: 2, // line width,
      zIndex: 5, // line z-index
      label: {
        ...getLabelStyle(),
      },
      style: {
        backgroundColor: '#52C3E8'
      }
    }]
  }
}
  return {
  chart: {
    type: 'area',
  },
  title: {
    text: title
  },
  xAxis: {
    categories: getXAxisCategories(longerTime + 1),
    ...(xAxisLength ? {max: xAxisLength} : {}),
    minPadding: 0,
    maxPadding: 0,
    ...(getPlotBands() ? {plotBands: [getPlotBands()]} : null),
    // plotBands: [{
    //   color: 'red',
    //   from: 15,
    //   to: 16,
    // }],
    // type: 'datetime',
    ...getPlotLines(),
  },
  yAxis: {
    title: {
      text: yAxisLabel
    }
  },
  plotOptions: {
    area: {
      stacking: 'normal',
      marker: {
        enabled: false // Disable markers
      },
      dataLabels: {
        enabled: false // Disable data labels for all series
      }
    }
  },
  series: seriesData
};
};


const controlTimes = [{
  time: 1,
  friendlyTime: '1 minute',
},
{
  time: 15,
  friendlyTime: '15 minutes',
},
{
  time: 60,
  friendlyTime: '1 hour',
},
{
  time: 360,
  friendlyTime: '6 hours',
},
{
  friendlyTime: '1 day',
  time: 1440,
},
{
  friendlyTime: '1 week',
  time: 10080,
},
];

const getChartTimesByControlLengthTime = controlLengthTime => {
  const baseAmountOfTimeToShow = 15;
  const halfwayThroughControlTotalTime = (controlLengthTime / 2) + baseAmountOfTimeToShow;
  const throughControlTotalTime = baseAmountOfTimeToShow + controlLengthTime;
  const fiveMinsAfterControlTotalTime = throughControlTotalTime + 5;
  const thirtyMinsAfterControlTotalTime = throughControlTotalTime + 15;
  const times = [{
    time: 10,
    friendlyTime: '5 mins before control start, 10 mins shown'
   }, {
    time: 15,
    friendlyTime: 'Control start, 15 mins shown'
   }, {
    time: halfwayThroughControlTotalTime, 
    friendlyTime: `Halfway through control, ${halfwayThroughControlTotalTime} mins shown`
   }, {
      time: throughControlTotalTime, 
      friendlyTime: `Control end, ${throughControlTotalTime} mins shown`
   }, {
      time: fiveMinsAfterControlTotalTime,
      friendlyTime: `5 mins after control end, ${fiveMinsAfterControlTotalTime} mins shown`
   }, {
       time: thirtyMinsAfterControlTotalTime,
      friendlyTime: `15+ mins after control end, ${thirtyMinsAfterControlTotalTime} mins shown`
}];
return times;
};


const timeSeriesCharts = {};
controlTimes.forEach((controlTime) => {
  const { friendlyTime, time } = controlTime;
  timeSeriesCharts[friendlyTime] = {
    controlLength: time,
    totalTimes: getChartTimesByControlLengthTime(time),
  };
});

function App() {
  const [showOneMinuteCharts, setShowOneMinuteCharts] = useState(false);
  const [showFifteenMinuteCharts, setShowFifteenMinuteCharts] = useState(false);
  const [showOneHourCharts, setShowOneHourCharts] = useState(false);
  const [showSixHourCharts, setShowSixHourCharts] = useState(false);
  const [showOneDayCharts, setShowOneDayCharts] = useState(false);
  const [showOneWeekCharts, setShowOneWeekCharts] = useState(false);
  const [showDataVariantOneCharts, setShowDataVariantOneCharts] = useState(false);  
  const [showDataVariantTwoCharts, setShowDataVariantTwoCharts] = useState(false);
  const [showDataVariantThreeCharts, setShowDataVariantThreeCharts] = useState(false);
  const [showDataVariantFourCharts, setShowDataVariantFourCharts] = useState(false);
  const [showDataVariantFiveCharts, setShowDataVariantFiveCharts] = useState(false);
  const [showDataVariantSixCharts, setShowDataVariantSixCharts] = useState(false);
  const [showDataVariantSevenCharts, setShowDataVariantSevenCharts] = useState(false);
  const [showDataVariantEightCharts, setShowDataVariantEightCharts] = useState(false);
  const [showDataVariantNineCharts, setShowDataVariantNineCharts] = useState(false);
  const [showDataVariantTenCharts, setShowDataVariantTenCharts] = useState(false);
  const [showDataVariantElevenCharts, setShowDataVariantElevenCharts] = useState(false);
  const [showDataVariantTwelveCharts, setShowDataVariantTwelveCharts] = useState(false);
  const [showDataVariantThirteenCharts, setShowDataVariantThirteenCharts] = useState(false);
  const [showDataVariantFourteenCharts, setShowDataVariantFourteenCharts] = useState(false);
  const [showDataVariantFifteenCharts, setShowDataVariantFifteenCharts] = useState(false);
  const [showDataVariantSixteenCharts, setShowDataVariantSixteenCharts] = useState(false);
  const [showDataVariantSeventeenCharts, setShowDataVariantSeventeenCharts] = useState(false);
  const [showDataVariantEighteenCharts, setShowDataVariantEighteenCharts] = useState(false);
  const [showDataVariantNineteenCharts, setShowDataVariantNineteenCharts] = useState(false);
  const [showDataVariantTwentyCharts, setShowDataVariantTwentyCharts] = useState(false);
  const [showDataVariantTwentyOneCharts, setShowDataVariantTwentyOneCharts] = useState(false);
  const [showDataVariantTwentyTwoCharts, setShowDataVariantTwentyTwoCharts] = useState(false);
  const [showDataVariantTwentyThreeCharts, setShowDataVariantTwentyThreeCharts] = useState(false);
  const [showDataVariantTwentyFourCharts, setShowDataVariantTwentyFourCharts] = useState(false);
  const [showDataVariantTwentyFiveCharts, setShowDataVariantTwentyFiveCharts] = useState(false);
  
  const getChartsByFriendlyKey = (friendlyKeyForChartCreation, variantType) => {
    const getVariantFriendlyText = (friendlyTime) => {
      if (variantType === 'Variant 2') {
       const variant2FriendlyTextTime = friendlyTime.split(',')[0];
        return variant2FriendlyTextTime; 
      } else if (variantType === 'Variant 3') {
        const variant3FriendlyTextTime = friendlyTime.split(',')[0];
        return variant3FriendlyTextTime;
      } else {
          return friendlyTime;
      }
    }; 
    const charts = [];
    Object.keys(timeSeriesCharts).find((key) => {
      if (key === friendlyKeyForChartCreation) {
      const { controlLength, totalTimes } = timeSeriesCharts[key];
      totalTimes.forEach(({time, friendlyTime}) => {
        charts.push(
          <>
            <h3> Control length: {friendlyKeyForChartCreation}</h3>
            <h3> Total time to show on charts: {getVariantFriendlyText(friendlyTime)}</h3>
            <HighchartsReact highcharts={Highcharts} options={options(controlLength, time, variantType)} key={`${key}${time}${variantType}`} />
          </>
        );
      });
    }
    });
    return charts;
  }

  const showCharts = () => {
    const showJsx = [];
    // One minute Charts
    if (showOneMinuteCharts) {
      const buttonText = 'Hide One Minute Control Length Charts';
      showJsx.push(<button onClick={() => setShowOneMinuteCharts(false)}>{buttonText}</button>);
      showJsx.push(getChartsByFriendlyKey('1 minute'));
    } else {
      const buttonText = 'Show One Minute Control Length Charts';
      showJsx.push(<button onClick={() => setShowOneMinuteCharts(true)}>{buttonText}</button>);
    }

    // Fifteen minute Charts
    if (showFifteenMinuteCharts) {
      const buttonText = 'Hide Fifteen Minute Control Length Charts';
      showJsx.push(<button onClick={() => setShowFifteenMinuteCharts(false)}>{buttonText}</button>);
      showJsx.push(getChartsByFriendlyKey('15 minutes'));
    } else {
      const buttonText = 'Show Fifteen Minute Control Length Charts';
      showJsx.push(<button onClick={() => setShowFifteenMinuteCharts(true)}>{buttonText}</button>);
    }

    // One hour Charts
    if (showOneHourCharts) {
      const buttonText = 'Hide One Hour Control Length Charts';
      showJsx.push(<button onClick={() => setShowOneHourCharts(false)}>{buttonText}</button>);
      showJsx.push(getChartsByFriendlyKey('1 hour'));
    } else {
      const buttonText = 'Show One Hour Control Length Charts';
      showJsx.push(<button onClick={() => setShowOneHourCharts(true)}>{buttonText}</button>);
    }

    // Six hour Charts
    if (showSixHourCharts) {
      const buttonText = 'Hide Six Hour Control Length Charts';
      showJsx.push(<button onClick={() => setShowSixHourCharts(false)}>{buttonText}</button>);
      showJsx.push(getChartsByFriendlyKey('6 hours'));
    } else {
      const buttonText = 'Show Six Hour Control Length Charts';
      showJsx.push(<button onClick={() => setShowSixHourCharts(true)}>{buttonText}</button>);
    }

    // One day Charts
    if (showOneDayCharts) {
      const buttonText = 'Hide One Day Control Length Charts';
      showJsx.push(<button onClick={() => setShowOneDayCharts(false)}>{buttonText}</button>);
      showJsx.push(getChartsByFriendlyKey('1 day'));
    } else {
      const buttonText = 'Show One Day Control Length Charts';
      showJsx.push(<button onClick={() => setShowOneDayCharts(true)}>{buttonText}</button>);
    }

    // One week Charts
    if (showOneWeekCharts) {
      const buttonText = 'Hide One Week Control Length Charts';
      showJsx.push(<button onClick={() => setShowOneWeekCharts(false)}>{buttonText}</button>);
      showJsx.push(getChartsByFriendlyKey('1 week'));
    } else {
      const buttonText = 'Show One Week Control Length Charts';
      showJsx.push(<button onClick={() => setShowOneWeekCharts(true)}>{buttonText}</button>);
    }
    return <div className="show-charts">
      {showJsx}
    </div>;
  }

  const showVariantChart = (showState, setState, variantType) => {
    const variantNumber = parseInt(variantType.split(' ')[1]);
    const variantText = variantNumber >= 20 ? `Number ${variantNumber - 19}` : variantType;
    const showJsx = [];
        // Variant 
        if (showState) {
          const buttonText = `Hide ${variantText} Charts`;
          showJsx.push(<button onClick={() => setState(false)}>{buttonText}</button>);
          showJsx.push(getChartsByFriendlyKey('1 hour', variantType));
        } else {
          const buttonText = `Show ${variantText} Charts`;
          showJsx.push(<button onClick={() => setState(true)}>{buttonText}</button>);
        }
        return showJsx;
  }

  const showDataVariantImageChart = (showState, setShowState, variantType) => {
    const showJsx = [];
    // Variant 
    if (showState) {
      const buttonText = `Hide ${variantType} Control Length Chart`;
      showJsx.push(<button onClick={() => setShowState(false)}>{buttonText}</button>);
      showJsx.push(<h4>Hover over image (edited graphic)</h4>);
      console.log(variantType);
      if (variantType === 'Variant 15') {
        showJsx.push(<img src={variant15Image} alt="Variant 15" />);
      } else if (variantType === 'Variant 17') {
        showJsx.push(<img src={variant17Image} alt="Variant 17" />);
      }
    } else {
      const buttonText = `Show ${variantType} Control Length Chart`;
      showJsx.push(<button onClick={() => setShowState(true)}>{buttonText}</button>);
    }
    return showJsx;
  }

  return (
    <div className="main">
      <h2> Normal Time Series Charts</h2>
      {showCharts()}
      <h2>X-Axis Variants (Shown for 1 hour controls)</h2>
      <h3>Variant Type 1: 15 mins before + only actual data</h3>
      {showVariantChart(showDataVariantOneCharts, setShowDataVariantOneCharts, 'Variant 1')}
      <h3>Variant Type 2: 15 mins before + 15 minutes after control start or 15 minutes after current data (whatever is greater)</h3>
      {showVariantChart(showDataVariantTwoCharts, setShowDataVariantTwoCharts, 'Variant 2')}
      <h3>Variant Type 3: 15 mins before + control length + 15 minutes after</h3>
      {showVariantChart(showDataVariantThreeCharts, setShowDataVariantThreeCharts, 'Variant 3')}
      <h2>Color Variants (Shown for 1 hour controls)</h2>
      <h3>Variant Type 4: Shades of Blue</h3>
      {showVariantChart(showDataVariantFourCharts, setShowDataVariantFourCharts, 'Variant 4')}
      <h3>Variant Type 5: Shades of Green</h3>
      {showVariantChart(showDataVariantFiveCharts, setShowDataVariantFiveCharts, 'Variant 5')}
      <h3>Variant Type 6: Slide show colors</h3>
      {showVariantChart(showDataVariantSixCharts, setShowDataVariantSixCharts, 'Variant 6')}
      <h3>Variant Type 7: Kitu Coloring</h3>
      {showVariantChart(showDataVariantSevenCharts, setShowDataVariantSevenCharts, 'Variant 7')}
      <h3>Variant Type 8: Same Color</h3>
      {showVariantChart(showDataVariantEightCharts, setShowDataVariantEightCharts, 'Variant 8')}
      <h3>Variant Type 9: Random Colors</h3>
      {showVariantChart(showDataVariantNineCharts, setShowDataVariantNineCharts, 'Variant 9')}
      <h2>Plotline "Control Start/End" Line Style</h2>
      <h3>Variant Type 10: Dashed Line</h3>
      {showVariantChart(showDataVariantTenCharts, setShowDataVariantTenCharts, 'Variant 10')}
      <h3>Variant Type 11: Regular Line</h3>
      {showVariantChart(showDataVariantElevenCharts, setShowDataVariantElevenCharts, 'Variant 11')}
      <h3>Variant Type 12: Dot Line</h3>
      {showVariantChart(showDataVariantTwelveCharts, setShowDataVariantTwelveCharts, 'Variant 12')}
      <h2>Plotline "Control Start/End" Line Label Style</h2>
      <h3>Variant Type 13: Horizontal Label</h3>
      {showVariantChart(showDataVariantThirteenCharts, setShowDataVariantThirteenCharts, 'Variant 13')}
      <h3>Variant Type 14: Vertical Label</h3>
      {showVariantChart(showDataVariantFourteenCharts, setShowDataVariantFourteenCharts, 'Variant 14')}
      <h3>Variant Type 15: No Label but hoverable</h3>
      {showDataVariantImageChart(showDataVariantFifteenCharts, setShowDataVariantFifteenCharts, 'Variant 15')}
      <h2>Plotbands</h2>
      <h3>Variant Type 16: Plot bands with label</h3>
      {showVariantChart(showDataVariantSixteenCharts, setShowDataVariantSixteenCharts, 'Variant 16')}
      <h3>Variant Type 17: Plot bands without label but hoverable</h3>
      {showDataVariantImageChart(showDataVariantSeventeenCharts, setShowDataVariantSeventeenCharts, 'Variant 17')}
      <h2>Plotlines and plotlines</h2>
      <h3>Variant Type 18: Plot band (with no label) and plot line label</h3>
      {showVariantChart(showDataVariantEighteenCharts, setShowDataVariantEighteenCharts, 'Variant 18')}
      <h3>Variant Type 19: Plot band (with labels) and plot line labels</h3>
      {showVariantChart(showDataVariantNineteenCharts, setShowDataVariantNineteenCharts, 'Variant 19')}
      <h2>Number examples</h2>
      <h3>1. Very High Numbers</h3>
      {showVariantChart(showDataVariantTwentyCharts, setShowDataVariantTwentyCharts, 'Variant 20')}
      <h3>2. Very Small Numbers</h3>
      {showVariantChart(showDataVariantTwentyOneCharts, setShowDataVariantTwentyOneCharts, 'Variant 21')}
      <h3>3. Negative Numbers</h3>
      {showVariantChart(showDataVariantTwentyTwoCharts, setShowDataVariantTwentyTwoCharts, 'Variant 22')}
      <h3>4. Very High and Very Small Numbers</h3>
      {showVariantChart(showDataVariantTwentyThreeCharts, setShowDataVariantTwentyThreeCharts, 'Variant 23')}
      <h3>5. Negative and Positive Numbers close in range</h3>
      {showVariantChart(showDataVariantTwentyFourCharts, setShowDataVariantTwentyFourCharts, 'Variant 24')}
      <h3>6. Negative and Positive Numbers far in range</h3>
      {showVariantChart(showDataVariantTwentyFiveCharts, setShowDataVariantTwentyFiveCharts, 'Variant 25')}
    </div>
  );
}

export default App
