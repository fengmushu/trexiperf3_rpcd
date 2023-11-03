var stream_header = []
var status_index = 6

function ui_sync_streams() {
	$('.ui-button-remove').button({
		icon: "ui-icon-trash",
		showLabel: false
	})
	$('.ui-button-start').button({
		icon: "ui-icon-play",
		showLabel: false
	})
	$('.ui-button-stop').button({
		icon: "ui-icon-circle-close",
		showLabel: false
	})
	$('.ui-button-edit').button({
		icon: "ui-icon-gear",
		showLabel: false
	})
	$('.ui-button-halt').button({
		icon: "ui-icon-alert",
		showLabel: false
	})
	$('.ui-button-detect').button({
		icon: "ui-icon-transferthick-e-w",
		showLabel: false
	})
	$('.ui-button-action').click((ev) => {
		console.log($(ev.currentTarget).val())
	})
}

function data_sync_streams(data) {
	var tab = window.stream_table
	tab.clear()
	data.forEach(row => {
		var Status = row[status_index]
		var action = 'remove'
		if (Status == 'idle') {
			action = ['detect', 'remove', 'edit']
		} else if (Status == 'running') {
			action = ['stop']
		} else if (Status == 'ready') {
			action = ['start', 'halt']
		} else if (Status == 'error') {
			action = ['remove', 'detect', 'edit']
		}
		row[status_index + 1] = action
		tab.row.add(row).draw()
	});
	// tab.rows.add(data).draw()
	ui_sync_streams()
}

function init_stream_table() {
	window.webcli.call('stream', ['header'], function (ev) {
		stream_header = JSON.parse(ev.message)
		var stream_table = new DataTable("#stream_table", {
			ordering: false,
			pageLength: 20,
			columns: stream_header,
			columnDefs: [{
				targets: status_index + 1,
				render: function (data, type, row, meta) {
					var ui = ''
					var idx = data.indexOf(row)
					var actions = row[status_index + 1]
					actions.forEach(action => {
						ui += '<button value=' + action + '-' + idx + ' class="ui-button-' + action + ' ui-button-action">' + action + '</button>'
					})
					return ui
				}
			}],
			data: [],
		})
		window.webcli.call('stream', ['list'], function (ev) {
			var data = JSON.parse(ev.message)
			data_sync_streams(data)
		})
		window.stream_table = stream_table
	})
}