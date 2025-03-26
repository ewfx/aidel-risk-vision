import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LinearRiskMeterChart = ({ confidenceScore = 0 }) => {
    const options = {
        chart: {
            type: "bar",
            backgroundColor: "#FFFFFF",
            height: 100
        },
        title: null,
        xAxis: {
            categories: [""],
            lineWidth: 0,
            labels: { enabled: false }
        },
        yAxis: {
            min: 0,
            max: 100,
            tickPositions: [0, 40, 70, 100],
            plotBands: [
                { from: 0, to: 40, color: "#55BF3B" },
                { from: 40, to: 70, color: "#DDDF0D" },
                { from: 70, to: 100, color: "#DF5353" }
            ]
        },
        series: [
            {
                name: "Confidence",
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
