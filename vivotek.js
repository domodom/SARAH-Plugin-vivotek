exports.init = function (SARAH){
  Connexion(SARAH.ConfigManager.getConfig());
  NameCam(SARAH.ConfigManager.getConfig());
  RefCam(SARAH.ConfigManager.getConfig());
}

exports.action = function(data, callback, config, SARAH) {

	// Vérification de la configuration

	config = config.modules.vivotek;

	if ((!config.adresse_ip) || (!config.protocol) || (!config.nom_flux)
			|| (!config.lien_capture) || (!config.user) || (!config.password)
			|| (!config.systeme)) {
		return callback({
			'tts' : 'Il me manque des paramètres pour le bon fonctionnement du pleuguine vivotek. '
		});
	}

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
	var parle = null;
	var body="Indéfinie";


	// 
	switch (data.setparam) {
	case 'affiche':
		run_vlc_command = 'vlc';
		parle = 'La caméra est maintenant affichée. ';
		parle1 = 'L\'affichage de la caméra à été fermé. ';
		break;
	case 'capture':
		run_viewer_command = 'capture';
		parle = 'La photo à été enregistrée dans le répertoire du pluguine. ';
		break;
	case 'redemarre':
		cgi_command = 'system_reset=0';
		parle = 'La caméra est en cours de redémarrage. ';
		break;
	case 'irmodeauto':
		cgi_command = 'ircutcontrol_mode=auto';
		parle = 'La caméra est maintenent en mode automatique. ';
		break;
	case 'irmodejour':
		cgi_command = 'ircutcontrol_mode=day';
		parle = 'La caméra est maintenent en mode jour. ';
		break;
	case 'irmodenuit':
		cgi_command = 'ircutcontrol_mode=night';
		parle = 'La caméra est maintenent en mode nuit. ';
		break;
	case 'enableprivacy':
		cgi_command = "privacymask_c0_enable=1";
		parle = 'Le masque est maintenant actif. ';
		break;
	case 'disableprivacy':
		cgi_command = "privacymask_c0_enable=0";
		parle = 'Le masque est maintenant inactif. ';
		break;
	case 'fermerplayer':
		kill_exec_command = 'vlc';
		parle = 'L\'affichage de la caméra à été fermé. ';
		break;
	case 'preset':
		preset_command = data.valpreset;
		parle = 'la caméra est positionnée sur ' + data.valpreset + '. ';
		break;

	case 'enablepatrol':
		eCamCtrl_command = 'auto=patrol';
		parle = 'La caméra effectue sa ronde. ';
		break;

	case 'disablepatrol':
		eCamCtrl_command = 'auto=stop';
		parle = 'La ronde de la caméra à été stoppée. ';
		break;
	case 'move':
		eCamCtrl_command = 'move=' + data.valmove;
		parle = ""
		break;
	case 'zoom':
		eCamCtrl_command = 'zoom=' + data.valzoom;
		parle = ""
		break;
	case 'updatepreset':
		get_presets ();
		parle = 'Mise a jour des presets terminé. ';
		break;
	default:
		break;
	}

	if (cgi_command) {
	var _auth = config.user + ":" + config.password + "@";
	var _set_cgi_url = '/cgi-bin/admin/setparam.cgi?';
	
		url = 'http://' + _auth + config.adresse_ip + _set_cgi_url
				+ cgi_command;

		var request = require('request');
		request({
			'uri' : url
		}, function(err, response, body) {
			if (err || response.statusCode != 200) {
				callback({
					'tts' : "La commande à échouée"
				});
				return;
			}
			callback({
				'tts' : parle
			});
			return;
		});
	}

	if (preset_command) {
		var _auth = config.user + ":" + config.password + "@";
		var _CtrlCam = '/cgi-bin/camctrl';
		var _eRecall = '/eRecall.cgi?stream=0&recall=';
		
		url = 'http://' + _auth + config.adresse_ip + _CtrlCam + _eRecall
				+ preset_command;
		var request = require('request');
		request({
			'uri' : url
		}, function(err, response, body) {
			if (err || response.statusCode != 200) {
				callback({
					'tts' : "La commande à échouée"
				});
				return;
			}
			callback({
				'tts' : parle
			});
			return;
			
		});
	}

	if (eCamCtrl_command) {
		var _auth = config.user + ":" + config.password + "@";
		var _CtrlCam = '/cgi-bin/camctrl';
		var _eCamCtrl = '/eCamCtrl.cgi?stream=0&'

		url = 'http://' + _auth + config.adresse_ip + _CtrlCam + _eCamCtrl
				+ eCamCtrl_command;
		var request = require('request');
		request({
			'uri' : url
		}, function(err, response, body) {
			if (err || response.statusCode != 200) {
				callback({
					'tts' : "La commande à échouée"
				});
				return;
			}
			callback({
				'tts' : parle
			});
			return;
			
		});
	}

	 if (run_vlc_command) {
		var _auth = config.user + ":" + config.password + "@";
		var spawn = require('child_process').spawn;
		switch (config.systeme) {

		case 'linux':
			var _Player = spawn('vlc', [
					'-f',
					'--sub-filter=logo',
					'--logo-file=' + __dirname + '/images/sarah.png',
					'--logo-position=4',
					config.protocol + '://' + _auth + config.adresse_ip
							+ config.nom_flux ]);

			_Player.on('exit', function(err) {
				if (err == 0) {
					callback({
						'tts' : parle1
					});
					return;
				}

			});
			callback({
				'tts' : parle
			});
			return;
			break;

		case 'windows':
		console.log('Systeme : ' + config.systeme);
		
		
			var _Player = spawn('C:\\Progra~1\\VideoLAN\\VLC\\vlc.exe',[
					'-f',
					'--sub-filter=logo ',
					'--logo-file=' + __dirname + '\\images\\sarah.png ',
					'--logo-position=4 ',
				    config.protocol + '://' + _auth + config.adresse_ip
							+ config.nom_flux]);

			_Player.on('exit', function(err) {
				if (err == 0) {
					callback({
						'tts' : parle1
					});
					return;
				}
			});
			callback({
				'tts' : parle
			});
			return;
			break;
		default:
			break;
		}
	}
//--
	if (run_viewer_command) {
		var _auth = config.user + ":" + config.password + "@";
		var _snapshot = "snapshot.jpg";
		var spawn = require('child_process').spawn;

		switch (config.systeme) {

		case 'linux':

			var _Wget = spawn('wget', [ '-O', __dirname + '/' + _snapshot,
					'http://' + _auth + config.adresse_ip + config.lien_capture ]);

			callback({
				'tts' : parle
			});
			return;
			break;

		case 'windows':
			SARAH.remote({
				'run' : 'C:\\WINDOWS\\SYSTEM32\\wscript.exe',
				'runp' : __dirname + '\\' + 'wget.vbs' + " " + 'http://'
						+ _auth + config.adresse_ip + config.lien_capture + " " + __dirname + '\\'
						+ _snapshot
			});
			callback({
				'tts' : parle
				});
			return;
			break;
		default:
			break;
		}

		callback({
			'tts' : parle
		});
	}


	if (kill_exec_command) {
		var spawn = require('child_process').spawn;

		switch (config.systeme) {

		case 'linux':
			var Prog = spawn('killall', ['vlc']);
			callback({
				'tts' : parle
			});
			return;
			break;

		case 'windows':

			var Prog = spawn('C:\\windows\\system32\\TASKKILL.exe', [ '/F',
					'/IM', 'vlc.exe', '/T' ]);
			callback({
				'tts' : parle
			});
			return;
			break;
		default:
			break;
		}
	}
}


		var NameCam = function (config) {
		var config = config.modules.vivotek;
		var auth = config.user + ':' + config.password;
		var url = 'http://'+ auth + '@' + config.adresse_ip + '/cgi-bin/admin/getparam.cgi?system_hostname=';
		var request = require('request');
		request({
			'uri' : url
		}, function(err, response, body) {
		if(body != null && body != undefined){
				NameCam = body.split("'");
				NameCam = NameCam[1];
				}
			if(body == null || body == undefined){
				NameCam = "Indéfinie";
			}
});
		return NameCam;
		
}

		var RefCam = function (config) {
		var config = config.modules.vivotek;
		var auth = config.user + ':' + config.password;
		var url = 'http://' + auth + '@' + config.adresse_ip + '/cgi-bin/admin/getparam.cgi?system_info_modelname=';
		var request = require('request');
		request({
			'uri' : url
		}, function(err, response, body) {
				if(body != null && body != undefined){
				RefCam = body.split("'");
				RefCam = RefCam[1];
				}
			if(body == null || body == undefined){
				RefCam = "Indéfinie";
			}
});
		return RefCam;
		
}

var Connexion = function (config) {	
	var config = config.modules.vivotek;
	var http = require('http');
	var options = {
	  hostname: config.adresse_ip,
	  port: 80,
	  path: '/',
	  auth: config.user + ':' + config.password
	};

	http.get(options, function(resultat) {
	
		resultat.on('data', function (chunk) {});
		resultat.on('end', function(){
		Connexion = 'active';
		console.log("La caméra IP est en ligne.");
				});
		}).on('error', function(e) {

		Connexion = 'inactive';
		console.log("La caméra IP est hors ligne.");
		
		});
	return Connexion;	
}

exports.Connexion  = Connexion;
exports.RefCam = RefCam;
exports.NameCam = NameCam;

exports.cron = function (callback, task, SARAH) 
{
Connexion;
}