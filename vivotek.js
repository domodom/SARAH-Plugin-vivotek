exports.action = function(data, callback, config, SARAH){
	var url="";

	// Vérification de la configuration
	config = config.modules.vivotek;
	
	if (config.adresse_ip == "[FIXME]"){
		console.log("L'adresse IP e la caméra n'est pas renseignée.");
		return callback({'tts' : "L'adresse IP de la caméra n'est pas renseignée."});
	}

	if (config.num_port == "[FIXME]"){
		console.log("e Port de la caméra n'est pas renseigné.");
		return callback({'tts' : "Le Port de la caméra n'est pas renseigné."});
	}
	if (config.protocol == "[FIXME]"){
		console.log("Le protocol de la caméra n'est pas renseigné.");
		return callback({'tts' : "Le protocole de la caméra n'est pas renseigné."});
	}
		if (config.nom_flux == "[FIXME]"){
		console.log("Le nom du flux de la caméra n'est pas renseigné.");
		return callback({'tts' : "Le nom du flux de la caméra n'est pas renseigné."});
	}
	if (config.lien_capture == "[FIXME]"){
		console.log("Lien permettant de prendre une photo.");
		return callback({'tts' : "Le lien permettant de prendre une photo de la caméra n'est pas renseigné."});
	}
	if (config.user == "[FIXME]"){
		console.log("L'utilisateur de la caméra n'est pas renseigné.");
		return callback({'tts' : "L'utilisateur de la caméra n'est pas renseigné."});
	}

	if (config.password == "[FIXME]"){
		console.log("Le mot de passe de la caméra n'est pas renseigné.");
		return callback({'tts' : "Le mot de passe de la caméra n'est pas renseigné."});
	}		

	
	// variables
	var _Ip_Camera = config.adresse_ip + "/";
	var _Port_Camera = config.num_port;
	var _User = config.user;
	var _Password = config.password;
	var _Protocol = config.protocol;
	var _stream = config.nom_flux;
	var _capture = config.lien_capture;	
	var _authentification = _User + ":" + _Password + "@";
	var _Player = "C:\\Program Files\\VideoLAN\\VLC\\vlc.exe";
	var _Navigation = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	
	//
	var _reboot = 'cgi-bin/admin/setparam.cgi?system_reset=0';
	//var _infrarouge = 'cgi-bin/admin/setparam.cgi?ircutcontrol_disableirled=1';

	var _IR_Mode_Auto ='cgi-bin/admin/setparam.cgi?ircutcontrol_mode=auto';
	var _IR_Mode_Jour ='cgi-bin/admin/setparam.cgi?ircutcontrol_mode=day';
	var _IR_Mode_Nuit ='cgi-bin/admin/setparam.cgi?ircutcontrol_mode=night';

	var _Enable_PrivacyMask ='cgi-bin/admin/setparam.cgi?privacymask_c0_enable=1';
	var _Disable_PrivacyMask ='cgi-bin/admin/setparam.cgi?privacymask_c0_enable=0';
	
	var _temp ='45000';
	

	
	if (data.commande) {
	
		 if (data.commande == "redemarre" || data.commande == "redemarre") {
			
			 // redémarrage de la camera
			url = 'http://' + _authentification + _Ip_Camera + _reboot;
			
			var request = require('request');
			request({ 'uri' : url }, function (err, response, body){					
			if (err || response.statusCode != 200) {
				callback({'tts': "L'action a échoué"}); return;
			}
				callback({'tts': "La caméra est en cours de redémarrage"});
				setTimeout(function(){SARAH.speak("La caméra est de nouveau disponible !");}, _temp);
				return;
			});
		}
		
		else if (data.commande == "capture" || data.commande == "capture") {
			
			SARAH.remote({ 'run' : _Navigation, 'runp' : 'http://' + _authentification + _Ip_Camera + _capture });
			return callback({'tts': "La photo à été prise !"});
			
			
			
			//url = 'http://' + _authentification + _Ip_Camera + _capture;
			var request = require('request');
			request({ 'uri' : url }, function (err, response, body){			
				if (err || response.statusCode != 200) {
					callback({'tts': "L'action a échoué"});
					return;
				}
				SARAH.remote({ 'run' : _Navigation, 'runp' :  '-chrome' + " " + 'http://' + _authentification + _Ip_Camera + _capture });
				return callback({'tts': "La photo à été prise !"});
				
				
			});
		}		

		else if (data.commande == "irmodeauto" || data.commande == "irmodeauto") {
			
			 // infrarouge de la camera en mode auto
			url = 'http://' + _authentification + _Ip_Camera + _IR_Mode_Auto;
			
			var request = require('request');
			request({ 'uri' : url }, function (err, response, body){					
			if (err || response.statusCode != 200) {
				callback({'tts': "L'action a échoué"}); return;
			}
				callback({'tts': "L'infrarouge de la caméra est en mode auto"});
				return;
			});
		}
		 
		else if (data.commande == "irmodejour" || data.commande == "irmodejour") {
			
			 // infrarouge de la camera en mode Jour
			url = 'http://' + _authentification + _Ip_Camera + _IR_Mode_Jour;
			
			var request = require('request');
			request({ 'uri' : url }, function (err, response, body){					
			if (err || response.statusCode != 200) {
				callback({'tts': "L'action a échoué"}); return;
			}
				callback({'tts': "L'infrarouge de la caméra est en mode jour"});
				return;
			});
		}
		 
		else if (data.commande == "irmodenuit" || data.commande == "irmodenuit") {
			
			 // infrarouge de la camera en mode Nuit
			url = 'http://' + _authentification + _Ip_Camera + _IR_Mode_Nuit;
			
			var request = require('request');
			request({ 'uri' : url }, function (err, response, body){					
			if (err || response.statusCode != 200) {
				callback({'tts': "L'action a échoué"}); return;
			}
				callback({'tts': "L'infrarouge de la caméra est en mode nuit"});
				return;
			});
		}
		 
		else if (data.commande == "enableprivacy" || data.commande == "enableprivacy") {
			
			 // Active le masque de la caméra
			url = 'http://' + _authentification + _Ip_Camera + _Enable_PrivacyMask;
			
			var request = require('request');
			request({ 'uri' : url }, function (err, response, body){					
			if (err || response.statusCode != 200) {
				callback({'tts': "L'action a échoué"}); return;
			}
				callback({'tts': "Le masque de la caméra est actif"});
				return;
			});
		}
		 
		else if (data.commande == "disableprivacy" || data.commande == "disableprivacy") {
			
			 // Désactive le masque de la caméra
			url = 'http://' + _authentification + _Ip_Camera + _Disable_PrivacyMask;
			
			var request = require('request');
			request({ 'uri' : url }, function (err, response, body){					
			if (err || response.statusCode != 200) {
				callback({'tts': "L'action a échoué"}); return;
			}
				callback({'tts': "Le masque de la caméra est actif"});
				return;
			});
		}

		else if (data.commande == "affiche" || data.commande == "affiche") {
			
			// Affichage la 'vue' de la camera dans vlc
			SARAH.remote({ 'run' : _Player, 'runp' : _Protocol + '://' + _authentification + _Ip_Camera + _stream});
			return callback({'tts': "J'ai affiché la caméra dans le lecteur multimédia."});

		} else {

			var request = require('request');
			request({ 'uri' : url }, function (err, response, body){
			
				if (err || response.statusCode != 200) {
					callback({'tts': "L'action a échoué"});
					return;
				}
					
				return callback({'tts': "caméra inaccessible !"});
			});	
		}
	}
	
}

    
