import $ from 'jquery'
import io from 'socket.io-client'
let sendPlugin = {
	render () {
		return `<div class="col-lg-10 send-container">
					<div class="input-group">
						<input type="text" class="form-control barrage-input" placeholder="发言吧...">
						<span class="input-group-btn">
							<button class="btn" type="button">发送</button>
						</span>
					</div>
				</div>`
	},
	action (barrage) {
        const $container = $(barrage.container);
		const socket = barrage.socket;
		$container.delegate('.btn', 'click', function () {
			let val = $container.find('.barrage-input').val();
			//向服务端的自定义事件 'my other event' 发出数据
			socket.emit('add-message', { text: val });
		});
	}
};

export default sendPlugin;