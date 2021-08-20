// 1～3人のターン性で遊べるようにする
// 入力された人数を受け取って、人数分の名前入力欄を表示する
// TODO: nullなら入力してくださいと表示してスタートさせない
// TODO: 入力された名前を使って結果のカウントと表示をする
document.getElementById("ok").onclick = function () {
    let playerElm = document.getElementById("player");
    let player = playerElm.value
    let allPlayerName = "";
    let playerName = document.getElementById("player_name");
    for (i = 0; i < player; i++) {
        allPlayerName = allPlayerName + 
            `${i + 1}人目 <input type="text"  id=player_name${i + 1} maxlength="10"/> さん<br>`;
    }
    playerName.innerHTML = allPlayerName;
}

// カードの枚数
const cardLength = 52;

// STARTボタン押下時に実行
document.getElementById("start").onclick = function () {

    // 52枚（4つの絵柄×13枚）のカードを用意する
    let card = [];
    let type = ["heart", "spade", "club", "diamond"];

    for(let i = 0; i < type.length; i++) {
        for(let j = 1; j < 14; j++) {
            let sliceNum = ('00' + j).slice(-2);
            card.push("card_" + type[i] + "_" + sliceNum);
        }
    }

    // カードをシャッフルする
    let rndCard = [];
    let num = [];
    let chofukuNum = [];

    for(i = 0; i < cardLength; i++) {
        num.push(i);
    }

    while(rndCard.length < cardLength) {
        let rndNum = Math.floor(Math.random()*52);
        if(!chofukuNum.includes(rndNum)) {
            rndCard.push(card[rndNum]);
            chofukuNum.push(rndNum);
        }
    }
    console.log(rndCard);

    // カードを表示させる
    let allPanel = "";
    let panel = document.getElementById("panel");
    for (i = 0; i < cardLength; i++) {
        allPanel = allPanel + `<img src=./img/back.png id=${rndCard[i]} />`;
    }
    panel.innerHTML = allPanel;
}

// カードをめくる
let firstCard = '';
let secondCard = '';
let firstCardFlg = true;
let FirstCardElm;
let SecondCardElm;

document.getElementById("panel").addEventListener('click', function(event) {
    let target = event.target;
    if (target.id != "panel" || target.id != "finish") {
        // 1枚目
        if (firstCardFlg == true) {
            firstCard = target.id;
            FirstCardElm = document.getElementById(firstCard);
            FirstCardElm.src = `./img/${firstCard}.png`;
            console.log(firstCardFlg);
            console.log(FirstCardElm);
            firstCardFlg = false;
        // 2枚目
        } else {
            secondCard = target.id;
            SecondCardElm = document.getElementById(secondCard);
            SecondCardElm.src = `./img/${secondCard}.png`;
            console.log(firstCardFlg);
            console.log(SecondCardElm);
            firstCardFlg = true;

            // 1枚目と2枚目の結果を照合する
            // 一緒であればカードを非表示にする
            // TODO: 並びがずれてしまうので表のままにした。finishはもう押せないようにしたい
            if (firstCard.split('_')[2] == secondCard.split('_')[2]) {
                // FirstCardElm.id = "finish";
                // SecondCardElm.id = "finish";
                console.log('そろった！');
            // 異なれば裏に戻す
            } else {
                // FirstCardElm.src = './img/back.png';
                // SecondCardElm.src = './img/back.png';
                console.log('はずれた');
            }
        }
    }
})

// TODO: 3人それぞれにそろった枚数を表示する
// TODO: ゲーム終了時に勝った人を表示する
// TODO: ゲーム終了時にそろった枚数のカウントをリセットする
