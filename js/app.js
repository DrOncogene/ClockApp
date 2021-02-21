//UI controlller IIFE
const UICtrl = (function (){
  //Object holding all UI element variables
  const UIElements = {
    clockBtn: document.querySelector('.clock-btn'),
    stopwatchBtn: document.querySelector('.stopwatch-btn'),
    timerBtn: document.querySelector('.timer-btn'),
    hours: document.querySelector('#hours'),
    minutes: document.querySelector('#minutes'),
    seconds: document.querySelector('#seconds'),
    playBtn: document.querySelector('#play-btn'),
    pauseBtn: document.querySelector('#pause-btn'),
    resetBtn: document.querySelector('#restart-btn'),
    colons: document.querySelectorAll('.colon'),
    arrowBtns: document.querySelectorAll('.arrows'),
    digitalClock: document.getElementById('digital-clock'),
    analogueClock: document.querySelector('.analogue-clock'),
    analogueToggle: document.querySelector('.analogue-toggle'),
    analogueToggleOff: document.querySelector('#toggle-off'),
    analogueToggleOn: document.querySelector('#toggle-on'),
    secondHand: document.getElementById('analogue-second'),
    minuteHand: document.getElementById('analogue-minute'),
    hourHand: document.getElementById('analogue-hour'),
  };

  // UI class constructor with a single property 'state'. The default state is 'clock'
  const UI = function(state = 'clock'){
    this.state = state;
  };

  // UI class prototype object to hold all prototype functions
  UI.prototype = {
    // prototype function that takes in a new state and set the state of the current instance to the new state.
    changeState(newState){
      this.state = newState;
      if (this.state === 'clock'){
        clockCtrl.homeState();

        // Set the clock homestate into motion to repeat every 1s
        const id = setInterval(() => {
          clockCtrl.homeState();
          clockCtrl.intervalIds.clockId = id;
          console.log(clockCtrl.intervalIds);
        }, 1000);
        
      } else if (this.state === 'stopwatch'){
        clockCtrl.stopwatchState();
      } else if (this.state === 'timer'){
        clockCtrl.timerState()
      };
    },


  }

  // Showoutput function that makes sure there are two digits shown for second, minute and hour and display them in the UI.
  const showOutput = function(hour,minute,second){
    
    if (hour.length === 1){
      hour = `0${hour}`
    };
    if (minute.length === 1){
      minute = `0${minute}`
    };
    if (second.length === 1){
      second = `0${second}`
    };

    UICtrl.UIElements.hours.textContent = hour;
    UICtrl.UIElements.minutes.textContent = minute;
    UICtrl.UIElements.seconds.textContent = second;
  };

  // Shows the button passed as a parameter in the UI by removing the 'is-hidden' bulma class.
  const show = function(btn){
    btn.classList.remove('is-hidden');
  };

  // Hide the button passed as a parameter in the UI by adding the 'is-hidden' bulma class.
  const hide = function(btn){
    btn.classList.add('is-hidden');
  };

  // Shows the toggler arrows in the UI by making use of the show function above (for the timer state).
  const showArrows = function(){
    UICtrl.UIElements.arrowBtns.forEach((arrowBtn)=>{
      show(arrowBtn);
    });
  };

  // Hides the toggler arrows in the UI by making use of the hide function above (for the timer state).
  const hideArrows = function(){
    UICtrl.UIElements.arrowBtns.forEach((arrowBtn)=>{
      hide(arrowBtn);
    });
  };

  // Shows the colons in the UI by making use of the show function above.
  const showColons = function(){
    UICtrl.UIElements.colons.forEach((colon)=>{
      show(colon);
    });
  };

  // Shows the colons in the UI by making use of the hide function above.
  const hideColons = function(){
    UICtrl.UIElements.colons.forEach((colon)=>{
      hide(colon);
    });
  };

  // Publicly available functions and properties of the UI controller packed in the returned object.
  return {
    UIElements,
    UI,
    showOutput,
    show,
    hide,
    showArrows,
    hideArrows,
    showColons,
    hideColons,
  }
})();

