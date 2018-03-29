import io from 'socket.io-client'
import $ from 'jquery'
import './static/css/common.css'
import Barrage from './components/barrage/layer'
import sendPlugin from './components/barrage/send_plugin'
import closePlugin from './components/barrage/close_plugin'

const App = () => {

	const data = [
		{
			text: '<img src="http://p6.qhimg.com/t015b30ba52c66874cf.png">'
		},
		{
			text: '<img src="http://p3.qhimg.com/t01a2c1b4ba0197fb49.png">'
		},
		{
			text: '准备要放大招了'
		}
	];

	//创建socket
	const socket = io('http://localhost:8888');
	const barrage = new Barrage('danmu-container', {
		socket: socket,
		data: data,
		cycle: 3000,
		winWidth: 800,
		winHeight: 400,
		rowHeight: 100
	});
	
	// 给弹幕注册组件
	barrage.registerPlugins(sendPlugin, closePlugin);  
};
new App();
