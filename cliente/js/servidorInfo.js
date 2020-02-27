//ip y puerto al que se le realizaran los pedidos
var servidor = 'https://geofobalstats.herokuapp.com';
//var servidor = 'http://localhost:8081';
var torneoactual = 5
var tipotorneo = 'Geofobal'


//Otras Funciones

function addZeroes( value ) {
    //set everything to at least two decimals; removs 3+ zero decimasl, keep non-zero decimals
    var new_value = value*1; //removes trailing zeros
    new_value = new_value+''; //casts it to string
  
    pos = new_value.indexOf('.');
    if (pos==-1) new_value = new_value + '.0';
    else {
        var integer = new_value.substring(0,pos);
        var decimals = new_value.substring(pos+1);
        while(decimals.length<1) decimals=decimals+'0';
        new_value = integer+'.'+decimals;
    }
    return new_value;
  }