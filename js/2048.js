let direction; //贪吃蛇移动方向  1——左，2——上，3——右，4——下
let wholeDirection; //整体移动方向  -1——整体左，-2——整体上，-3——整体右，-4——整体下
let timer;//计时器
let fruit = [];//果实
let snake = [[]];//蛇所占坐标,第三个为坐标的值
let array = [];  //二维数组，代表范围内每一格
let score = 0; //得分


innitial();


//初始化
function innitial() {
	direction = 2;
	wholeDirection = 0;
	timer = null;
	snake = [[0, 0, 2]];
	fruit = [0, 0, 2];
	array = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[2, 0, 0, 0, 0, 0, 0, 0]
	];
	score = 0;

	drawPanel();
	fruit[0] = parseInt(Math.random() * 7, 10) + 1;
	fruit[1] = parseInt(Math.random() * 7, 10) + 1;
	array[7 - fruit[1]][fruit[0]] = fruit[2];
	setCellStyle();
}

//生成panel
function drawPanel() {
	let panel = document.getElementById("panel");
	let panelInnerHtml = "";
	for (let i = 0; i < array.length; i++) {
		panelInnerHtml += "<div class='row'>";
		for (let j = 0; j < array[i].length; j++) {
			panelInnerHtml += "<div id = 'c" + j + i + "' class='cell'></div>"
		}
		panelInnerHtml += "</div>";
	}
	panel.innerHTML = panelInnerHtml;
}

//随机生成果实
function bearFruit() {
	fruit[0] = parseInt(Math.random() * 7, 10) + 1;
	fruit[1] = parseInt(Math.random() * 7, 10) + 1;
	if (Math.round(Math.random()) === 0) {
		fruit[2] = 2;
	} else {
		fruit[2] = 4;
	}

	//检测果实是否在蛇体内
	for (let i = 0; i < snake.length; i++) {
		//在蛇体内
		if (snake[i][0] === fruit[0] && snake[i][1] === fruit[1]) {
			//重新生成
			bearFruit()
		}
	}
}

//根据array值来设置cell样式
function setCellStyle() {
	let cellName = "";
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array[i].length; j++) {
			cellName = "c" + j + i;
			let cell = document.getElementById(cellName);
			cell.className = "cell _" + array[i][j];
			if (array[i][j] !== 0) {
				cell.innerText = array[i][j];
			}
		}
	}
}

//判断键盘输入
window.onkeydown = function (event) {
	var keyCode = event.keyCode || event.which || event.charCode;
	var altKey = event.altKey;
	if (altKey) {
		switch (keyCode) {
			case 37:
				wholeDirection = -1;
				break;
			case 38:
				wholeDirection = -2;
				break;
			case 39:
				wholeDirection = -3;
				break;
			case 40:
				wholeDirection = -4;
				break;
			default:
				break;
		}
	} else {
		switch (keyCode) {
			case 37:
				if (direction !== 3) {
					direction = 1;
				}
				break;
			case 38:
				if (direction !== 4) {
					direction = 2;
				}
				break;
			case 39:
				if (direction !== 1) {
					direction = 3;
				}
				break;
			case 40:
				if (direction !== 2) {
					direction = 4;
				}
				break;
			default:
				break;
		}
	}

};

//画蛇
function drawSnake() {
	//清零
	array = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0]
	];

	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array[i].length; j++) {
			cellName = "c" + j + i;
			let cell = document.getElementById(cellName);
			cell.innerText = "";
		}
	}

	//设置果实
	array[7 - fruit[1]][fruit[0]] = fruit[2];
	//对蛇进行处理
	slimSnake();
	//设置蛇
	for (let i = 0; i < snake.length; i++) {
		array[7 - snake[i][1]][snake[i][0]] = snake[i][2];
	}

	//设置分数
	let scoreInner = document.getElementById("score");
	scoreInner.innerHTML = "Score:&nbsp;&nbsp;" + score;

	setCellStyle();

	//判断是否已经合成2048方块
	for (let i = 0; i < snake.length; i++) {
		if (snake[i][2] === 2048) {
			clearInterval(timer);
			alert("You Win!");
			timer = null
		}
	}
}

//根据蛇的方向来移动
function run() {
	//记录目前轨迹
	let lastSnake = [[]];
	for (let i = 0; i < snake.length; i++) {
		lastSnake[i] = [];
		lastSnake[i][0] = snake[i][0];
		lastSnake[i][1] = snake[i][1];
		lastSnake[i][2] = snake[i][2];
	}

	//一般移动
	if (wholeDirection === 0) {
		//计算下一步轨迹
		let newSnake = [[]];
		newSnake[0] = snake[0].slice();

		//根据方向做移动
		switch (direction) {
			case 1:
				//蛇头转向
				newSnake[0][0] -= 1;
				break;
			case 2:
				//蛇头转向
				newSnake[0][1] += 1;
				break;
			case 3:
				//蛇头转向
				newSnake[0][0] += 1;

				break;
			case 4:
				//蛇头转向
				newSnake[0][1] -= 1;
				break;
		}

		//蛇身跟上
		for (let i = 1; i < snake.length; i++) {
			newSnake[i] = [];
			newSnake[i][0] = snake[i - 1][0];
			newSnake[i][1] = snake[i - 1][1];
			newSnake[i][2] = snake[i][2];
		}
		snake = newSnake;
	}
	//整体移动
	else {
		debugger;
		switch (wholeDirection) {
			case -1:
				for (let i = 0; i < snake.length; i++) {
					snake[i][0] -= 1;
				}
				break;
			case -2:
				for (let i = 0; i < snake.length; i++) {
					snake[i][1] += 1;
				}
				break;
			case -3:
				for (let i = 0; i < snake.length; i++) {
					snake[i][0] += 1;
				}
				break;
			case -4:
				for (let i = 0; i < snake.length; i++) {
					snake[i][1] -= 1;
				}
		}
		wholeDirection = 0;
	}

	//判断是否出界
	dead();
	//判断是否吃到果实
	eatFruit(lastSnake);
	//画新的蛇
	drawSnake();

}

