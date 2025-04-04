import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Stock_API } from '@/constants/api';

const API_URL = Stock_API // Change to your backend IP

// const API_URL = "http://localhost:8000/predict"; // Change to your backend IP
// const API_URL = "http://host.docker.internal:8000/predict";


const StockChartNew = ({ sname }) => {
  const [stockData, setStockData] = useState({});
  const [testPredictions, setTestPredictions] = useState([]);
  const [futurePredictions, setFuturePredictions] = useState([]);
  const [testDates, setTestDates] = useState([]);
  const [futureDates, setFutureDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("1M"); // Default: 1 Month view
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  let selectedTicker = sname?.symbol || "TATAPOWER.NS"; // Default if not provided
  console.log('new=',selectedTicker.slice(0,-3))
  selectedTicker=selectedTicker.slice(0,-3)+'NS'
  console.log("Selected Ticker:", selectedTicker);
  // Time frame mapping to days
  const timeFrames = {
    "1W": 7,
    "1M": 30,
    "1Y": 365,
    "5Y": 1825,
    "30F": 30, // Special case for future & test predictions only
  };

  useEffect(() => {
    fetchStockData();
  }, [timeFrame, selectedTicker]); // Fetch data when ticker or timeframe changes

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        tickers: [selectedTicker], // Dynamically use the ticker
        days: 30,
      });

      console.log("Response:", response.data);
      const stock = response.data.results[0];

      if (stock) {
        setStockData(stock.closing_prices || {});   
        setTestPredictions(stock.test_predictions || []);
        setFuturePredictions(stock.future_predictions || []);
        // setFuturePredictions([...Array(testPredictions.length).fill(null), ...(stock.future_predictions || [])]);
        setTestDates(stock.test_dates || []);
        setFutureDates(stock.future_dates || []);
        console.log('future=',futureDates,typeof(futureDates))

        // Ensure future predictions start after the last test date
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
    setLoading(false);
  };

  const allDates = Object.keys(stockData); // Extract last N dates
  const values = Object.values(stockData); // Extract last N closing prices

  console.log('stockkkkk=',values,typeof(values))


  // Prepare datasets based on selected time frame
  let labels = [];
  let datasets = [];

  if (timeFrame === "30F") {
    // Show only test & future predictions
    labels = [...allDates.slice(-100), ...futureDates];
    datasets = [
      // { data: [...values.slice((allDates.length-testPredictions.length)-100,(allDates.length-testPredictions.length)), ...testPredictions.slice(-100)], color: () => "#00ff00", label: "Test Predictions" }, // Green
      { data: [...values.slice(-100), ...futurePredictions], color: () => "#0000ff", label: "Future Predictions" }, // Blue
      { data: [...values.slice(-100)], color: () => "#ffffff", label: "Future Predictions" }, // white
    ];
  } else {
    // Show only actual closing prices
    labels = Object.keys(stockData).slice(-timeFrames[timeFrame]);
    datasets = [
      { data: Object.values(stockData).slice(-timeFrames[timeFrame]), color: () => "#ffaaff", label: "Actual Prices" }, // Pink
    ];
  }

  // Function to get only a few key date labels (Start, Mid, End)
  const getDateRangeLabels = (dates) => {
    if (dates.length < 3) return dates; // Show all if few
    return [dates[0], dates[Math.floor(dates.length / 2)], dates[dates.length - 1]]; // Start, Middle, End
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 10 }}>
<Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
  {String(selectedTicker)} Stock Chart
</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <LineChart
            data={{
              labels: getDateRangeLabels(labels), // Key dates
              datasets: datasets,
            }}
            width={Dimensions.get("window").width - 5} // Full width minus some padding
            height={400} // Adjust height to fit on phone screen
            yAxisLabel="₹"
            chartConfig={{
              backgroundGradientFrom: "#101010",
              backgroundGradientTo: "#101010",
              decimalPlaces: 2,
              color: () => "#ffaaff", // Default line color
              labelColor: () => "#FFFFFF", // Label color
              propsForDots: {
                r: "0",
                strokeWidth: "0",
                stroke: "#ffffff",
              },
              propsForBackgroundLines: {
                strokeWidth: 0, // Remove background grid lines
              },
            }}
            bezier
            style={{ borderRadius: 10 }}
            withInnerLines={false}
            withVerticalLines={false}
            withHorizontalLines={false}
            onDataPointClick={({ value, index }) => {
              setSelectedPrice(value);
              setSelectedDate(labels[index]); // Get correct date
            }}
          />

          {/* Display Selected Price & Date */}
          {selectedPrice !== null && selectedDate !== null && (
            <View
              style={{
                borderRadius: 5,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Text style={{ color: "#ffaaff", fontSize: 30, fontWeight: "bold" }}>₹{selectedPrice.toFixed(2)}</Text>
              <Text style={{ color: "#aaaaaa", fontSize: 15, fontWeight: "bold" }}>{selectedDate}</Text>
            </View>
          )}
        </>
      )}

      {/* Time Frame Selector */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        {Object.keys(timeFrames).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setTimeFrame(key)}
            style={{
              backgroundColor: timeFrame === key ? "#0000ff" : "#ddd",
              padding: 10,
              borderRadius: 5,
              marginHorizontal: 5,
            }}
          >
            <Text style={{ color: timeFrame === key ? "#fff" : "#000" }}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default StockChartNew;