// Clock controller IIFE
const clockCtrl = (function(){
  // An object to hold the ids of any of the intervals currently running whose value will be dynamically set anytime an interval is set in to motion
  const intervalIds = {
    clockId: 0,
    stopwatchId: 0,
    timerId: null,
    timerPaused: false,
  };

  // An homestate function that is called when the app state is 'clock'
  const homeState = function(){
    // Clears the intervals of the other app states, if they're currently set.
    clearInterval(intervalIds.stopwatchId);
    clearInterval(intervalIds.timerId);
    // Grabs today's date and gets the hour, minute and second
    const today = new Date();
    const currentHour = today.getHours().toString();
    const currentMinute = today.getMinutes().toString();
    const currentSecond = today.getSeconds().toString();
    // Outputs them in the UI
    UICtrl.showOutput(currentHour, currentMinute, currentSecond);
    // Make the clock tab the active tab and deactivate the rest by adding or removing the 'is-active' bulma class
    UICtrl.UIElements.clockBtn.parentElement.classList.add('is-active');
    UICtrl.UIElements.stopwatchBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.timerBtn.parentElement.classList.remove('is-active');
    // Hide all the buttons
    UICtrl.hide(UICtrl.UIElements.playBtn);
    UICtrl.hide(UICtrl.UIElements.pauseBtn);
    UICtrl.hide(UICtrl.UIElements.resetBtn);
    // Hide analogue clock
    UICtrl.hide(UICtrl.UIElements.analogueClock);
    // show analogue toggle
    UICtrl.show(UICtrl.UIElements.analogueToggle);
    UICtrl.show(UICtrl.UIElements.analogueToggleOff);
    UICtrl.hide(UICtrl.UIElements.analogueToggleOn);
    // Shows the colons in case they have been hidden when switching over from the timer state where they are hidden. Same for the hideArrows().
    UICtrl.showColons();
    UICtrl.hideArrows();

  };
  
  // An stopwatchState function that is called when the app state is 'stopwatch'
  const stopwatchState = function(){
     // Clears the intervals of the other app states, if they're currently set.
    clearInterval(intervalIds.clockId);
    clearInterval(intervalIds.timerId);
    // Make the stopwatch tab the active tab and deactivate the rest by adding or removing the 'is-active' bulma class.
    UICtrl.UIElements.clockBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.timerBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.stopwatchBtn.parentElement.classList.add('is-active');
    // Set the ouput to 0
    UICtrl.showOutput('00','00','00');
    // Show the play and restart button and hide the pause button
    UICtrl.show(UICtrl.UIElements.playBtn);
    UICtrl.hide(UICtrl.UIElements.pauseBtn);
    UICtrl.show(UICtrl.UIElements.resetBtn);
    // hide analogue toggle and analogue clock if shown from home state and show digital output
    UICtrl.hide(UICtrl.UIElements.analogueClock);
    UICtrl.hide(UICtrl.UIElements.analogueToggle);
    UICtrl.show(UICtrl.UIElements.digitalClock);
    // Shows the colons in case they have been hidden when switching over from the timer state where they are hidden. Same for the hideArrows().
    UICtrl.showColons();
    UICtrl.hideArrows();
  };

  // An timerState function that is called when the app state is 'timer'
  const timerState = function(){
    // Clears the intervals of the other app states, if they're currently set.
    clearInterval(intervalIds.stopwatchId);
    clearInterval(intervalIds.clockId);
    // Set the ouput to 0
    UICtrl.showOutput('00','00','00');
    // Make the timer tab the active tab and deactivate the rest by adding or removing the 'is-active' bulma class.
    UICtrl.UIElements.clockBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.stopwatchBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.timerBtn.parentElement.classList.add('is-active');
    // Show the play and restart button and hide the pause button
    UICtrl.show(UICtrl.UIElements.playBtn);
    UICtrl.hide(UICtrl.UIElements.pauseBtn);
    UICtrl.show(UICtrl.UIElements.resetBtn);
     // hide analogue toggle and analogue clock if shown from home state and show digital output
     UICtrl.hide(UICtrl.UIElements.analogueClock);
     UICtrl.hide(UICtrl.UIElements.analogueToggle);
     UICtrl.show(UICtrl.UIElements.digitalClock);
    // Shows the colons in case they have been hidden when switching over from the timer state where they are hidden. Same for the hideArrows().
    UICtrl.showArrows();
    UICtrl.hideColons();
  };

  // A play function that is called when the play button is clicked and execute a set of logic depending on the state passed as the parameter.
  const play = function (state){
    // Grabs the current output values and parse them as integers
    let second = parseInt(UICtrl.UIElements.seconds.textContent);
    let minute = parseInt(UICtrl.UIElements.minutes.textContent);
    let hour = parseInt(UICtrl.UIElements.hours.textContent);
    // Check if state is 'stopwatch'
    if (state === 'stopwatch'){
      second += 1;
      if (second === 60){
        second = 0;
        minute += 1;
      } else if (minute === 60){
        minute = 0;
        hour += 1;
      };

    } else if (state === 'timer'){
      // if current state is 'timer'
      if (second === 0 && minute === 0 && hour === 0){
        // If everything is 0, clear the timer interval, if currently running and set the timerId to null.
        clearInterval(intervalIds.timerId);
        intervalIds.timerId = null;
        // Show play button and hide pause button
        UICtrl.show(UICtrl.UIElements.playBtn);
        UICtrl.hide(UICtrl.UIElements.pauseBtn);
      } else if (second !== 0){
        // If everything is not 0, show pause button and hide play button
        UICtrl.hide(UICtrl.UIElements.playBtn);
        UICtrl.show(UICtrl.UIElements.pauseBtn);
        second -= 1;
        if (second === 0 && minute !== 0){
          second = 59;
          minute -= 1;
        } else if (second === 0 && minute === 0){
          if (hour !== 0){
            second = 59;
            minute = 59;
            hour -= 1;
          };
        }; 
      } else if (second === 0){
        // If everything is not 0, show pause button and hide play button
        UICtrl.hide(UICtrl.UIElements.playBtn);
        UICtrl.show(UICtrl.UIElements.pauseBtn);
        if (minute !== 0 && hour !== 0){
          second = 59;
          minute -= 1;
        } else if (minute === 0 && hour !== 0){
          second = 59;
          minute = 59;
          hour -= 1;
        } else if (minute !== 0 && hour === 0){
          second = 59;
          minute -= 1;
        };
      };
    };
    
    // Convert them back to strings
    second = second.toString();
    minute = minute.toString();
    hour = hour.toString();
    // Output them in the UI
    UICtrl.showOutput(hour, minute, second);
    
  };

  // function that hold the logic for the analogue clock
  const playAnalogueClock = function(){
    const today = new Date();
    const second = today.getSeconds();
    const minute = today.getMinutes();
    const hour = today.getHours();
    // calculate the degrees for each hand
    const secondDeg = second * 6;
    const minuteDeg = (minute * 6) + (1/60)*secondDeg;
    const hourDeg = ((hour%12) * 30) + (1/12)*minuteDeg;
  
    console.log(secondDeg, minuteDeg, hourDeg);
  
    UICtrl.UIElements.secondHand.style.transition = 'all ease 0.5s';
    if (secondDeg === 0 || secondDeg === 360){
      UICtrl.UIElements.secondHand.style.transition = 'none';
    };
    // rotate each hand using the transform: rotate() css property using the angles calculated
    UICtrl.UIElements.secondHand.style.transform = `translate(50%, 1rem) rotate(${secondDeg}deg)`;
    UICtrl.UIElements.minuteHand.style.transform = `translate(50%, 1rem) rotate(${minuteDeg}deg)`;
    UICtrl.UIElements.hourHand.style.transform = `translate(50%, 1rem) rotate(${hourDeg}deg)`;
  };
  // A pause function that is called when the pause button is clicked and execute the set of logic.
  const pause = function(){
    // Grab the current values
    let second = UICtrl.UIElements.seconds.textContent;
    let minute = UICtrl.UIElements.minutes.textContent;
    let hour = UICtrl.UIElements.hours.textContent;
    // Output them in the UI
    UICtrl.showOutput(hour, minute, second);
  };

  // Reset function to reset the stopwatch or timer
  const reset = function(){
   
    if (UICtrl.UIElements.pauseBtn.classList.contains('is-hidden')){
       // If pause button is hidden i.e. the stopwatch or timer is not currently running, set the output to 0 
      // clearInterval(intervalIds.stopwatchId);
      UICtrl.showOutput('00','00','00');
    } else if (UICtrl.UIElements.playBtn.classList.contains('is-hidden')){
       // If play button is hidden i.e. the stopwatch or timer is currently running.
       // Clear the other app state intervals
      clearInterval(intervalIds.stopwatchId);
      clearInterval(intervalIds.timerId);
      // Set timerId to null
      intervalIds.timerId = null;
      // Show play button and hide pause button
      UICtrl.show(UICtrl.UIElements.playBtn);
      UICtrl.hide(UICtrl.UIElements.pauseBtn);
      // Set the ouput to 0
      UICtrl.showOutput('00','00','00');
    }
    
  }

  // Publicly available functions and properties of the clock controller packed in the returned object.
  return {
    homeState,
    stopwatchState,
    timerState,
    intervalIds,
    play,
    playAnalogueClock,
    pause,
    reset,
  }
})();

