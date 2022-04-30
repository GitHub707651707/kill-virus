let config = {
    status: 0,
    score: 0,
    speed: 3,
    go: false
}

let birth, update;
let uiStart = document.querySelector('#ui-start');
// 开始游戏
function startGame() {
    console.log("start")
    config.status = 1;
    // ui-start滑走动画
    document.querySelector('.up1').classList.add('slide-up');
    document.querySelector('.up2').classList.add('slide-up');
    document.querySelector('.up3').classList.add('slide-up');
    document.querySelector('.down').classList.add('slide-down');
    // 延时0.5s将ui-start部分取消
    setTimeout(function() {
        uiStart.style.display = "none";
    }, 500);
    // 间隔1s生成病毒
    birth = setInterval(function() {
        createVirus();
    }, 1000);
    // 以每秒60次的频率更新virus的y坐标
    update = setInterval(function() {
        fallDown();
    }, 16);
}


let game = document.querySelector('#game');
let virusList = [];
// 生成virus
function createVirus() {
    // 创建virus层
    let virus = document.createElement('div');
    virus.setAttribute("class", "virus");
    // 创建p层
    let p = document.createElement('p');
    p.setAttribute("class", "letter");
    // p为随机大写字母
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let letter = letters[Math.floor(Math.random() * 25)];
    p.innerHTML = letter;
    //为virus添加op属性样式，便于后期监听
    virus.op = letter;
    // 为p标签添加随机背景颜色
    let color = '';
    switch(Math.floor(Math.random() * 5)){
        case 0:
            color = 'radial-gradient(rgba(255,150,150,0),rgba(255,0,0,1))';break;
        case 1:
            color = 'radial-gradient(rgba(0, 255, 0, 0),rgba(0,255,0,1))';break;
        case 2:
            color = 'radial-gradient(rgba(0, 0, 255, 0),rgba(0,0,255,1))';break;
        case 3:
            color = 'radial-gradient(rgba(255, 255, 0, 0),rgba(255,255,0,1))';break;
        case 4:
            color = 'radial-gradient(rgba(0, 255, 255, 0),rgba(0,255,255,1))';break;
        case 5:
            color = 'radial-gradient(rgba(255, 0, 255, 0),rgba(255,0,255,1))';break;
    }
    p.style.backgroundImage = color;
    // 将p塞进virus
    virus.appendChild(p);
    //随机设定virus的x坐标
    virus.style.left = Math.floor(Math.random() * (game.offsetWidth - 80)) + 'px';
    // 将virus添加进game层
    game.appendChild(virus);
    virusList.push(virus);
    console.log("成功添加一个病毒");
}
// 获取当前窗口高度
let bg = document.querySelector('#bg');
let winHight = bg.offsetHeight;
let uiWarn = document.querySelector('#ui-warn');
// 病毒下落
function fallDown() {
    for (var i = 0; i < virusList.length; i++) {
        let virus = virusList[i];
        virus.style.top = virus.offsetTop + config.speed + 'px';
        if (virus.offsetTop > winHight) {
            //console.log("游戏结束");
            endGame();
        } else if (virus.offsetTop > (winHight - 200) && !config.go) {
            //console.log("警告");
            uiWarn.setAttribute('class', 'warn-anim');
            config.go = true;
            setTimeout(function() {
                uiWarn.setAttribute('class', '');
                config.go = false;
            }, 1500);
        }
    }
}

// 游戏失败
let uiEnd = document.querySelector('#ui-end');
function endGame() {
    config.status = 0;
    clearInterval(update);
    clearInterval(birth);
    uiEnd.style.display = "block";
}

let xmAudio = document.querySelector('#xm');
let scoreLabel = document.querySelector('#score-label');
// 添加键盘监听事件,实现按键消灭病毒功能
window.addEventListener('keyup', function(e) {
    if (config.status === 1) {
        // 当触发'keyup'事件时，遍历virusList
        for (let i = 0; i < virusList.length; i++) {
            let virus = virusList[i];
            // 如果'按键'与virus里的字母(op)一样
            if (virus.op.toUpperCase() === e.key.toUpperCase()) {
                // 将virus替代成dieImg
                let dieImg = this.document.createElement('img');
                game.appendChild(dieImg);
                dieImg.src = './src/virus-die.png';
                dieImg.style.position = 'absolute';
                dieImg.style.left = virus.offsetLeft + 'px';
                dieImg.style.top = virus.offsetTop + 'px';
                // 为dieImg添加fade-out动画效果
                dieImg.classList.add('fade-out');
                // 从virusList和game中移除virus
                game.removeChild(virus);
                virusList.splice(i--, 1);//数组长度发送变化,后退一位
                // 分数+1，分数栏变化
                scoreLabel.innerHTML = ++config.score;
                // 重置xm音频时间点，并播放
                xmAudio.currentTime = 0;
                xmAudio.play();
            }
        }
    }
})

// 重新开始游戏 
function restartGame() {
    console.log('重新进行游戏');
    config.status = 0;
    uiEnd.style.display = "none";
    game.innerHTML = '';
    virusList = [];
    startGame();
    config.score = 0;
    config.go = false;
    scoreLabel.innerHTML = 0;
}