// ===================== Початкові дані =====================
// Таблиці пов'язані між собою через ключі:
//   лікар.department     -> відділення.code
//   пацієнт.doctor       -> лікар.id
//   відділення.head      -> лікар.id

const DEFAULT_DATA = {
  // Сутність 1: Лікар
  doctors: [
    { id: 1, fullName: 'Губарєв Ростислав', specialty: 'Кардіолог', department: 'KRD', category: 'Вища',  experience: 18, office: '204', phone: '+380 67 123 45 67', salary: 32000 },
    { id: 2, fullName: 'Борщевська Анна',   specialty: 'Невролог',  department: 'NRV', category: 'Перша', experience: 11, office: '310', phone: '+380 50 234 56 78', salary: 27500 },
    { id: 3, fullName: 'Пашков Володимир',  specialty: 'Хірург',    department: 'HRG', category: 'Вища',  experience: 22, office: '115', phone: '+380 93 345 67 89', salary: 35000 },
    { id: 4, fullName: 'Кадучак Катерина',  specialty: 'Педіатр',   department: 'PED', category: 'Друга', experience: 5,  office: '021', phone: '+380 66 456 78 90', salary: 22000 },
    { id: 5, fullName: 'Касіян Михайло',    specialty: 'Терапевт',  department: 'TRP', category: 'Перша', experience: 9,  office: '102', phone: '+380 97 567 89 01', salary: 25000 }
  ],

  // Сутність 2: Пацієнт
  patients: [
    { card: 'P-1001', fullName: 'Зверхановський Владислав',  birthDate: '12.03.1958', gender: 'Ч', address: 'м. Київ, вул. Хрещатик, 10',          phone: '+380 67 111 22 33', diagnosis: 'Гіпертонічна хвороба', doctor: 1, admissionDate: '28.10.2026', ward: 21 },
    { card: 'P-1002', fullName: 'Войцехівський Дмитро',      birthDate: '05.07.1985', gender: 'Ч', address: 'м. Київ, вул. Січових Стрільців, 45', phone: '+380 50 222 33 44', diagnosis: 'Мігрень',              doctor: 2, admissionDate: '01.11.2026', ward: 34 },
    { card: 'P-1003', fullName: 'Борщевський Владислав',     birthDate: '19.11.1990', gender: 'Ч', address: 'м. Бровари, вул. Київська, 7',        phone: '+380 93 333 44 55', diagnosis: 'Гострий апендицит',    doctor: 3, admissionDate: '03.11.2026', ward: 12 },
    { card: 'P-1004', fullName: 'Олійник Софія Максимівна',  birthDate: '22.04.2019', gender: 'Ж', address: 'м. Київ, просп. Перемоги, 88',        phone: '+380 66 444 55 66', diagnosis: 'Бронхіт',              doctor: 4, admissionDate: '30.10.2026', ward: 5 },
    { card: 'P-1005', fullName: 'Поліщук Василь Григорович', birthDate: '08.09.1972', gender: 'Ч', address: 'м. Ірпінь, вул. Соборна, 15',         phone: '+380 97 555 66 77', diagnosis: 'Пневмонія',            doctor: 5, admissionDate: '02.11.2026', ward: 8 }
  ],

  // Сутність 3: Відділення
  departments: [
    { code: 'KRD', name: 'Кардіологічне', head: 1, floor: 2, beds: 40, freeBeds: 6, doctorsCount: 8,  hours: '08:00 – 18:00', phone: '201' },
    { code: 'NRV', name: 'Неврологічне',  head: 2, floor: 3, beds: 35, freeBeds: 4, doctorsCount: 6,  hours: '08:00 – 17:00', phone: '301' },
    { code: 'HRG', name: 'Хірургічне',    head: 3, floor: 1, beds: 50, freeBeds: 9, doctorsCount: 12, hours: 'цілодобово',    phone: '101' },
    { code: 'PED', name: 'Педіатричне',   head: 4, floor: 0, beds: 30, freeBeds: 7, doctorsCount: 5,  hours: '08:00 – 20:00', phone: '001' },
    { code: 'TRP', name: 'Терапевтичне',  head: 5, floor: 1, beds: 45, freeBeds: 3, doctorsCount: 10, hours: '08:00 – 19:00', phone: '102' }
  ]
};

