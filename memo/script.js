document.addEventListener('DOMContentLoaded', () => {
  const memoList = document.getElementById('memoList');
  const memoTitle = document.getElementById('memoTitle');
  const memoContent = document.getElementById('memoContent');
  const saveMemoButton = document.getElementById('saveMemoButton');
  const addMemoButton = document.getElementById('addMemoButton');
  const deleteSelectedButton = document.getElementById('deleteSelectedButton');
  
  let memos = JSON.parse(localStorage.getItem('memos')) || [];
  let currentMemoIndex = null;
  let isEditing = false;
  let initialTitle = '';
  let initialContent = '';
  
  const renderMemoList = () => {
    memoList.innerHTML = '';
    let hasChecked = false;

    memos.forEach((memo, index) => {
      const li = document.createElement('li');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = memo.checked || false;
      checkbox.addEventListener('change',(e) => {
        e.stopPropagation();
        memo.checked = checkbox.checked;
        localStorage.setItem('memos', JSON.stringify(memos));
        renderMemoList();
      });

      const title = document.createElement('span');
      title.textContent = memo.title || '無題のメモ';
      title.addEventListener('click', () => {
        if (currentMemoIndex === index) return;
        if (isEditing && hasUnsavedChanges()) {
          if (!confirm('編集中のメモは保存されていません。破棄してもよろしいですか？')) {
            return;
        }
      }
        loadMemoForEditing(index);
      });

      li.appendChild(checkbox);
      li.appendChild(title);
      memoList.appendChild(li);

      if (memo.checked) hasChecked = true;
    });
    deleteSelectedButton.disabled = !hasChecked;
  };
  
  const saveMemo = () => {
    const title = memoTitle.value.trim() || '無題のメモ';
    const content = memoContent.value.trim();
  
    if (content.length > 1000) {
      alert('本文は1000文字以内にしてください。');
      return;
    }

    const memo = { title, content, checked: false };

    if (currentMemoIndex === null) {
      memos.push(memo);
    } else {
      memos[currentMemoIndex] = { ...memos[ currentMemoIndex], ...memo };
    }
  
    localStorage.setItem('memos', JSON.stringify(memos));
    renderMemoList();
    resetMemoEditor();
    alert('メモを保存しました。');
    isEditing = false;
  };

  const loadMemoForEditing = (index) => {
    currentMemoIndex = index;
    const memo = memos[index];
    memoTitle.value = memo.title;
    memoContent.value = memo.content;
    initialTitle = memo.title;
    initialContent = memo.content;
    isEditing = true;
  };
  
  const deleteSelectedMemos = () => {
    memos = memos.filter((memo) => !memo.checked);
    localStorage.setItem('memos', JSON.stringify(memos));
    renderMemoList();
    alert('選択したメモを削除しました。');
  };

  const resetMemoEditor = () => {
    currentMemoIndex = null;
    memoTitle.value = '';
    memoContent.value = '';
    initialTitle = '';
    initialContent = '';
    isEditing = false;
  };

  const hasUnsavedChanges = () => {
    return initialTitle !== memoTitle.value || initialContent !== memoContent.value;
  }

  addMemoButton.addEventListener('click', () => {
    if (isEditing && hasUnsavedChanges()) {
      if (!confirm('編集中のメモは保存されていません。破棄してもよろしいですか？')){
        return;
      }
    }
    resetMemoEditor();
  });
  

  saveMemoButton.addEventListener('click', saveMemo);
  deleteSelectedButton.addEventListener('click', deleteSelectedMemos);

  renderMemoList();
});