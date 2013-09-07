/*
 ***********************************************
 * Fichier:vivotek.js
 * Date:04/09/2013
 * Version: 1.2
 * Auteur: Eddy TELLIER
 * Sarah plugin pour Caméra Vivotek
 ***********************************************
 */

exports.action = function(data, callback, config, SARAH) {

	// Vérification de la configuration

	config = config.modules.vivotek;

    // Verification de la configuration
	if (config.adresse_ip == "Ex : 192.168.1.200") {
		console.log("L'adresse IP e la caméra n'est pas renseignée.");
		return callback({
			'tts' : "L'adresse IP de la caméra n'est pas renseignée."
		});
	}

	if (config.protocol == "Ex : rtsp ou http") {
		console.log("Le protocol de la caméra n'est pas renseigné.");
		return callback({
			'tts' : "Le protocole de la caméra n'est pas renseigné."
		});
	}
	if (config.nom_flux == "Ex : live.sdp") {
		console.log("Le nom du flux de la caméra n'est pas renseigné.");
		return callback({
			'tts' : "Le nom du flux de la caméra n'est pas renseigné."
		});
	}
	if (config.lien_capture == "Ex : cgi-bin/viewer/video.jpg") {
		console.log("Lien permettant de prendre une photo.");
		return callback({
			'tts' : "Le lien permettant de prendre une photo de la caméra n'est pas renseigné."
		});
	}
	if (config.user == "Ex : admin") {
		console.log("L'utilisateur de la caméra n'est pas renseigné.");
		return callback({
			'tts' : "L'utilisateur de la caméra n'est pas renseigné."
		});
	}

	if (config.password == "Ex : admin") {
		console.log("Le mot de passe de la caméra n'est pas renseigné.");
		return callback({
			'tts' : "Le mot de passe de la caméra n'est pas renseigné."
		});
	}

	// Variables du fichier propriété

	var _Ip_Camera = config.adresse_ip + "/";
	var _Port_Camera = config.num_port;
	var _User = config.user;
	var _Password = config.password;
	var _Protocol = config.protocol;
	var _stream = config.nom_flux;
	var _capture = config.lien_capture;
	
	var _authentification = _User + ":" + _Password + "@";
	
	
    //var exec = require('child_process').exec;
    
    var cgi_command = null;
    var run_command = null;
	var patrol_command = null;
    var run_vlc_command = null;
	var run_viewer_command = null;
	var kill_exec_command = null;
	var preset_command = null;
	var move_command = null;
	var zoom_command = null;
	var eCamCtrl_command = null;
	
    var result = null;
    
	// Déclaration des CHEMINS pour les applications
	// Vous pouvez l'adaptez selon votre système
	// Ex : "C:\\Program Files (x64)\\etc..."

	var _PhotoViewer = '"C:\\Program Files\\Windows Photo Viewer\\PhotoViewer.dll"';
	var _Player = "C:\\Program Files\\VideoLAN\\VLC\\vlc.exe";
	var _Navigation = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";

	// -------------------------------------------------------------------

	var wscript="wscript.exe";
	var _rundll32="rundll32.exe";	
	var wgetvbs="wget.vbs";
	var script_wget_path="";
	var url = "";

	
	var _temp = '45000';

	// Variables des commandes CGI pour les caméras Vivotek
	var _cgi_url = 'cgi-bin/admin/setparam.cgi?';
	var _reboot = 'system_reset=0';
	var _IR_Mode_Auto = 'ircutcontrol_mode=auto';
	var _IR_Mode_Jour = 'ircutcontrol_mode=day';
	var _IR_Mode_Nuit = 'ircutcontrol_mode=night';
	var _Enable_PrivacyMask = 'privacymask_c0_enable=1';
	var _Disable_PrivacyMask = 'privacymask_c0_enable=0';

	var _snapshot = __dirname + "\\snapshot.jpg";
	
	// Commande CGI pour le contrôl PTZ
	var _CtrlCam = 'cgi-bin/camctrl/';
	var _eRecall = 'eRecall.cgi?stream=0&recall=';
	var _eCamCtrl = 'eCamCtrl.cgi?stream=0&'

	
    // 
    switch (data.setparam) {
        case 'affiche':
            run_vlc_command = 'vlc.exe';
            result = 'La caméra est maintenant affiché';
            break;
        case 'capture':
        	run_viewer_command = 'rundll32.exe';
            result = 'La photo à été prise et affichée';
            break;
        case 'redemarre':
        	cgi_command = 'system_reset=0';
            result = 'La caméra est en cours de redémarrage';
            break;
        case 'irmodeauto':
        	cgi_command = 'ircutcontrol_mode=auto';
            result = 'La caméra est maintenent en mode automatique';
            break;
		case 'irmodejour':
			cgi_command = 'ircutcontrol_mode=day';
            result = 'La caméra est maintenent en mode jour';
            break;
		case 'irmodenuit':
			cgi_command = 'ircutcontrol_mode=night';
            result = 'La caméra est maintenent en mode nuit';
            break;
		case 'enableprivacy':
			cgi_command = "privacymask_c0_enable=1";
            result = 'Le masque est maintenant actif';
            break;
		case 'disableprivacy':
			cgi_command = "privacymask_c0_enable=0";
            result = 'Le masque est maintenant inactif';
            break;
		case 'fermerplayer':
			kill_exec_command = 'vlc.exe';
            result = 'L\'affichage de la caméra à été fermée';
            break;	
		case 'fermerphoto':
			kill_exec_command = 'rundll32.exe';
            result = 'La photo de la caméra à été fermée';
            break;							
		case 'preset':
			preset_command = _eRecall + data.valpreset;
            result = 'la caméra est positionnée sur ' + data.valpreset;
            break;
			
		case 'enablepatrol':
            eCamCtrl_command =  'auto=patrol';
            result = 'La caméra effectue sa ronde';
            break;
			
        case 'disablepatrol':
            eCamCtrl_command = 'auto=stop';
            result = 'La ronde de la caméra à été stopée';
            break;
		case 'move':
            eCamCtrl_command = 'move=' + data.valmove;
			result = ""
            break;
		case 'zoom':
            eCamCtrl_command = 'zoom=' + data.valzoom;
			result = ""
            break;
			
        default :
            break;
    }

    if (cgi_command) {
	
		url = 'http://' + _authentification + _Ip_Camera + _cgi_url + cgi_command;

			var request = require('request');
			request({'uri' : url}, function(err, response, body) {
				if (err || response.statusCode != 200) {
					callback({'tts' : "La commande à échouée"});
					return;
				}
				callback({'tts' : result});
				return;
			});
    }
    
    if (preset_command) {
		
		url = 'http://' + _authentification + _Ip_Camera + _CtrlCam + _eRecall + preset_command;
			var request = require('request');
			request({'uri' : url}, function(err, response, body) {
				if (err || response.statusCode != 200) {
					callback({'tts' : "La commande à échouée"});
					return;
				}
				callback({'tts' : result});
				return;
			});	
    }
	
	if (eCamCtrl_command) {
		
		url = 'http://' + _authentification + _Ip_Camera + _CtrlCam + _eCamCtrl + eCamCtrl_command;
			var request = require('request');
			request({'uri' : url}, function(err, response, body) {
				if (err || response.statusCode != 200) {
					callback({'tts' : "La commande à échouée"});
					return;
				}
				callback({'tts' : result});
				return;
			});	
    }
	
    else if (run_vlc_command) {

				SARAH.remote({'run' : _Player,'runp' : _Protocol + '://' + _authentification + _Ip_Camera + _stream},function(err, response, body) {
				
				if (err || response.statusCode != 200) {
					callback({'tts' : "La commande à échouée"});
					console.log (response.statusCode)
					return;
				}
				callback({'tts' : result});
				return;
			});		
	}
	else if (run_viewer_command) {
			script_wget_path=__dirname + "\\" + wgetvbs;
			SARAH.remote({'run' : wscript, 'runp' : script_wget_path + " " + 'http://' + _authentification + _Ip_Camera +  _capture + " "  + _snapshot});
			SARAH.remote({'run' : _rundll32, 'runp' : " " + _PhotoViewer + ", ImageView_Fullscreen" + " " + _snapshot});	
			callback({'tts' : "La photo à été prise"});
		}
		    
	else if (kill_exec_command) {
	
			var spawn = require('child_process').spawn;
			var vlc = spawn('TASKKILL.exe', [ '/F', '/IM', kill_exec_command, '/T' ]);
			vlc.on('exit', function(err, response, body) {
				if (err || response == 218) {
					callback({'tts' : "La commande à échouée"});
					return;
				}
				callback({'tts' : result});
				return;
			});	
		}  				
	}
