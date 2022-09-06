function calendar(){

    calendar = {};

    // Названия месяцев
    calendar.monthName=[
        'Январь', 'Февраль', 'Март', 'Апрель',
        'Май', 'Июнь', 'Июль', 'Август',
        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    // Названия дней недели
    calendar.dayName=[
        'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'
    ];

    // Выбранная дата
    calendar.selectedDate = {
        'Day' : null,
        'Month' : null,
        'Year' : null
    };

    // ID элемента для размещения календарика
    calendar.element_id=null;

    // Выбор даты
    calendar.selectDate = function(day,month,year) {
        calendar.selectedDate={
            'Day' : day,
            'Month' : month,
            'Year' : year
        };
        calendar.drawCalendar(month,year);
    }

    // Отрисовка календарика на выбранный месяц и год
    calendar.drawCalendar = function(month,year) {
        var tmp='';
        tmp+='<table class="calendar" cellspacing="0" cellpadding="0">';

        // Месяц и навигация
        tmp+='<tr>';
        tmp+='<td class="navigation" '+
            'onclick="calendar.drawCalendar('+(month>1?(month-1):12)+
            ','+(month>1?year:(year-1))+');">&#9668;<\/td>';
        tmp+='<td colspan="5" class="navigation" '+
            'onclick="calendar.drawCalendar('+
            calendar.selectedDate.Month+','+
            calendar.selectedDate.Year+');">'+
            calendar.monthName[(month-1)]+' - '+year+'<\/td>';
        tmp+='<td class="navigation" '+
            'onclick="calendar.drawCalendar('+(month<12?(month+1):1)+
            ','+(month<12?year:(year+1))+');">&#9658;<\/td>';
        tmp+='<\/tr>';

        // Шапка таблицы с днями недели
        tmp+='<tr>';
        tmp+='<th>'+calendar.dayName[0]+'<\/th>';
        tmp+='<th>'+calendar.dayName[1]+'<\/th>';
        tmp+='<th>'+calendar.dayName[2]+'<\/th>';
        tmp+='<th>'+calendar.dayName[3]+'<\/th>';
        tmp+='<th>'+calendar.dayName[4]+'<\/th>';
        tmp+='<th class="holiday">'+calendar.dayName[5]+'<\/th>';
        tmp+='<th class="holiday">'+calendar.dayName[6]+'<\/th>';
        tmp+='<\/tr>';

        // Количество дней в месяце
        var total_days = 32 - new Date(year, (month-1), 32).getDate();
        // Начальный день месяца
        var start_day = new Date(year, (month-1), 1).getDay();
        if (start_day==0) { start_day=7; }
        start_day--;
        // Количество ячеек в таблице
        var final_index=Math.ceil((total_days+start_day)/7)*7;

        var day=1;
        var index=0;
        do {
            // Начало строки таблицы
            if (index%7==0) {
                tmp+='<tr>';
            }
            // Пустые ячейки до начала месяца или после окончания
            if ((index<start_day) || (index>=(total_days+start_day))) {
                tmp+='<td class="grayed"> <\/td>';
            }
            else {
                var class_name='';
                // Выбранный день
                if (calendar.selectedDate.Day==day &&
                    calendar.selectedDate.Month==month &&
                    calendar.selectedDate.Year==year) {
                    class_name='selected';
                }
                // Праздничный день
                else if (index%7==6 || index%7==5) {
                    class_name='holiday';
                }
                // Ячейка с датой
                tmp+='<td class="'+class_name+'" '+
                    'onclick="calendar.selectDate('+
                    day+','+month+','+year+');">'+day+'<\/td>';
                day++;
            }
            // Конец строки таблицы
            if (index%7==6) {
                tmp+='<\/tr>';
            }
            index++;
        }
        while (index<final_index);

        tmp+='<\/table>';

        // Вставить таблицу календарика на страницу
        var el=document.getElementById(calendar.element_id);
        if (el) {
            el.innerHTML=tmp;
        }
    }

    // ID элемента для размещения календарика
    calendar.element_id = 'calendar_table';

    // По умолчанию используется текущая дата
    calendar.selectedDate={
        'Day' : new Date().getDate(),
        'Month' : parseInt(new Date().getMonth())+1,
        'Year' : new Date().getFullYear()
    };

    // Нарисовать календарик
    calendar.drawCalendar(
        calendar.selectedDate.Month,
        calendar.selectedDate.Year
    );
}
// =========================================================== Игра
var area = document.getElementById('area');
var cell = document.getElementsByClassName('cell');
var currentPlayer = document.getElementById('curPlyr');

var player = "x";
var stat = {
    'x': 0,
    'o': 0,
    'd': 0
}
var winIndex = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [3,5,7]
];
// ячейки
for(var i = 1; i <= 9; i++) {
    area.innerHTML += "<div class='cell' pos=" + i + "></div>";
}
//функция клика
for (var i = 0; i< cell.length; i++) {
    cell[i].addEventListener('click', cellClick, false);
}
//определить занята ли ячейка или нет
function cellClick() {

    var data = [];

    if(!this.innerHTML) {
        this.innerHTML = player;
    }else {
        alert("Ячейка занята");
        return;
    }

    for(var i in cell){
        if(cell[i].innerHTML == player){
            data.push(parseInt(cell[i].getAttribute('pos')));
        }
    }
// логика положения яцеек
    if(checkWin(data)) {
        stat[player] += 1;
        restart("Выграл: " + player);
    }else {
        var draw = true;
        for(var i in cell) {
            if(cell[i].innerHTML == '') draw = false;
        }
        if(draw) {
            stat.d += 1;
            restart("Ничья");
        }
    }

    player = player == "x" ? "o" : "x";
    currentPlayer.innerHTML = player.toUpperCase();
}
// проверка на совпадает ли позиция игрока с выйгрышной позицией
function checkWin(data) {
    for(var i in winIndex) {
        var win = true;
        for(var j in winIndex[i]) {
            var id = winIndex[i][j];
            var ind = data.indexOf(id);

            if(ind == -1) {
                win = false
            }
        }

        if(win) return true;
    }
    return false;
}

