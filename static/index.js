import { WebCli } from '/webcli/webcli.js';

var sever_address = []
function update_server_address() {
	window.webcli.call('server', function (ev) {
		sever_address = JSON.parse(ev)
		sever_address = sever_address
	})
}

function bind_server() {
	window.txt_server = $("#txt_server_addresss").autocomplete({
		source: function (req, rsp) {
			var term = req.term
			if (term in sever_address) {
				rsp(sever_address)
				return
			}
			update_server_address()
		}
	});
	$("#txt_server_addresss").spinner({
		spin: function (ev, ui) {
			this.selection_idx = sever_address.indexOf(this.value)
			this.selection_idx += ui.value
			if (sever_address[this.selection_idx])
				this.value = sever_address[this.selection_idx]
			return false
		}
	})
}

function bind_progressbar() {
	window.main_bar = $("#main_bar").progressbar({
		value: false,
		change: function () {
		},
		complete: function () {
		}
	});
	window.main_bar_label = $("#main_bar_label")
}

function bind_tab_pages() {
	window.main_tabs = $("#tabs").tabs({
		activate: function (ev, ui) {
			if (ui.newTab.text() == 'Stream') {
				remote_sync_streams()
			}
			if (ui.newTab.text() == 'Dashboard') {
				statistics_update()
			}
			window.webcli.update_webcli_log(true)
		}
	})
}

function bind_others() {
	$("#cg_test_case").controlgroup();
	$("#cg_stream_config").controlgroup();
	$("#list_test_case").selectmenu()
	$('#btn_stream_add').button({
		icon: 'ui-icon-circle-check',
		showLabel: true,
	})
	window.uilog = $("#txt_log").resizable({
		helper: "ui-resizable-helper",
	})
	$('#btn_stream_add').on('click', function (ev) {
		var type = $('#list_stream_type').val()
		var target = window.txt_server.val()
		var dir = $("input[name='stream_type']:checked").val();
		window.webcli.call('stream_add', [type, target, '1000', '1500', '0.1', dir], function (ev) {
			var data = JSON.parse(ev)
			local_sync_streams(data)
		});
	});
}

function resizeBody() {
	$('#tabs').height($(window).height() - $("#main_bar").height() - 25)
	var c_height = $('#tabs').height() - 40
	$('#tabs-1').height(c_height)
	if (window.chart_dash) {
		window.chart_dash.options.height = c_height - 10
	}
	statistics_update()
}

function bind_window() {
	$(window).resize(function () {
		resizeBody()
	})
	resizeBody()
}

function monitor_process() {
	window.webcli.call('monitor', function (ev) {
		var ma = JSON.parse(ev)
		if (ma && ma.length > 0) {
			ma.forEach(fresh => {
				if (!fresh) {
					remote_sync_streams()
					return
				}
			});
		}
	})
}

function statistics_update() {
	/* current first tab page? */
	if (window.main_tabs.tabs('option', 'active') == 0) {
		window.webcli.call('statistics', function (ev) {
			var oa = JSON.parse(ev)
			if (oa && oa.length > 0) {
				update_streams_chart(oa[0])
			}
		})
	}
}

$(function () {
	window.webcli = new WebCli()
	bind_server()
	bind_progressbar()
	bind_tab_pages()
	bind_others()
	bind_window()
	update_server_address()

	init_chart()
	init_stream_table()

	window.monitor = setInterval(() => {
		monitor_process()
	}, 1000)

	statistics_update()
	setInterval(() => {
		statistics_update()
	}, 5000)
})