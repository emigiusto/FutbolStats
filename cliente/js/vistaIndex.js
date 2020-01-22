$(document).ready(iniciarIndex());

function iniciarIndex() {
    $('[data-toggle="tooltip"]').tooltip();
    llenarTablaPosiciones("#tablePosicionesGeoFutbol > tbody",3);
    //cargarJugadoresDeck();
}


function llenarTablaPosiciones(nombredom,torneoid) {
      $.getJSON(servidor + "/posiciones/"+ torneoid,
      function(jugadorstats) {
          
                  //SUMO PUNTOS A FAVOR Y CONTRA DE TODOS LOS QUE TENGAN >= 0.4 DE asistenciaalltime
                    var puntosfavorpartido = [];
                    var puntoscontrapartido = [];
                    
                    for (let index = 0; index < jugadorstats.length; index++) {
                      
                        if (jugadorstats[index].asistenciaalltime >= 0.4){
                          puntosfavorpartido.push(jugadorstats[index].PA);
                          puntoscontrapartido.push(jugadorstats[index].PAC);
                        }
                    }

                    //Calculo minimos y maximos para Of y Def Power
                    var minPF = Math.min.apply(null, puntosfavorpartido);
                    var maxPF = Math.max.apply(null, puntosfavorpartido);
                    var rangePF = maxPF - minPF
                    
                    var minPC = Math.min.apply(null, puntoscontrapartido);
                    var maxPC = Math.max.apply(null, puntoscontrapartido);
                    var rangePC = maxPC - minPC


                        //Recorro players y aplico a resultado los offpower y defpower
                for (let index = 0; index < jugadorstats.length; index++) {
                    //OFF Y DEF POWER
                    if (jugadorstats[index].asistenciaalltime < 0.4) {
                          jugadorstats[index].offpower = -1
                          jugadorstats[index].defpower = -1
                    } else {
                        jugadorstats[index].offpower = ((jugadorstats[index].PA-minPF)/rangePF)*10
                        jugadorstats[index].defpower = -((jugadorstats[index].PAC-maxPC)/rangePC)*10
                    }
                }
          

          var contenidoTabla = "";
          for (let index = 0; index < jugadorstats.length; index++) {
            
                var element = jugadorstats[index]
                
                if (typeof element.offpower !== 'number')
                    {var offpowerCorr = -1} else { var offpowerCorr = Math.round(element.offpower* 10) / 10;}; 
                if (typeof element.defpower !== 'number')
                    {var defpowerCorr = -1} else { var defpowerCorr = Math.round(element.defpower* 10) / 10;}; 
            
            if (element.asistenciatorneo>=0.4){
                var lineaTabla = 
                  '<tr><td scope="row"><a href="jugador.html?id=' + element.jugadorId +'">' + element.nombre + " " +element.apellido 
                  + '</a></th><td>'+ element.ganados +'</td><td>'
                  + element.perdidos +'</td><td>'
                  + element.empatados +'</td><td>' 
                  + element.totales + '</td><td>' 
                  + element.puntos + '</td><td>' 
                  + Math.round(element.puntosporpartido* 10) / 10 + '</td><td>'
                  + element.golesjugadortorneo + '</td><td>'
                  + Math.round(element.golesjugadorporpartido* 10) / 10 + '</td><td>'
                  + addZeroes(Math.round(element.eficienciaganados*100 * 10) / 10) + '%</td><td>'
                  + addZeroes(offpowerCorr) + '</td><td>' 
                  + addZeroes(defpowerCorr) + '</td><td>' 
                  + addZeroes(Math.round(element.asistenciatorneo*100 * 10) / 10) + '%</td></tr>'
            } else {var lineaTabla = ''}
                  contenidoTabla = contenidoTabla + lineaTabla
          }

          $(nombredom).html(contenidoTabla)
      })
}

function cargarJugadoresDeck() {
      /*<div class="card">
    <img src="..." class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
    </div>*/
  $.getJSON(servidor + "/players",
    function(data) {
      //Borro los contenedores de opciones
      $("#jugadoresDeck").html('');
      var contentSelection = "";
      var newline = ""

        for (i = 0; i < data.player.length; i++) {
          
          newline = '<div class="card" idplayer="'+  data.player[i].id +'">'
                    + '<img src="'+ data.player[i].foto +'" class="card-img-top" alt="..."><div class="card-body">'
                    + '<div class="tituloyracha"><h5 class="card-title">'+ data.player[i].nombre + ' ' +data.player[i].apellido + '</h5>'
                    + '<h4></h4></div>'
          + '<p class="card-text">'+ data.player[i].posicion +'</p>'
          + '<p class="card-text"><small class="text-muted">Last updated 1 mins ago</small></p></div></div>'

          contentSelection = contentSelection + newline;

            //ACTUALIZO LAS RACHAS
                $.getJSON(servidor + "/rachaPlayer?jugadorId=" + data.player[i].id,
                function(players) {
                    var racha = players.racha
                            if (racha>0 && racha<4) {
                              img = '<img class="rachaicon" src="img/iconos/index/racha/up-arrow.png" alt="">'
                            } else if (racha>=4){
                              img = '<img class="rachaicon" src="img/iconos/index/racha/fire.png" alt="">'
                            }
                            else if (racha === 0){
                              img = '<img class="rachaicon" src="img/iconos/index/racha/right-arrow.png" alt="">'
                            }
                            else if (racha < 0 && racha > -3){
                              img = '<img class="rachaicon" src="img/iconos/index/racha/diagonal-arrow.png" alt="">'
                            }
                            else if (racha <= -3){
                              img = '<img class="rachaicon" src="img/iconos/index/racha/down-arrow.png" alt="">'
                            }
                    $("[idplayer="+ players.jugadorId +"] h4").html(racha + img )
                })

        }

        $("#jugadoresDeck").html(contentSelection);

        $("div.card").click(function(e) {
          var idPlayer = (this).getAttribute("idplayer")
          window.location.replace("jugador.html?id=" + idPlayer);
        })
    });
  
}
//------------------------------------------------------------//
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
