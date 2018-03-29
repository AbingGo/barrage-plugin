import $ from 'jquery'
let closePlugin = {
	render () {
		return `<div class="close">
					x
				</div>`
	},
	action (barrage) {
        const $container = $(barrage.container);
        $container.find('.close').on('click', () => {
            barrage.destroy();
        });
	}
};

export default closePlugin;