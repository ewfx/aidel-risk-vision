import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LinearRiskMeterChart = ({ confidenceScore = 65 }) => {
    const options = {
        chart: {
            type: "bar", // Changed from "gauge" to "bar" for linear gauge style
            backgroundColor: "#FFFFFF",
            height: 100
        },
        title: null, // No chart title
        xAxis: {
            categories: ["Risk Score"],
            lineWidth: 0,
            labels: {
                enabled: false
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            title: null,
            tickPositions: [0, 40, 70, 100], // Key risk levels
            plotBands: [
                {
                    from: 0,
                    to: 40,
                    color: "#55BF3B" // Green (Low Risk)
                },
                {
                    from: 40,
                    to: 70,
                    color: "#DDDF0D" // Yellow (Moderate Risk)
                },
                {
                    from: 70,
                    to: 100,
                    color: "#DF5353" // Red (High Risk)
                }
            ]
        },
        series: [
            {
                name: "Risk Score",
                data: [confidenceScore],
                color: confidenceScore <= 40 ? "#55BF3B" : confidenceScore <= 70 ? "#DDDF0D" : "#DF5353",
                borderRadius: 5,
                dataLabels: {
                    enabled: true,
                    format: "{y} %"
                }
            }
        ],
        legend: { enabled: false },
        credits: { enabled: false }
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LinearRiskMeterChart;
