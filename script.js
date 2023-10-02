
// убираем действия браузера по умолчанию
document.body.onselectstart = function(){
    return false;
}
document.body.ondragstart = function() {
    return false;
};
/////////////////////////////////////

const ocean = document.querySelector('#ocean');
ocean.onmousemove = ()=>{
    ocean.style.cursor = `url('foto/icons/sniper.png')24 24 ,none`;
}

let oceanAudio = new Audio("audio/ocean.mp3");
oceanAudio.loop = true;

const sound = document.querySelector('.sound');

// создаем рыбок
let listFish = [];

class ObjFish{
    constructor(name,link,path,pointer){
        this.name = name;
        this.link = link;
        this.path = path;
        this.pointer = pointer;
        listFish.push(this);
        createList(this.name,this.path)

    }
}

new ObjFish("атлантическая скумбрия","https://ru.wikipedia.org/wiki/%D0%90%D1%82%D0%BB%D0%B0%D0%BD%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%BA%D1%83%D0%BC%D0%B1%D1%80%D0%B8%D1%8F","foto/скумбрия.png");
new ObjFish("длиннохвостый тунец","https://ru.wikipedia.org/wiki/%D0%94%D0%BB%D0%B8%D0%BD%D0%BD%D0%BE%D1%85%D0%B2%D0%BE%D1%81%D1%82%D1%8B%D0%B9_%D1%82%D1%83%D0%BD%D0%B5%D1%86","foto/тунец.png");
new ObjFish("карп","https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D1%80%D0%BF%D1%8B","foto/карп.png");
new ObjFish("кета","https://ru.wikipedia.org/wiki/%D0%9A%D0%B5%D1%82%D0%B0","foto/кета.png", 'scale(-1,1)');
new ObjFish("микижа","https://ru.wikipedia.org/wiki/%D0%9C%D0%B8%D0%BA%D0%B8%D0%B6%D0%B0","foto/микижа.png");
new ObjFish("горбуша","https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D1%80%D0%B1%D1%83%D1%88%D0%B0","foto/горбуша.png");

let start = Date.now();

function createFish(item){
    let img = document.createElement('img');
    
    img.src = item.path;
    img.setAttribute('alt', 'fish');
    img.setAttribute('name', item.name);
    img.className = 'fish active';
    img.style.height = randomInteger(40,90) + 'px';

    ocean.prepend(img);
    
    randomСoordinates({elem:img, rotate: item.pointer});

    setTimeout(function run() {
        randomСoordinates({elem:img, rotate: item.pointer});
        setTimeout(run, randomInteger(2000, 7000));
      }, randomInteger(2000, 7000));

}

//запускаем стартовое количество рыб
for(let i=0; i<=4; i++){
    listFish.forEach(item => {
        createFish(item)
    })
}



//функция смены координат
function randomСoordinates({elem,left,top,rotate= 'scale(1)'}) {
    let randomLeft,randomTop;
    let center = ocean.clientWidth /2;
    
    if(elem.classList.contains('active')){
        randomTop = randomInteger(-100, ocean.clientHeight);
        if(elem.getBoundingClientRect().left > center){
            randomLeft = randomInteger(-ocean.clientWidth, 0);
        } else{
            randomLeft = randomInteger(ocean.clientWidth, ocean.clientWidth*2);
        }

    }else{
        randomLeft = left;
        randomTop = top;
        elem.addEventListener("transitionend", ()=>elem.remove(), false);
    }


        let x = randomLeft - (elem.offsetLeft + elem.clientWidth / 2);
        let y = randomTop - (elem.offsetTop + elem.clientHeight / 2);
        
        if(x>=0){
            elem.style.transform = `rotateZ(${57.2958*(Math.atan(y/x))}deg) ${rotate}`;
        }else{
            
            elem.style.transform = `rotateZ(${57.2958*(Math.atan(y/x)+Math.PI)}deg) rotateX(180deg) ${rotate}`;
        }

        elem.style.left = randomLeft + 'px';
        elem.style.top = randomTop + 'px';
    }

//функция рандом
function randomInteger(min, max) {
    let rand = Math.random() * (max - min) + min;
    return Math.ceil(rand);
}

