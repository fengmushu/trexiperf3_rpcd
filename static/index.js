import { WebCli } from '/webcli/webcli.js';

var sever_address = []
function update_server_address() {
	window.webcli.call('server', function (ev) {
		sever_address = JSON.parse(ev.message)
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
	$("#progressbar").progressbar({
		value: false,
		change: function () {
		},
		complete: function () {
		}
	});
}

function bind_others() {
	$("#controlgroup").controlgroup();
	$("#tabs").tabs()
	$('#btn_connect').button({
		icon: 'ui-icon-circle-check',
		showLabel: true,
	})
	$('#btn_connect').on('click', function (ev) {
		var target = window.txt_server.val()
		var type = $("input[name='stream_type']:checked").val();
		window.webcli.call('connect', [target, type], function (ev) {
			console.log(ev)
		});
	});
}

$(function () {
	window.webcli = new WebCli()
	bind_server()
	bind_progressbar()
	bind_others()
	update_server_address()

	init_chart()
})