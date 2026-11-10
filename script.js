// Сутність 1: Лікар
const doctors = [
  { id: 1, fullName: 'Губанов Руслан',   specialty: 'Кардіолог', department: 'Кардіологічне', category: 'Вища',  experience: 18, office: '204', phone: '+380 67 123 45 67', salary: 32000 },
  { id: 2, fullName: 'Борщ Аліна',     specialty: 'Невролог',  department: 'Неврологічне',  category: 'Перша', experience: 11, office: '310', phone: '+380 50 234 56 78', salary: 27500 },
  { id: 3, fullName: 'Пашуков Владислав',    specialty: 'Хірург',    department: 'Хірургічне',    category: 'Вища',  experience: 22, office: '115', phone: '+380 93 345 67 89', salary: 35000 },
  { id: 4, fullName: 'Кадученко Ірина',    specialty: 'Педіатр',   department: 'Педіатричне',   category: 'Друга', experience: 5,  office: '021', phone: '+380 66 456 78 90', salary: 22000 },
  { id: 5, fullName: 'Кастелян Микола',      specialty: 'Терапевт',  department: 'Терапевтичне',  category: 'Перша', experience: 9,  office: '102', phone: '+380 97 567 89 01', salary: 25000 }
];

// Сутність 2: Пацієнт
const patients = [
  { card: 'P-1001', fullName: 'Зверхній Володимир Петрович',  birthDate: '12.03.1958', gender: 'Ч', address: 'м. Київ, вул. Хрещатик, 10',          phone: '+380 67 111 22 33', diagnosis: 'Гіпертонічна хвороба', doctor: 'Губарєв Р. П.',    admissionDate: '28.10.2026', ward: 21 },
  { card: 'P-1002', fullName: 'Войцик Павел',      birthDate: '05.07.1985', gender: 'Ч', address: 'м. Київ, вул. Січових Стрільців, 45', phone: '+380 50 222 33 44', diagnosis: 'Мігрень',              doctor: 'Борщевська А. В.', admissionDate: '01.11.2026', ward: 34 },
  { card: 'P-1003', fullName: 'Борщ Владислав Андрійович',     birthDate: '19.11.1990', gender: 'Ч', address: 'м. Бровари, вул. Київська, 7',        phone: '+380 93 333 44 55', diagnosis: 'Гострий апендицит',    doctor: 'Пашков В. Г.',     admissionDate: '03.11.2026', ward: 12 },
  { card: 'P-1004', fullName: 'Олійник Софія Максимівна',  birthDate: '22.04.2019', gender: 'Ж', address: 'м. Київ, просп. Перемоги, 88',        phone: '+380 66 444 55 66', diagnosis: 'Бронхіт',              doctor: 'Кадучак К. А.',    admissionDate: '30.10.2026', ward: 5 },
  { card: 'P-1005', fullName: 'Поліщук Василь Григорович', birthDate: '08.09.1972', gender: 'Ч', address: 'м. Ірпінь, вул. Соборна, 15',         phone: '+380 97 555 66 77', diagnosis: 'Пневмонія',            doctor: 'Касіян М. А.',     admissionDate: '02.11.2026', ward: 8 }
];

// Сутність 3: Відділення
const departments = [
  { code: 'KRD', name: 'Кардіологічне', head: 'Губанов Р. П.',    floor: 2, beds: 40, freeBeds: 6, doctorsCount: 8,  hours: '08:00 – 18:00', phone: '201' },
  { code: 'NRV', name: 'Неврологічне',  head: 'Борщ А. В.', floor: 3, beds: 35, freeBeds: 4, doctorsCount: 6,  hours: '08:00 – 17:00', phone: '301' },
  { code: 'HRG', name: 'Хірургічне',    head: 'Пашуков В. Г.',     floor: 1, beds: 50, freeBeds: 9, doctorsCount: 12, hours: 'цілодобово',    phone: '101' },
  { code: 'PED', name: 'Педіатричне',   head: 'Кадученко І. А.',    floor: 0, beds: 30, freeBeds: 7, doctorsCount: 5,  hours: '08:00 – 20:00', phone: '001' },
  { code: 'TRP', name: 'Терапевтичне',  head: 'Кастелян М. А.',     floor: 1, beds: 45, freeBeds: 3, doctorsCount: 10, hours: '08:00 – 19:00', phone: '102' }
];

