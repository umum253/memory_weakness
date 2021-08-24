// 変数定義
// プレイヤーの名前のリスト
let playerList = [];
// プレイヤーごとにそろったペアをカウントするリスト
let countList = [0, 0, 0];
// 現在のプレイヤーを判断する変数
let curPlayerJudgeing = 0;
// ゲームの終了を判断する変数
let gameFinishJudgeing = 0;
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
// カードを順番通りに格納するリスト
let card = [];
// カードの絵柄
let type = ["heart", "spade", "club", "diamond"];
// カードをシャッフルして格納するリスト
let rndCard = [];
// カードをシャッフルするとき重複をなくすためのリスト
let chofukuNum = [];
// 1枚目のカード
let FirstCardElm;
let firstCardId = '';
// 2枚目のカード
let SecondCardElm;
let secondCardId = '';
// 1枚目のカードかどうかのフラグ
let firstCardFlg = true;

// はずれた場合に裏に戻す処理を遅らせるためのタイマー定義
function delay(n) {
    return new Promise(function(resolve){
        setTimeout(resolve, n*1000);
    });
}

// STARTボタンを非活性にしておく
document.getElementById("start").disabled = true;

// OKボタンクリック時に実行(ゲーム設定)
document.getElementById("ok").onclick = function () {
    playerElm = document.getElementById("player");
    player = playerElm.value
    playerName = document.getElementById("player_name");
    // 入力されていない場合、アラートを表示する
    if (player == 0) {
        alert("人数を設定してください")
    // 入力されている場合、人数分の名前入力欄を表示してSTARTボタンを活性化
    } else {
        for (let i = 0; i < player; i++) {
            playerNameTag += `${i + 1}人目 <input type="text" id=player_name${i} maxlength="10"/> さん<br>`;
        }
        playerName.innerHTML = playerNameTag;
        document.getElementById("start").disabled = false;
        document.getElementById("ok").disabled = true;
    }
}

// STARTボタンクリック時に実行
document.getElementById("start").onclick = function () {
    // 入力された名前をリストに入れる
    for (let i = 0; i < player; i++) {
        playerList.push(document.getElementById("player_name" + i).value);
    }

    // 現在のプレイヤーを表示
    curPlayer = document.getElementById("current_player");
    curPlayerTag = `${playerList[0]}さんのターンです`;
    curPlayer.textContent = curPlayerTag;

    // プレイヤーごとのカウントを表示
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

// カードをクリック時に実行
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
                // 1秒待って(awaitはPromise処理の結果が返ってくるまで一時停止してくれる)、非表示にする
                await delay(1);
                document.getElementById(firstCardId).style.visibility ="hidden";
                document.getElementById(secondCardId).style.visibility ="hidden";
                // プレイヤーごとのカウントを変更する
                countList[curPlayerJudgeing % player]++;
                countTag = "";
                count = document.getElementById("count");
                for (let i = 0; i < player; i++) {
                    countTag += `${playerList[i]}さん ${countList[i]}ペア　`;
                }
                count.textContent = countTag;
                gameFinishJudgeing++;
            // はずれた場合、裏に戻す
            } else {
                console.log('はずれた');
                // 1秒待って(awaitはPromise処理の結果が返ってくるまで一時停止してくれる)、裏に戻す
                await delay(1);
                FirstCardElm.src = './img/back.png';
                SecondCardElm.src = './img/back.png';
                // 現在のプレイヤーを変更する
                curPlayerJudgeing++;
                curPlayer = document.getElementById("current_player");
                curPlayer.textContent = `${playerList[curPlayerJudgeing % player]}さんのターンです`;
            }
        }
    }

    // ゲーム終了時、勝った人を表示する
    if (gameFinishJudgeing == CARD_LENGTH/2) {
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