function restart(text) {

    alert(text);
    for(var i = 0; i < cell.length; i++) {
        cell[i].innerHTML = '';
    }
    updateStat();
}

function updateStat() {
    document.getElementById('sX').innerHTML = stat.x;
    document.getElementById('sO').innerHTML = stat.o;
    document.getElementById('sD').innerHTML = stat.d;
}

// ------------------------------------------------
addAnother = function() {
    let text = prompt('Введите новый элемент', 0);
    var ul = document.getElementById("list");
    var li = document.createElement("li");
    var children = ul.children.length + 1
    li.setAttribute("id", "element"+children)
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li)
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function four(){
    let div = document.querySelectorAll(".hidden");
    let arr = new Array(div.length).fill(0).map((_, i) => i).sort(() => Math.random() - 0.5);

    for (let i = 0; i < 1; i++) {
        let rand_div = div[ arr[i] ];
        rand_div.classList.remove("hidden");
        rand_div.style.background = ` ${getRandomColor()}`;
    }

}


/* ----------------------- Задание 9 + 10  --------------------------- */
/* вывод всех полей на экран */
function Complete(){
    let checkEmail = function(userEmail){
        const rexEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
        return rexEmail.test(userEmail);
    }

    var Elem="\nИмя: " + document.Sel1.Name.value +
        "\nПароль: " + document.Sel1.Password_One.value +
        "\nEmail: " + document.Sel1.Email.value +
        "\nТелефон: " + document.Sel1.Phone.value +
        "\nПол: " + document.Sel1.Code.value +
        "\nВаша специализация: " + document.Sel1.mySelect.value +
        "\nСтрана: " + document.Sel1.mySelect2.value;

    if (checkEmail(document.Sel1.Email.value) &&  (document.Sel1.Password_One.value==document.Sel1.Password_Two.value))
        alert(Elem);
    else
        alert("Ошибка при вводе \nПопробуйте еще раз");
}


