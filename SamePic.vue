<template>
  <div id = "table">
    <div id = "same_pic">
      <h1>같은 그림 찾기</h1>
      <div id = "info">
        <button id = "gameStart" @click="gameStart">게임시작</button>
        <span>점수 : <span id = 'score'>0</span> 점</span>
      </div>
      <div id = "game">
        <div id = "count">준비</div>
        <table id = "cardTable"></table>
      </div>
    </div>
  </div>
</template>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>

let gameState = '';

let openCardId1 = '';
let openCardId2 = '';

let cards;
let score = 0;
let openedCnt = 0;


$(document).on('click','#cardTable td' ,function(){

    if(gameState != 'playing') return false;// 게임 카운트 다운시 누를경우 return
    if(openCardId2 != '') return false;  //2개 열려있는데 누른경우 return
    if($(this).hasClass('opened'))  return false;//열려있는 카드를 또 누른경우 return

    $(this).addClass('opened');  //열려있다는것을 구분하기 위한 class추가
    if(openCardId1 == ''){
        $(this).find('img').show();
        $(this).find('span').hide();
        openCardId1 = this.id;
    }else {
        if(openCardId1 == openCardId2)  return false;// 같은 카드 누른경우 return

        $(this).find('img').show();
        $(this).find('span').hide();

        var openCardSrc1 = $('#'+openCardId1).find('img').attr('src');
        var openCardSrc2 = $(this).find('img').attr('src');
        openCardId2 = this.id;

        if(openCardSrc1 == openCardSrc2) {  //일치
            openCardId1 = '';
            openCardId2 = '';
            scorePlus();
            if(++openedCnt == 8){
                alert('게임 끝!! \n당신의 점수는 '+score+'점 입니다!');
            }
        }else { //불일치
            setTimeout(back, 1000);
            scoreMinus();
        }
    }
})

function setGame(){
      document.getElementById('cardTable').style.display = 'none';

      gameState = 'alreadyStart';
      let sec = 5;
      
      scoreInit();
      setTable();
      $("cardTable td span").hide();
      let intervalId = setInterval(function(){
        document.getElementById("count").innerHTML = --sec;
      }, 1000);

      setTimeout(function(){
        clearInterval(intervalId);
        $("#countDown").text('start');
        $("#cardTable td img").hide();
        $("#cardTable td span").show();
        gameState = 'playing';
        document.getElementById("count").innerHTML = "시작";
        document.getElementById('cardTable').style.display = '';
        document.getElementById('gameStart').innerHTML = "재시작하기";
      }, 5000);
};
function scoreInit(){
    score = 0;
    openedCnt = 0;
    document.getElementById("score").innerText = score;
};

function setTable(){
      cards = [
        require('./assets/apeach.png').default, require('./assets/apeach.png').default,
        require('./assets/con.png').default, require('./assets/con.png').default,
        require('./assets/frodo.png').default, require('./assets/frodo.png').default,
        require('./assets/jayz.png').default, require('./assets/jayz.png').default,
        require('./assets/lion.png').default, require('./assets/lion.png').default,
        require('./assets/muzi.png').default, require('./assets/muzi.png').default,
        require('./assets/neo.png').default, require('./assets/neo.png').default,
        require('./assets/tube.png').default, require('./assets/tube.png').default
      ];

      let cardTableDom = "<tr>";
      for(let i = 0; i <16; i++){
         
        if(i > 0 && (i % 4 == 0)){
          cardTableDom += "</tr><tr>";
        }

        let index = Math.floor(Math.random() * (15 - i - 0) + 0);
        let img = cards.splice(index, 1);
        cardTableDom += '<td id="card' + i + '"style="border:solid #9DCEFF; width: 110px; height: 110px; "><img src="'+img+'" style="width: 100px;"><span>OPEN</span></td>'

      }
      cardTableDom += "</tr>";
      $('#cardTable').html(cardTableDom);
};
function scorePlus(){
  score += 10;
  document.getElementById('score').innerText = score;
};
function scoreMinus(){
  score -= 5;
  document.getElementById('score').innerText = score;
};
function back(){
  $("#"+openCardId1).find('img').hide();
  $("#"+openCardId1).find('span').show();
    $("#"+openCardId2).find('img').hide();
  $("#"+openCardId2).find('span').show();
    $("#"+openCardId1).removeClass('opened');
  $("#"+openCardId2).removeClass('opened');
  openCardId1 = '';
  openCardId2 = '';
}
export default {
  methods: {
    gameStart: function(){
      if(gameState === ''){
        setGame();
      }
      else if(gameState === 'playing'){
        alert("게임을 재시작합니다.");
        gameState = '';
        document.getElementById("gameStart").innerHTML = '게임시작';
        setGame();
      }
    },
  },
};
</script>

<style scoped>
#same_pic{
    display: inline-block;
    width: 80%;
    height: auto;
    margin-top: 25px;
}
#info{
    margin-top: 15px;
    margin-bottom: 15px;
}
button {
    padding: 10px 20px;
    margin-right: 40px;
    margin-bottom: 10px;
}
#count {
    width: 474px;
    margin: auto;
    padding: 10px 0;
    font-size: 20px;
    font-weight: bold;
}
#cardTable {
    width: 474px;
    height: 474px;
    margin: auto;
    margin-bottom: 40px;
    border-collapse: collapse;
}
#cardTable td{
    border: solid #9DCEFF;
}
</style>