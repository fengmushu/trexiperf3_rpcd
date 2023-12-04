
function init_chart() {
	var chart = new CanvasJS.Chart("mlineChart", {
		zoomEnabled: false,
		height: 680,
		// width: 800,
		animationEnabled: true,
		title: {
			text: "Runtime stream statistics"
		},
		axisX: {
			title: "-"
		},
		axisY: {
			includeZero: true
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			verticalAlign: "top",
			fontSize: 22,
			fontColor: "dimGrey",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "line",
			xValueType: "dateTime",
			yValueFormatString: "####.00",
			xValueFormatString: "hh:mm:ss TT",
			showInLegend: true,
			name: "RX",
			dataPoints: []
		},
		{
			type: "line",
			xValueType: "dateTime",
			yValueFormatString: "####.00",
			showInLegend: true,
			name: "TX",
			dataPoints: []
		}]
	});
	window.chart_dash = chart;

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		chart.render();
	}
}

function update_streams_chart(ds) {
	var chart = window.chart_dash;

	// ds.shift()
	var RX = []; //chart.options.data[0].dataPoints
	var TX = []; //chart.options.data[1].dataPoints
	ds.forEach(row => {
		var time = new Date();
		time.setUTCSeconds(row[0])
		yValueRx = Math.ceil(row[1] / 1024 / 100)
		yValueTx = Math.ceil(row[2] / 1024 / 100)
		RX.push({
			x: time.getTime(),
			y: yValueRx
		});
		TX.push({
			x: time.getTime(),
			y: yValueTx
		});
	});
	chart.options.data[0].dataPoints = RX
	chart.options.data[1].dataPoints = TX
	chart.options.data[0].legendText = " RX " + yValueRx;
	chart.options.data[1].legendText = " TX " + yValueTx;
	chart.render()
}