// מעבר בין 4 המסכים
function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');

  // עדכון סרגל ניווט תחתון
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
  if (screenId === 'schedule-screen') {
    document.getElementById('tab-schedule').classList.add('active');
  } else {
    document.getElementById('tab-home').classList.add('active');
  }
}

// בחירת משך זמן בטופס הזמנה
let selectedDuration = 1;
let selectedEndHour = '15:00';
let selectedClassification = 'operational';

function setDuration(hours, endHourText, btn) {
  selectedDuration = hours;
  selectedEndHour = endHourText;
  btn.parentElement.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('calc-return-text').innerText = `⏱️ שעת חזרה מחושבת: ${endHourText}`;
}

// בחירת סיווג נסיעה
function setClassification(type, btn) {
  selectedClassification = type;
  btn.parentElement.querySelectorAll('.choice-btn').forEach(b => {
    b.classList.remove('active-orange', 'active');
  });
  btn.classList.add('active-orange');
}

// בחירת רמת דחיפות
function setUrgency(level, btn) {
  btn.parentElement.querySelectorAll('.choice-btn').forEach(b => {
    b.classList.remove('active-green', 'active-orange');
  });
  btn.classList.add(level === 'low' ? 'active-green' : 'active-orange');
}

// הוספת הזמנה חדשה לציר הזמן הקיים (ללא מחיקת הכרטיסים הקיימים)
function submitBooking() {
  const purpose = document.getElementById('trip-purpose').value.trim() || 'נסיעה חדשה';
  const driverVal = document.getElementById('driver-select').value;

  const badgeMap = {
    operational: { text: 'מבצעי', cls: 'operational-badge', cardCls: 'operational' },
    personal: { text: 'אישי', cls: 'personal-badge', cardCls: 'personal' },
    unplanned: { text: 'בלת"מ', cls: 'urgent-badge', cardCls: 'unplanned' }
  };

  const info = badgeMap[selectedClassification];

  const newCardHtml = `
    <div class="timeline-card ${info.cardCls}" data-type="booked">
      <div class="time-col">
        <span class="date">20.10.2026</span>
        <span class="hours">14:00-${selectedEndHour}</span>
      </div>
      <div class="info-col">
        <span class="task-badge ${info.cls}">${info.text} • ${purpose}</span>
        <span class="person-name">${driverVal}</span>
      </div>
      <button class="btn-call-circle" onclick="alert('חיוג אל: ${driverVal}')">📞</button>
    </div>
  `;

  document.getElementById('home-timeline-list').insertAdjacentHTML('afterbegin', newCardHtml);
  document.getElementById('schedule-timeline-list').insertAdjacentHTML('afterbegin', newCardHtml);

  document.getElementById('trip-purpose').value = '';
  alert(`ההזמנה נשמרה ושוריינה בלו"ז!\nמטרה: ${purpose}\nשעות: 14:00-${selectedEndHour}`);
  switchScreen('home-screen');
}

// סינון כרטיסים במסך הלו"ז
function filterSchedule(filterType, btn) {
  btn.parentElement.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('#schedule-timeline-list .timeline-card').forEach(card => {
    if (filterType === 'all' || card.dataset.type === filterType) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// התנדבות כנהג במסך הלו"ז
function volunteerDriver(btn, requesterName) {
  const card = btn.closest('.timeline-card');
  card.classList.remove('pending');
  card.classList.add('personal');
  card.dataset.type = 'booked';
  const badge = card.querySelector('.task-badge');
  badge.className = 'task-badge personal-badge';
  badge.innerText = '🔵 אישי • שובץ נהג (אופיר)';
  btn.remove();
  alert(`שובצת כנהג לנסיעה של ${requesterName}!`);
}

// אישור נסיעה דחופה ע"י בעל תפקיד
function approveTrip(btn) {
  const card = btn.closest('.timeline-card');
  const badge = card.querySelector('.task-badge');
  badge.className = 'task-badge mint-badge';
  badge.innerText = '✓ בלת"מ • אושר ע"י בעל תפקיד';
  btn.remove();
  alert('הנסיעה הדחופה אושרה!');
}

// בחירת יום בפס השבועי
function selectDayPill(pill) {
  document.querySelectorAll('.day-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
}

function toggleScheduleView(btn) {
  btn.innerText = btn.innerText.includes('יומי ✓') ? 'יומי | שבועי ✓' : 'יומי ✓ | שבועי';
}

function toggleProfileRole(btn) {
  btn.parentElement.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}