// ===================== Опис колонок і полів форми =====================
// key       — назва поля в об'єкті
// title     — заголовок колонки та підпис поля у формі
// num       — числова колонка (вирівнювання праворуч)
// nowrap    — не переносити текст у комірці
// format    — функція для гарного виводу значення
// auto      — значення генерується автоматично, у формі поля немає
// input     — тип поля форми: text | number | date | tel | select
// options   — варіанти для select (масив або функція, що повертає масив)
// suggest   — підказки з уже наявних значень цієї колонки (datalist)
// min, max, pattern, patternMsg, placeholder, wide — налаштування поля

const PHONE_PATTERN = '^\\+?[0-9 ()-]{10,18}$';
const PHONE_MSG = 'Формат: +380 67 123 45 67';

const doctorColumns = [
  { key: 'id',         title: '№', auto: true },
  { key: 'fullName',   title: 'ПІБ', input: 'text', placeholder: 'Прізвище Ім\'я', wide: true },
  { key: 'specialty',  title: 'Спеціалізація', input: 'text', suggest: true, placeholder: 'Кардіолог' },
  { key: 'department', title: 'Відділення', input: 'select', options: function () { return departments.map(function (d) { return d.name; }); } },
  { key: 'category',   title: 'Категорія', input: 'select', options: ['Вища', 'Перша', 'Друга', 'Без категорії'] },
  { key: 'experience', title: 'Стаж (років)', num: true, input: 'number', min: 0, max: 60 },
  { key: 'office',     title: 'Кабінет', input: 'text', pattern: '^[0-9]{1,4}$', patternMsg: 'Лише цифри, напр. 204', placeholder: '204' },
  { key: 'phone',      title: 'Телефон', nowrap: true, input: 'tel', pattern: PHONE_PATTERN, patternMsg: PHONE_MSG, placeholder: '+380 67 123 45 67' },
  { key: 'salary',     title: 'Ставка (грн)', num: true, format: formatMoney, input: 'number', min: 1, max: 1000000 }
];

const patientColumns = [
  { key: 'card',          title: '№ картки', nowrap: true, auto: true },
  { key: 'fullName',      title: 'ПІБ', input: 'text', placeholder: 'Прізвище Ім\'я', wide: true },
  { key: 'birthDate',     title: 'Дата народження', nowrap: true, input: 'date', notFuture: true },
  { key: 'gender',        title: 'Стать', input: 'select', options: ['Ч', 'Ж'] },
  { key: 'address',       title: 'Адреса', input: 'text', placeholder: 'м. Київ, вул. Хрещатик, 10', wide: true },
  { key: 'phone',         title: 'Телефон', nowrap: true, input: 'tel', pattern: PHONE_PATTERN, patternMsg: PHONE_MSG, placeholder: '+380 67 123 45 67' },
  { key: 'diagnosis',     title: 'Діагноз', input: 'text', suggest: true },
  { key: 'doctor',        title: 'Лікуючий лікар', input: 'text', suggest: true, placeholder: 'Прізвище І. Б.' },
  { key: 'admissionDate', title: 'Дата госпіталізації', nowrap: true, input: 'date' },
  { key: 'ward',          title: 'Палата', input: 'number', min: 1, max: 999 }
];

const departmentColumns = [
  { key: 'code',         title: 'Код', input: 'text', pattern: '^[A-Z]{3}$', patternMsg: '3 великі латинські літери, напр. KRD', placeholder: 'KRD', upper: true },
  { key: 'name',         title: 'Назва', input: 'text', placeholder: 'Кардіологічне' },
  { key: 'head',         title: 'Завідувач', input: 'text', suggest: true, placeholder: 'Прізвище І. Б.' },
  { key: 'floor',        title: 'Поверх', num: true, input: 'number', min: 0, max: 30 },
  { key: 'beds',         title: 'Кількість ліжок', num: true, input: 'number', min: 1, max: 1000 },
  { key: 'freeBeds',     title: 'Вільних ліжок', num: true, input: 'number', min: 0, max: 1000 },
  { key: 'doctorsCount', title: 'Кількість лікарів', num: true, input: 'number', min: 0, max: 500 },
  { key: 'hours',        title: 'Години прийому', input: 'text', placeholder: '08:00 – 18:00' },
  { key: 'phone',        title: 'Внутрішній телефон', input: 'text', pattern: '^[0-9]{3,4}$', patternMsg: '3–4 цифри, напр. 201', placeholder: '201' }
];

