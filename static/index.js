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

function bind_tabs() {
	$("#tabs").tabs({
		activate: function (ev, ui) {
			if (ui.newTab.text() == 'Stream')
				remote_sync_streams()
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

function bind_window() {
	function resizeBody() {
		$('#tabs').height($(window).height() - $("#main_bar").height() - 25)
		$('#tabs-1').height($('#tabs').height() - 60)
	}
	$(window).resize(function () {
		resizeBody()
	})
	resizeBody()
}

$(function () {
	window.webcli = new WebCli()
	bind_server()
	bind_progressbar()
	bind_tabs()
	bind_others()
	bind_window()
	update_server_address()

	init_chart()
	init_stream_table()
})