buildMetadata('940');
buildCharts('940');

function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  })
}

init();

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("id: " + result.id);
    PANEL.append("h6").text("Race: " + result.ethnicity);
    PANEL.append("h6").text("Sex: " + result.gender);
    PANEL.append("h6").text("Age: " + result.age);
    PANEL.append("h6").text("Location: " + result.location);
    PANEL.append("h6").text("Type: " + result.bbtype);
    PANEL.append("h6").text("Freq: " + result.wfreq);
  });
}


// charts

function buildCharts(sample) {

  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    var ytick = otu_ids.slice(0, 10).map(otu_id => `OTU${otu_id}`).reverse()
    var metadata = data.metadata;
    var wfreq= metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;

    var trace1 = {
      x: sample_values.slice(0, 10).reverse(),
      y: ytick,
      type: 'bar',
      orientation: 'h',
      text: otu_labels.slice(0, 10).reverse(),
      marker: {
        color: 'rgb(142,124,195)'
      }
    };

    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    };

    var layout1 = {
      title: 'Top Bacteria',
      font: {
        family: 'Raleway, sans-serif'
      },
      showlegend: false,
      xaxis: {
        tickangle: -45
      },
      yaxis: {
        zeroline: false,
        gridwidth: 2
      },
      bargap: 0.05
    };

    var data = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreq,
        title: { text: "Hand Washing", font: { size: 24 } },
        delta: { reference: 9, increasing: { color: "RebeccaPurple" } },
        gauge: {
          axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "blue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 1], color: "white" },
            { range: [1, 2], color: "white" },
            { range: [2, 3], color: "white" },
            { range: [3, 4], color: "white" },
            { range: [4, 5], color: "white" },
            { range: [5, 6], color: "white" },
            { range: [7, 8], color: "white" },
            { range: [8, 9], color: "white" },
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 9
          }
        }
      }
    ];

    var layout2 = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    };



    Plotly.newPlot('bar', [trace1], layout1);
    Plotly.newPlot('bubble', [trace2]),
      Plotly.newPlot('gauge', data, layout2);
  });


}


function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

