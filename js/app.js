const UICtrl = (function (){
  const UIElements = {
    clockBtn: document.querySelector('.clock-btn'),
    stopwatchBtn: document.querySelector('.stopwatch-btn'),
    timerBtn: document.querySelector('.timer-btn'),
    hours: document.querySelector('#hours'),
    minutes: document.querySelector('#minutes'),
    seconds: document.querySelector('#seconds'),
    playBtn: document.querySelector('#play-btn'),
    pauseBtn: document.querySelector('#pause-btn')
  };

  const UI = function(state = 'clock'){
    this.state = state;
  };

  UI.prototype = {
    changeState(newState){
      this.state = newState;
      if (this.state === 'clock'){
        clearInterval(clockCtrl.intervalIds.stopwatchId);
        clockCtrl.homeState();
        const id = setInterval(() => {
          clockCtrl.homeState();
          clockCtrl.intervalIds.clockId = id;
          console.log(clockCtrl.intervalIds);
        }, 1000);
        
      } else if (this.state === 'stopwatch'){
        clockCtrl.stopwatchState();
      } else if (this.state === 'timer'){
        clockCtrl.timerState()
      } else {

      }
    },


  }

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

  const show = function(btn){
    btn.classList.remove('is-hidden');
  };

  const hide = function(btn){
    btn.classList.add('is-hidden');
  };

  return {
    UIElements,
    UI,
    showOutput,
    show,
    hide,
  }
})();

const clockCtrl = (function(){
  const intervalIds = {};

  const homeState = function(){
    const today = new Date();
    const currentHour = today.getHours().toString();
    const currentMinute = today.getMinutes().toString();
    const currentSecond = today.getSeconds().toString();
    
    UICtrl.showOutput(currentHour, currentMinute, currentSecond);
    UICtrl.UIElements.clockBtn.parentElement.classList.add('is-active');
    UICtrl.UIElements.stopwatchBtn.parentElement.classList.remove('is-active');
    UICtrl.hide(UICtrl.UIElements.playBtn);
    UICtrl.hide(UICtrl.UIElements.pauseBtn);
  };

  const stopwatchState = function(){
    clearInterval(intervalIds.clockId);
    UICtrl.UIElements.clockBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.stopwatchBtn.parentElement.classList.add('is-active');
    UICtrl.showOutput('00','00','00');
    UICtrl.show(UICtrl.UIElements.playBtn);
  };

  const playStopwatch = function (){
    let second = parseInt(UICtrl.UIElements.seconds.textContent);
    let minute = parseInt(UICtrl.UIElements.minutes.textContent);
    let hour = parseInt(UICtrl.UIElements.hours.textContent);
    second += 1;

    if (second === 60){
      second = 0;
      minute += 1;
    } else if (minute === 60){
      minute = 0;
      hour += 1;
    }

    second = second.toString();
    minute = minute.toString();
    hour = hour.toString();
    UICtrl.showOutput(hour, minute, second);
    
  };

  const pause = function(){
    let second = UICtrl.UIElements.seconds.textContent;
    let minute = UICtrl.UIElements.minutes.textContent;
    let hour = UICtrl.UIElements.hours.textContent;
    
    UICtrl.showOutput(hour, minute, second);
  }

  return {
    homeState,
    stopwatchState,
    intervalIds,
    playStopwatch,
    pause,
  }
})();

const App = (function(UICtrl, clockCtrl){
  const UI = new UICtrl.UI;

  const loadEventListners = function(){
    UICtrl.UIElements.clockBtn.addEventListener('click', () => {
      if (UI.state !== 'clock'){
        UI.changeState('clock');
      }
    });

    UICtrl.UIElements.stopwatchBtn.addEventListener('click', function(){
      if (UI.state !== 'stopwatch'){
        UI.changeState('stopwatch');
      }
    });

    UICtrl.UIElements.playBtn.addEventListener('click', (e)=>{
      if (e.target.hasAttribute('fill') || e.target.classList.contains('fa-play-circle')){
        UICtrl.hide(UICtrl.UIElements.playBtn);
        UICtrl.show(UICtrl.UIElements.pauseBtn);
        let id;
        if (UI.state === 'stopwatch'){
          id = setInterval(function(){
            clockCtrl.playStopwatch();
            console.log(clockCtrl.intervalIds)
          }, 1000);
        } else if (UI.state === 'timer'){

        };
        clockCtrl.intervalIds.stopwatchId = id;
      };
    });

    UICtrl.UIElements.pauseBtn.addEventListener('click', (e) => {
      if (e.target.hasAttribute('fill') || e.target.classList.contains('fa-pause-circle')){
        clearInterval(clockCtrl.intervalIds.stopwatchId);
        UICtrl.hide(UICtrl.UIElements.pauseBtn);
        UICtrl.show(UICtrl.UIElements.playBtn);
        clockCtrl.pause();
      };
    });
  }

  return {
    init: function(){
      loadEventListners();

      if (UI.state === 'clock'){
        clockCtrl.homeState();
        const id = setInterval(() => {
          clockCtrl.homeState();
          clockCtrl.intervalIds.clockId = id;
          console.log(clockCtrl.intervalIds)
        }, 1000);
      } else if (UI.state === 'stopwatch'){
        clockCtrl.stopwatchState();
      } else {

      };
      
    }
  }
})(UICtrl, clockCtrl);

App.init();