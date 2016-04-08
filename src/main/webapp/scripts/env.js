
var domain = window.location.hostname;
var restHost;
if(domain == "104.236.252.51" || domain == "app.fitoscanner.com"){
	restHost = domain+':8080';
}else{
	restHost = domain+':8081';
}
var restContext = 'tip_eiroa_mauro_server_backend';
var frontendContext = 'tip_eiroa_mauro_server_frontend';
