document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!/^07[0-9]{8}$/.test(phone)) {
    alert('شماره تلفن نامعتبر است! لطفاً شماره‌ای مانند 07XXXXXXXX وارد کنید.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const exists = users.find(u => u.phone === phone);
  if (exists) {
    alert('این شماره قبلاً ثبت شده.');
    return;
  }

  users.push({ username, phone });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify({ username, phone }));

  alert('ثبت‌نام موفق بود!');
  window.location.href = 'index.html';
});
document.getElementById('postForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const reader = new FileReader();
  const file = document.getElementById('image').files[0];

  if (!file) {
    alert('لطفاً عکس انتخاب کنید.');
    return;
  }

  reader.onload = function () {
    const imageUrl = reader.result;
    const ad = {
      title: document.getElementById('title').value.trim(),
      description: document.getElementById('description').value.trim(),
      price: document.getElementById('price').value.trim(),
      category: document.getElementById('category').value,
      location: document.getElementById('location').value.trim(),
      image: imageUrl,
      user: JSON.parse(localStorage.getItem('currentUser') || '{}'),
      date: new Date().toLocaleString()
    };

    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    ads.push(ad);
    localStorage.setItem('ads', JSON.stringify(ads));

    alert('آگهی با موفقیت ثبت شد!');
    window.location.href = 'index.html';
  };

  reader.readAsDataURL(file);
});
const adsContainer = document.getElementById('ads');
const ads = JSON.parse(localStorage.getItem('ads') || '[]');

if (ads.length === 0) {
  adsContainer.innerHTML = '<p>هیچ آگهی‌ای ثبت نشده است.</p>';
} else {
  ads.reverse().forEach(ad => {
    const card = document.createElement('div');
    card.style.border = '1px solid #ccc';
    card.style.padding = '10px';
    card.style.marginBottom = '15px';
    card.style.borderRadius = '5px';
    card.style.backgroundColor = '#fff';

    card.innerHTML = `
      <img src="${ad.image}" alt="عکس" style="width:100%; max-height:200px; object-fit:cover;">
      <h3>${ad.title}</h3>
      <p><strong>قیمت:</strong> ${ad.price} افغانی</p>
      <p><strong>موقعیت:</strong> ${ad.location}</p>
      <p><strong>دسته:</strong> ${ad.category}</p>
      <p><strong>توضیحات:</strong> ${ad.description}</p>
      <p><strong>تاریخ:</strong> ${ad.date}</p>
      <button onclick="messageUser('${ad.user.phone}', '${ad.title}')">پیام به فروشنده</button>
    `;

    adsContainer.appendChild(card);
  });
}

function messageUser(phone, item) {
  alert(`برای تماس با فروشنده درباره‌ی "${item}" با شماره ${phone} پیام بفرستید.`);
}
const adsContainer = document.getElementById('ads');
const searchBox = document.getElementById('searchBox');
const categoryItems = document.querySelectorAll('#categories li');
let ads = JSON.parse(localStorage.getItem('ads') || '[]');
ads = ads.reverse(); // نمایش آگهی‌های جدیدتر بالا

function displayAds(filteredAds) {
  adsContainer.innerHTML = '';

  if (filteredAds.length === 0) {
    adsContainer.innerHTML = '<p>هیچ آگهی‌ای یافت نشد.</p>';
    return;
  }

  filteredAds.forEach(ad => {
    const card = document.createElement('div');
    card.style.border = '1px solid #ccc';
    card.style.padding = '10px';
    card.style.marginBottom = '15px';
    card.style.borderRadius = '5px';
    card.style.backgroundColor = '#fff';

    card.innerHTML = `
      <img src="${ad.image}" alt="عکس" style="width:100%; max-height:200px; object-fit:cover;">
      <h3>${ad.title}</h3>
      <p><strong>قیمت:</strong> ${ad.price} افغانی</p>
      <p><strong>موقعیت:</strong> ${ad.location}</p>
      <p><strong>دسته:</strong> ${ad.category}</p>
      <p><strong>توضیحات:</strong> ${ad.description}</p>
      <p><strong>تاریخ:</strong> ${ad.date}</p>
      <button onclick="messageUser('${ad.user.phone}', '${ad.title}')">پیام به فروشنده</button>
    `;

    adsContainer.appendChild(card);
  });
}

‎// جستجو
searchBox.addEventListener('input', () => {
  const keyword = searchBox.value.trim().toLowerCase();
  const filtered = ads.filter(ad => ad.title.toLowerCase().includes(keyword));
  displayAds(filtered);
});

‎// فیلتر دسته‌بندی
categoryItems.forEach(item => {
  item.addEventListener('click', () => {
    const selected = item.getAttribute('data-cat');
    let filtered = ads;

    if (selected !== 'همه') {
      filtered = ads.filter(ad => ad.category === selected);
    }

    displayAds(filtered);
  });
});

