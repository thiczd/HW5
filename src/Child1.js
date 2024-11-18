import React, { Component } from "react";
import * as d3 from "d3";

class Child1 extends Component {
  state = {
    company: "Apple", // Default Company
    selectedMonth: "November", //Default Month
  };

  componentDidMount() {
    // console.log(this.props.csv_data); // Use this data as default. When the user will upload data this props will provide you the updated data
    this.renderChart();
  }

  componentDidUpdate() {
    // console.log(this.props.csv_data);
    this.renderChart();
  }

  renderChart = () => {
    const data = this.props.csv_data;
    console.log(data);

    // Set the dimensions of the chart
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 500,
      height = 300,
      innerWidth = 500 - margin.left - margin.right,
      innerHeight = 300 - margin.top - margin.bottom;

    const svg = d3
      .select("#mychart")
      .attr("width", width)
      .attr("height", height)
      .select("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x_Scale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Date))
      .range([0, innerWidth]);

    const y_Scale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Low), d3.max(data, (d) => d.High)])
      .range([innerHeight, 0]);
    // console.log(y_Scale);
    // data.map((item) => console.log(item.Low));

    // CLOSE LINE
    var lineGeneratorClose = d3
      .line()
      .x((d) => x_Scale(d.Date))
      .y((d) => y_Scale(d.Close))
      .curve(d3.curveCardinal);
    var pathDataClose = lineGeneratorClose(data);
    // DATA POINT
    svg
      .selectAll(".close-point")
      .data(data)
      .join("circle")
      .attr("class", "close-point")
      .attr("cx", (d) => x_Scale(d.Date)) // X position based on Date
      .attr("cy", (d) => y_Scale(d.Close)) // Y position based on High value
      .attr("r", 4) // Radius of the circle
      .attr("fill", "red");
    // LINE
    svg
      .selectAll(".close-line")
      .data([pathDataClose])
      .join("path")
      .attr("d", (myd) => myd)
      .attr("fill", "none")
      .attr("stroke", "red");
    // LABEL
    svg
      .selectAll(".close-label")
      .data(data)
      .join("text")
      .attr("class", "close-label")
      .attr("x", (d) => x_Scale(d.Date))
      .attr("y", (d) => y_Scale(d.Close) - 10) // Slightly above the circle
      .text((d) => d.Close)
      .attr("font-size", "10px")
      .attr("fill", "red");

    // OPEN LINE
    var lineGeneratorOpen = d3
      .line()
      .x((d) => x_Scale(d.Date))
      .y((d) => y_Scale(d.Open))
      .curve(d3.curveCardinal);

    var pathDataOpen = lineGeneratorOpen(data);
    // DATA POINT
    svg
      .selectAll(".open-point")
      .data(data)
      .join("circle")
      .attr("class", "open-point")
      .attr("cx", (d) => x_Scale(d.Date)) // X position based on Date
      .attr("cy", (d) => y_Scale(d.Open)) // Y position based on High value
      .attr("r", 4) // Radius of the circle
      .attr("fill", "green");
    // LINE
    svg
      .selectAll(".open-line")
      .data([pathDataOpen])
      .join("path")
      .attr("d", (myd) => myd)
      .attr("fill", "none")
      .attr("stroke", "green");
    // LABEL
    svg
      .selectAll(".open-label")
      .data(data)
      .join("text")
      .attr("class", "open-label")
      .attr("x", (d) => x_Scale(d.Date))
      .attr("y", (d) => y_Scale(d.Open) - 10) // Slightly above the circle
      .text((d) => d.Open)
      .attr("font-size", "10px")
      .attr("fill", "green");

    // Add the X axis using join
    svg
      .selectAll(".x.axis")
      .data([null])
      .join("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x_Scale));

    // Add the Y axis using join
    svg
      .selectAll(".y.axis")
      .data([null])
      .join("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y_Scale));
  };

  render() {
    const options = ["Apple", "Microsoft", "Amazon", "Google", "Meta"]; // Use this data to create radio button
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]; // Use this data to create dropdown

    return (
      <div className="child1">
        <svg id="mychart" width="700" height="400">
          <g></g>
        </svg>
      </div>
    );
  }
}

export default Child1;
