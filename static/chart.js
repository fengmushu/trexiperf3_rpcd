
function init_chart() {
	var chart = new CanvasJS.Chart("mlineChart", {
		zoomEnabled: false,
		height: 680,
		// width: 800,
		animationEnabled: true,
		theme: "dark1",
		title: {
			text: "WLAN Stations"
		},
		// axisX: {
		// 	title: ""
		// },
		axisY: {
			includeZero: true
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			verticalAlign: "top",
			fontSize: 14,
			fontColor: "dimGrey",
			itemclick: toggleDataSeries
		},
		data: [{
			type: "line",
			xValueType: "dateTime",
			yValueFormatString: "####.00",
			xValueFormatString: "hh:mm:ss TT",
			showInLegend: true,
			name: "RX-",
			dataPoints: []
		},
		{
			type: "line",
			xValueType: "dateTime",
			yValueFormatString: "####.00",
			showInLegend: true,
			name: "TX-",
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

function update_streams_chart(ifstat) {
	var chart = window.chart_dash;

	chart.options.data = []
	for (iface in ifstat) {
		var RX = []
		var TX = []
		ds = ifstat[iface]
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
		lineRx = {
			type: "line",
			xValueType: "dateTime",
			yValueFormatString: "####.00",
			xValueFormatString: "hh:mm:ss TT",
			showInLegend: true,
			name: "RX-" + iface,
		}
		lineRx.dataPoints = RX
		lineTx = {
			type: "line",
			xValueType: "dateTime",
			yValueFormatString: "####.00",
			showInLegend: true,
			name: "TX-" + iface,
		}
		lineTx.dataPoints = TX
		lineRx.legendText = "RX-" + iface + ':' + yValueRx;
		lineTx.legendText = "TX-" + iface + ':' + yValueTx;
		chart.options.data.push(lineRx)
		chart.options.data.push(lineTx)
	}
	chart.render()
}