//判断是否出界
function dead() {
	for (let i = 0; i < snake.length; i++) {
		if (snake[i][0] > 7 || snake[i][1] > 7 || snake[i][0] < 0 || snake[i][1] < 0) {
			clearInterval(timer);
			alert("撞到墙啦");
			// innitial();
		}
	}
}

//判断是否吃到果实
function eatFruit(lastSnake) {
	//从头部吃到果实
	if (fruit[0] === snake[0][0] && fruit[1] === snake[0][1]) {
		//果实是否合适
		if (fruit[2] < snake[0][2]) {
			//合适，不相等，产生新蛇头
			let newSnake = [[]];
			newSnake[0] = fruit.slice();

			for (let i = 0; i < lastSnake.length; i++) {
				newSnake[i + 1] = [];
				newSnake[i + 1][0] = lastSnake[i][0];
				newSnake[i + 1][1] = lastSnake[i][1];
				newSnake[i + 1][2] = lastSnake[i][2];
			}
			snake = newSnake;
			score += fruit[2];

			//生成新的果实
			bearFruit();
		} else {
			if (fruit[2] === snake[0][2]) {
				//合适，相等
				snake[0][2] += fruit[2];
				score += fruit[2];

				//生成新的果实
				bearFruit();
			} else {
				//不合适
				clearInterval(timer);
				alert("太贪心了");
				// innitial();
			}
		}

		return;
	}

	for (let i = 1; i < snake.length; i++) {
		//从其他部分吃到果实
		if (fruit[0] === snake[i][0] && fruit[1] === snake[i][1]) {
			//果实是否合适
			if (fruit[2] > snake[i - 1][2] && fruit[2] <= snake[i][2]) {
				//合适
				//判断蛇尾方向
				if (snake[snake.length - 2][0] < snake[snake.length - 1][0]) {
					//向右
					snake.push([snake[snake.length - 1][0] + 1, snake[snake.length - 1][1], 0]);
				} else if (snake[snake.length - 2][0] > snake[snake.length - 1][0]) {
					//向左
					snake.push([snake[snake.length - 1][0] - 1, snake[snake.length - 1][1], 0]);
				} else if (snake[snake.length - 2][1] < snake[snake.length - 1][1]) {
					//向上
					snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1] + 1, 0]);
				} else {
					//向下
					snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1] - 1, 0]);
				}

				//将第i位之后的每一位的值往后延一位
				for (let j = snake.length - 1; j > i; j--) {
					snake[j][2] = snake[j - 1][2];
				}

				//将第i位设置为果实
				snake[i][2] = fruit[2];
				score += fruit[2];

				//生成新的果实
				bearFruit();
			} else {
				//不合适
				clearInterval(timer);
				alert("吞食错误");
				// innitial();
			}
		}
	}
}

//判断蛇内部是否存在方块可合并
function slimSnake() {
	for (let i = 0; i < snake.length - 1; i++) {
		if (snake[i][2] === snake[i + 1][2]) {
			snake[i][2] += snake[i + 1][2];
			for (let j = i + 1; j < snake.length - 1; j++) {
				snake[j][2] = snake[j + 1][2];
			}
			snake.pop();
			slimSnake()
		}
	}
}

//设置开始按钮被选择时变色
function beginSelected() {
	let begin = document.getElementById("begin");
	begin.style.backgroundColor = "#1992EE";
	begin.style.cursor = "pointer";
}

function beginUnselected() {
	let begin = document.getElementById("begin");
	begin.style.backgroundColor = "#6BAFEA";
}

//设置暂停按钮被选择时变色
function pauseSelected() {
	let pause = document.getElementById("pause");
	pause.style.backgroundColor = "#1992EE";
	pause.style.cursor = "pointer";
}

function pauseUnselected() {
	let pause = document.getElementById("pause");
	pause.style.backgroundColor = "#6BAFEA";
}

//点击开始
function begin() {
	if (timer) {
		clearInterval(timer);
	}
	innitial();
	timer = setInterval("run()", 400);
}

//点击暂停
function pause() {
	let pauseValue = document.getElementById("pause");
	if (timer !== null) {
		if (timer !== 0) {
			clearInterval(timer);
			timer = 0;
			pauseValue.innerHTML = "回到游戏";
		} else {
			timer = setInterval("run()", 400);
			pauseValue.innerHTML = "暂停一下";
		}
	}

}