//変数定義
const textBox = document.getElementById('text');
const save = document.getElementById('click');
const contenerBox = document.getElementById('container');
const filterBox = document.getElementById('hit');
const searchBtn = document.getElementById('search');

let textArr = [];
let cnt = 0;
let clickFlg = false;
let date2 = '';
let inputWord = '';

//初期化
function init(){
  const storedData = localStorage.getItem('snippets');
  textArr = storedData ? JSON.parse(storedData) : [];
  textOpen(textArr);
}

//検索ボタン
searchBtn.addEventListener('click', wordSeach, false);
//検索ボタン押下
function wordSeach(e) {
  //ページリロード中止
  event.preventDefault();
  inputWord = filterBox.value;
  //配列内を検索する
  //filter->検索した値を配列のオブジェクトで返す
  //map->返されたオブジェクトをtextのキーのみの配列に直す
  const resultObjects = textArr.filter(item => item.text.includes(inputWord));
  console.log(resultObjects);
  const result = resultObjects.map(item => item.text);
  console.log(result);
  alert('一致するのは' + result + 'です。');
 }

//保存ボタン
save.addEventListener('click', saveClick, false);
//保存ボタン押下
function saveClick(){
  if (textBox.value.trim() ===
''){
  return;
  }
  saveStorage();
  contenerBox.innerHTML = '';
  textOpen();
}

//ローカルストレージ
function saveStorage(){
  const inputText = textBox.value;
  const storedData = localStorage.getItem('snippets');
  let jsonArr = storedData ? JSON.parse(storedData) : [];
  const now = Date.now();
  const newsnippets = {
    text: inputText,
    created: now,
    updated: now
  };

  console.log('inputの値' + inputText);
  console.log('配列' + typeof jsonArr);
  jsonArr.push(newsnippets);
  console.log(newsnippets);

  localStorage.setItem('snippets', JSON.stringify(jsonArr));

  //入力欄クリア
  textBox.value = '';

  textArr = jsonArr;
}

//保存したテキストを表示
function textOpen(){
  contenerBox.innerHTML = '';
  j = 1;
  for(let i=0; i<textArr.length; i++){
   const snippet = textArr[i];

   let listBox = document.createElement('div');
   listBox.classList.add('box');
   const strElement =  document.createElement('div');
   strElement.innerHTML = '<span id="nm">' + j + ': </span>'+ snippet.text;
   strElement.classList.add('list', 'spaceS');

  //日付表示
   const dateText =  document.createElement('div');

  //登録日時の整形
  const createdTime = new Date(snippet.created);
  const createdStr = `${createdTime.getFullYear()}年${createdTime.getMonth()}月${createdTime.getDate()}日`;
  let dateOutput = `登録:${createdStr}`;

  if (snippet.updated && snippet.updated !== snippet.created){
    const updatedTime = new Date(snippet.updated);
  const updatedStr = `${updatedTime.getFullYear()}年${updatedTime.getMonth()}月${updatedTime.getDate()}日`
    dateOutput += ` | 更新 :${updatedStr}`;
  }

  dateText.textContent = dateOutput;

  let deleteBtn = document.createElement('button');
  deleteBtn.classList.add('box', 'btnSize');
  deleteBtn.textContent = "削除";

  let updateBtn = document.createElement('button');
  updateBtn.classList.add('box', 'btnSize');
  updateBtn.textContent = "編集";

   listBox.appendChild(strElement);
   listBox.appendChild(deleteBtn);
   listBox.appendChild(updateBtn);
   listBox.appendChild(dateText);
   contenerBox.appendChild(listBox);

   //削除ボタンイベント
   deleteBtn.addEventListener('click', function (){
     deleteClick(i);
   });
  //編集ボタンイベント
   updateBtn.addEventListener('click', function (){
    //編集
    if (updateBtn.textContent === '編集'){
     const inputText = snippet.text;
     console.log(inputText);
     updateBtn.textContent = "更新";
     clickFlg = true;
     console.log(inputText);
     strElement.textContent = '';
     let before = j-1;
     console.log(before);
     strElement.innerHTML = `${before}<input type="text" id="up" value="${inputText}"></input>`;
    } else {
     //編集後に更新
     const inputText = document.getElementById('up').value;
     console.log(inputText);
     strElement.innerHTML = '';
     strElement.textContent = inputText;
     updateClick(i, inputText);
     console.log('更新するよ！');
     clickFlg = false;
    }
   });
   j++;
  }
}

//削除機能
function deleteClick(index){
  textArr.splice(index, 1);
  localStorage.setItem('snippets', JSON.stringify(textArr));
  console.log('削除したよ！');
  textOpen();
}

//編集機能で配列を更新
function updateClick(index, text){
  const oldSnippet = textArr[index];
  const updatesnippets = {
    text: text,
    created: oldSnippet.created,
    updated: Date.now()
  };

  //編集完了後
  textArr.splice(index, 1, updatesnippets);
  localStorage.setItem('snippets', JSON.stringify(textArr));
  console.log('編集するよ！');
  textOpen();
}

init();

//検索
//カテゴリー分け