// ===================== Збереження в localStorage =====================

const STORAGE_KEY = 'hospital-db-v1';

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

// Читає збережені дані; якщо їх немає або вони пошкоджені — повертає початкові
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.doctors) && Array.isArray(parsed.patients) && Array.isArray(parsed.departments)) {
        return parsed;
      }
    }
  } catch (e) {
    // localStorage недоступний або JSON зіпсований — працюємо з початковими даними
  }
  return cloneData(DEFAULT_DATA);
}

// Зберігає всі таблиці. Інші вкладки отримають подію 'storage' і оновляться.
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    showToast('Не вдалося зберегти дані в браузері');
  }
}

// Поточні дані сторінки
let db = loadData();

// ===================== Опис колонок і полів форми =====================
// key       — назва поля в об'єкті
// title     — заголовок колонки та підпис поля у формі
// num       — числова колонка (вирівнювання праворуч)
// nowrap    — не переносити текст у комірці
// format    — функція для гарного виводу значення
// auto      — значення генерується автоматично (у формі поля немає, змінювати не можна)
// locked    — значення вводиться при створенні, але потім не змінюється (ключ запису)
// input     — тип поля: text | number | date | tel | select
// options   — фіксовані варіанти для select
// ref       — select зі значеннями з ІНШОЇ таблиці (назва сутності)
// suggest   — підказки з уже наявних значень цієї колонки (datalist)
// min, max, pattern, patternMsg, placeholder, wide, upper, notFuture — налаштування поля

const PHONE_PATTERN = '^\\+?[0-9 ()-]{10,18}$';
const PHONE_MSG = 'Формат: +380 67 123 45 67';

const doctorColumns = [
  { key: 'id',         title: '№', auto: true },
  { key: 'fullName',   title: 'ПІБ', input: 'text', placeholder: 'Прізвище Ім\'я', wide: true },
  { key: 'specialty',  title: 'Спеціалізація', input: 'text', suggest: true, placeholder: 'Кардіолог' },
  { key: 'department', title: 'Відділення', input: 'select', ref: 'departments' },
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
  { key: 'doctor',        title: 'Лікуючий лікар', input: 'select', ref: 'doctors' },
  { key: 'admissionDate', title: 'Дата госпіталізації', nowrap: true, input: 'date' },
  { key: 'ward',          title: 'Палата', input: 'number', min: 1, max: 999 }
];

const departmentColumns = [
  { key: 'code',         title: 'Код', locked: true, input: 'text', pattern: '^[A-Z]{3}$', patternMsg: '3 великі латинські літери, напр. KRD', placeholder: 'KRD', upper: true },
  { key: 'name',         title: 'Назва', input: 'text', placeholder: 'Кардіологічне' },
  { key: 'head',         title: 'Завідувач', input: 'select', ref: 'doctors' },
  { key: 'floor',        title: 'Поверх', num: true, input: 'number', min: 0, max: 30 },
  { key: 'beds',         title: 'Кількість ліжок', num: true, input: 'number', min: 1, max: 1000 },
  { key: 'freeBeds',     title: 'Вільних ліжок', num: true, input: 'number', min: 0, max: 1000 },
  { key: 'doctorsCount', title: 'Кількість лікарів', num: true, input: 'number', min: 0, max: 500 },
  { key: 'hours',        title: 'Години прийому', input: 'text', placeholder: '08:00 – 18:00' },
  { key: 'phone',        title: 'Внутрішній телефон', input: 'text', pattern: '^[0-9]{3,4}$', patternMsg: '3–4 цифри, напр. 201', placeholder: '201' }
];