displayAds(ads);

function messageUser(phone, item) {
  alert(`برای تماس با فروشنده درباره‌ی "${item}" با شماره ${phone} پیام بفرستید.`);
}
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
const recipient = JSON.parse(localStorage.getItem('chatUser') || '{}'); // گیرنده پیام
const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');

let chats = JSON.parse(localStorage.getItem('chats') || '[]');

‎// نمایش پیام‌ها بین دو نفر
function loadMessages() {
  chatBox.innerHTML = '';

  const filtered = chats.filter(msg =>
    (msg.sender.phone === currentUser.phone && msg.receiver.phone === recipient.phone) ||
    (msg.sender.phone === recipient.phone && msg.receiver.phone === currentUser.phone)
  );

  filtered.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + (msg.sender.phone === currentUser.phone ? 'sent' : 'received');
    msgDiv.innerHTML = `<p>${msg.text}</p><small>${msg.time}</small>`;
    chatBox.appendChild(msgDiv);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', e => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (text === '') return;

  const newMsg = {
    sender: currentUser,
    receiver: recipient,
    text: text,
    time: new Date().toLocaleString()
  };

  chats.push(newMsg);
  localStorage.setItem('chats', JSON.stringify(chats));
  messageInput.value = '';
  loadMessages();
});

loadMessages();
function messageUser(phone, item) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const seller = users.find(u => u.phone === phone);

  if (!seller) {
    alert('فروشنده پیدا نشد!');
    return;
  }

  localStorage.setItem('chatUser', JSON.stringify(seller));
  window.location.href = 'chat.html';
}
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.phone === phone && u.password === password);

  if (!user) {
    alert('شماره یا رمز اشتباه است.');
    return;
  }

  localStorage.setItem('currentUser', JSON.stringify(user));
  alert('خوش آمدید!');
  window.location.href = 'index.html';
});
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
if (!currentUser.phone) {
  window.location.href = 'login.html';
}

const allAds = JSON.parse(localStorage.getItem('ads') || '[]');
const myAds = allAds.filter(ad => ad.user.phone === currentUser.phone);
const container = document.getElementById('myAds');

if (myAds.length === 0) {
  container.innerHTML = '<p>شما هنوز هیچ آگهی‌ای ثبت نکرده‌اید.</p>';
} else {
  myAds.forEach((ad, index) => {
    const card = document.createElement('div');
    card.className = 'ad-card';
    card.innerHTML = `
      <img src="${ad.image}" alt="عکس آگهی">
      <h3>${ad.title}</h3>
      <p>قیمت: ${ad.price} افغانی</p>
      <p>دسته: ${ad.category}</p>
      <button onclick="deleteAd(${index})">حذف</button>
    `;
    container.appendChild(card);
  });
}

function deleteAd(myIndex) {
  if (confirm('آیا مطمئن هستید که می‌خواهید این آگهی را حذف کنید؟')) {
    const all = JSON.parse(localStorage.getItem('ads') || '[]');
    const updated = all.filter(ad => ad.user.phone !== currentUser.phone || ad.title !== myAds[myIndex].title);
    localStorage.setItem('ads', JSON.stringify(updated));
    alert('آگهی حذف شد!');
    location.reload();
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}
let editIndex = -1;

function editAd(index) {
  editIndex = index;
  const ad = myAds[index];

  document.getElementById('editTitle').value = ad.title;
  document.getElementById('editPrice').value = ad.price;
  document.getElementById('editLocation').value = ad.location;
  document.getElementById('editImage').value = ad.image;
  document.getElementById('editDescription').value = ad.description;
  document.getElementById('editCategory').value = ad.category;

  document.getElementById('editFormContainer').style.display = 'block';
}

document.getElementById('editAdForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const allAds = JSON.parse(localStorage.getItem('ads') || '[]');
  const updatedAd = {
    ...myAds[editIndex],
    title: document.getElementById('editTitle').value,
    price: document.getElementById('editPrice').value,
    location: document.getElementById('editLocation').value,
    image: document.getElementById('editImage').value,
    description: document.getElementById('editDescription').value,
    category: document.getElementById('editCategory').value,
    date: new Date().toLocaleString()
  };

  const adIndex = allAds.findIndex(ad =>
    ad.user.phone === currentUser.phone && ad.title === myAds[editIndex].title
  );

  if (adIndex !== -1) {
    allAds[adIndex] = updatedAd;
    localStorage.setItem('ads', JSON.stringify(allAds));
    alert('آگهی ویرایش شد!');
    location.reload();
  }
});
document.getElementById('addForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const file = document.getElementById('imageInput').files[0];

  if (!file) {
    alert('لطفاً عکس انتخاب کنید.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const imageData = reader.result;

    const newAd = {
      title,
      price,
      location,
      description,
      category,
      image: imageData,
      user: currentUser,
      date: new Date().toLocaleString()
    };

    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    ads.push(newAd);
    localStorage.setItem('ads', JSON.stringify(ads));

    alert('آگهی ثبت شد!');
    window.location.href = 'index.html';
  };

  reader.readAsDataURL(file);
});
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');

