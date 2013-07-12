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
    orientation = (options.orientation) || 'horizontal',
    states = options.states - 1 || 1,
    initial_state = options.initial_state || 0;

  var state = initial_state;

  console.log(state)

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
    //  // state = 1;
    //  percent = percent - (percent-1)*.4;
    // } else if (percent + state< 0) {
    //  percent *= .4;
    // }

    manipulator(percent, state, false, element)
  }

  function nextState() {
    if (state < states) state++;
  }

  function prevState() {
    if (state > 0) state--;
  }

  function cycleState() {
    if (state < states) state++;
    else state = 0;
  }

  function handleComplete(ev) {
    if (ev) {
      switch(ev.type) {
        case 'swipe':
          if (orientation == 'vertical') {
            if (ev.gesture.direction == 'up') prevState();
            if (ev.gesture.direction == 'down') nextState();
          } else {
            if (ev.gesture.direction == 'left') prevState();
            if (ev.gesture.direction == 'right') nextState();
          }

          ev.gesture.stopDetect();

          break

        case 'release':
          var percent = ev.gesture.distance / (max - min);

          if (percent >= .5) {
            if (orientation == 'vertical') {
              if (ev.gesture.direction == 'up') prevState();
              if (ev.gesture.direction == 'down') nextState();
            } else {
              if (ev.gesture.direction == 'left') prevState();
              if (ev.gesture.direction == 'right') nextState();
            }
          }

          break;
      }
    }

    manipulator(state, 0, true, element);
  }

  function handleToggle() {
    cycleState();
    handleComplete();
  }

  function setup() {
    Hammer(element).on('drag', handleDrag);


    Hammer(element).on('swipe release', handleComplete);
    if (toggle_on_tap) Hammer(element).on('tap', handleToggle);

    handleComplete();
  }

  setup();
}

// Segue(slider, {
//  min: 0, // default = 0
//  max: 100, // default = 100
//  manipulator: dragSlider,
//  complete: true, // default = true
//  toggle_on_tap: true, // default = false
//  orientation: 'horizontal' // default = horizontal
// })

// Segue(slider, dragSlider) // should also work

// function dragSlider(percent, animate, element (optional))