// ===================== Реєстр сутностей =====================
// keyField   — поле, яке однозначно визначає запис (на нього посилаються інші таблиці)
// labelField — поле, яке показується у випадних списках інших таблиць

const entities = {
  doctors: {
    title: 'Лікарі',
    singular: 'Лікар',
    accusative: 'лікаря',
    formTitle: 'Новий лікар',
    tableId: 'doctors-table',
    columns: doctorColumns,
    keyField: 'id',
    labelField: 'fullName',
    fillAuto: function (item) {
      item.id = nextNumber(db.doctors.map(function (d) { return d.id; }));
    }
  },
  patients: {
    title: 'Пацієнти',
    singular: 'Пацієнт',
    accusative: 'пацієнта',
    formTitle: 'Новий пацієнт',
    tableId: 'patients-table',
    columns: patientColumns,
    keyField: 'card',
    labelField: 'fullName',
    fillAuto: function (item) {
      const n = nextNumber(db.patients.map(function (p) { return parseInt(p.card.replace(/\D/g, ''), 10); }));
      item.card = 'P-' + n;
    },
    // Перевірки, що стосуються кількох полів одразу
    validate: function (item) {
      const errors = {};
      if (parseDate(item.admissionDate) < parseDate(item.birthDate)) {
        errors.admissionDate = 'Дата госпіталізації не може бути раніше дати народження';
      }
      return errors;
    }
  },
  departments: {
    title: 'Відділення',
    singular: 'Відділення',
    accusative: 'відділення',
    formTitle: 'Нове відділення',
    tableId: 'departments-table',
    columns: departmentColumns,
    keyField: 'code',
    labelField: 'name',
    // selfKey — код запису, який редагується (щоб не порівнювати його з самим собою)
    validate: function (item, selfKey) {
      const errors = {};
      const others = db.departments.filter(function (d) { return d.code !== selfKey; });
      if (others.some(function (d) { return d.code === item.code; })) {
        errors.code = 'Відділення з таким кодом уже існує';
      }
      if (others.some(function (d) { return d.name.toLowerCase() === item.name.toLowerCase(); })) {
        errors.name = 'Відділення з такою назвою вже існує';
      }
      if (item.freeBeds > item.beds) {
        errors.freeBeds = 'Вільних ліжок не може бути більше, ніж усього ліжок';
      }
      return errors;
    }
  }
};

// ===================== Допоміжні функції =====================

// 32000 -> "32 000"
function formatMoney(value) {
  return Number(value).toLocaleString('uk-UA');
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

// "05.11.2026" -> "2026-11-05"
function displayToIso(display) {
  const parts = String(display).split('.');
  return parts.length === 3 ? parts[2] + '-' + parts[1] + '-' + parts[0] : '';
}

// "05.11.2026" -> об'єкт Date
function parseDate(display) {
  const parts = display.split('.');
  return new Date(+parts[2], +parts[1] - 1, +parts[0]);
}

// Сьогоднішня дата у форматі "2026-11-05"
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

// Пошук запису за ключем (ключ може прийти як рядок з HTML-атрибута)
function findRecord(entityKey, key) {
  const keyField = entities[entityKey].keyField;
  return db[entityKey].find(function (r) { return String(r[keyField]) === String(key); });
}

// Чи можна змінювати колонку кліком по комірці
function isEditable(col) {
  return !col.auto && !col.locked;
}

// Текст комірки: для посилань показуємо назву зі зв'язаної таблиці
function cellText(col, item) {
  const value = item[col.key];
  if (col.ref) {
    const linked = findRecord(col.ref, value);
    return linked ? linked[entities[col.ref].labelField] : '—';
  }
  return col.format ? col.format(value) : value;
}

// Варіанти випадного списку: фіксовані або з іншої таблиці
function selectOptions(col) {
  if (col.ref) {
    const ref = entities[col.ref];
    return db[col.ref].map(function (r) {
      return { value: String(r[ref.keyField]), label: r[ref.labelField] };
    });
  }
  return col.options.map(function (o) { return { value: o, label: o }; });
}

// Заповнює <select> варіантами, зберігаючи обране значення
function fillSelect(select, col) {
  const current = select.value;
  const options = selectOptions(col);
  select.innerHTML = '';

  const empty = document.createElement('option');
  empty.value = '';
  empty.textContent = options.length ? '— оберіть —' : '— немає даних, спочатку додайте —';
  select.appendChild(empty);

  options.forEach(function (opt) {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    select.appendChild(option);
  });
  select.value = current;
}

// ===================== Сповіщення =====================

const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2800);
}

