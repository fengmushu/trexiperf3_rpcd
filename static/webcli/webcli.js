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
		var bar = window.main_bar;
		bar.progressbar("value", val)

		var img_src = './img/icon_session_inactive.png'
		bar.find('img').attr('src', img_src)

		img_src = './img/icon_session_' + txt + '.png'
		if (txt != 'active') {
			img_src = './img/icon_session_error.png'
		}
		setTimeout(() => {
			bar.find('img').attr('src', img_src)
		}, 200)
	}

	update_webcli_log(clean = false) {
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
			/**
			 * 0	UNSENT	代理被创建，但尚未调用 open() 方法。
			 * 1	OPENED	open() 方法已经被调用。
			 * 2	HEADERS_RECEIVED	send() 方法已经被调用，并且头部和状态已经可获得。
			 * 3	LOADING	下载中；responseText 属性已经包含部分数据。
			 * 4	DONE	下载操作已完成。
			*/
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
					cli.update_progress(false, "active")
					callback(res.result ? res.result.message : res);
				}
			} else {
				if (req.readyState == 4 && req.status != 200) {
					/**
					 * 4: status: 0 -> error, lost connection
					*/
					console.log(req.status, req.readyState)
					cli.update_progress(false, "error")
				}
			}
		};
		req.send(JSON.stringify(json2))
	}

	get_log(clean) {
		var info = ''
		this.log.forEach(line => {
			info += line + '<br>'
		});
		if (clean) {
			this.log = []
		}
		return info
	}
}
