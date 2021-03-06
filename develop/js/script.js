// *******************
// **** Variables ****
// *******************

const data = [1,2,3,4,5,6,7,8,9,10,
              11,12,13,14,15,16,17,18,19,20,
              21,22,23,24,25]

let numbers;
let countDown;

let conditionToGameClear = 0; // (25 - num)番の要素をクリックしたらゲームクリア

let Game = { point: 0 };
let ms = 0;
let sec = 0;
let stopWatch;


// *******************
// **** Functions ****
// *******************

document.addEventListener('DOMContentLoaded', () => {
  setNumbers();
  clickStartBtn();
  slider();
  adjustWindow();
  whenResize();
  onlyPortrait();
  // changeState("pre"); // デバッグ用 ["pre","play","post"]
  // endCommentSelect('800'); // デバッグ用
});


const isDisabled = (target) => {
  target.setAttribute('disabled', true);
};

const removeDisabled = (target) => {
  target.removeAttribute('disabled');
};


// フィッシャー・イェーツのアルゴリズム
const randomize = () => {
  numbers = data.concat();

  for ( let i = numbers.length - 1; i > 0; i-- ) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = numbers[i];
    numbers[i] = numbers[j];
    numbers[j] = tmp;
  }

};


// ほぼデバッグ用
let state = "pre"

// 今回はメンテナンス性を考えてこの方法で切り替えを実装 => もっとシンプルにできるはず..！
// state属性の切り替え => changeState('play')
const changeState = str => {
  const // （入れ替え要素リスト）
        modal = document.querySelector('.modal'),
        startModal = document.getElementById('startModal'),
        gameField = document.getElementById('gameField'),
        post = document.querySelector('.post__wrap');

  state = str;

  switch ( state ) {
    case 'pre':
      writeState(modal, str)
      writeState(startModal, str)
      writeState(gameField, str)
      writeState(post, str)
      break;
      case 'play':
      writeState(modal, str)
      writeState(startModal, str)
      writeState(gameField, str)
      writeState(post, str)
      break;
    case 'post':
      writeState(modal, str)
      writeState(startModal, str)
      writeState(gameField, str)
      writeState(post, str)
      break;
  }
  function writeState (e, s) {
    e.setAttribute('state', s);
  }
};


// ポイントの計算量
let amountToAdd    =  40;  // 加点量
let amountToDeduct = -40;  // 減点量

let fullScore = amountToAdd * 25; // // 満点の設定:1000

//  ポイントの足し引き
//  calcPoint() >> 引数: amountToAdd or amountToDeduct
const calcPoint = amount => {
    Game.point += amount
    pointDisplayUpdate();
};

// 点数表示の更新
const pointDisplayUpdate = () => {
  const gamePoint = document.getElementById('gamePoint');
  gamePoint.innerHTML = Game.point;
};

// 点数を評価してメッセージを出す
const endCommentSelect = gameScore => {
  const
        endComment = document.getElementById('endComment'),
          perfect  = gameScore == fullScore,
          step1    = score(2),
          step2    = score(5),
          step3    = score(8),
          step4    = score(11),
    perfectMessage = 'ノーミス!',
    step1UpMessage = 'あと一歩!',
    step2UpMessage = '次はもっと正確に！',
    step3UpMessage = 'お手つきが多いよ！',
    step4UpMessage = 'しっかり数を数えよう！',
    elseMessage    = '眼鏡をかけ忘れていませんか..？';

    // score() >> 設定スコアの計算/ 引数: ミスした回数
    function score(miss) {
    return fullScore + amountToDeduct * miss };

  pushComment = comment => endComment.children[1].innerHTML = comment;

  if ( perfect ) {
    pushComment(perfectMessage) }
  else if( fullScore > gameScore && gameScore >= step1 ) {
    pushComment(step1UpMessage) }
  else if( step1 > gameScore && gameScore >= step2 ) {
    pushComment(step2UpMessage) }
  else if( step2 > gameScore && gameScore >= step3 ) {
    pushComment(step3UpMessage) }
  else if( step3 > gameScore && gameScore >= step4 ) {
    pushComment(step4UpMessage) }
  else {
    pushComment(elseMessage) }
};


pushTimeAndPoint = () => {
  endComment = document.getElementById('endComment'),
  point = document.getElementById('gamePoint').innerHTML,
  time = document.getElementById('timer').innerHTML,
  endComment.children[0].innerHTML =
  `Point: ${point}<br>
  Time&nbsp;: ${time}`;
};

// セット(合流するべき？)
const setNumbers = () => {
  const startBtn = document.getElementById('startBtn');
  const cells_ele = document.querySelectorAll('#gameField > .cell');
  let cells = Array.prototype.slice.call(cells_ele);

  // スタートボタンを押したら数を要素にセット
  startBtn.addEventListener('click', () => {
    changeState('play')
    randomize();
    cells.forEach( (ele,index) =>  ele.innerHTML = `${numbers[index]}` );
  })
};

// 加算＆表示の更新
const countUp = () => {
  // 加算
  ms += 1;
  // sec += 1;
  if (ms > 99) {
    ms = 0;
    sec += 1;
  };

  // 0埋め
  secNum = ("0" + sec).slice(-2);
  msNum = ("0" + ms).slice(-2);
  // 表示
  document.getElementById('timer').innerHTML = `${secNum}` + ':' +`${msNum}`;
};

