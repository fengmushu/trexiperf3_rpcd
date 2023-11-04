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
		var action = $(ev.currentTarget).val()
		window.webcli.call('stream_action', [action], function (ev) {
			var data = JSON.parse(ev)
			local_sync_streams(data)
		})
	})
}

function local_sync_streams(data) {
	var tab = window.stream_table
	tab.clear().draw()
	data.forEach(row => {
		var Status = row[status_index]
		var action = ['remove']
		if (Status == 'idle') {
			action = ['detect', 'edit', 'remove']
		} else if (Status == 'running') {
			action = ['detect', 'stop']
		} else if (Status == 'ready') {
			action = ['start', 'halt']
		} else if (Status == 'error') {
			action = ['detect', 'edit', 'remove']
		}
		row[status_index + 1] = action
		tab.row.add(row).draw()
	});
	ui_sync_streams()
}

function update_progress(val, txt) {
	window.main_bar.progressbar("value", val)
	if (txt) {
		window.main_bar_label.text(txt)
	}
}

function remote_sync_streams() {
	window.webcli.call('stream', ['list'], function (ev) {
		var data = JSON.parse(ev)
		local_sync_streams(data)
	})
}

function init_stream_table() {
	window.webcli.call('stream', ['header'], function (ev) {
		stream_header = JSON.parse(ev)
		var stream_table = new DataTable("#stream_table", {
			ordering: false,
			// pageLength: 20,
			paging: false,
			columns: stream_header,
			columnDefs: [{
				targets: status_index + 1,
				render: function (data, type, row, meta) {
					var ui = ''
					var idx = row[row.length - 1]
					var actions = row[status_index + 1]
					actions.forEach(action => {
						ui += '<button value=' + action + '-' + idx + ' class="ui-button-' + action + ' ui-button-action">' + action + '</button>'
					})
					return ui
				}
			}],
			data: [],
		})
		remote_sync_streams()
		window.stream_table = stream_table
	})
}