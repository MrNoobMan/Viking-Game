
function soundFX(){
	
	var stabFiles = ["soundfx/gore0.mp3", "soundfx/gore1.mp3"],
		bowFiles = ["soundfx/bowFire0.mp3", "soundfx/bowFire1.mp3"],
		woundFiles = ["soundfx/swing0.mp3", "soundfx/swing1.mp3"];
	
	this.stabSounds = [];
	this.bowSounds = [];
	this.woundSounds = [];
	
	this.init = function(){
		
		for(var j = 0; j < 25; j++){
			for(var i = 0; i < bowFiles.length; i++){
				var bowFx = new Audio(bowFiles[i]);
					bowFx.volume = .2;
					bowFx.load();
				this.bowSounds.push(bowFx);
			}
			for(var i = 0; i < woundFiles.length; i++){
				var woundFx = new Audio();
					woundFx.src = woundFiles[i];
					woundFx.volume = .25;
					woundFx.load();
				this.woundSounds.push(woundFx);
			}
			for(var i = 0; i < stabFiles.length; i++){
				var stabFx = new Audio();
					stabFx.src = stabFiles[i];
					stabFx.volume = .2;
					stabFx.load();
				this.stabSounds.push(stabFx);
			}
		}
	}

	this.getSound = function(sound){
		var snd = this[sound].find(findPlaybleAudio);
		snd.play();
	}
	
}

function findPlaybleAudio(e){
	return (e.currentTime == 0 || e.ended);
}