// ===================== Таблиці =====================

// Будує таблицю сутності. highlightKey — ключ рядка, який треба підсвітити.
function renderTable(entityKey, highlightKey) {
  const entity = entities[entityKey];
  const data = db[entityKey];
  const table = document.getElementById(entity.tableId);
  table.innerHTML = '';

  // Заголовок
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  entity.columns.forEach(function (col) {
    const th = document.createElement('th');
    th.textContent = col.title;
    headRow.appendChild(th);
  });
  const actionsTh = document.createElement('th');
  actionsTh.className = 'actions';
  actionsTh.setAttribute('aria-label', 'Дії');
  headRow.appendChild(actionsTh);
  thead.appendChild(headRow);
  table.appendChild(thead);

  // Рядки з даними
  const tbody = document.createElement('tbody');

  if (data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = entity.columns.length + 1;
    td.className = 'empty';
    td.textContent = 'Немає записів. Натисніть «+ Додати», щоб створити перший.';
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  data.forEach(function (item) {
    const key = item[entity.keyField];
    const tr = document.createElement('tr');
    tr.dataset.key = key;
    if (highlightKey !== undefined && String(key) === String(highlightKey)) tr.className = 'new-row';

    entity.columns.forEach(function (col) {
      const td = document.createElement('td');
      td.textContent = cellText(col, item);
      td.dataset.col = col.key;
      if (col.num) td.classList.add('num');
      if (col.nowrap) td.classList.add('nowrap');
      if (isEditable(col)) {
        td.classList.add('editable');
        td.title = 'Клікніть, щоб змінити';
      }
      tr.appendChild(td);
    });

    // Кнопка видалення рядка
    const actionsTd = document.createElement('td');
    actionsTd.className = 'actions';
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'delete-btn';
    del.innerHTML = '&times;';
    del.title = 'Видалити';
    del.setAttribute('aria-label', 'Видалити «' + item[entity.labelField] + '»');
    actionsTd.appendChild(del);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

// Перемальовує всі таблиці (крім exceptKey, якщо задано)
function renderAll(highlight, exceptKey) {
  Object.keys(entities).forEach(function (key) {
    if (key === exceptKey) return;
    renderTable(key, highlight && highlight.entity === key ? highlight.key : undefined);
  });
}

// Кліки в таблицях: × — видалення, клік по комірці — редагування
function initTableEvents() {
  Object.keys(entities).forEach(function (entityKey) {
    const table = document.getElementById(entities[entityKey].tableId);
    table.addEventListener('click', function (event) {
      const tr = event.target.closest('tbody tr');
      if (!tr || tr.dataset.key === undefined) return;

      if (event.target.closest('.delete-btn')) {
        requestDelete(entityKey, tr.dataset.key);
        return;
      }

      const td = event.target.closest('td.editable');
      if (td && !td.classList.contains('editing')) {
        const col = entities[entityKey].columns.find(function (c) { return c.key === td.dataset.col; });
        startEdit(td, entityKey, tr.dataset.key, col);
      }
    });
  });
}

// ===================== Поля вводу (спільні для форми та редагування) =====================

// Створює елемент вводу для колонки. Повертає { control, list } (list — datalist або null).
function createControl(col, entityKey, id) {
  let control;
  let list = null;

  if (col.input === 'select') {
    control = document.createElement('select');
    fillSelect(control, col);
  } else {
    control = document.createElement('input');
    control.type = col.input;
    if (col.placeholder) control.placeholder = col.placeholder;
    if (col.min !== undefined) control.min = col.min;
    if (col.max !== undefined) control.max = col.max;
    if (col.notFuture) control.max = todayIso();
    if (col.input === 'number') control.step = 1;
    control.autocomplete = 'off';

    if (col.suggest) {
      list = document.createElement('datalist');
      list.id = id + '-list';
      uniqueValues(db[entityKey], col.key).forEach(function (value) {
        const option = document.createElement('option');
        option.value = value;
        list.appendChild(option);
      });
      control.setAttribute('list', list.id);
    }

    if (col.upper) {
      control.addEventListener('input', function () {
        control.value = control.value.toUpperCase();
      });
    }
  }

  control.id = id;
  control.name = col.key;
  return { control: control, list: list };
}

// Значення з об'єкта -> значення для поля вводу
function toInputValue(col, value) {
  if (value === undefined || value === null) return '';
  if (col.input === 'date') return displayToIso(value);
  return String(value);
}

// Перевіряє введене значення. Повертає { value } або { error }.
function parseValue(col, rawValue) {
  let raw = String(rawValue).trim();
  if (col.upper) raw = raw.toUpperCase();

  if (raw === '') return { error: 'Обов\'язкове поле' };

  if (col.ref) {
    const linked = findRecord(col.ref, raw);
    if (!linked) return { error: 'Оберіть значення зі списку' };
    return { value: linked[entities[col.ref].keyField] };
  }

  if (col.input === 'select') {
    if (col.options.indexOf(raw) === -1) return { error: 'Оберіть значення зі списку' };
    return { value: raw };
  }

  if (col.input === 'number') {
    const n = Number(raw);
    if (!Number.isInteger(n)) return { error: 'Введіть ціле число' };
    if (col.min !== undefined && n < col.min) return { error: 'Мінімум ' + col.min };
    if (col.max !== undefined && n > col.max) return { error: 'Максимум ' + col.max };
    return { value: n };
  }

  if (col.input === 'date') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return { error: 'Некоректна дата' };
    if (col.notFuture && raw > todayIso()) return { error: 'Дата не може бути в майбутньому' };
    return { value: isoToDisplay(raw) };
  }

  if (col.pattern && !new RegExp(col.pattern).test(raw)) return { error: col.patternMsg };

  return { value: raw };
}

// ===================== Форма додавання (попап) =====================

const dialog = document.getElementById('add-dialog');
const form = document.getElementById('add-form');
const formFields = document.getElementById('form-fields');
const dialogTitle = document.getElementById('dialog-title');

let currentEntity = null; // ключ сутності, для якої відкрито форму

// Створює одне поле форми (підпис + поле + місце для помилки)
function createField(col, entityKey) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field' + (col.wide ? ' wide' : '');
  wrapper.dataset.key = col.key;

  const id = 'field-' + col.key;

  const label = document.createElement('label');
  label.htmlFor = id;
  label.innerHTML = col.title + ' <span class="req">*</span>';
  wrapper.appendChild(label);

  const created = createControl(col, entityKey, id);
  if (created.list) wrapper.appendChild(created.list);

  // Прибираємо повідомлення про помилку, щойно користувач виправляє поле
  created.control.addEventListener('input', function () { setError(col.key, ''); });
  created.control.addEventListener('change', function () { setError(col.key, ''); });
  wrapper.appendChild(created.control);

  const error = document.createElement('div');
  error.className = 'error';
  wrapper.appendChild(error);

  return wrapper;
}

// Відкриває попап із формою для обраної сутності
function openForm(entityKey) {
  const entity = entities[entityKey];
  currentEntity = entityKey;
  dialogTitle.textContent = entity.formTitle;

  formFields.innerHTML = '';
  entity.columns.forEach(function (col) {
    if (!col.auto) formFields.appendChild(createField(col, entityKey));
  });

  dialog.showModal();
  const first = formFields.querySelector('input, select');
  if (first) first.focus();
}

function closeForm() {
  dialog.close();
}

dialog.addEventListener('close', function () { currentEntity = null; });

// Оновлює випадні списки у відкритій формі (якщо дані змінилися в іншій вкладці)
function refreshFormOptions() {
  if (!currentEntity) return;
  entities[currentEntity].columns.forEach(function (col) {
    if (col.ref && form.elements[col.key]) fillSelect(form.elements[col.key], col);
  });
}

// Показує (або прибирає, якщо message порожній) помилку під полем
function setError(key, message) {
  const wrapper = formFields.querySelector('.field[data-key="' + key + '"]');
  if (!wrapper) return;
  wrapper.classList.toggle('invalid', Boolean(message));
  wrapper.querySelector('.error').textContent = message;
}

// Обробка відправки форми
form.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!currentEntity) return;

  const entityKey = currentEntity;
  const entity = entities[entityKey];
  const item = {};
  let hasErrors = false;

  // 1. Перевірка кожного поля окремо
  entity.columns.forEach(function (col) {
    if (col.auto) return;
    const result = parseValue(col, form.elements[col.key].value);
    setError(col.key, result.error || '');
    if (result.error) hasErrors = true;
    else item[col.key] = result.value;
  });

  // 2. Перевірки, що залежать від кількох полів
  if (!hasErrors && entity.validate) {
    const errors = entity.validate(item);
    Object.keys(errors).forEach(function (key) {
      setError(key, errors[key]);
      hasErrors = true;
    });
  }

  if (hasErrors) {
    const firstInvalid = formFields.querySelector('.field.invalid input, .field.invalid select');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // 3. Автоматичні поля (номер, № картки) і збереження
  if (entity.fillAuto) entity.fillAuto(item);

  // Будуємо об'єкт у порядку колонок, щоб він виглядав як решта даних
  const record = {};
  entity.columns.forEach(function (col) { record[col.key] = item[col.key]; });

  db[entityKey].push(record);
  saveData();
  renderAll({ entity: entityKey, key: record[entity.keyField] });
  closeForm();
  showToast(entity.singular + ' «' + record[entity.labelField] + '» додано');
});