let fire = new Audio("audio/fire.mp3");
fire.pause();
fire.currentTime = 0.0;
fire.volume = 0.1;

let check = 0;
let click = 0;

let shot = document.createElement('div');
ocean.prepend(shot)

//отслеживаем клики мыши
ocean.addEventListener('mousedown', function(event){
    
    let  targetClass = event.target.classList;
    
    if(targetClass.contains('fish')){
        if(check)fire.play();
        kill(event.target);
    }else if(targetClass.contains('sound')){
        soundOn();
    }else if(targetClass.contains('list-fish')){
        document.querySelector('.list-box').classList.toggle('show');
    }else if(targetClass.contains('plus')){
        addFish();
        click = 0;
    }else if(targetClass.contains('minus')){
        dellFish();
    }else if(targetClass.contains('create')){
        arrow.classList.add('arrow')
        document.querySelector('.create-fish').classList.add('show');
        document.querySelector('.fish-box').classList.toggle('fish-box-on');
        window.onblur = ()=> {return false};
    }
    if(targetClass.contains('ocean') || targetClass.contains('fish')){
        document.querySelector('.list-box').classList.remove('show')
        
        if(check)fire.play();
        shot.classList.add('shot');
        shot.style.left = event.clientX - 10 + 'px';
        shot.style.top =event.clientY - 10 + 'px';
    }
    
    
}, false);

ocean.addEventListener('mouseup', ()=>{
    if(document.querySelectorAll('.active').length<1){
        minus.hidden = true;
        document.querySelector('.list-box').classList.remove('show');
    }

    shot.classList.remove('shot');
}, false);

//удаляем рыб по одной
function kill(target){
    let rotate = target.style.transform;
    
    createNotification(target);
    target.classList.remove('active');
    randomСoordinates({elem: target, left:target.offsetLeft, top: -300});
    target.style.pointerEvents = 'none';

    if(rotate.includes('rotateX')){
        if(rotate.includes('rotateX')&&rotate.includes('scale(-1, 1)')){
            target.style.transform = 'rotateX(180deg)';
        }else{
            target.style.transform = 'rotateZ(180deg)';
        }
    }else{
        if(rotate.includes('scale(-1, 1)')){
            target.style.transform = 'rotateZ(180deg)';
        }else{
            target.style.transform = 'rotateX(180deg) ';         
        }
    }

}

//вкл/выкл музыки
function soundOn(){
    if(check){
        oceanAudio.pause();
        check = 0;
        sound.src = 'foto/icons/volume_off.svg';
    }else{
        oceanAudio.play();
        check = 1;
        sound.src = 'foto/icons/volume_up.svg';
        window.onblur = function () {check = 1; soundOn()};

    }
}

//создание и заполнение списка с рыбами
function createList(name,path){
    let cloneElem = document.querySelector('.list-elem').cloneNode(true);
    
        cloneElem.querySelector('.nameFish').innerHTML =  `  
        <img class="del" src="foto/icons/delete.png" alt="del" title="Удалить этот вид">
        <p>${name}</p>`;
        
        cloneElem.querySelector('.img-fish').innerHTML =
        `<img src="${path}" alt="fish">`
        document.querySelector('.list-box').prepend(cloneElem)

}

//удаление рыб из списка
document.querySelector('.list-box').onclick = (e)=>{
    if(e.target.classList.contains('del')){
    let name = e.target.nextElementSibling.textContent;

        for (let elem of document.querySelectorAll(`[name = "${name}"]`)) {
            elem.classList.remove('active');
        }
        
        e.target.closest('.list-elem').remove();
    }
}

//форма для создания своих рыб
let err = document.querySelector('.error');
let form = document.forms.modalBox;

form.fishName.onblur = ()=>{
    let checkName = listFish.find(item => item.name == form.fishName.value.toLowerCase().split(' ').join(''))
    if(checkName){
        form.fishName.value = prompt(`К СОЖАЛЕНИЮ "${form.fishName.value.toUpperCase()}" УЖЕ ИМЕЕТСЯ. Можно назвать `,
        `${form.fishName.value} с пивом`) || '';
    }
};

