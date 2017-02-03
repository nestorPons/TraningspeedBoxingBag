var bel = null;
var storage = window.localStorage;
var pause=false;
var cronometer = null;
var crono = null;
var config = new Array();

function isEmpty(arg){
	if(arg==='undefined'||arg===null||isNaN(arg)) return true;
}
var present = new Array();
var presents = new Array();
presents[0] = {
	name: 'H.I.I.T',
	min:7,
	max: 13,
	seg: 30,
	min: 0
}
presents[1] = {
	name: 'Boxing',
	min:10,
	max: 15,
	seg: 0,
	min: 3
}
presents[2] = {
	name: 'M.M.A.',
	min:13,
	max: 17,
	seg: 0,
	min: 5
}
var colors = ['orange', 'yellow', 'blue', 'red', 'green', 'purple'];
var en = {
	tile: 'Traning speed boxing bag',
	start: 'Start',
	stop: 'Stop',
	go: 'Go!',
	timer: 'Timer',
	music: 'Sound',
	on: 'On',
	off: 'Off',
	presents: 'Select type traning' 
}
var lang = en;
var app = {
    // Application Constructor
        initialize: function() {

		load();
		$('.icon-cog').click(function(){
			reset();
			$('#config').show()
		});
		$('.icon-cancel-circle').click(function(){
			save(
				function(){
					$('#config').hide();
					load();
				})
		})
		$('.digit').blur(function(){$(this).val(leadingZero($(this).val()))});
		$('#presents').change(function(){

			present = presents[parseInt($('#presents').val())];
			save(load,present.min,present.seg)
		})
        this.bindEvents();
		$('body').show();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		beep1 = new Media('sounds/beep1.mp3');
		beep2 = new Media('sounds/bel2.mp3');
		beep3 = new Media('sounds/bone-crack.mp3');
		beep4 = new Media('sounds/bel1.mp3');
		
		
		console.log('receivedEvent')
		/*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
		*/
    },
	start: function(){
		
		var seg = 1;
		if(storage.getItem("sound")) beep1.play();
		$('#btn').text(seg);
			
		crono  = setInterval(function(){
			++seg;
			$('#btn').text(seg);
			if(seg>=4){
				seg =0 ;
				clearInterval(crono);		
				$('#btn').text(lang.go);
				app.training();
			}else{
				if(storage.getItem("sound")) beep1.play();
			}
		}, 1000);
	},
	training: function(){
		if(storage.getItem("sound")) beep2.play()
		$('#btn')
			.empty()
			.addClass('icon-pause')
			.click(function(){
				if(pause){
					pause = false;
					$('#btn')
						.removeClass('icon-play')
						.addClass('icon-pause')
				}else{
					pause = true;
					$('#btn')
						.removeClass('icon-pause')
						.addClass('icon-play')
				}
			})

		var time = numeroAleatorio(present.min,present.max);
		var count = 0;
		
		cronometer = setInterval(function(){
			if(!pause){
				if(config.mili<=0){
					if(config.seg<=0){
						if(config.min<=0) {
								if(storage.getItem("sound")) beep4.play();	
								reset();
						}else{
							config.min--;
							config.seg = 60;
						}
					}else{
						config.seg--;							
						config.mili = 100;
					}
				}else{
					config.mili--;				
				}
					
				$('#mili').text(leadingZero(config.mili))
				$('#seg').text(leadingZero(config.seg));
				$('#min').text(leadingZero(config.min));
			}
		},10);
		
		crono = setInterval(function(){
			if(!pause){
				if (count==time){
					changeColor();
					time =  numeroAleatorio(present.min,present.max);
					count= 0;
				}
				count++;
			}
		}, 100);		
	}
};
function reset(){
	clearInterval(crono);
	clearInterval(cronometer);
	$('#btn')
		.removeClass()
		.off()
	pause = false;
	load();
}
function load(){

	(function cargarConfig(){
		var seg = !isEmpty(storage.getItem("seg"))?parseInt(storage.getItem("seg")):60;
		var min = !isEmpty(storage.getItem("min"))?parseInt(storage.getItem("min")):60;
		var sound = storage.getItem("sound")=='true';
		var present = !isEmpty(storage.getItem("present"))?parseInt(storage.getItem("present")):1;

		config = {
			min: min,
			seg: seg,
			mili: 00 ,
			sound: sound,
			present: present,
		}		
	})()
	present = presents[config.present];
	
	$('#configMin').val(leadingZero(config.min));
	$('#configSeg').val(leadingZero(config.seg));
	$('#tile').text(lang.tile);
	$('#lblTimer').text(lang.timer);
	$('#lblMusic').text(lang.music);
	$('#soundOn').text(lang.on);
	$('#soundOff')	.text(lang.off);

	$('#sound').prop('checked',config.sound);
	$('#lblPesents').text(lang.presents);
	$('#btn')
		.text(lang.start)
		.click(function(){	
			if($(this).text()==lang.start) app.start();
		});
	$('#mili').text('00')
	$('#seg').text(leadingZero(config.seg));
	$('#min').text(leadingZero(config.min));
}
function save(callback,min,seg){
	var min = isEmpty(min)?$('#configMin').val():min;
	var seg = isEmpty(seg)?$('#configSeg').val():seg;

	storage.setItem("min", min)
	storage.setItem("seg", seg)
	storage.setItem("sound", $('#sound').is(':checked'));
	storage.setItem("present",  $('#presents').val());

	if(typeof(callback) == 'function') callback();
}
function loadPresents(){
	$()
}
function changeColor(){
	var n = numeroAleatorio(0,colors.length);
	if($('#btn').is('.'+colors[n]))
			n = (n==present.max)?n--:n++;
		 
	if(storage.getItem("sound")) beep3.play();
	$('#btn')
		.removeClass()
		.addClass(colors[n]);

	return colors[n];
}
function leadingZero(Time) { 
		var n = (Time < 10) ? "0" + Time : + Time;
		if(n.length>2) n = n.substr(1);
		return n;
}
function numeroAleatorio(min, max) {
	var n = Math.round(Math.random() * (max - min) + min);
	return n ;
}