// ストップウォッチスタート
countStart = () =>  stopWatch = setInterval(countUp,10);

//スタートボタン押した時にカウント始める。
const clickStartBtn = () => {
  const startBtn = document.getElementById('startBtn');
  startBtn.addEventListener('click', () => {
    sec = 0;
    ms = 0;
    isDisabled(startBtn);
    setTimeout( () => { main() },10); // セッティング分のサービスカウント
  })
};

// 数字順にクリックした時に要素をDisabledに
const main = () => {
  const gameField = document.getElementById('gameField');
  const restartBtn = document.getElementById('restartBtn')
  const cells_ele = document.querySelectorAll('#gameField > .cell');
  let cells = Array.prototype.slice.call(cells_ele);

  countDown = []
  countDown = data.concat();

  countStart();

  cells.forEach( ele => {
    // 数字クリックした時
    ele.onclick = () => {

      // 正解したら
      if ( ele.innerHTML == 25 - countDown.length + 1 ) {
        banishAnimation(ele); // 消える動き
        countDown.splice(0, 1); // 次の数字を今クリックしたもの+1に
        // n++;
        calcPoint(amountToAdd); // 加点
      }
      else {
        calcPoint(amountToDeduct); // お手つきは減点！
      }
      // 終了
      if ( countDown.length == conditionToGameClear ) {
        clearInterval(stopWatch);
        removeDisabled(restartBtn);
        changeState('post');
        endCommentSelect(Game.point)
        pushTimeAndPoint()
      }
    }
  })
  reset();
};

// 消えるモーション
const banishAnimation = target => {
  Promise.resolve()
  .then( () => {
    return new Promise( resolve => {
      target.animate( {
        background: ['#ffd45e', '#ffd45e'],
        opacity: ['1', '0.7', '0'],
        fontSize: ['1em', '1.2em']
      }
      , {
        duration: 250,
        iterations: 1
      });
      setTimeout( () => {
      target.style.opacity = 0;
      resolve();
    }, 150)
    })
  })
  .then( () => {
    return new Promise( resolve => {
      setTimeout( () => {
        target.animate( {
          opacity: [0, 1]
        }
        , {
          duration: 200,
          iterations: 1
        });
        target.style.opacity = 1;
      isDisabled(target);
      resolve();
      }, 450)
    })
  })
};


const reset = () => {
  const
      startBtn = document.getElementById('startBtn'),
      restartBtn = document.getElementById('restartBtn'),
      gameField = document.getElementById('gameField'),
      endComment = document.getElementById('endComment'),
      cells_ele = gameField.querySelectorAll('.cell'),
      cells = Array.prototype.slice.call(cells_ele);

  restartBtn.onclick = () => {
    Game.point = 0;
    gamePoint.innerHTML = Game.point;
    sec = 0;
    ms = 0;
    timer.innerHTML = '00:00';

    changeState('pre');
    removeDisabled(startBtn);
    isDisabled(restartBtn);

    cells.forEach( cell =>
      removeDisabled(cell)
    );

  };
};



// 表示調整用スライダー
const slider = () => {
  const elem = document.getElementById('rangeSlider');
  const target = document.getElementById('sliderValue');
  const rangeValue = (elem, target) => {
    return function(evt) {
      fontChange(`${12+ elem.value * 2}px`);
      // console.log(elem.value) // 表示の確認用
    }
  }
  elem.addEventListener('input', rangeValue(elem, target));
};

fontChange = size => document.documentElement.style.fontSize = size;


// game-field 表示調整・基準（jsによるレスポンシブ）

let width;
let height;

const whenResize = () => {
  window.addEventListener("resize",() =>
    setTimeout(adjustWindow, 300)
  )
};

// ウィンドウリサイズ時の表示サイズ調整
const adjustWindow = () => {
  // console.log("!")
  const slider = document.getElementById('rangeSlider');
  width = document.body.clientWidth;
  height = document.body.clientHeight;
  if ( 420 > height ) {
    slider.setAttribute('value', '0');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 450 > height ) {
    slider.setAttribute('value', '1.3');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 480 > height ) {
    slider.setAttribute('value', '1.3');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 500 > height ) {
    slider.setAttribute('value', '2');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 530 > height ) {
    slider.setAttribute('value', '2.5');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 580 > height ) {
    slider.setAttribute('value', '3');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 600 > height ) {
    slider.setAttribute('value', '4');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 650 > height ) {
    slider.setAttribute('value', '4.9');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( width < 540 && height > 700 ) { // 横の制限
    slider.setAttribute('value', '6.8');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 700 > height ) {
    slider.setAttribute('value', '5.5');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 750 > height ) {
    slider.setAttribute('value', '6.8');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 800 > height ) {
    slider.setAttribute('value', '8');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else if ( 850 > height ) {
    slider.setAttribute('value', '10');
    fontChange(`${12+ slider.value * 2}px`);
  }
  else {
    slider.setAttribute('value', '10');
    fontChange(`${12+ slider.value * 2}px`);
  }
};

// スマホの横置き時、「縦でお願いします」のダイアログを出す。
const onlyPortrait = () => {

  window.onorientationchange = () => {
    switch ( window.orientation ) {
      case 0:
        break;
      case 90:
        alert('スマホでは画面を縦にしてプレイしてください');
        break;
      case -90:
        alert('スマホでは画面を縦にしてプレイしてください２');
        break;
    }
  }
}