document.getElementById('dialog-close').addEventListener('click', closeForm);
document.getElementById('dialog-cancel').addEventListener('click', closeForm);

// Закриття кліком по затемненню навколо попапу
dialog.addEventListener('click', function (event) {
  if (event.target === dialog) closeForm();
});

// Кнопки «+ Додати …»
document.querySelectorAll('.add-btn').forEach(function (button) {
  button.addEventListener('click', function () {
    openForm(button.dataset.entity);
  });
});

// ===================== Редагування комірок =====================

let activeEdit = null; // { td, entityKey, recordKey, col, control, error }

// Клік по комірці: замість тексту з'являється поле вводу
function startEdit(td, entityKey, recordKey, col) {
  const record = findRecord(entityKey, recordKey);
  if (!record) return;

  const created = createControl(col, entityKey, 'inline-' + col.key);
  const control = created.control;
  control.value = toInputValue(col, record[col.key]);

  const box = document.createElement('div');
  box.className = 'inline-edit';
  box.appendChild(control);
  if (created.list) box.appendChild(created.list);

  const ok = document.createElement('button');
  ok.type = 'button';
  ok.className = 'inline-ok';
  ok.textContent = '✓';
  ok.title = 'Зберегти (Enter)';
  box.appendChild(ok);

  const error = document.createElement('div');
  error.className = 'inline-error';

  td.textContent = '';
  td.classList.add('editing');
  td.removeAttribute('title');
  td.appendChild(box);
  td.appendChild(error);

  activeEdit = { td: td, entityKey: entityKey, recordKey: recordKey, col: col, control: control, error: error };

  control.focus();
  if (control.tagName === 'INPUT') {
    try { control.select(); } catch (e) { /* для деяких типів полів виділення недоступне */ }
  }

  control.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitEdit(true);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelEdit();
    }
  });

  // Для списку зберігаємо одразу після вибору
  if (control.tagName === 'SELECT') {
    control.addEventListener('change', function () { commitEdit(true); });
  }

  // Клік у будь-якому іншому місці сторінки — збереження
  control.addEventListener('blur', function () { commitEdit(false); });

  // mousedown не забирає фокус із поля, тож спрацює саме click по кнопці
  ok.addEventListener('mousedown', function (event) { event.preventDefault(); });
  ok.addEventListener('click', function () { commitEdit(true); });
}

