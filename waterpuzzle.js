document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const playButton = document.getElementById('play-button');
    const levelSelect = document.getElementById('level-select');

    const colors=[
        "BlanchedAlmond",
        "CornflowerBlue",
        "Cyan",
        "DarkGray",
        "DarkSeaGreen",
        "LightBlue",
        "LightGoldenRodYellow",
        "LightCoral",
        "Pink",
        "RosyBrown",
        "Tan",
        "Salmon",
        "SlateBlue",
        "RoyalBlue",
        "PowderBlue"

    ]
    const tubes = [];//用來存所有試管的陣列 
    let selectedTube = null;
    let levelCount = 1;

    function chooseLevel(level){//把畫面上的文字改成目前關卡
        levelCount=level;
        document.getElementById('level-Count').textContent=levelCount;
    }

    levelSelect.addEventListener('change', (event) => {
        levelCount = parseInt(event.target.value);
        document.getElementById('level-count').textContent = levelCount;
    });

    playButton.addEventListener('click', () => {//用者按「開始」會做  清空舊試管  createTubes()
        tubes.length = 0;
        createTubes();
        fillTubes();
    });

    function createTubes() {//建立遊戲的「試管」畫面
        // 依照選擇的關卡來產生試管
        gameBoard.innerHTML = "";

        for (let i = 0; i < levelCount + 1; i++) {
            const tube = document.createElement('div');
            tube.classList.add('tube');
            tube.addEventListener('click', () => selectTube(tube));
            gameBoard.appendChild(tube);
            tubes.push(tube);
        }
        for(let i=0;i<2;i++){
            const emptyTube=document.createElement('div');
            emptyTube.classList.add('tube');//幫這個 div 加上一個 CSS 類別
            emptyTube.addEventListener('click',()=>selectTube(emptyTube));//當你「點擊這個試管」時，要做某件事
            gameBoard.appendChild(emptyTube);//把剛剛做的 div 加到畫面上
            tubes.push(emptyTube);
        }
    }
    function selectTube(tube){//負責「點一下選擇，第二下倒水」的流程控制。@@
        if (selectedTube){
            if(selectedTube!==tube){
                pourWater(selectedTube,tube);
            }
            selectedTube.classList.remove('selected');
            selectedTube = null;
        }else{
             selectedTube = tube;
        tube.classList.add('selected');
        }
        
    }
    function pourWater(fromTube, toTube) {//把水從一支試管倒到另一支
    let fromWater = fromTube.querySelector('.water:last-child');//取得試管裡最後一個水塊（頂端水）
    let toWater = toTube.querySelector('.water:last-child');

    if (!fromWater) return; // 沒東西不能倒

    if (!toWater) {
        const color = fromWater.style.backgroundColor;//取來源頂端水的顏色
        //這樣可以倒同色的水塊

        while (
            fromWater &&
            fromWater.style.backgroundColor === color &&//裡確保倒的水和前面倒的水是同一種顏色。
            toTube.childElementCount < 4//目標試管還沒滿（假設每管最多 4 個水塊）
        ) {
            toTube.appendChild(fromWater);//把水塊移到目標試管
            fromWater = fromTube.querySelector('.water:last-child');//更新來源頂端水塊（因為剛移動走了）
        }
    } else {//倒水到非空試管
        while (
            fromWater &&
            fromWater.style.backgroundColor === toWater.style.backgroundColor &&
            toTube.childElementCount < 4
        ) {
            toTube.appendChild(fromWater);
            fromWater = fromTube.querySelector('.water:last-child');
            toWater = toTube.querySelector('.water:last-child');
        }
    }

    checkGameState(); // 檢查玩家是否完成關卡
}
    function fillTubes(){//遊戲開始時每個試管裡的水」的邏輯
        const gameColors=colors.slice(0,levelCount+1);
        const waterBlocks=[];
        gameColors.forEach(color=>{
            for (let i=0;i<4;i++){
                waterBlocks.push(color);//把顏色加到陣列
            }
        });
        waterBlocks.sort(()=>0.5-Math.random());//0.5 - Math.random()  結果就是打亂陣列

        let index=0;//紀錄水塊
        tubes.slice(0,levelCount+1).forEach(tube=>{
            for(let i=0;i<4;i++){
                const water=document.createElement('div');
                water.classList.add('water');
                water.style.backgroundColor=waterBlocks[index];
                water.style.height='20%';
                tube.appendChild(water);
                index++;
            }
        })
    }
    function checkGameState() {

    const allSameColor = (tube) => {
        const waters = Array.from(tube.children);

        return (
            waters.length === 4 &&
            waters.every(w => w.style.backgroundColor === waters[0].style.backgroundColor)
        );
    };

    if (tubes.every(tube => tube.childElementCount === 0 || allSameColor(tube))) {
        alert('過關!');
    }
}
});