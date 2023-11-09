export class WebCli {
	json2 = {
		"jsonrpc": "2.0",
		"method": "traffic_gen.API.monitor",
		"params": [],
		"id": "monitor"
	};

	constructor(prefix) {
		if (prefix)
			this.prefix = prefix
		else
			this.prefix = "traffic_gen.API."
		this.log = []
	}

	update_progress(val, txt) {
		window.main_bar.progressbar("value", val)
		if (txt) {
			window.main_bar_label.text(txt)
		}
	}

	update_webcli_log(clean=false) {
		var log = window.webcli.get_log(clean)
		window.uilog.html(log)
	}

	async call(method, params, callback) {
		var cli = this
		var json2 = this.json2

		if (typeof (params) == "function") {
			callback = params
		}

		json2.method = this.prefix + method
		json2.params = params
		json2.id = Math.ceil((Math.random() * 0xFFFFFF)).toString()

		var req = new XMLHttpRequest();
		req.open('POST', '/rpc', true);
		req.setRequestHeader('Content-type', 'application/json');

		req.onreadystatechange = function () {
			if (req.readyState == 4 && req.status == 200) {
				var res = JSON.parse(req.responseText);
				if (callback) {
					if (res.error) {
						var err = "[" + res.id + ": " + res.error.code + "] " + res.error.message
						cli.log.unshift(err)
						cli.update_progress(false, err)
						cli.update_webcli_log()
						return
					}
					cli.update_progress(false, "ready")
					var rc = res.result ? res.result.message : res
					callback(rc);
				}
			}
		};
		var str = JSON.stringify(json2)
		req.send(str)
	}

	get_log(clean) {
		var info = ''
		this.log.forEach(line => {
			info += line + '<br>'
		});
		if(clean) {
			this.log = []
		}
		return info
	}
}
