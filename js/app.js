const UICtrl = (function (){
  const UIElements = {
    clockBtn: document.querySelector('.clock-btn'),
    stopwatchBtn: document.querySelector('.stopwatch-btn'),
    timerBtn: document.querySelector('.timer-btn'),
    hours: document.querySelector('#hours'),
    minutes: document.querySelector('#minutes'),
    seconds: document.querySelector('#seconds'),
    playBtn: document.querySelector('#play-btn'),
    pauseBtn: document.querySelector('#pause-btn'),
    restartBtn: document.querySelector('#restart-btn'),
    colons: document.querySelectorAll('.colon'),
    arrowBtns: document.querySelectorAll('.arrows'),
  };

  const UI = function(state = 'clock'){
    this.state = state;
  };

  UI.prototype = {
    changeState(newState){
      this.state = newState;
      if (this.state === 'clock'){
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

  const showArrows = function(){
    UICtrl.UIElements.arrowBtns.forEach((arrowBtn)=>{
      show(arrowBtn);
    });
  };

  const hideArrows = function(){
    UICtrl.UIElements.arrowBtns.forEach((arrowBtn)=>{
      hide(arrowBtn);
    });
  };

  const showColons = function(){
    UICtrl.UIElements.colons.forEach((colon)=>{
      show(colon);
    });
  };

  const hideColons = function(){
    UICtrl.UIElements.colons.forEach((colon)=>{
      hide(colon);
    });
  };

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

const clockCtrl = (function(){
  const intervalIds = {};

  const homeState = function(){
    clearInterval(intervalIds.stopwatchId);
    clearInterval(intervalIds.timerId);
    const today = new Date();
    const currentHour = today.getHours().toString();
    const currentMinute = today.getMinutes().toString();
    const currentSecond = today.getSeconds().toString();
    
    UICtrl.showOutput(currentHour, currentMinute, currentSecond);
    UICtrl.UIElements.clockBtn.parentElement.classList.add('is-active');
    UICtrl.UIElements.stopwatchBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.timerBtn.parentElement.classList.remove('is-active');
    UICtrl.hide(UICtrl.UIElements.playBtn);
    UICtrl.hide(UICtrl.UIElements.pauseBtn);
    UICtrl.hide(UICtrl.UIElements.restartBtn);
    UICtrl.showColons();
    UICtrl.hideArrows();
  };

  const stopwatchState = function(){
    clearInterval(intervalIds.clockId);
    clearInterval(intervalIds.timerId);
    UICtrl.UIElements.clockBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.timerBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.stopwatchBtn.parentElement.classList.add('is-active');
    UICtrl.showOutput('00','00','00');
    UICtrl.show(UICtrl.UIElements.playBtn);
    UICtrl.hide(UICtrl.UIElements.pauseBtn);
    UICtrl.show(UICtrl.UIElements.restartBtn);
    UICtrl.showColons();
    UICtrl.hideArrows();
  };

  const timerState = function(){
    clearInterval(intervalIds.stopwatchId);
    clearInterval(intervalIds.clockId);
    UICtrl.showOutput('00','00','00');
    UICtrl.UIElements.clockBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.stopwatchBtn.parentElement.classList.remove('is-active');
    UICtrl.UIElements.timerBtn.parentElement.classList.add('is-active');
    UICtrl.show(UICtrl.UIElements.playBtn);
    UICtrl.hide(UICtrl.UIElements.pauseBtn);
    UICtrl.show(UICtrl.UIElements.restartBtn);
    UICtrl.showArrows();
    UICtrl.hideColons();
  };

  const play = function (state){
    let second = parseInt(UICtrl.UIElements.seconds.textContent);
    let minute = parseInt(UICtrl.UIElements.minutes.textContent);
    let hour = parseInt(UICtrl.UIElements.hours.textContent);

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
      if (second === 0 && minute === 0 && hour === 0){
        clearInterval(intervalIds.timerId);
        UICtrl.show(UICtrl.UIElements.playBtn);
        UICtrl.hide(UICtrl.UIElements.pauseBtn);
      } else if (second !== 0){
        second -= 1;
        if (second === 0 && minute !== 0){
          second = 59;
          minute -= 1;
          if (minute == 0 && hour !== 0){
            minute = 59;
            hour -= 1;
          };
        }; 
      } else if (second === 0){
        if (minute !== 0 || hour !== 0){
          second = 59;
          if (minute !== 0){
            minute -= 1;
          };
          if (minute == 0 && hour !== 0){
            minute = 59;
            hour -= 1;
          };
        };
      };
    };
    
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
  };

  const restart = function(){
    if (UICtrl.UIElements.pauseBtn.classList.contains('is-hidden')){
      // clearInterval(intervalIds.stopwatchId);
      UICtrl.showOutput('00','00','00');
    } else if (UICtrl.UIElements.playBtn.classList.contains('is-hidden')){
      clearInterval(intervalIds.stopwatchId);
      UICtrl.show(UICtrl.UIElements.playBtn);
      UICtrl.hide(UICtrl.UIElements.pauseBtn);
      UICtrl.showOutput('00','00','00');
    }
    
  }

  return {
    homeState,
    stopwatchState,
    timerState,
    intervalIds,
    play,
    pause,
    restart,
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

    UICtrl.UIElements.timerBtn.addEventListener('click', ()=>{
      if (UI.state !== 'timer'){
        UI.changeState('timer');
      }
    });

    UICtrl.UIElements.playBtn.addEventListener('click', (e)=>{
      if (e.target.hasAttribute('fill') || e.target.classList.contains('fa-play-circle')){
        UICtrl.hide(UICtrl.UIElements.playBtn);
        UICtrl.show(UICtrl.UIElements.pauseBtn);
        let id;
        if (UI.state === 'stopwatch'){
          id = setInterval(function(){
            clockCtrl.play(UI.state);
            console.log(clockCtrl.intervalIds)
          }, 1000);
          clockCtrl.intervalIds.stopwatchId = id;
        } else if (UI.state === 'timer'){
          id = setInterval(function(){
            clockCtrl.play(UI.state);
          }, 1000);
          clockCtrl.intervalIds.timerId = id;
        };
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

    UICtrl.UIElements.restartBtn.addEventListener('click', (e)=>{
      if (e.target.hasAttribute('fill') || e.target.classList.contains('fa-sync-alt')){
        clockCtrl.restart();
      };
    });

    UICtrl.UIElements.arrowBtns.forEach((arrow)=>{
      arrow.addEventListener('click', (e)=>{
        if (e.target.hasAttribute('fill') && e.target.parentElement.classList.contains('fa-sort-up')){
          let output = parseInt(e.target.parentElement.parentElement.previousElementSibling.textContent);
          output += 1;
          e.target.parentElement.parentElement.previousElementSibling.textContent = `0${output.toString()}`;
        } else if (e.target.hasAttribute('fill') && e.target.parentElement.classList.contains('fa-sort-down')){
          let output = parseInt(e.target.parentElement.parentElement.previousElementSibling.textContent);
          if (output > 0){
            output -= 1;
          }
          e.target.parentElement.parentElement.previousElementSibling.textContent = `0${output.toString()}`;
        }
      })
    })
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