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
//let cnt = 0;

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
    category: selWord
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

   let listBox = document.createElement('div');
   listBox.classList.add('box','middleB');
   const strElement =  document.createElement('div');
   strElement.innerHTML = '<span id="nm">' + j + ': </span>'+ snippet.text;
   strElement.classList.add('spaceS', 'snippet-content');

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
    case '':
     categoryText = 'なし';
     break;
  }
  categoryElement.textContent = '分類:' + categoryText;
   //console.log(selWord.value);

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
        // upArea.classList.toggle('is-text-open');
        if (strElement.classList.contains('is-open')) {
          upArea.classList.add('is-text-open');
          longStr.textContent = '▲▲ 編集エリアを閉じる';
        } else {
          upArea.classList.remove('is-text-open');
          longStr.textContent = '▼ 編集エリアを表示';
        }
      } else {
        const inputText = snippet.text;
        if (strElement.classList.contains('is-open')) {
          strElement.innerHTML = `<span id="nm">${j}: </span><p id='up2' class='inputOpen'>${inputText}</p>`;
          longStr.innerHTML = '▲▲ 詳細を閉じる';
        } else {
          strElement.innerHTML = `<span id="nm">${j}: </span>${inputText}`;
          longStr.textContent = '▼ 詳細を表示';
        }
       }
  //   console.log('詳細ボタン押下！');
  //   const inputText = snippet.text;
  //   console.log(inputText);
  //   strElement.classList.toggle('is-open');
  //   const upArea = document.getElementById('up');
  //   console.log(updateBtn.textContent);

  // if (upClick && upArea){
  //     upArea.classList.toggle('is-text-open');
  //     console.log('更新エリアはあるよ！');
  //    if (upArea.classList.contains('is-text-open')){
  //     //入力欄
  //     strElement.innerHTML = `${i+1}:<textarea id='up' class='inputOpen'>${inputText}</textarea>`;
  //     longStr.textContent = '▲▲ 編集エリアを閉じる';
  //    } else {
  //     strElement.innerHTML = `${i+1}:<input type="text" class="inputOpen" value="${inputText}"></input>`;
  //     longStr.textContent = '▼ 編集エリアを表示';
  //     console.log(strElement.className);
  //    }
  //   } else {
  //     console.log('更新エリアはないよ！');
  //    const inputText = snippet.text;
  //    if (strElement.classList.contains('is-open')){
  //     //入力欄
  //     strElement.innerHTML = `${i+1}:<p id='up2' class='inputOpen'>${inputText}</p>`;
  //     longStr.textContent = '▲▲ 詳細を閉じる';
  //    } else {
  //     strElement.classList.add('inputOpen');
  //     strElement.innerHTML = `${i+1}:${inputText}`;
  //     longStr.textContent = '▼ 詳細を表示';
  //    }
  //     //upClick == false;
  //     readFlg == true;
  });

   listBox.appendChild(strElement);
   listBox.appendChild(longStr);
   listBox.appendChild(copyBtn);
   listBox.appendChild(deleteBtn);
   listBox.appendChild(updateBtn);
   listBox.appendChild(categoryElement);
   listBox.appendChild(dateText);
   contenerBox.appendChild(listBox);

   //コピペボタン
   copyBtn.addEventListener('click', function(){
    //コピペボタン押下
      console.log('コピペボタン押下！');
      const inputText = snippet.text;
      copyClick(i, inputText);
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

      strElement.innerHTML = `<span id="nm">${j}: </span><textarea id='up' class='inputOpen'>${inputText}</textarea>`;
      const upArea = document.getElementById('up');
   if (strElement.classList.contains('is-open')){
     upArea.classList.add('is-text-open');
     longStr.textContent = '▲▲ 編集エリアを閉じる';
   } else {
      upArea.classList.remove('is-text-open');
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

  //    const inputText = snippet.text;
  //    console.log(inputText);
  //    updateBtn.textContent = "更新";
  //    clickFlg = true;
  //    upClick = true;
  //    strElement.innerHTML = `${i+1}:<textarea id='up' class='inputOpen'>${inputText}</textarea>`;
  //    const upArea = document.getElementById('up');
  //  if (strElement.classList.contains('is-open')){
  //    upArea.classList.add('is-text-open');
  //    longStr.textContent = '▲▲ 編集エリアを閉じる';
  //  } else {
  //     longStr.textContent = '▼ 編集エリアを表示';
  //  }
  //    console.log(inputText);
  //    let before = j-1;
  //    console.log(before);
  //    //キャンセルボタン追加
  //    let cancelBtn = document.createElement('button');
  //    cancelBtn.classList.add('cancelBtn');
  //    cancelBtn.textContent = "キャンセル";
  //    updateBtn.after(cancelBtn);
  //    //キャンセルボタン押下
  //    cancelBtn.addEventListener('click', function(){
  //      updateBtn.textContent = "編集";
  //      textOpen(textArr);
  //         });
  //   } else {
  //    //編集後に更新
  //    const inputText = document.getElementById('up').value;
  //    updateClick(i, inputText);
  //    console.log('更新するよ！');
  //    clickFlg = false;
  //   }
   });
   j++;
  }
}

//コピペ
function copyClick(index, text){
  console.log(index, text);
   navigator.clipboard.writeText(text).then(success, faild);
  function success(){
    console.log('コピー完了！');
    alert('「' + text + '」 をコピーしました！');
  }
  function faild(){
    console.log('コピー失敗、、、');
    alert('コピー失敗！');
  }
}

//詳細表示ボタン

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
    category: oldSnippet.category
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
   } else {
     return;
   }
   localStorage.setItem('snippets', JSON.stringify(textArr));
   const result = textArr.map(item => item.text);
   textOpen(textArr);
}

init(textArr);
//localStorage.clear();
//詳細ボタン押下した状態での更新
//詳細ボタンのみ押した場合→伸びるだけ
//編集→詳細はテキストエリアが伸びる
//詳細→編集はテキストエリアになる
//並び替え見た目
//分類にコーディングを追加
//長文の対応(レイアウトの変更)