// Повертає комірці звичайний вигляд
function restoreCell(edit, record) {
  edit.td.classList.remove('editing', 'invalid');
  edit.td.textContent = record ? cellText(edit.col, record) : '';
  edit.td.title = 'Клікніть, щоб змінити';
}

function cancelEdit() {
  const edit = activeEdit;
  if (!edit) return;
  activeEdit = null;
  restoreCell(edit, findRecord(edit.entityKey, edit.recordKey));
}

// Зберігає нове значення комірки.
// strict = true (Enter / ✓): при помилці поле лишається відкритим з підказкою.
// strict = false (клік поза полем): при помилці зміна скасовується.
function commitEdit(strict) {
  const edit = activeEdit;
  if (!edit) return;

  const entity = entities[edit.entityKey];
  const record = findRecord(edit.entityKey, edit.recordKey);
  if (!record) { cancelEdit(); return; }

  const result = parseValue(edit.col, edit.control.value);
  let error = result.error;

  if (!error && entity.validate) {
    const candidate = Object.assign({}, record);
    candidate[edit.col.key] = result.value;
    const errors = entity.validate(candidate, record[entity.keyField]);
    const keys = Object.keys(errors);
    if (keys.length) error = errors[keys[0]];
  }

  if (error) {
    if (strict) {
      edit.error.textContent = error;
      edit.td.classList.add('invalid');
      edit.control.focus();
    } else {
      cancelEdit();
      showToast('Зміну не збережено: ' + error);
    }
    return;
  }

  activeEdit = null;
  const changed = record[edit.col.key] !== result.value;
  record[edit.col.key] = result.value;
  restoreCell(edit, record);

  if (changed) {
    saveData();
    // Інші таблиці можуть показувати це значення (напр. ім'я лікаря у пацієнтів)
    renderAll(null, edit.entityKey);
    edit.td.classList.add('flash');
    edit.td.addEventListener('animationend', function () { edit.td.classList.remove('flash'); }, { once: true });
  }
}

