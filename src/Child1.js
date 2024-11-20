import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";
class Child1 extends Component {
  state = {
    company: "Apple", // Default Company
    selectedMonth: "November", //Default Month
  };
  set_company = (company_name) => {
    this.setState({ company: company_name });
    console.log("succesfully changed company state");
  };
  set_month = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };

  componentDidMount() {
    // console.log(this.props.csv_data); // Use this data as default. When the user will upload data this props will provide you the updated data

    this.renderChart();
  }

  componentDidUpdate() {
    // console.log(this.props.csv_data);
    this.destroyChart();

    this.renderChart();
  }

  destroyChart = () => {
    // Completely clear the SVG by removing all child elements
    d3.select("#mychart").selectAll("*").remove();
    // Optionally reset the <g> element for consistent structure
    d3.select("#mychart").append("g");
  };

  renderChart = () => {
    const monthNames = [
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
    ];

    const { company, selectedMonth } = this.state;

    const data = this.props.csv_data.filter((item) => {
      const itemMonth = new Date(item.Date).getMonth(); // Extract month from Date object this is an INT
      const targetMonth = monthNames.indexOf(selectedMonth); // Convert string month to index INT

      return item.Company === company && itemMonth === targetMonth;
    });

    console.log(data);
    // this is used to format date in text
    const formatDate = d3.timeFormat("%Y-%m-%d");

    // Set the dimensions of the chart
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 700,
      height = 400,
      innerWidth = 600 - margin.left - margin.right,
      innerHeight = 400 - margin.top - margin.bottom;

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

    // CLOSE LINE //
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
      .attr("fill", "#e41a1c")
      .on("mouseover", function (event, d) {
        svg
          .append("rect")
          .attr("class", "label-background")
          .attr("x", x_Scale(d.Date) + 15)
          .attr("y", y_Scale(d.Open) - 25)
          .attr("width", 100)
          .attr("height", 60)
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("stroke-width", 1);

        // Create the label when the mouse hovers over the circle
        svg
          .append("text")
          .attr("class", "label")
          .attr("x", x_Scale(d.Date) + 20) // X position based on Date
          .attr("y", y_Scale(d.Open) - 10) // Slightly above the circle
          .attr("font-size", "10px")
          .attr("fill", "black")
          .text("Date: " + formatDate(d.Date))
          .append("tspan")
          .attr("x", x_Scale(d.Date) + 20)
          .attr("dy", "1.2em")
          .text("Open: " + d.Open.toFixed(2))
          .append("tspan")
          .attr("x", x_Scale(d.Date) + 20)
          .attr("dy", "1.2em")
          .text("Close: " + d.Close.toFixed(2))
          .append("tspan")
          .attr("x", x_Scale(d.Date) + 20)
          .attr("dy", "1.2em")
          .text("Difference: " + (d.Close - d.Open).toFixed(2));
        d3.select(event.target).attr("r", 8); // Increase circle radius
        d3.select(this).style("cursor", "pointer");
      })
      .on("mouseout", function (event, d) {
        // Remove the label when the mouse leaves the circle
        svg.selectAll(".label-background").remove();

        svg.selectAll(".label").remove();
        d3.select(event.target).attr("r", 4); // Increase circle radius
        d3.select(this).style("cursor", "default");
      });

    //  LINE
    svg
      .selectAll(".close-line")
      .data([pathDataClose])
      .attr("class", "close-line")

      .join("path")
      .attr("d", (myd) => myd)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c");

    ////////////////////////////////

    // OPEN LINE //
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
      .attr("fill", "#b2df8a")
      .on("mouseover", function (event, d) {
        svg
          .append("rect")
          .attr("class", "label-background")
          .attr("x", x_Scale(d.Date) + 15)
          .attr("y", y_Scale(d.Open) - 25)
          .attr("width", 100)
          .attr("height", 60)
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("stroke-width", 1);
        // Create the label when the mouse hovers over the circle
        svg
          .append("text")
          .attr("class", "label")
          .attr("x", x_Scale(d.Date) + 20) // X position based on Date
          .attr("y", y_Scale(d.Open) - 10) // Slightly above the circle
          .attr("font-size", "10px")
          .attr("fill", "black")
          .text("Date: " + formatDate(d.Date))
          .append("tspan")
          .attr("x", x_Scale(d.Date) + 20)
          .attr("dy", "1.2em")
          .text("Open: " + d.Open.toFixed(2))
          .append("tspan")
          .attr("x", x_Scale(d.Date) + 20)
          .attr("dy", "1.2em")
          .text("Close: " + d.Close.toFixed(2))
          .append("tspan")
          .attr("x", x_Scale(d.Date) + 20)
          .attr("dy", "1.2em")
          .text("Difference: " + (d.Close - d.Open).toFixed(2));

        d3.select(event.target).attr("r", 8); // Increase circle radius
        d3.select(this).style("cursor", "pointer");
      })
      .on("mouseout", function (event, d) {
        // Remove the label when the mouse leaves the circle
        svg.selectAll(".label-background").remove();

        svg.selectAll(".label").remove();
        d3.select(event.target).attr("r", 4); // Increase circle radius
        d3.select(this).style("cursor", "default");
      });

    // LINE
    svg
      .selectAll(".open-line")
      .attr("class", "open-line")
      .data([pathDataOpen])
      .join("path")
      .attr("d", (myd) => myd)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a");

    //////////////////////////////////////

    // AXIS

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
        <div className="radio-buttons">
          <label>Company</label>
          <form className="company">
            {options.map((company) => (
              <div key={company} className="radio">
                <label>
                  <input
                    type="radio"
                    value={company}
                    checked={this.state.company === company}
                    onChange={() => this.set_company(company)}
                  />
                  {company}
                </label>
              </div>
            ))}
          </form>
        </div>

        <div className="dropdown-menu">
          <label>
            Months:
            <select
              value={this.state.selectedMonth}
              onChange={(event) => this.set_month(event)}
            >
              {months.map((month) => (
                <option value={month}>{month}</option>
              ))}
            </select>
          </label>
        </div>

        <svg id="mychart" width="700" height="400">
          <g></g>
        </svg>
      </div>
    );
  }
}

export default Child1;
