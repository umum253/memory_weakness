// 変数定義
// プレイヤーの名前のリスト
let playerList = [];
// プレイヤーごとにそろったペアをカウントするリスト
let countList = [0, 0, 0];
// 現在のプレイヤーを判断する変数
let curPlayerJudging = 0;
// ゲームの終了を判断する変数
let gameFinishJudging = 0;
// 取得する要素と挿入するタグ
let playerElm = '';
let player = 0;
let playerNameTag = '';
let playerName = '';
let curPlayerTag = '';
let curPlayer =　'';
let countTag = '';
let count = '';
let panelTag = '';
let panel = '';
let resultTag = '';
let result = '';
// カードの合計枚数
const CARD_LENGTH = 52;
// カードの絵柄
let type = ["heart", "spade", "club", "diamond"];
// カードを順番通りに格納するリスト
let card = [];
// カードをシャッフルして格納するリスト
let rndCard = [];
// カードをシャッフルするとき重複をなくすためのリスト
let chofukuNum = [];
// 1枚目のカード
let FirstCardElm = '';
let firstCardId = '';
// 2枚目のカード
let SecondCardElm = '';
let secondCardId = '';
// 1枚目のカードかどうかのフラグ
let firstCardFlg = true;

// 処理を指定秒数遅らせるタイマー定義
// (awaitで呼び出すとPromise処理の結果が返ってくるまで一時停止する)
function delay(n) {
    return new Promise(function(resolve){
        setTimeout(resolve, n*1000);
    });
}

// STARTボタンを非活性にしておく
document.getElementById("start").disabled = true;

// OKボタンクリック時に実行する処理
document.getElementById("ok").onclick = function () {
    // 入力されたプレイヤー数を取得する
    playerElm = document.getElementById("player");
    player = playerElm.value
    playerName = document.getElementById("player_name");
    // プレイヤー数が入力されていない場合、アラートを表示する
    if (player == 0) {
        alert("人数を設定してください")
    // プレイヤー数が入力されている場合、名前入力欄を表示しSTARTボタンを活性化する
    } else {
        for (let i = 0; i < player; i++) {
            playerNameTag += `${i + 1}人目 <input type="text" id=player_name${i} maxlength="10"/> さん<br>`;
        }
        playerName.innerHTML = playerNameTag;
        document.getElementById("start").disabled = false;
        document.getElementById("ok").disabled = true;
    }
}

// STARTボタンクリック時に実行する処理
document.getElementById("start").onclick = function () {
    // 入力されたプレイヤーの名前を取得する
    for (let i = 0; i < player; i++) {
        playerList.push(document.getElementById("player_name" + i).value);
    }

    // 現在のプレイヤーを表示する
    curPlayer = document.getElementById("current_player");
    curPlayerTag = `${playerList[0]}さんのターンです`;
    curPlayer.textContent = curPlayerTag;

    // プレイヤーごとのカウントを表示する
    countTag = "";
    count = document.getElementById("count");
    for (let i = 0; i < player; i++) {
        countTag += `${playerList[i]}さん ${countList[i]}ペア　`;
    }
    count.textContent = countTag;

    // 52枚（4つの絵柄×13枚）のカードを用意する
    for(let i = 0; i < type.length; i++) {
        for(let j = 1; j < 14; j++) {
            let sliceNum = ('00' + j).slice(-2);
            card.push("card_" + type[i] + "_" + sliceNum);
        }
    }

    // カードをシャッフルする
    while(rndCard.length < CARD_LENGTH) {
        let rndNum = Math.floor(Math.random()*CARD_LENGTH);
        if(!chofukuNum.includes(rndNum)) {
            rndCard.push(card[rndNum]);
            chofukuNum.push(rndNum);
        }
    }
    console.log(rndCard);

    // カードを表示する
    panel = document.getElementById("panel");
    for (i = 0; i < CARD_LENGTH; i++) {
        panelTag = panelTag + `<img src=./img/back.png id=${rndCard[i]} />`;
    }
    panel.innerHTML = panelTag;
}

// カードクリック時に実行する処理
document.getElementById("panel").addEventListener('click', async function(event) {
    let target = event.target;
    // ゲーム開始時、STARTボタンを非活性にしておく
    document.getElementById("start").disabled = true;

    if (target.id != "panel" || target.id != "finish" || target.id != "finish") {
        // 1枚目をめくる
        if (firstCardFlg == true) {
            firstCardId = target.id;
            FirstCardElm = document.getElementById(firstCardId);
            FirstCardElm.src = `./img/${firstCardId}.png`;
            console.log(FirstCardElm);
            firstCardFlg = false;
        // 2枚目をめくる
        } else {
            secondCardId = target.id;
            SecondCardElm = document.getElementById(secondCardId);
            SecondCardElm.src = `./img/${secondCardId}.png`;
            console.log(SecondCardElm);
            firstCardFlg = true;

            // 1枚目と2枚目の結果を照合する
            // そろった場合、非表示にする
            if (firstCardId.split('_')[2] == secondCardId.split('_')[2]) {
                console.log('そろった！');
                // 1秒待ってからカードを非表示にする
                await delay(1);
                document.getElementById(firstCardId).style.visibility ="hidden";
                document.getElementById(secondCardId).style.visibility ="hidden";
                // プレイヤーごとのカウントを変更する
                countList[curPlayerJudging % player]++;
                countTag = "";
                count = document.getElementById("count");
                for (let i = 0; i < player; i++) {
                    countTag += `${playerList[i]}さん ${countList[i]}ペア　`;
                }
                count.textContent = countTag;
                gameFinishJudging++;
            // はずれた場合、裏に戻す
            } else {
                console.log('はずれた');
                // 1秒待ってからカードを裏に戻す
                await delay(1);
                FirstCardElm.src = './img/back.png';
                SecondCardElm.src = './img/back.png';
                // 現在のプレイヤーを変更する
                curPlayerJudging++;
                curPlayer = document.getElementById("current_player");
                curPlayer.textContent = `${playerList[curPlayerJudging % player]}さんのターンです`;
            }
        }
    }

    // ゲーム終了時、勝った人を表示する
    if (gameFinishJudging == CARD_LENGTH/2) {
        // TODO: 同率1位に対応できてない
        let winner = countList.indexOf(Math.max.apply(null, countList));
        resultTag = "";
        result = document.getElementById("result");
        resultTag = `最終結果： ${playerList[winner]}さんの勝ち！`
        result.textContent = resultTag;
    }
})

// TODO: awaitの秒数を無視して別のカードを連打するとおかしくなる
// TODO: 非表示のカードもクリックできてしまう