// ===================== Видалення =====================

// Шукає записи в інших таблицях, які посилаються на цей запис
function findUsages(entityKey, key) {
  const usages = [];
  Object.keys(entities).forEach(function (otherKey) {
    const other = entities[otherKey];
    other.columns.forEach(function (col) {
      if (col.ref !== entityKey) return;
      db[otherKey].forEach(function (row) {
        if (String(row[col.key]) === String(key)) {
          usages.push(other.title + ': «' + row[other.labelField] + '» (' + col.title.toLowerCase() + ')');
        }
      });
    });
  });
  return usages;
}

function requestDelete(entityKey, key) {
  const entity = entities[entityKey];
  const record = findRecord(entityKey, key);
  if (!record) return;
  const name = record[entity.labelField];
  const usages = findUsages(entityKey, key);

  if (usages.length) {
    showMessage({
      type: 'error',
      title: 'Видалення неможливе',
      text: entity.singular + ' «' + name + '» використовується в інших таблицях, тому наразі видалити його неможливо. ' +
            'Спочатку змініть або видаліть пов\'язані записи:',
      list: usages
    });
    return;
  }

  showMessage({
    type: 'confirm',
    title: 'Підтвердження видалення',
    text: 'Видалити ' + entity.accusative + ' «' + name + '»? Цю дію не можна скасувати.',
    confirmText: 'Видалити',
    onConfirm: function () { deleteRecord(entityKey, key); }
  });
}

