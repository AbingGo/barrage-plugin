import './layer.less'
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.css'

var random = function (start, end) {
	return start + ~~(Math.random() * (end - start));
};

class Component{
	constructor(id, opts = {}) {
		this.opts = opts;
		this.container = document.getElementById(id);
		this.socket = this.opts.socket;
		this.winWidth = this.opts.winWidth;
		this.winHeight = this.opts.winHeight;
		this.rowHeight = this.opts.rowHeight;
		this.rowNumber = Math.floor(this.winHeight / this.rowHeight);
		this.data = this.opts.data;

		this.rowsHandlers = this.setRowsHandlers(this.rowNumber);
		this.container.innerHTML = this.render(this.rowNumber);

		this.timer = null;

		this.bindEvent();
		this.motions();
		this.listen();
	}
	registerPlugins(...plugins){
        plugins.forEach(plugin => {
            let pluginContainer = document.createElement('div');
            pluginContainer.className = 'danmu-plugin';
			pluginContainer.innerHTML = plugin.render(this.rowNumber);
            this.container.appendChild(pluginContainer);
            plugin.action(this);
        });
    }
}
export default class Barrage extends Component {
	constructor(id, opts = {}) {
		super(id, opts);
		this.timer = setInterval(() => {
			let messageData = this.data.shift();
			if (!messageData) {
				return;
			}
			this.insertMessage(messageData.text);
		}, 100);
	}

	listen () {
		this.socket.on('news', (data) => {
			console.log(data.msg);
		});
		/* 
		创建自定义事件 'news'
		作用：接受服务端 socket.emit('news', 数据); 发出的数据
		*/
		this.socket.on('message', (data) => {
			 //输出服务端响应了数据
			 this.data.push(data);
		});
	}

	render (rows) {
		let tpl = '';
		for (let row = 0; row < rows; row++) {
			tpl += `<div class="danmu-list-row${row} row" style="width: ${this.winWidth * 10}px;transform: translate(${this.winWidth}px); top: ${this.rowHeight * row}px" data-row="${row}"></div>`;
		}
		return `<div class="content">${tpl}</div>`;
	}

	destroy () {
		clearInterval(this.timer);
		$(this.container).remove();
	}

	motions () {
		for (let i = 0; i < this.rowNumber; i++) {
			this.playMotion(`row${i}`);
		}
	}

	setRowsHandlers (rows) {
		let rowsObj = {};
		for (let i = 0; i < rows; i++) {
			rowsObj[`row${i}`] = {
				row: i,
				width: 0,
				speed : random(3, 5),
				status: {
					pause: false
				},
				motionId: null
			};
		}
		return rowsObj;
	}

	setRowHandler (row, width) {
		this.rowsHandlers[row].width += width;
		if (!this.rowsHandlers[row].motionId) {
			this.addMotion(row);
		}
	}

	playMotion (row) {
		this.rowsHandlers[row].motionId = requestAnimationFrame(() => {
			this.step(row);
		});
	}

	stopMotion (row) {
		cancelAnimationFrame(this.rowsHandlers[row].motionId);
	}

	pauseMotion (row) {
		this.rowsHandlers[row].status['pause'] = true;
	}

	resumeMotion (row) {
		this.rowsHandlers[row].status['pause'] = false;
	}

	step (row) {
		if (this.rowsHandlers[row].status['pause']) {
			requestAnimationFrame(() => {
				this.step(row);
			});
			return;
		}
		let speed = this.rowsHandlers[row]['speed'];
		let $firstNode = $(`.danmu-list-${row} .message`).eq(0);

		if ($firstNode.length) {
			let w = $firstNode.outerWidth() || 0;
			let tx = parseInt($(`.danmu-list-${row}`).css('transform').split(',')[4]);
			if (w && tx < -w) {
				$(`.danmu-list-${row} .message`).eq(0).remove();
				tx += w;
			}
			$(`.danmu-list-${row}`).css({
				transform: `translate(${tx - speed}px)`
			});
		} else {
			$(`.danmu-list-${row}`).css({
				transform: `translate(800px)`
			});
		}
		requestAnimationFrame(() => {
			this.step(row);
		});
	}

	bindEvent () {
		let self = this;
		$(this.container).delegate('.row', 'mouseenter', function (ev) {
			let row = $(this).data().row;
			self.pauseMotion(`row${row}`);
		});

		$(this.container).delegate('.row', 'mouseleave', function (ev) {
			let row = $(this).data().row;
			self.resumeMotion(`row${row}`);
		});
	}

	insertMessage (data) {
		let curRowIdx = this.getInertRowsIndex();
		if ($(`.danmu-list-${curRowIdx} .message`).length > 10) {
			return;
		}
		let messageWidth = data.toString().length;
		let message = this.renderMessage(data, messageWidth);
		$(`.danmu-list-${curRowIdx}`).append(message);
		this.setRowHandler(curRowIdx, messageWidth);
	}

	renderMessage (data, messageWidth) {
		return `<div class="message" data-width="${messageWidth}"><a href="###">${data}</a></div>`
	}

	getInertRowsIndex () {
		let minR = 'row0';
		let minW = 0;
		Object.keys(this.rowsHandlers).forEach((key => {
			minW = this.rowsHandlers[minR].width;
			if (this.rowsHandlers[key].width < minW) {
				minR = key;
			}
		}));
		return minR;
	}
}  