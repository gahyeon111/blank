/**
  Copyright 2012 Michael Morris-Pearce

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

(function () {


  /* Piano keyboard pitches. Names match sound files by ID attribute. */

  var keys = [
    'A2', 'Bb2', 'B2', 'C3', 'Db3', 'D3', 'Eb3', 'E3', 'F3', 'Gb3', 'G3', 'Ab3',
    'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4',
    'A4', 'Bb4', 'B4', 'C5', 'Db5'
  ];

  /* Corresponding keyboard keycodes, in order w/ 'keys'. */
  /* QWERTY layout:
  /*   upper register: Q -> P, with 1-0 as black keys. */
  /*   lower register: Z -> M, , with A-L as black keys. */

  var codes = [
    90, 83, 65, 81, 50, 87, 51, 69, 82, 53, 84, 54, 89,
    55, 85, 73, 57, 79, 48, 80, 219, 78, 221, 8, 220,
    76, 190, 1916348, 222

    // 90, 83, 88, 67, 70, 86, 71, 66, 78, 74, 77, 75,
    // 81, 50, 87, 69, 52, 82, 53, 84, 89, 55, 85, 56,
    // 73, 57, 79, 80
  ];

  var pedal = 32; /* Keycode for sustain pedal. */
  var tonic = 'A2'; /* Lowest pitch. */

  /* Piano state. */

  var intervals = {};
  var depressed = {};

  /* Selectors */

  function pianoClass(name) {
    return '.piano-' + name;
  };

  function soundId(id) {
    return 'sound-' + id;
  };

  function sound(id) {
    var it = document.getElementById(soundId(id));
    return it;
  };

  /* Virtual piano keyboard events. */

  function keyup(code) {
    var offset = codes.indexOf(code);
    var k;
    if (offset >= 0) {
      k = keys.indexOf(tonic) + offset;
      return keys[k];
    }
  };

  function keydown(code) {
    return keyup(code);
  };

  function press(key) {
    var audio = sound(key); // 건반 소리 들어감
    if (depressed[key]) {
      return;
    }
    clearInterval(intervals[key]);
    if (audio) {
      audio.pause();
      audio.volume = 1.0;
      if (audio.readyState >= 2) {
        audio.currentTime = 0;
        audio.play();
        depressed[key] = true;
      }
    }
    switch (key) {
      case 'C4':
        starset.add('C4');
        break;
      case 'D4':
        starset.add('D4');
        break;
      case 'E4':
        starset.add('E4');
        break;
      case 'F4':
        starset.add('F4');
        break;
      case 'G4':
        starset.add('G4');
        break;
      case 'A4':
        starset.add('A4');
        break;
      case 'Db5':
        starset.add('Db5');
        break;
      default:
        starset.clear();
    }


    switch (key) {
      // 북두칠성
      case 'C4':
      case 'D4':
      case 'E4':
      case 'F4':
      case 'G4':
      case 'A4':
      case 'Db5':
        $(pianoClass(key)).animate({
          'backgroundColor': '#fff',

        }, 0);
        break;
      // 'S'
      case 'A2':
      case 'B3':
      case 'C3':
      case 'Bb2':
      case 'Ab3':
      case 'Eb4':
      case 'B4':
        $(pianoClass('A2')).animate({
          'backgroundColor': '#B2EBF4'//'#D4F4FA'//"#B2EBF4"
        }, 0);
        $(pianoClass('B3')).animate({
          'backgroundColor': '#B2EBF4'//'#D4F4FA'//"#B2EBF4"
        }, 0);
        $(pianoClass('C3')).animate({
          'backgroundColor': '#B2EBF4'//'#D4F4FA'//"#B2EBF4"
        }, 0);
        $(pianoClass('Bb2')).animate({
          'backgroundColor': '#B2EBF4'//'#D4F4FA'//"#B2EBF4"
        }, 0);
        $(pianoClass('Ab3')).animate({
          'backgroundColor': '#B2EBF4'//'#D4F4FA'//"#B2EBF4"
        }, 0);
        $(pianoClass('Eb4')).animate({
          'backgroundColor': '#B2EBF4'//'#D4F4FA'//"#B2EBF4"
        }, 0);
        $(pianoClass('B4')).animate({
          'backgroundColor': '#B2EBF4'//'#D4F4FA'//"#B2EBF4"
        }, 0);
        $(pianoClass('Gb3')).animate({
          'backgroundColor': '#B2EBF4'//'#D4F4FA'//"#B2EBF4"
        }, 0);
        break;
      // 'T'
      case 'G3':
      case 'Eb3':
        $(pianoClass('G3')).animate({
          'backgroundColor': '#CEF279'//'#E4F7BA'//'#CEF279'
        }, 0);
        $(pianoClass('Eb3')).animate({
          'backgroundColor': '#CEF279'//'#E4F7BA'//'#CEF279'
        }, 0);
        $(pianoClass('Ab4')).animate({
          'backgroundColor': '#CEF279'//'#E4F7BA'//'#CEF279'
        }, 0);
        $(pianoClass('Gb3')).animate({
          'backgroundColor': '#CEF279'//'#E4F7BA'//'#CEF279'
        }, 0);
        $(pianoClass('Bb4')).animate({
          'backgroundColor': '#CEF279'//'#E4F7BA'//'#CEF279'
        }, 0);
        break;
      // 'A'
      case 'B2':
      case 'E3':
        $(pianoClass('B2')).animate({
          'backgroundColor': '#FFE08C'//'#FAECC5'//'#FFC19E'
        }, 0);
        $(pianoClass('E3')).animate({
          'backgroundColor': '#FFE08C'//'#FAECC5'//'#FFC19E'
        }, 0);
        $(pianoClass('Bb4')).animate({
          'backgroundColor': '#FFE08C'//'#FAECC5'//'#FFC19E'
        }, 0);
        $(pianoClass('D3')).animate({
          'backgroundColor': '#FFE08C'//'#FAECC5'//'#FFC19E'
        }, 0);
        $(pianoClass('Db4')).animate({
          'backgroundColor': '#FFE08C'//'#FAECC5'//'#FFC19E'
        }, 0);
        $(pianoClass('Ab4')).animate({
          'backgroundColor': '#FFE08C'//'#FAECC5'//'#FFC19E'
        }, 0);
        break;
      // 'R'
      case 'F3':
      case 'Db3':
      case 'A3':
      case 'Bb3':
      case 'Gb4':
      case 'C5':
        $(pianoClass('F3')).animate({
          'backgroundColor': '#FFA7A7'//'#FFD8D8'//'#D1B2FF'
        }, 0);
        $(pianoClass('Db3')).animate({
          'backgroundColor': '#FFA7A7'//'#FFD8D8'//'#D1B2FF'
        }, 0);
        $(pianoClass('A3')).animate({
          'backgroundColor': '#FFA7A7'//'#FFD8D8'//'#D1B2FF'
        }, 0);
        $(pianoClass('Bb3')).animate({
          'backgroundColor': '#FFA7A7'//'#FFD8D8'//'#D1B2FF'
        }, 0);
        $(pianoClass('Gb4')).animate({
          'backgroundColor': '#FFA7A7'//'#FFD8D8'//'#D1B2FF'
        }, 0);
        $(pianoClass('C5')).animate({
          'backgroundColor': '#FFA7A7'//'#FFD8D8'//'#D1B2FF'
        }, 0);
        $(pianoClass('D3')).animate({
          'backgroundColor': '#FFA7A7'//'#FFD8D8'//'#D1B2FF'
        }, 0);
        $(pianoClass('Db4')).animate({
          'backgroundColor': '#FFA7A7'//'#FFD8D8'//'#D1B2FF'
        }, 0);
        break;
      // 'S' and 'T'
      case 'Gb3':
        $(pianoClass(key)).animate({
          'backgroundColor': '#B7F0B1'//'#CEFBC9'//'#B7F0DC'
        }, 0);
        break;
      // 'T' and 'A'
      case 'Bb4':
      case 'Ab4':
        $(pianoClass(key)).animate({
          'backgroundColor': '#FAED7D'//'#FAF4C0'//'#E6E682'
        }, 0);
        break;
      // 'A' and 'R'
      case 'D3':
      case 'Db4':
        $(pianoClass(key)).animate({
          'backgroundColor': '#FFC19E'//'#FAE0D4'//'#E6C8C8'
        }, 0);
        break;
      default:
    }

    // $(pianoClass(key)).animate({
    //   // 건반 눌렸을 때 색상
    //   'backgroundColor': '#484848'
    //   // <='#A192A6'
    // }, 0);

  };

  function clickk(key) {

  }

  /* Manually diminish the volume when the key is not sustained. */
  /* These values are hand-selected for a pleasant fade-out quality. */

  function fade(key) {
    var audio = sound(key);
    var stepfade = function () {
      if (audio) {
        if (audio.volume < 0.03) {
          kill(key)();
        } else {
          if (audio.volume > 0.2) {
            audio.volume = audio.volume * 0.95;
          } else {
            audio.volume = audio.volume - 0.01;
          }
        }
      }
    };
    return function () {
      clearInterval(intervals[key]);
      intervals[key] = setInterval(stepfade, 5);
    };
  };

  /* Bring a key to an immediate halt. */

  function kill(key) {
    // 눌렀다가 다시 돌아오는 거
    var audio = sound(key);
    return function () {
      clearInterval(intervals[key]);
      if (audio) {
        audio.pause();
      }

      // 눌렀다가 다시 돌아오는 색상
      keys.forEach(function (key) {
        $(pianoClass(key)).animate({
          'backgroundColor': '#8a7998'
        }, 100, 'easeOutExpo');
      })


      // 북두칠성 다 누른 경우
      if (starset.size == 7) {
        // window.alert("You are right!");
        // console.log("정답입니다!!!!!");
        stars(starset);
      }
      else {
        // console.log("오답입니다!!!!");
        console.log(window.innerHeight);
        console.log(window.innerWidth);
      }
    };

  };

  function stars(starset) {
    var arr = new Array();
    var i = 0;
    starset.forEach(function (star) {
      arr.push(star);
    })
    for (const s of arr) {
      console.log(s);
      (function (ii) {
        i++;
        setTimeout(() => {
          $(pianoClass(s)).animate({
            'backgroundColor': '#FAED7D',
            'color': '#3F0099'
          }, 0);
        }, i * 300)
      })(s);
    }
    console.log('ljflajsik');
    setTimeout(() => {
      document.location.href = 'http://192.249.18.155:443/stack';
    }, 5000)

    console.log('skjlksfjkla');
  }

  /* Simulate a gentle release, as opposed to hard stop. */

  var fadeout = true;

  /* Sustain pedal, toggled by user. */

  var sustaining = false;

  /* Register mouse event callbacks. */


  const starset = new Set();

  // var startbtn = document.getElementsByClassName("confetti-button");
  // startbtn[0].addEventListener("click", clickstart);
  var startbtn = document.getElementById("mooon");
  startbtn.addEventListener("click", clickstart);

  function clickstart(e) {
    window.alert("play the piano!");
    starset.clear();
  }

  var btn = document.getElementById("lockk");
  btn.addEventListener("click", startt);
  var isStart = 0;
  function startt(e) {
    if (isStart == 0) {
      // window.alert("game start!");
      keys.forEach(function (key) {
        $(pianoClass(key)).animate({
          'borderWidth': 2
        }, 0);
      });
      isStart = 1;
    }
    else {
      keys.forEach(function (key) {
        $(pianoClass(key)).animate({
          'borderWidth': 35
        }, 0);
      });
      isStart = 0;
    }

  }

  keys.forEach(function (key) {
    $(pianoClass(key)).mousedown(function () {
      $(pianoClass(key)).animate({
        'backgroundColor': '#A192A6'
      }, 0);
      press(key);
    });
    if (fadeout) {
      $(pianoClass(key)).mouseup(function () {
        depressed[key] = false;
        if (!sustaining) {
          fade(key)();
        }
      });
    } else {
      $(pianoClass(key)).mouseup(function () {
        depressed[key] = false;
        if (!sustaining) {
          kill(key)();
        }
      });
    }

  });

  /* Register keyboard event callbacks. */

  $(document).keydown(function (event) {
    if (event.which === pedal) {
      sustaining = true;
      $(pianoClass('pedal')).addClass('piano-sustain');
    }
    press(keydown(event.which));
  });

  $(document).keyup(function (event) {
    if (event.which === pedal) {
      sustaining = false;
      $(pianoClass('pedal')).removeClass('piano-sustain');
      Object.keys(depressed).forEach(function (key) {
        if (!depressed[key]) {
          if (fadeout) {
            fade(key)();
          } else {
            kill(key)();
          }
        }
      });
    }
    if (keyup(event.which)) {
      depressed[keyup(event.which)] = false;
      if (!sustaining) {
        if (fadeout) {
          fade(keyup(event.which))();
        } else {
          kill(keyup(event.which))();
        }
      }
    }
  });

})();
var animateButton = function (e) {

  e.preventDefault;
  //reset animation
  e.target.classList.remove('animate');

  e.target.classList.add('animate');
  setTimeout(function () {
    e.target.classList.remove('animate');
  }, 700);
};

var classname = document.getElementsByClassName("confetti-button");

for (var i = 0; i < classname.length; i++) {
  classname[i].addEventListener('click', animateButton, false);
}