function regPassword(){
    var Password_One = document.getElementById("Password_One").value;
    var pas_regV = /^[a-z0-9]{6,}$/gi;
    if (Password_One.match(pas_regV) == null){
        document.getElementById("divPassword").innerHTML = "Пожалуйста, введите пароль в формате: Иван!";
        document.getElementById("Password_One").style.border="2px solid red";
    }
    else {
        document.getElementById("divPassword").innerHTML = "";
        document.getElementById("Password_One").style.border="2px solid green";
    }

    var Password_Two = document.getElementById("Password_Two").value;
    var pas_regV = /^[a-z0-9]{6,}$/gi;
    if (Password_Two.match(pas_regV) == null){
        document.getElementById("divPassword_Two").innerHTML = "Пожалуйста, введите совпадающие пароли!";
        document.getElementById("Password_Two").style.border="2px solid red";
    }
    else {
        document.getElementById("divPassword_Two").innerHTML = "";
        document.getElementById("Password_Two").style.border="2px solid green";
    }
}

function regPhone(){
    var Phone = document.getElementById("Phone").value;
    var phone_regV = /^\d[\d\(\)\ -]{4,9}\d$/;
    if (Phone.match(phone_regV) == null){
        divPhone.innerHTML = 'Пожалуйста, введите правильный номер телефона!'
        document.getElementById("Phone").style.border="2px solid red";
    }
    else {
        document.getElementById("divPhone").innerHTML = "";
        document.getElementById("Phone").style.border="2px solid green";
    }
}

function regName(){
    var Name = document.getElementById("Name").value;
    var name_regV = /[а-яА-я]+$/gi;
    if (Name.match(name_regV) == null){
        divName.innerHTML = "Пожалуйста, введите имя в формате: Иван!"
        document.getElementById("Name").style.border="2px solid red";
    }
    else {
        document.getElementById("divName").innerHTML = "";
        document.getElementById("Name").style.border="2px solid green";
    }
}

function regFacultet(){
    var facultet = document.getElementById("facultet").value;
    var facultet_regV = /[а-яА-я]+$/gi;
    if (facultet.match(facultet_regV) == null){
        divFacultet.innerHTML = "Пожалуйста, введите корректное название факультета!"
        document.getElementById("facultet").style.border="2px solid red";
    }
    else {
        document.getElementById("divFacultet").innerHTML = "";
        document.getElementById("facultet").style.border="2px solid green";
    }
}

function regCafedra(){
    var cafedra = document.getElementById("cafedra").value;
    var cafedra_regV = /[а-яА-я]+$/gi;
    if (cafedra.match(cafedra_regV) == null){
        divCafedra.innerHTML = "Пожалуйста, введите корректное название кафедры!"
        document.getElementById("cafedra").style.border="2px solid red";
    }
    else {
        document.getElementById("divCafedra").innerHTML = "";
        document.getElementById("cafedra").style.border="2px solid green";
    }
}

function regEmail(){
    var Email = document.getElementById("Email").value;
    var Email_regV = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    if (Email.match(Email_regV) == null){
        divEmail.innerHTML = "Пожалуйста, введите корректый email!"
        document.getElementById("Email").style.border="2px solid red";
    }
    else {
        document.getElementById("divEmail").innerHTML = "";
        document.getElementById("Email").style.border="2px solid green";
    }
}
$(document).ready(function(){
    $('a').on('click', function(e){
        e.preventDefault();
    });
    $('#ddmenu li').hover(function () {
        clearTimeout($.data(this,'timer'));
        $('ul',this).stop(true,true).slideDown(200);
    }, function () {
        $.data(this,'timer', setTimeout($.proxy(function() {
            $('ul',this).stop(true,true).slideUp(200);
        }, this), 100));
    });
});
// (function($) {
//     $(function() {
//         $('nav ul li a:not(:only-child)').click(function(e) {
//             $(this).siblings('.nalumes-nucludem').toggle();
//
//             $('.nalumes-nucludem').not($(this).siblings()).hide();
//             e.stopPropagation();
//         });
//
//         $('html').click(function() {
//             $('.nalumes-nucludem').hide();
//         });
//
//         $('#sadas-polnyus').click(function() {
//             $('nav ul').slideToggle();
//         });
//
//         $('#sadas-polnyus').on('click', function() {
//             this.classList.toggle('active');
//         });
//     });
// })(jQuery);














