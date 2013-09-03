exports.action = function(data, callback, config, SARAH){
	var url="";

	// Récuperation de la config
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
	
	

	
	if (data.commande) {
	
		 if (data.commande == "redemarre" || data.commande == "redemarre") {
			// redemarre la camera : reinitialisation
			url = _urlcamera + _reboot;
			//console.log("Envoi de la requete a : " + url);
			var request = require('request');
			request({ 'uri' : url }, function (err, response, body){					
			if (err || response.statusCode != 200) {
				callback({'tts': "L'action a échoué"}); return;
			}
				callback({'tts': "La caméra redémarre !"});
				setTimeout(function(){SARAH.speak("La caméra est de nouveau disponible !");}, _delai_reset);
				return;
			});
		}
		
		else if (data.commande == "capture" || data.commande == "capture") {
			
			SARAH.remote({ 'run' : _Navigation, 'runp' : 'http://' + _authentification + _Ip_Camera + _capture });
				return callback({'tts': "La photo à été prise !"});
			
			
			
			url = 'http://' + _authentification + _Ip_Camera + _capture;
			// Prend une photo
			//console.log("Envoi de la requete a : " + url);
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


		else if (data.commande == "affiche" || data.commande == "affiche") {
			// Affichage la 'vue' de la camera dans vlc
			SARAH.remote({ 'run' : _Player, 'runp' : _Protocol + '://' + _authentification + _Ip_Camera + _stream});
			return callback({'tts': "J'ai affichai la caméra dans le lecteur multimédia."});

		} else {
		
			// Envoi de la requete

			var request = require('request');
			request({ 'uri' : url }, function (err, response, body){
			
				if (err || response.statusCode != 200) {
					callback({'tts': "L'action a échoué"});
					return;
				}
					
				return callback({'tts': "caméra en mouvement !"});
			});	
		}
	}
	
}

    