function deleteRecord(entityKey, key) {
  // Дані могли змінитися в іншій вкладці, поки було відкрито підтвердження
  if (findUsages(entityKey, key).length) {
    requestDelete(entityKey, key);
    return;
  }
  const entity = entities[entityKey];
  const index = db[entityKey].findIndex(function (r) { return String(r[entity.keyField]) === String(key); });
  if (index === -1) return;

  const removed = db[entityKey].splice(index, 1)[0];
  saveData();
  renderAll();
  showToast(entity.singular + ' «' + removed[entity.labelField] + '» видалено');
}

// ===================== Попап повідомлень =====================

const messageDialog = document.getElementById('message-dialog');
const messageHead = document.getElementById('message-head');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const messageList = document.getElementById('message-list');
const messageOk = document.getElementById('message-ok');
const messageCancel = document.getElementById('message-cancel');

let messageConfirm = null; // що виконати після натискання основної кнопки

// options: { type: 'error' | 'confirm', title, text, list, confirmText, onConfirm }
function showMessage(options) {
  messageTitle.textContent = options.title;
  messageText.textContent = options.text;

  messageList.innerHTML = '';
  (options.list || []).forEach(function (line) {
    const li = document.createElement('li');
    li.textContent = line;
    messageList.appendChild(li);
  });
  messageList.hidden = !options.list || options.list.length === 0;

  const isConfirm = options.type === 'confirm';
  messageHead.classList.add('danger');
  messageCancel.hidden = !isConfirm;
  messageOk.textContent = isConfirm ? options.confirmText : 'Зрозуміло';
  messageOk.className = 'btn ' + (isConfirm ? 'btn-danger' : 'btn-primary');
  messageConfirm = isConfirm ? options.onConfirm : null;

  if (messageDialog.open) messageDialog.close();
  messageDialog.showModal();
  (isConfirm ? messageCancel : messageOk).focus();
}

messageOk.addEventListener('click', function () {
  const action = messageConfirm;
  messageDialog.close();
  if (action) action();
});
messageCancel.addEventListener('click', function () { messageDialog.close(); });
document.getElementById('message-close').addEventListener('click', function () { messageDialog.close(); });
messageDialog.addEventListener('click', function (event) {
  if (event.target === messageDialog) messageDialog.close();
});
messageDialog.addEventListener('close', function () { messageConfirm = null; });

// ===================== Відновлення початкових даних =====================

document.getElementById('reset-btn').addEventListener('click', function () {
  showMessage({
    type: 'confirm',
    title: 'Відновити початкові дані?',
    text: 'Усі додані, змінені та видалені записи буде повернуто до початкового стану (у всіх відкритих вкладках).',
    confirmText: 'Відновити',
    onConfirm: function () {
      db = cloneData(DEFAULT_DATA);
      saveData();
      renderAll();
      showToast('Початкові дані відновлено');
    }
  });
});

// ===================== Синхронізація між вкладками =====================
// Подія 'storage' приходить в усі ІНШІ вкладки тієї самої сторінки,
// коли одна з них змінює localStorage.

window.addEventListener('storage', function (event) {
  if (event.key !== STORAGE_KEY && event.key !== null) return; // null — localStorage.clear()

  db = loadData();

  // Незавершене редагування комірки скасовується — таблиця буде перемальована
  activeEdit = null;
  renderAll();
  refreshFormOptions();
  showToast('Дані оновлено з іншої вкладки');
});

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

renderAll();
initTableEvents();
initTabs();
