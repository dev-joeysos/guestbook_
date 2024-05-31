import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://lionguestbook.kro.kr:8000'; 

  const form = document.getElementById('guestbook-form');
  const entriesList = document.getElementById('entries');
  // GET
  const loadEntries = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });
      console.log('fetch 성공, JSON 파싱');
      const entries = await response.json();
      console.log('JSON 파싱 성공', entries);
      
      entriesList.innerHTML = '';

      const reversedEntries = entries.reverse();
      console.log('역순 목록:', reversedEntries);

      reversedEntries.forEach((entry) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <h3>${entry.title}</h3>
          <p>${entry.content}</p>
          <p>By: ${entry.writer}</p>
          <p>${formatDate(entry.created_at)}</p>
          <button onclick="deleteEntry(${entry.id})">삭제</button>
        `;
        entriesList.appendChild(li);
        console.log('Entry added to the list:', entry); 
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch entries_out.');
    }
  };
  loadEntries();

  // POST 
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const writer = document.getElementById('writer').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, writer, password }),
      });
      if (response.ok) {
        loadEntries();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to post entry');
    }
  });

  window.deleteEntry = async (id) => {
    const password = prompt('비밀번호를 입력하세요');

    if (!password) {
      alert('올바른 비밀번호를 입력하세요');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.status === 204) {
        alert('게시글이 정상적으로 삭제되었습니다.');
        loadEntries();
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Failed to delete entry');
        return;
      }

      alert(result.deleted);
      loadEntries();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete entry. Please check the password.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}${month}${day} ${hours}:${minutes}`;
  };
});
