function init_chart() {

	var dataPoints1 = [];
	var dataPoints2 = [];

	var chart = new CanvasJS.Chart("chartContainer", {
		zoomEnabled: true,
		title: {
			text: "Share Value of Two Companies"
		},
		axisX: {
			title: "chart updates every 3 secs"
		},
		axisY: {
			prefix: "$",
			includeZero: false
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
			yValueFormatString: "$####.00",
			xValueFormatString: "hh:mm:ss TT",
			showInLegend: true,
			name: "Company A",
			dataPoints: dataPoints1
		},
		{
			type: "line",
			xValueType: "dateTime",
			yValueFormatString: "$####.00",
			showInLegend: true,
			name: "Company B",
			dataPoints: dataPoints2
		}]
	});
	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		chart.render();
	}

	var updateInterval = 3000;
	// initial value
	var yValue1 = 600;
	var yValue2 = 605;

	var time = new Date;
	// starting at 9.30 am
	time.setHours(9);
	time.setMinutes(30);
	time.setSeconds(0);
	time.setMilliseconds(0);

	function updateChart(count) {
		count = count || 1;
		var deltaY1, deltaY2;
		for (var i = 0; i < count; i++) {
			time.setTime(time.getTime() + updateInterval);
			deltaY1 = .5 + Math.random() * (-.5 - .5);
			deltaY2 = .5 + Math.random() * (-.5 - .5);

			// adding random value and rounding it to two digits. 
			yValue1 = Math.round((yValue1 + deltaY1) * 100) / 100;
			yValue2 = Math.round((yValue2 + deltaY2) * 100) / 100;

			// pushing the new values
			dataPoints1.push({
				x: time.getTime(),
				y: yValue1
			});
			dataPoints2.push({
				x: time.getTime(),
				y: yValue2
			});
		}

		// updating legend text with  updated with y Value 
		chart.options.data[0].legendText = " Company A  $" + yValue1;
		chart.options.data[1].legendText = " Company B  $" + yValue2;
		chart.render();
	}
	// generates first set of dataPoints 
	updateChart(100);
	setInterval(function () { updateChart() }, updateInterval);

}