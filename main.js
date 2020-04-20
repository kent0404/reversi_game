let pass = function () { };
let toryo = function () { };
let highlight = function () { };

$(document).ready(function () {
  'use strict';
  paper.install(window);
  paper.setup(document.getElementById('mainCanvas'));
  const para1 = document.getElementsByTagName('p')[0];
  const para2 = document.getElementsByTagName('p')[1];

  const cell数 = 8;
  let length = Number(mainCanvas.style.width.substr(0, mainCanvas.style.width.length - 2));
  if (length === 0) {
    length = Number(mainCanvas.width);
  }
  const cellSize = length / cell数;
  const small = Math.floor((cell数 - 1) / 2);
  const large = Math.ceil((cell数 - 1) / 2);

  let around = [[1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]];
  let highlight_list = [];
  let result_list = [];
  let stones = [];
  let turn = 4;

  function drawLine(startX, startY, endX, endY, color) {
    let myPath = new Path();
    myPath.add(new Point(startX, startY), new Point(endX, endY));
    myPath.strokeColor = color;
    paper.view.draw();
  }

  function drawReversiline() {
    for (let i = 1; i < cell数; i++) {
      drawLine(i * cellSize, 0, i * cellSize, length, 'black');
      drawLine(0, i * cellSize, length, i * cellSize, 'black');
    }
  }

  function drawRectangle(startX, startY, endX, endY, color) {
    let myPath = new Path();
    myPath = Shape.Rectangle(startX, startY, endX, endY);
    myPath.fillColor = color;
    paper.view.draw();
  }

  function drawCell(X, Y, cellNumber, cellSize, ) {
    let myPath;
    switch (cellNumber) {
      case 'black':
        myPath = new Path();
        myPath = Shape.Circle(X * cellSize + cellSize / 2, Y * cellSize + cellSize / 2, cellSize * 0.4);
        myPath.fillColor = 'black';
        break;
      case 'white':
        myPath = new Path();
        myPath = Shape.Circle(X * cellSize + cellSize / 2, Y * cellSize + cellSize / 2, cellSize * 0.4);
        myPath.fillColor = 'white';
        break;
    }
    paper.view.draw();
    in二次元配列(X, Y, cellNumber);
  }

  function out二次元配列(X, Y) {
    if (0 <= X && X < cell数 && 0 <= Y && Y < cell数) {
      return stones[X + Y * cell数];
    } else {
      return 0;
    }
  }

  function in二次元配列(X, Y, value) {
    stones[X + Y * cell数] = value;
  }

  function check(X, Y) {
    if (check_何があるか(X, Y)) {
      if (check_周りに敵石があるか(X, Y)) {
        if (check_先に自分石があるか(X, Y)) {
          return true;
        }
      }
    }
    return false;
  }

  function check_何があるか(X, Y) {
    if (out二次元配列(X, Y) === 'None') {
      return true;
    }
  }

  function check_周りに敵石があるか(X, Y) {
    let recerchColor;
    result_list = [];
    if (turn % 2 === 0) {
      recerchColor = 'white';
    } else {
      recerchColor = 'black';
    }
    around = [[1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]];
    for (let i = 0; i < 8; i++) {
      if (out二次元配列(X + around[i][0], Y + around[i][1]) === recerchColor) {
        result_list.push(around[i]);
      }
    }
    if (result_list.length !== 0) {
      return true;
    }
  }

  function check_先に自分石があるか(X, Y) {
    let recerchColor;
    if (turn % 2 === 0) {
      recerchColor = 'black';
    } else {
      recerchColor = 'white';
    }
    for (let i = 0; i < result_list.length; i++) {
      let j = 2;
      while (true) {
        let recerchPlace = out二次元配列(X + result_list[i][0] * j, Y + result_list[i][1] * j);
        if (recerchPlace === 0) {
          result_list[i] = 'None';
          break;
        } else if (recerchPlace === recerchColor) {
          result_list[i].push(j);
          break;
        } else {
          j++
        }
      }
    }
    if (result_list.some(x => x !== 'None')) {
      return true;
    }
  }

  highlight = function () {
    for (let i = 0; i < cell数; i++) {
      for (let j = 0; j < cell数; j++) {
        if (check(j, i)) {
          drawRectangle(j * cellSize, i * cellSize, cellSize, cellSize, 'rgb(0,150,0)');
          highlight_list.push([j, i]);
        }
      }
    }
    drawReversiline();
  }

  function highlight_非表示() {
    for (let i = 0; i < highlight_list.length; i++) {
      drawRectangle(highlight_list[i][0] * cellSize, highlight_list[i][1] * cellSize, cellSize, cellSize, 'darkgreen');
    }
    drawReversiline();
    highlight_list = [];
  }

  pass = function () {
    for (let i = 0; i < cell数; i++) {
      for (let j = 0; j < cell数; j++) {
        if (check(j, i)) {
          alert('パスできません');
          return;
        }
      }
    }
    alert('パスしました');
    turn++;
    if (turn % 2 === 0) {
      para2.textContent = '先手（黒）'
    } else {
      para2.textContent = '後手（白）'
    }
  }

  toryo = function () {
    if (confirm("投了しますか？")) {
      finish(true);
    }
  }

  function finish(toryo) {
    alert('終局');
    let whiteCounter = 0;
    let blackCounter = 0;
    result_list = [];
    for (let i = 0; i < cell数 ** 2; i++) {
      if (stones[i] === 'white') {
        whiteCounter++
      } else if (stones[i] === 'black') {
        blackCounter++
      }
    }
    if (toryo) {
      if (turn % 2 === 0) {
        result_list.push(whiteCounter)
        result_list.push(blackCounter)
        result_list.push('黒の投了により白の勝ち！');
      } else {
        result_list.push(blackCounter)
        result_list.push(whiteCounter)
        result_list.push('白の投了により黒の勝ち！')
      }
    } else {
      if (whiteCounter > blackCounter) {
        result_list.push(whiteCounter)
        result_list.push(blackCounter)
        result_list.push('白の勝ち！');
      } else if (blackCounter > whiteCounter) {
        result_list.push(blackCounter)
        result_list.push(whiteCounter)
        result_list.push('黒の勝ち！')
      } else {
        result_list.push(whiteCounter)
        result_list.push(blackCounter)
        result_list.push('引き分け')
      }
    }
    para1.textContent = result_list[2];
    para2.textContent = '成績：' + result_list[0] + '対' + result_list[1];
  }

  for (let i = 0; i < cell数 ** 2; i++) {
    stones.push('None');
  }

  drawCell(small, small, 'white', cellSize);
  drawCell(large, large, 'white', cellSize);
  drawCell(small, large, 'black', cellSize);
  drawCell(large, small, 'black', cellSize);

  drawReversiline();

  let tool;
  tool = new Tool;

  tool.onMouseDown = function (event) {
    let X = Math.floor(event.point.x / cellSize);
    let Y = Math.floor(event.point.y / cellSize);
    let cellColor;
    if (check(X, Y)) {
      highlight_非表示();
      if (turn % 2 === 0) {
        cellColor = 'black';
        para2.textContent = '後手（白）'
      } else {
        cellColor = 'white'
        para2.textContent = '先手（黒）'
      }
      for (let i = 0; i < result_list.length; i++) {
        for (let j = 0; j < result_list[i][2]; j++) {
          drawCell(X + result_list[i][0] * j, Y + result_list[i][1] * j, cellColor, cellSize);
        }
      }
      if (turn >= cell数 ** 2 - 1) {
        finish();
      } else {
        turn++;
      }
    } else {
      alert('置けません');
    }
  }
});
