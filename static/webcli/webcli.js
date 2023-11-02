export class WebCli {
	json2 = {
		"jsonrpc": "2.0",
		"method": "trexiperf_rpcd.sample.greeting",
		"params": [],
		"id": "greeting"
	};

	constructor(prefix) {
		if (prefix)
			this.prefix = prefix
		else
			this.prefix = "trexiperf_rpcd.sample."
	}

	call(method, params, callback) {
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
				if (callback)
					callback(res.result);
			}
		};
		// req.onprogress = function (ev) {
		// 	console.log(ev)
		// }
		// req.onload = function (ev) {
		// 	console.log(ev)
		// }
		// req.onloadend = function (ev) {
		// 	console.log(ev)
		// }
		var str = JSON.stringify(json2)
		req.send(str)
		console.log("JSON-RPC2:", str)
	}
}
