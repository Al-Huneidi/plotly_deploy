function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      
      // Filter the data to find the object with the desired sample (id) number.
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      
      // Use d3 to select the html id tag, `#sample-metadata`.
      var PANEL = d3.select("#sample-metadata");
      
      // Use `.html("") to clear out any existing metadata.
      PANEL.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      // as the forEach loops through the metadata to append new tags for each key-value pair
      // and make the labels uppercase letters. 
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  // Build the charts.
  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
      
      // Build a Bubble Chart
      var bubbleLayout = {
        title: "Number of Bacteria Species Per Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Electric"
          }
        }
      ];
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      
      // Create a bar chart.
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
          marker: {
            color: 'rgb(72,61,139)'
          }
        }
      ];
      var barLayout = {
        title: "Top 10 Bacteria Species",
        margin: { t: 30, l: 150 }
      };

      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  function init() {
    // Get a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    // Use the list of sample names to populate the selection options.
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      // Use the first sample (id) at the begining of the array to create the initial charts, prior to selecting an id from dropdown menu.
      var startSample = sampleNames[0];
      buildCharts(startSample);
      buildMetadata(startSample);
    });
  }
  function optionChanged(newSample) {
    // Get new data each time a new id is selected from the dropdown menu.
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  // Initialize the dashboard
  init();