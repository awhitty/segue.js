function Segue(element, options) {
	// make sure we have instructions here
	if (!element || !options.manipulator) {
		console.log("Warning: Segue invoked without a root element or any manipulator... I can't work with this!")
		return;
	}

	// defaults
	var options = options || {},
		manipulator = options.manipulator,
		min = options.min || 0,
		max = options.max || 100,
		complete = (options.complete != undefined) ? options.complete : true, // might be a better way to do this?
		toggle_on_tap = (options.toggle_on_tap != undefined) ? options.toggle_on_tap : false,
		orientation = (options.orientation) || 'horizontal';

	var state = 0;

	function handleDrag(ev) {
		ev.gesture.preventDefault();
		ev.gesture.stopPropagation();

		var delta;

		switch(orientation) {
			case 'horizontal':
				delta = ev.gesture.deltaX;

				break;

			case 'vertical':
				delta = ev.gesture.deltaY;

				break;
		}

		var percent = delta / (max - min);
		// if (percent + state > 1) {
		// 	// state = 1;
		// 	percent = percent - (percent-1)*.4;
		// } else if (percent + state< 0) {
		// 	percent *= .4;
		// }

		manipulator(percent, state, false, element)
	}

	function handleComplete(ev) {
		if (ev) {
			switch(ev.type) {
				case 'swipe':
					if (orientation == 'vertical') {
						if (ev.gesture.direction == 'up') state = 0;
						if (ev.gesture.direction == 'down') state = 1;
					} else {
						if (ev.gesture.direction == 'left') state = 0;
						if (ev.gesture.direction == 'right') state = 1;
					}

					ev.gesture.stopDetect();

					break

				case 'release':
					var percent = ev.gesture.distance / (max - min);

					if (percent >= .5) state = Math.abs(state - 1);
					else state = state;

					break;
			}
		}

		if (options.complete) options.complete(state);
		manipulator(state, 0, true, element);
	}

	function handleToggle() {
		state = Math.abs(state - 1);
		handleComplete();
	}

	function setup() {
		Hammer(element).on('drag', handleDrag);


		if (complete) Hammer(element).on('swipe release', handleComplete);
		if (toggle_on_tap) Hammer(element).on('tap', handleToggle);
	}

	setup();
}

// Segue(slider, {
// 	min: 0, // default = 0
// 	max: 100, // default = 100
// 	manipulator: dragSlider,
// 	complete: true, // default = true
// 	toggle_on_tap: true, // default = false
// 	orientation: 'horizontal' // default = horizontal
// })

// Segue(slider, dragSlider) // should also work

// function dragSlider(percent, animate, element (optional))