// App controller IIFE
const App = (function(UICtrl, clockCtrl){
  // Instantiate a new UI object
  const UI = new UICtrl.UI;
  // Load event listners function to set all event listeners
  const loadEventListners = function(){
    // Clock button event listner to change the app state to 'clock'
    UICtrl.UIElements.clockBtn.addEventListener('click', () => {
      if (UI.state !== 'clock'){
        UI.changeState('clock');
      }
    });
    // Stopwatch button event listner to change the app state to 'stopwatch'
    UICtrl.UIElements.stopwatchBtn.addEventListener('click', function(){
      if (UI.state !== 'stopwatch'){
        UI.changeState('stopwatch');
      }
    });
    // Timer button event listner to change the app state to 'timer'
    UICtrl.UIElements.timerBtn.addEventListener('click', ()=>{
      if (UI.state !== 'timer'){
        UI.changeState('timer');
      }
    });
    // Play button event listener
    UICtrl.UIElements.playBtn.addEventListener('click', (e)=>{
      // Checks if the event target has the fill attribute (a path from the font awesome icon) or is the play svg (which contain the path)
      if (e.target.hasAttribute('fill') || e.target.classList.contains('fa-play-circle')){
        let id; //
        if (UI.state === 'stopwatch'){
          // Hide play button and show pause button
          UICtrl.hide(UICtrl.UIElements.playBtn);
          UICtrl.show(UICtrl.UIElements.pauseBtn);
          // Set an interval to call the play button with the stopwatch state every 1s
          id = setInterval(function(){
            clockCtrl.play(UI.state);
          }, 1000);
          // Set the stopwatch Id to the Id value returned by the set interval above
          clockCtrl.intervalIds.stopwatchId = id;
        } else if (UI.state === 'timer'){
          if (clockCtrl.intervalIds.timerId === null){
            clockCtrl.intervalIds.timerPaused = false;
            // Set an interval to call the play button with the timer state every 1s
            id = setInterval(function(){
              clockCtrl.play(UI.state);
            }, 1000);
            // Set the stopwatch Id to the Id value returned by the set interval above
            clockCtrl.intervalIds.timerId = id;
          };
        };
      };
    });
    // Pause button event listener
    UICtrl.UIElements.pauseBtn.addEventListener('click', (e) => {
      // Checks if the event target has the fill attribute (a path from the font awesome icon) or is the pause svg (which contain the path)
      if (e.target.hasAttribute('fill') || e.target.classList.contains('fa-pause-circle')){
        if (UI.state === 'stopwatch'){
          // If app state is 'stopwatch', clear the stopwatch interval currently running
          clearInterval(clockCtrl.intervalIds.stopwatchId);
        } else if (UI.state === 'timer'){
          // If app state is 'timer', clear the timer interval currently running
          clearInterval(clockCtrl.intervalIds.timerId);
          // Set the Id back to null
          clockCtrl.intervalIds.timerId = null;
          // Set the timerPaused property to true to be used in the arrow event listener
          clockCtrl.intervalIds.timerPaused = true;
        };
        // Show the play button and hide the pause button
        UICtrl.hide(UICtrl.UIElements.pauseBtn);
        UICtrl.show(UICtrl.UIElements.playBtn);
        // Call the pause function
        clockCtrl.pause();
      };
    });
    // Reset button event listener
    UICtrl.UIElements.resetBtn.addEventListener('click', (e)=>{
      if (e.target.hasAttribute('fill') || e.target.classList.contains('fa-sync-alt')){
        clockCtrl.reset();
      };
    });
    // Arrow toggle event listener
    UICtrl.UIElements.arrowBtns.forEach((arrow)=>{
      arrow.addEventListener('click', (e)=>{
        // If timer interval is not running and is not paused
        if (clockCtrl.intervalIds.timerId === null && clockCtrl.intervalIds.timerPaused === false){
          let output;
          if (e.target.hasAttribute('fill') && e.target.parentElement.classList.contains('fa-sort-up')){
            // For up arrows
            output = parseInt(e.target.parentElement.parentElement.previousElementSibling.textContent);
            output += 1;
          } else if (e.target.hasAttribute('fill') && e.target.parentElement.classList.contains('fa-sort-down')){
            // For down arrows
            output = parseInt(e.target.parentElement.parentElement.previousElementSibling.textContent);
            if (output > 0){
              output -= 1;
            };
          };
          output = output.toString();
          if (output.length == 1){
            output = `0${output}`
          }
          e.target.parentElement.parentElement.previousElementSibling.textContent = output;
        };
      });
    });
    // Anaglogue toggle event listener
    UICtrl.UIElements.analogueToggle.addEventListener('click', (e)=>{
      if (e.target.hasAttribute('fill') || e.target.classList.contains('fa-toggle-off')){
        // show analogue clock
        UICtrl.show(UICtrl.UIElements.analogueClock);
        // hide digital clock
        UICtrl.hide(UICtrl.UIElements.digitalClock);
        // hide toggle off button
        UICtrl.hide(UICtrl.UIElements.analogueToggleOff);
        // show toggle on
        UICtrl.show(UICtrl.UIElements.analogueToggleOn);
        // clear the digital clock interval
        clearInterval(clockCtrl.intervalIds.clockId);
        // set analogue clock interval
        setTimeout(function run(){
          clockCtrl.playAnalogueClock();
          const id = setTimeout (function(){
            run();
          }, 1000);
          clockCtrl.intervalIds.clockId = id;
        }, 0);
      } else if (e.target.hasAttribute('fill') || e.target.classList.contains('fa-toggle-on')){
        // hide analogue clock
        UICtrl.hide(UICtrl.UIElements.analogueClock);
        // show digital
        UICtrl.show(UICtrl.UIElements.digitalClock);
        // show toggle off
        UICtrl.show(UICtrl.UIElements.analogueToggleOff);
        // hide toggle on
        UICtrl.hide(UICtrl.UIElements.analogueToggleOn);
        // clear the digital clock interval
        clearInterval(clockCtrl.intervalIds.clockId);
        // set analogue clock interval
        setTimeout(function run(){
          clockCtrl.homeState();
          const id = setTimeout (function(){
            run();
          }, 1000);
          clockCtrl.intervalIds.clockId = id;
        }, 0);
      }
    });
  };

  return {
    // App initializing function to call the load event listener function and set the appropriate app state 
    init: function(){
      loadEventListners();
      if (UI.state === 'clock'){
        clockCtrl.homeState();
        const id = setInterval(() => {
          clockCtrl.homeState();
        }, 1000);
        clockCtrl.intervalIds.clockId = id;
      } else if (UI.state === 'stopwatch'){
        clockCtrl.stopwatchState();
      } else if (UI.state === 'timer'){
        clockCtrl.timerState();
      };
    },
  };
})(UICtrl, clockCtrl);

// App entry point to initialize the app by calling the app init() function
App.init();