form.file.onchange = ()=>{
    formImg.src = URL.createObjectURL(form.file.files[0])
    form.urlFish.value = formImg.src;
    err.classList.remove('show');
    form.file.value = '';
    form.urlFish.focus();
}

form.urlFish.oninput = ()=> {
    if(form.urlFish.value == formImg.src){
        err.classList.remove('show');
        return;
    }

    let valid = ['.svg', '.png', '.jpg'];

    try{
        for(let i of valid){
            if(new URL(form.urlFish.value).href.endsWith(i)){
                formImg.src =form.urlFish.value;
                err.classList.remove('show');
                break;
                
            }else{
                err.classList.add('show');
                err.innerHTML = 'Пожалуйста, введите правильный url.';
            }
        }

    }catch{
        formImg.src = 'foto/fish1.png';
        err.classList.add('show')
        err.innerHTML = 'Пожалуйста, введите правильный url.';
    }
}

form.querySelector('.pointer-right').onclick = ()=>formImg.style.transform = 'scale(-1,1)';
form.querySelector('.pointer-left').onclick = ()=>formImg.style.transform = 'scale(1)';

form.querySelector('.btn-top').addEventListener('click', ()=> {
    resetForm();
    arrow.classList.remove('arrow');
})
        
form.addEventListener('submit', function(event){
    event.preventDefault();
    let style; 
    
    if(form.formImg.style.transform.includes('scale(-1, 1)')){
        style = 'scale(-1,1)';
    }

    createFish(new ObjFish(form.fishName.value, form.inpLink.value, form.urlFish.value, style));

    resetForm()
})

function resetForm(){
    formImg.style.transform = 'scale(1)';
    formImg.src = "foto/fish1.png";
    form.reset();
    arrow.classList.remove('arrow')
    err.classList.remove('show');
    document.querySelector('.create-fish').classList.remove('show');
    form.querySelector('.fish-box').classList.remove('fish-box-on');
    window.onblur = function () {check = 1; soundOn()};
}


const minus = document.querySelector('.minus');

//добавляем рыб
function addFish(){
    click = 0;
    let k = document.querySelectorAll('.list-box p')
for(let i of k){

    listFish.find((item) =>{
        if(item.name == i.innerHTML){
                createFish(item)
        }
    } )
        
    }
        minus.hidden = false;
}


//удаляем кол-во рыб 
function dellFish(){
    if(++click == 5) akula();
        
    for(let i=0; i<=3; i++) {
        let kill = document.querySelector('.active');
        if(kill){
            kill.classList.remove('active');
        }
    }
}

function akula(){
    let akula = document.createElement('img')
    akula.classList.add('akula');
    akula.src = "foto/Акула.png";
    akula.style.zIndex = 1;
    akula.style.width = 600 + 'px';
    akula.style.left = ocean.clientWidth + akula.clientWidth + 'px';
    akula.style.top = randomInteger(-100, ocean.clientHeight) + 'px';
    ocean.append(akula)
    randomСoordinates({elem:akula, left: -1000, top: randomInteger(-100, ocean.clientHeight), rotate: "scale(-1,1)"});
}

//уведомления
function createNotification(target){
    for (let elem of document.getElementsByClassName('notification')) elem.remove();


    let notification = document.createElement('div');
    let params = listFish.find(item => item.name == target.getAttribute('name')) ;

    notification.className = 'notification btn';
    notification.id = 'notification';
    ocean.prepend(notification);

    notification.insertAdjacentHTML('afterbegin', `<img src='${params.path}' alt='fish' style='width:100px; transform:${params.pointer};'>`)
    notification.insertAdjacentHTML('beforeend', `<p>${params.name}</p>`)
    
    notification.style.top =notification.getBoundingClientRect().top + 115 + 'px';
    
    let timer = setTimeout(()=>notification.remove(),2000);

    notification.onmouseenter = ()=>{
        clearTimeout(timer);
        if(params.link){
            notification.insertAdjacentHTML('beforeend', `<a href='${params.link}' target='_blank'>Узнать больше</a>`);
        }else{
            notification.insertAdjacentHTML('beforeend', `<a href='#'>нет информации</a>`);
        }
   } 

   notification.onmouseleave = ()=>{
       timer = setTimeout(()=>notification.remove(),1500);
       notification.lastChild.remove()
   }
}