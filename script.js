
//変数定義
const textBox = document.getElementById('text');
const save = document.getElementById('click');
const contenerBox = document.getElementById('container');
const filterBox = document.getElementById('hit');
const searchBtn = document.getElementById('search');
const showAllBtn = document.getElementById('show-all');
const clearAllBtn = document.getElementById('clear-all');
const categorySelect = document.getElementById('cate');
const categorySelect2 = document.getElementById('cate2');
const selectBox = document.getElementById('dateSort');
const selectParts = document.querySelectorAll('dateSort option');

let textArr = [];
let cnt = 0;
let clickFlg = false;
let date2 = '';
let inputWord = '';
let selWord = '';
let categoryText = '';
let upClick = false;
let readFlg = false;
let cntFlg = false;
let favoriteFlg = false;
let strLength = 0;
let shortStr = '';
let strArr = [];
let ti = '';

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
  inputWord = filterBox.value.trim();
  //プルダウンの値を取得
  selWord = categorySelect.value;
  console.log(selWord);
  console.log(textArr);

  const resultObjects = textArr.filter(item =>{
  //入力欄の検索
  const textMatch = item.text.includes(inputWord);
  console.log(textMatch);

  const categoryMatch = (selWord === '' || item.category === selWord);
    return textMatch && categoryMatch;
  });

  //配列内を検索する
  //filter->検索した値を配列のオブジェクトで返す
  //map->返されたオブジェクトをtextのキーのみの配列に直す
  const result = resultObjects.map(item => item.text);
  console.log(result);
  textOpen(resultObjects);

  //検索クリア
  filterBox.value = '';
 }

//全件表示ボタン
showAllBtn.addEventListener('click', showAllData, false);
//全件表示ボタン押下
function showAllData(){
  textOpen(textArr);
  //検索クリア
  filterBox.value = '';
}

//全件クリアボタン
clearAllBtn.addEventListener('click', clearAllData, false);
//全件クリアボタン押下
function clearAllData(){
  if(!confirm('全件削除しますか？')){
    return;
  }
  console.log('本当に削除するの？');
  localStorage.clear();
  textOpen();
  //検索クリア
  filterBox.value = '';
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
  textOpen(textArr);
}

