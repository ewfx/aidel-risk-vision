import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";

// Initialize Highcharts-more module
if (typeof HighchartsMore === "function") {
    HighchartsMore(Highcharts);
}

const RiskMeterChart = ({ riskScore = 65 }) => {
    const options = {
        chart: {
            type: "gauge",
            backgroundColor: "#FFFFFF"
        },
        title: null, // Ensures no title is displayed
        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [
                {
                    backgroundColor: "#FFF",
                    borderWidth: 0,
                    outerRadius: "109%"
                },
                {
                    backgroundColor: "#FFF",
                    borderWidth: 1,
                    outerRadius: "107%"
                },
                {
                    backgroundColor: "#FFF",
                    borderWidth: 0,
                    outerRadius: "105%",
                    innerRadius: "103%"
                }
            ]
        },
        yAxis: {
            min: 0,
            max: 100,
            minorTickInterval: "auto",
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: "inside",
            minorTickColor: "#000",
            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: "inside",
            tickLength: 10,
            tickColor: "#000",
            labels: {
                step: 2,
                rotation: "auto",
                style: { color: "#000" }
            },
            title: {
                text: "Risk Score",
                style: { color: "#000" }
            },
            plotBands: [
                { from: 0, to: 40, color: "#55BF3B" },
                { from: 40, to: 70, color: "#DDDF0D" },
                { from: 70, to: 100, color: "#DF5353" }
            ]
        },
        series: [
            {
                name: "Risk Score",
                data: [riskScore],
                tooltip: {
                    valueSuffix: " %"
                },
                dial: {
                    backgroundColor: "#000000",
                    borderColor: "#55BF3B",
                    baseLength: "70%",
                    baseWidth: 6,
                    radius: "90%"
                }
            }
        ]
    };


    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RiskMeterChart;
