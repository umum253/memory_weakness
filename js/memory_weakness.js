// カードの枚数
const cardLength = 52;

// 画面読み込み時に実行
window.onload = function () {

    // 52枚（4つの絵柄×13枚）のカードを用意する
    let card = [];
    let type = ["heart", "spade", "clover", "diamond"];

    for(let i = 0; i < type.length; i++) {
        for(let j = 1; j < 14; j++) {
            card.push("card_" + type[i] + "_" + j + ".png");
        }
    }
    // console.log("card.length: " + card.length);

    // カードをシャッフルする
    let rndCard = [];
    let num = [];
    let chofukuNum = [];

    for(i = 0; i < cardLength; i++) {
        num.push(i);
    }

    console.log("rndCard.length: " + rndCard.length);

    while(rndCard.length < cardLength) {
        let rndNum = Math.floor(Math.random()*52);
        if(!chofukuNum.includes(rndNum)) {
            rndCard.push(card[rndNum]);
            chofukuNum.push(rndNum);
        }
    }

    console.log(rndCard);
    console.log("rndCard.length: " + rndCard.length);

    // カードを表示させる

    let allPanel = "";
    let panel = document.getElementById("panel");
    for (i = 0; i < cardLength; i++) {
        allPanel = allPanel + `<p>${rndCard[i]}</p>`;
    }
    panel.innerHTML = allPanel;

}

// カードをめくる
// 1枚目と2枚目の結果を照合する
// 　一緒であればカードを非表示にする
// 　異なれば裏に戻す
// 3人でターン性で遊べるようにする(1人でも遊べるようにした方がよい)
// 3人それぞれにそろった枚数を表示する
// ゲーム終了時に勝った人を表示する
// ゲーム終了時にそろった枚数のカウントをリセットする