searchInput.addEventListener('input', renderFilteredAds);
filterCategory.addEventListener('change', renderFilteredAds);

function renderFilteredAds() {
  const keyword = searchInput.value.toLowerCase();
  const category = filterCategory.value;

  const filtered = ads.filter(ad => {
    const matchesKeyword =
      ad.title.toLowerCase().includes(keyword) ||
      ad.description.toLowerCase().includes(keyword);

    const matchesCategory = category === '' || ad.category === category;

    return matchesKeyword && matchesCategory;
  });

  displayAds(filtered);
}

function displayAds(list) {
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p>هیچ آگهی‌ای مطابق جستجو پیدا نشد.</p>';
    return;
  }

  list.forEach(ad => {
    const card = document.createElement('div');
    card.className = 'ad-card';
    card.innerHTML = `
      <img src="${ad.image}" alt="عکس آگهی">
      <h3>${ad.title}</h3>
      <p>${ad.price} افغانی</p>
      <p>دسته: ${ad.category}</p>
      <p>موقعیت: ${ad.location}</p>
    `;
    container.appendChild(card);
  });
}

‎// نمایش اولیه
displayAds(ads);
const urlParams = new URLSearchParams(window.location.search);
const adId = urlParams.get('ad'); // شناسه آگهی
const sellerPhone = urlParams.get('to'); // شماره فروشنده

const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
if (!currentUser.phone) {
  window.location.href = 'login.html';
}

const messages = JSON.parse(localStorage.getItem('messages') || '[]');
const myMessages = messages.filter(
  msg => msg.adId === adId &&
    ((msg.from === currentUser.phone && msg.to === sellerPhone) ||
     (msg.from === sellerPhone && msg.to === currentUser.phone))
);

const container = document.getElementById('messages');
const form = document.getElementById('msgForm');
const input = document.getElementById('msgInput');

function renderMessages() {
  container.innerHTML = '';
  myMessages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'msg' + (msg.from === currentUser.phone ? ' me' : '');
    div.textContent = msg.text;
    container.appendChild(div);
  });
  container.scrollTop = container.scrollHeight;
}

renderMessages();

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = input.value;
  if (!text) return;

  const newMsg = {
    adId,
    from: currentUser.phone,
    to: sellerPhone,
    text,
    time: new Date().toISOString()
  };

  messages.push(newMsg);
  localStorage.setItem('messages', JSON.stringify(messages));
  input.value = '';
  myMessages.push(newMsg);
  renderMessages();
});
<a href="chat.html?ad=${index}&to=${ad.user.phone}">پیام دادن به فروشنده</a>
const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');

‎// فیلتر پیام‌هایی که به کاربر فعلی ارسال شده‌اند
const myInbox = allMessages.filter(msg => msg.to === currentUser.phone);

‎// فقط فرستنده‌های یکتا
const senders = [...new Set(myInbox.map(msg => msg.from))];

const inboxContainer = document.getElementById('inbox');
if (senders.length === 0) {
  inboxContainer.innerHTML = '<p>هیچ پیام جدیدی ندارید.</p>';
} else {
  senders.forEach(senderPhone => {
    const link = document.createElement('a');
    link.href = `chat.html?ad=0&to=${senderPhone}`;
    link.textContent = `پیام از شماره: ${senderPhone}`;
    link.style.display = 'block';
    inboxContainer.appendChild(link);
  });
}
‎// ثبت زمان بازدید از چت
const lastSeenKey = `lastSeen_${currentUser.phone}_to_${sellerPhone}_ad_${adId}`;
localStorage.setItem(lastSeenKey, new Date().toISOString());
let unreadCount = 0;

Object.values(grouped).forEach(msg => {
  const lastSeenKey = `lastSeen_${currentUser.phone}_to_${msg.from}_ad_${msg.adId}`;
  const lastSeen = localStorage.getItem(lastSeenKey);
  if (!lastSeen || new Date(msg.time) > new Date(lastSeen)) {
    unreadCount++;
  }
});
const badge = document.getElementById('notifBadge');
if (unreadCount > 0) {
  badge.textContent = unreadCount;
  badge.style.display = 'inline-block';
} else {
  badge.style.display = 'none';
}
