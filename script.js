
// убираем действия браузера по умолчанию
document.body.onselectstart = function(){
    return false;
}
document.body.ondragstart = function() {
    return false;
};
/////////////////////////////////////

const ocean = document.querySelector('#ocean');

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
    }
}

let los = new ObjFish("атлантическая скумбрия","https://ru.wikipedia.org/wiki/%D0%90%D1%82%D0%BB%D0%B0%D0%BD%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%BA%D1%83%D0%BC%D0%B1%D1%80%D0%B8%D1%8F","foto/скумбрия.png");
let rop = new ObjFish("тунец","","foto/тунец.png");
// let op = new ObjFish("Карп1","https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D1%80%D0%BF%D1%8B","foto/carp1.png","scale(-1,1)");
let aop = new ObjFish("карп","https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D1%80%D0%BF%D1%8B","foto/carp.png");

function createFish(item){
    let img = document.createElement('img');
    
    img.src = item.path;
    img.setAttribute('alt', 'fish');
    img.setAttribute('name', item.name);
    img.className = 'fish active';
    img.style.width = randomInteger(150,300) + 'px';

    ocean.prepend(img);

    randomСoordinates(img,"null","null",lll=item.pointer)
    
    setInterval(()=> randomСoordinates(img,"null","null",lll=item.pointer), randomInteger(2000, 6000));
}

//запускаем стартовое количество рыб
for(let i=0; i<=4; i++){
    listFish.forEach(item => {
        // createFish(item)
    })
}



//функция смены координат
function randomСoordinates(elem,left,top,lll = 'scale(1)') {
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
            elem.style.transform = `rotateZ(${57.2958*(Math.atan(y/x))}deg) ${lll}`;
        }else{
            
            elem.style.transform = `rotateZ(${57.2958*(Math.atan(y/x)+Math.PI)}deg) rotateX(180deg) ${lll}`;
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

let check = 0;

let shot = document.createElement('div');
ocean.prepend(shot)

//отслеживаем клики мыши
ocean.addEventListener('mousedown', function(event){
    
    let  target = event.target;

    
    if(target.classList.contains('fish')){
        if(check)fire.play();
        kill(target);
    }else if(target.classList.contains('sound')){
        soundOn();
    }else if(target.classList.contains('plus')){
        addFish()
    }else if(target.classList.contains('minus')){
        dellFish()
    }else if(target.closest('.btn')){
        return;
    }else{
        if(check)fire.play();
        shot.classList.add('shot');
        shot.style.left = event.clientX - 10 + 'px';
        shot.style.top =event.clientY - 10 + 'px';
    }
    
    
}, false);

ocean.addEventListener('mouseup', ()=>{
    if(document.querySelectorAll('.active').length<1) minus.hidden = true;
}, false);

//удаляем рыб по одной
function kill(target){
    let rotate = target.style.transform;
    
    createNotification(target);
    target.classList.remove('active');
    randomСoordinates(target,target.offsetLeft, -300);
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

const minus = document.querySelector('.minus');

//добавляем рыб
function addFish(){
    listFish.forEach(item => {
        createFish(item)
    }); 
    minus.hidden = false;
}

//удаляем кол-во рыб 
function dellFish(){

    for(let i=0; i<=listFish.length-1; i++) {
        let kill = document.querySelector('.active');
        if(kill){
            kill.className = '';
            kill.classList.add('fish');

        }
    }
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
    
    let timer = setTimeout(()=>notification.remove(),1500);

    notification.onmouseenter = ()=>{
        clearTimeout(timer);
        if(params.link){
            notification.insertAdjacentHTML('beforeend', `<a href='${params.link}' target='blank'>Узнать больше</a>`);
        }else{
            notification.insertAdjacentHTML('beforeend', `<a href='#'>нет информации</a>`);
        }
   } 

   notification.onmouseleave = ()=>{
       timer = setTimeout(()=>notification.remove(),1500);
       notification.lastChild.remove()
   }

}
//////////////////////////////////////////////////////////

// document.querySelector('.btn-top').onclick = ()=> {
//     document.querySelector('.fish-box').classList.toggle('fish-box-on');p()
// }

// let i = 0;
// function p(){

//     let arrow =document.querySelectorAll('.arrow span')
    
//     setInterval(()=>{
//         arrow[i].classList.toggle('arrowOff');
//         (i < arrow.length-1) ? i++ : i=0;
    
//     },300)
// }

let form = document.forms.modalBox;
// console.log(form)

function gg(){
    let ff = listFish.find(item => item.name == form.fishName.value.toLowerCase().split(' ').join(''))
    if(ff){
        let y = prompt(`К СОЖАЛЕНИЮ "${form.fishName.value.toUpperCase()}" УЖЕ ИМЕЕТСЯ. Можно назвать `,`${form.fishName.value} с пивом`)
        form.fishName.value = y || '';
    }
}

    form.send.onchange = ()=>gg(); 
    form.fishName.onblur = ()=>gg();


form.file.onchange = ()=>{
     form.urlFish.value = form.file.value || form.urlFish.value;
    //  console.log(form.urlFish.value)
     ooo(form.urlFish.value)
     
    }
    
    form.urlFish.oninput = ()=>{

        form.urlFish.value ||  form.file.value;
        form.file.value = '';
        ooo(form.urlFish.value)
        
}

function ooo(ddd){
    let k = ['.svg', '.png', '.jpg']

    document.querySelector('.fish-box').classList.remove('fish-box-on');

    for(let i of k){

        if(ddd.endsWith(i)){
            formImg.onerror = ()=>console.log('yes')
            formImg.src = ddd;
            
            document.querySelector('.fish-box').classList.add('fish-box-on');
        }
    }
    // console.log(formImg.complete)
}

