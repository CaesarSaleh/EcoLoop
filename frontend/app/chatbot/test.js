const d3 = require('d3');
const { JSDOM } = require('jsdom');
const svg2png = require('svg2png');

async function generateChart() {
  // Create a virtual DOM
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const document = dom.window.document;

  // Your data
  const data = [10, 20, 30, 40, 50];

  // Select the body element
  const body = d3.select(document.body);

  // Create an SVG container
  const svg = body.append('svg')
    .attr('width', 500)
    .attr('height', 100);

  // Create circles based on data
  svg.selectAll('circle')
    .data(data)
    .enter().append('circle')
    .attr('r', d => d)
    .attr('cx', (d, i) => i * 40 + 50)
    .attr('cy', 50);

  // Get the SVG content
  const svgString = dom.serialize();

  // Convert SVG to PNG
  const pngBuffer = await svg2png(svgString);

  // You can use the PNG buffer as needed (e.g., save to a file, send in response, etc.)
  console.log('SVG converted to PNG successfully.');
}

generateChart();
