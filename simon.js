var strict = false;
var on = false;
var color = {
	"topleft": ["rgb(0, 255, 0)","rgb(0, 167, 74)"],
	"topright": ["blue","rgb(9, 74, 143)"],
	"botleft": ["yellow","rgb(204, 167, 7)"],
	"botright": ["red", "rgb(159, 15, 23)"]
};

var list = [];
var index = 0;
var count = 1;
var usrPlay = false;
var playing = false;
var waitTimeout;
var context = new window.AudioContext();
var osc = null;

var frequencies = {
	'topleft': 329.63,
	'topright':261.63,
	'botleft': 220,
	'botright':164.81
};

$(document).ready(function(){

	function comPlay(num, time){
		var i = 0;
		clearTimeout(waitTimeout);
		var interval = setInterval(function(){
			if (on){
				//audio[list[i]].play();
				//osc.frequency.value = frequencies[i];
				//osc.play(0);
				osc = context.createOscillator();
				osc.frequency.value = frequencies[list[i]];
				osc.connect(context.destination);
				osc.start(0);
				setTimeout(function(){
					if (i !== 0){
						$("#" + list[i - 1]).css("background-color",color[list[i - 1]][1]);
					}
					osc.disconnect(context.destination);
					osc = null;
				}, time - 200);
				$("#" + list[i]).css("background-color",color[list[i]][0]);
				i++;
				if (i === num){
					setTimeout(function(){
						usrPlay = true;	
					}, time - 200);
					waitTimeout = setTimeout(function(){
						if (on){
							whenWrong();
						}
					}, 5000);
					clearInterval(interval);
				}
			}
			else {
				clearInterval(interval);
			}
		}, time);
	}

	function genList(){
		list = [];
		for (var i = 0; i < 20; i++){
			var num = Math.floor(1 + 4*Math.random());
			switch (num){
				case 1:
					list.push("topleft");
					break;
				case 2:
					list.push("topright");
					break;
				case 3:
					list.push("botleft");
					break;
				case 4:
					list.push("botright");
			}
		}
	}

	function whenWrong(){
		clearTimeout(waitTimeout);
		console.log("error");
		if (strict){
			var nn = 0;
			var inter = setInterval(function(){
				$("#" + list[index]).css("background-color",color[list[index]][(nn % 2) ? 1 : 0]);
				nn++;
				if (nn === 6){
					index = 0;
					count = 1;
					$(".count").html(count);
					genList();
					setTimeout(comPlay(count, 1000), 1500);	
					clearInterval(inter);
				}
			}, 150);
		}
		else {
			var nn = 0;
			var inter = setInterval(function(){
				$("#" + list[index]).css("background-color",color[list[index]][(nn % 2) ? 1 : 0]);
				nn++;
				if (nn === 6){
					index = 0;
					setTimeout(comPlay(count, 1000), 1500);	
					clearInterval(inter);
				}
			}, 150);
		}
	}

	// Start here
	
	$(".btnOn").on("click", function(){
		if (on){
			on = false;
			if (osc){
				osc.disconnect(context.destination);
				osc = null;
			}
			$("#btnStart").css("background-color", "rgb(159, 15, 23)");
			$(".btnOn").css("color","rgb(100,100,100)");
			$(".count").html("");
			clearTimeout(waitTimeout);
		}
		else {
			playing = false;
			on = true;
			genList();
			console.log(list);
			index = 0;
			count = 1;
			usrPlay = false;
			$(".btnOn").css("color","white");
			$(".count").html(count);

		}
	});

	$("#btnStrict").on("click", function(){
		if (on){
			if (strict){
				strict = false;
				$(".light").css("background-color","black");
			}
			else {
				strict = true;
				$(".light").css("background-color","red");
			}
		}
	});

	$("#btnStart").on("click",function(){
		if (on && !playing) {
			$(this).css('background-color', 'red');
			comPlay(1, 1000);
			usrPlay = true;
			playing = true;
		}
	});

	$("#btnAgain").on("click",function(){
		$(".Win").css("visibility","hidden");
		genList();	
		index = 0;
		count = 1;
		usrPlay = false;
		$(".btnOn").css("color","white");
		$(".count").html(count);
		comPlay(1, 1000);
		usrPlay = true;
	});

	$(".cir").mousedown(function(){
		if (on && usrPlay){
			if ($(this).attr("id") === list[index]){
				osc = context.createOscillator();
				osc.frequency.value = frequencies[list[index]];
				osc.connect(context.destination);
				osc.start(0);
				clearTimeout(waitTimeout);
				$(this).css("background-color",color[$(this).attr("id")][0]);
				//audio[$(this).attr("id")].play();
				index++;
				console.log("index: " + index);
				console.log("count: " + count);
			}
			else {
				whenWrong();
			}
		}
	});
	$(".cir").mouseup(function(){
		if (on && usrPlay){
			$(this).css("background-color",color[$(this).attr("id")][1]);
			//audio[$(this).attr("id")].pause();
			//audio[$(this).attr("id")].currentTime = 0;
			if (osc){
				osc.disconnect(context.destination);
				osc = null;
			}
			if (index === count){
				if (count === 20){
					$(".Win").css("visibility","visible");
				}
				else {
					count++;
					$(".count").html(count);
					index = 0;
					usrPlay = false;
					setTimeout(comPlay(count, 1000), 200);
				}
			}
			else {
				waitTimeout = setTimeout(function(){
					if (on){
						console.log("Time Out");
						whenWrong();
					}
				}, 5000);
			}
		}
	});
});