// ===================== Реєстр сутностей =====================

const entities = {
  doctors: {
    formTitle: 'Новий лікар',
    tableId: 'doctors-table',
    columns: doctorColumns,
    data: doctors,
    // Автоматичні поля: наступний порядковий номер
    fillAuto: function (item) {
      item.id = nextNumber(doctors.map(function (d) { return d.id; }));
    }
  },
  patients: {
    formTitle: 'Новий пацієнт',
    tableId: 'patients-table',
    columns: patientColumns,
    data: patients,
    fillAuto: function (item) {
      const n = nextNumber(patients.map(function (p) { return parseInt(p.card.replace(/\D/g, ''), 10); }));
      item.card = 'P-' + n;
    },
    // Перевірки, що стосуються кількох полів одразу
    validate: function (item) {
      const errors = {};
      if (parseDate(item.admissionDate) < parseDate(item.birthDate)) {
        errors.admissionDate = 'Не може бути раніше дати народження';
      }
      return errors;
    }
  },
  departments: {
    formTitle: 'Нове відділення',
    tableId: 'departments-table',
    columns: departmentColumns,
    data: departments,
    validate: function (item) {
      const errors = {};
      if (departments.some(function (d) { return d.code === item.code; })) {
        errors.code = 'Відділення з таким кодом уже існує';
      }
      if (departments.some(function (d) { return d.name.toLowerCase() === item.name.toLowerCase(); })) {
        errors.name = 'Відділення з такою назвою вже існує';
      }
      if (item.freeBeds > item.beds) {
        errors.freeBeds = 'Не може бути більше, ніж усього ліжок';
      }
      return errors;
    }
  }
};

// ===================== Допоміжні функції =====================

// 32000 -> "32 000"
function formatMoney(value) {
  return value.toLocaleString('uk-UA');
}

// Наступний номер після найбільшого: [1, 2, 5] -> 6
function nextNumber(numbers) {
  return numbers.length ? Math.max.apply(null, numbers) + 1 : 1;
}

// "2026-11-05" (з <input type="date">) -> "05.11.2026"
function isoToDisplay(iso) {
  const parts = iso.split('-');
  return parts[2] + '.' + parts[1] + '.' + parts[0];
}

// "05.11.2026" -> об'єкт Date
function parseDate(display) {
  const parts = display.split('.');
  return new Date(+parts[2], +parts[1] - 1, +parts[0]);
}

// Сьогоднішня дата у форматі для атрибута max: "2026-11-05"
function todayIso() {
  const d = new Date();
  const pad = function (n) { return String(n).padStart(2, '0'); };
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

// Унікальні наявні значення колонки — для підказок у формі
function uniqueValues(data, key) {
  const result = [];
  data.forEach(function (item) {
    if (item[key] !== '' && result.indexOf(item[key]) === -1) result.push(item[key]);
  });
  return result.sort();
}

// ===================== Таблиці =====================

// Будує таблицю: заголовок із columns, рядки з масиву data.
// highlightIndex — номер рядка, який треба підсвітити (щойно доданий).
function renderTable(tableId, columns, data, highlightIndex) {
  const table = document.getElementById(tableId);
  table.innerHTML = '';

  // Заголовок
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  columns.forEach(function (col) {
    const th = document.createElement('th');
    th.textContent = col.title;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  // Рядки з даними
  const tbody = document.createElement('tbody');
  data.forEach(function (item, index) {
    const tr = document.createElement('tr');
    if (index === highlightIndex) tr.className = 'new-row';
    columns.forEach(function (col) {
      const td = document.createElement('td');
      const value = item[col.key];
      td.textContent = col.format ? col.format(value) : value;
      if (col.num) td.classList.add('num');
      if (col.nowrap) td.classList.add('nowrap');
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

// ===================== Таби =====================

// Перемикання табів: показуємо лише таблицю обраної сутності
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) { p.classList.remove('active'); });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
}

// ===================== Запуск =====================

Object.keys(entities).forEach(function (key) {
  const entity = entities[key];
  renderTable(entity.tableId, entity.columns, entity.data);
});
initTabs();