//ローカルストレージ
function saveStorage(){
  const inputText = textBox.value;
  const selWord = categorySelect2.value;
  const storedData = localStorage.getItem('snippets');
  let jsonArr = storedData ? JSON.parse(storedData) : [];
  const now = Date.now();
  console.log(textArr);
  //ローカルに登録
  const newsnippets = {
    text: inputText,
    created: now,
    updated: now,
    category: selWord,
    flg: false
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
function textOpen(arr){
  contenerBox.innerHTML = '';
  //console.log(selWord);
  j = 1;
  for(let i=0; i<arr.length; i++){
   const snippet = arr[i];
   const selWord = snippet.category;

   //リセット
   shortStr = '';
   strLength = 0;

   strLength = snippet.text.length;
   console.log(i + '番目:' + strLength);

   let listBox = document.createElement('div');
   listBox.classList.add('box','middleB');
   const strElement =  document.createElement('div');
   strElement.classList.add('spaceS', 'snippet-content','main-text');

  const favoMark = document.createElement('span');
  //お気に入りの表示
  if (snippet.flg) {
    favoMark.classList.add('pinBtnSize');
    favoMark.textContent = "🌟";
  } else {
    favoMark.textContent = "";
  }

  //要素表示可能にするための変更
  const numSpan = document.createElement('span');
  numSpan.id = 'nm';
  numSpan.textContent = (i+1) + ':';

  //テキスト
  const textSpan = document.createElement('span');
  textSpan.className = 'main-text';

  //全角15文字より多い場合は「…」で表示する
  if (strLength > 15){
    shortStr = snippet.text.substr(0, 13) + '…';
    textSpan.textContent = shortStr;
    console.log(i + ':' + textSpan.textContent);
  } else if (strLength >= 1){
    textSpan.textContent = snippet.text;
  } else {
    shortStr = '';
  }
  //文字用の配列を追加
  strArr.splice(i, 1, shortStr);
  console.log('配列の再配列: ' + strArr[i]);
  console.log('再配列後の配列は: ' + strArr);

  if (snippet.flg){
    strElement.appendChild(favoMark);
  } else {
    favoMark.remove();
  }
  strElement.appendChild(numSpan);
  strElement.appendChild(textSpan);

  //カテゴリー表示
  const categoryElement = document.createElement('span');
  switch (selWord) {
    case 'work':
     categoryText = 'お仕事';
     break;
    case 'hoby':
     categoryText = '趣味';
     break;
    case 'study':
     categoryText = '学び';
     break;
    case 'coding':
     categoryText = 'コーディング';
     break;
    case '':
     categoryText = 'なし';
     break;
  }
  categoryElement.textContent = '分類:' + categoryText;

  //日付表示
   const dateText =  document.createElement('div');
   dateText.classList.add('dateS');

  //登録日時の整形
  const createdTime = new Date(snippet.created);
  const createdStr = `${createdTime.getFullYear()}年${createdTime.getMonth() + 1}月${createdTime.getDate()}日`;
  let dateOutput = `登録:${createdStr}`;

  if (snippet.updated && snippet.updated !== snippet.created){
    const updatedTime = new Date(snippet.updated);
  const updatedStr = `${updatedTime.getFullYear()}年${updatedTime.getMonth() + 1}月${updatedTime.getDate()}日`
    dateOutput += ` | 更新 :${updatedStr}`;
  }

  dateText.textContent = dateOutput;

  let favoriteBtn = document.createElement('button');
favoriteBtn.classList.add('btnSize','pinBtnSize');
  favoriteBtn.textContent = "🌟:お気に入り";

  let copyBtn = document.createElement('button');
copyBtn.classList.add('btnSize','copyBtnSize');
  copyBtn.textContent = "コピー";

  let deleteBtn = document.createElement('button');
  deleteBtn.classList.add('btnSize');
  deleteBtn.textContent = "削除";

  let updateBtn = document.createElement('button');
  updateBtn.classList.add('btnSize');
  updateBtn.textContent = "編集";

  let longStr = document.createElement('button');
  longStr.classList.add('longBtn');
  longStr.textContent = "詳細を表示する";

   //詳細ボタンイベント
    longStr.addEventListener('click', function () {
      strElement.classList.toggle('is-open');
      const upArea = document.getElementById('up');

      if (upClick && upArea) {
        if (strElement.classList.contains('is-open')) {
          upArea.classList.add('is-text-open');
          longStr.textContent = '▲▲ 編集エリアを閉じる';
        } else {
          upArea.classList.remove('is-text-open');
          longStr.textContent = '▼ 編集エリアを表示';
        }
      } else {
        const inputText = snippet.text;
        strElement.innerHTML = '';
        const newNum = document.createElement('span');
        newNum.id = 'nm';
        newNum.textContent = (i+1) + ': ';
        strElement.appendChild(newNum);

        if (strElement.classList.contains('is-open')) {

        const p = document.createElement('p');
        p.id = 'up2';
        p.className = 'inputOpen';
        p.textContent = inputText;
        strElement.appendChild(p);
        p.style.fontSize = "20px";
          strElement.style.display = "flex";
          longStr.innerHTML = '▲▲ 詳細を閉じる';
        } else {

        //全角15文字より多い場合の表示
         if (snippet.text.length > 15){
          ti = snippet.text.substr(0, 13) + '…';
     console.log('表示されたのは' + ti);
         } else {
          ti = inputText;
          console.log('セットするのは' + ti);
         }
        const t = document.createTextNode(ti);
        strElement.appendChild(t);
        strElement.style.fontSize = "20px";
        longStr.textContent = '▼ 詳細を表示';
        }
       }
  });

   // ボタンをまとめるコンテナを作成
   let btnGroup = document.createElement('div');
   btnGroup.classList.add('btnGroup');

   listBox.appendChild(strElement);
   listBox.appendChild(longStr);
   listBox.appendChild(favoriteBtn);
   listBox.appendChild(copyBtn);
   listBox.appendChild(deleteBtn);
   listBox.appendChild(updateBtn);
   //ボタンまとめ用のコンテナ、今はやらない
   listBox.appendChild(btnGroup);

   listBox.appendChild(categoryElement);
   listBox.appendChild(dateText);
   contenerBox.appendChild(listBox);

   //お気に入り機能
   favoriteBtn.addEventListener('click', function (){
     console.log('お気に入りボタン押下！');
     console.log('元々のフラグが ' + snippet.flg + ' 、' + '押したら' + cntFlg + ' になった！');
     if (snippet.flg === cntFlg){
       if (cntFlg) {
         cntFlg = false;
       } else {
         cntFlg = true;
       }
     }
     favoAdd(i, cntFlg);
   });

   //コピペボタン
   copyBtn.addEventListener('click', function(){
    //コピペボタン押下
      console.log('コピペボタン押下！');
      const inputText = snippet.text;
      copyClick(i, inputText, copyBtn);
      console.log(inputText);
    }
   );
   //削除ボタンイベント
   deleteBtn.addEventListener('click', function (){
     deleteClick(i);
   });
  //編集ボタンイベント
   updateBtn.addEventListener('click', function (){
    if (updateBtn.textContent === '編集'){
     const inputText = snippet.text;
     updateBtn.textContent = "更新";
     upClick = true;

      strElement.innerHTML = '';
      const n = document.createElement('span');
      n.id = 'nm';
      n.textContent = (i+1) + ': ';
      strElement.appendChild(n);

      const tea = document.createElement('textarea');
      tea.id = 'up';
      tea.className = 'inputOpen';
      tea.value = snippet.text;
      strElement.appendChild(tea);

   if (strElement.classList.contains('is-open')){
     tea.classList.add('is-text-open');
     longStr.textContent = '▲▲ 編集エリアを閉じる';
   } else {
      tea.classList.remove('is-text-open');
      longStr.textContent = '▼ 編集エリアを表示';
   }
     //キャンセルボタン追加
     let cancelBtn = document.createElement('button');
     cancelBtn.classList.add('cancelBtn');
     cancelBtn.textContent = "キャンセル";
     updateBtn.after(cancelBtn);
     //キャンセルボタン押下
     cancelBtn.addEventListener('click', function(){
       updateBtn.textContent = "編集";
       upClick = false;
       textOpen(textArr);
          });
    } else {
     //編集後に更新
      const upArea = document.getElementById('up');
      if (upArea) {
        updateClick(i, upArea.value);
        console.log('更新するよ！');
        upClick = false;
       }
    }
   });
   j++;
  }
}

//お気に入り追加
function favoAdd(index, flg){
  console.log('フラグは ' + flg + ' !');
  const oldSnippet = textArr[index];
  const updatesnippets = {
          text: oldSnippet.text,
          created: oldSnippet.created,
          updated: oldSnippet.updated,
          category: oldSnippet.category,
          flg: flg
  };

  //お気に入り追加後
  textArr.splice(index, 1, updatesnippets);

  //お気に入り並び替え
  const sortedArr = textArr.sort((a, b) => {
    if (a.flg === b.flg){
      return b.created - a.created;
    }
    return a.flg ? -1 : 1;
  });

  localStorage.setItem('snippets', JSON.stringify(textArr));
  console.log('お気に入りを追加するよ！');
  textOpen(textArr);
  //console.log(textArr);
}

//コピペ
function copyClick(index, text, element){
  console.log(index, text);
  const btnText = element.textContent;
  console.log('ボタンは' + btnText);
  navigator.clipboard.writeText(text).then(success, faild);
  function success(){
    console.log('コピー完了！');
    element.style.backgroundColor = "#4CAF50";
    element.textContent = '完了！';
    setTimeout(() => {
      element.style.backgroundColor = "";
      element.textContent = btnText;
    }, 1500);
  }
  function faild(){
    console.log('コピー失敗、、、');
    alert('コピー失敗！');
  }
}

//削除機能
function deleteClick(index){
  textArr.splice(index, 1);
  localStorage.setItem('snippets', JSON.stringify(textArr));
  console.log('削除したよ！');
  textOpen(textArr);
}

//編集機能で配列を更新
function updateClick(index, text){
  const oldSnippet = textArr[index];
  const updatesnippets = {
    text: text,
    created: oldSnippet.created,
    updated: Date.now(),
    category: oldSnippet.category,
    flg: oldSnippet.flg
  };

  //編集完了後
  textArr.splice(index, 1, updatesnippets);
  localStorage.setItem('snippets', JSON.stringify(textArr));
  console.log('編集するよ！');
  textOpen(textArr);
}

//登録日付で並び替え
selectBox.addEventListener('change', dateSortChange, false);
function dateSortChange(e){
   console.log('changeイベント発動！');
   const selectValue = selectBox.value;
   console.log('選択肢は' + selectValue);

   if (selectValue === 'asc'){
   console.log('ここからは昇順');
   //登録日付で並べ替え
  let sortAsc = textArr.sort((a,b) => (a.created < b.created ? -1 : 1));
   console.log('並べ替えた結果' + sortAsc[1].text);
   } else if (selectValue === 'desc') {
   console.log('ここからは降順');
  let sortAsc = textArr.sort((a,b) => (a.created > b.created ? -1 : 1));
   console.log('並べ替えた結果' + sortAsc[1].text);
   //更新日付で並べ替え
   } else if (selectValue === 'asc-u') {
   console.log('ここからは更新昇順');
   let sortAsc = textArr.sort((a,b) => (a.updated < b.updated ? -1 : 1));
   console.log('並べ替えた結果' + sortAsc[1].text);
   } else if (selectValue === 'desc-u') {
   console.log('ここからは更新降順');
   let sortAsc = textArr.sort((a,b) => (a.updated > b.updated ? -1 : 1));
   console.log('並べ替えた結果' + sortAsc[1].text);
   } else if(selectValue === 'asc-f') {
   console.log('ここからはお気に入り順');
   let sortAsc = textArr.sort((a,b) => {
    if (a.flg !== b.flg){
      return a.flg ? -1 : 1;
    } else if (a.flg === b.flg) {
      return a.created > b.created ? -1 : 1;
    }
   });
   console.log('並べ替えた結果' + sortAsc[1].text);
   } else {
     return;
   }
   localStorage.setItem('snippets', JSON.stringify(textArr));
   const result = textArr.map(item => item.text);
   textOpen(textArr);
}

init(textArr);
strArr = [];
//localStorage.clear();

//PCのレイアウト追加←これはあとでもおっけ
