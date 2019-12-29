

$(document).ready(iniciarIndex());

function iniciarIndex() {
    $('[data-toggle="tooltip"]').tooltip();
    listadoTorneos.actualizarTorneos();
    listadoJugadores.actualizarJugadores();
    llenarTablaPosiciones("#tablePosicionesGeoFutbol > tbody",1);
    llenarTablaPosiciones("#tablePosicionesFutbolMixto > tbody",2);
    //cargarJugadoresDeck();
}


function llenarTablaPosiciones(nombredom,torneoid) {
      $.getJSON(servidor + "/posiciones?torneoId="+ torneoid,
      function(playersPorTorneo) {
          
                  //CALCULO PROMEDIO DE PUNTOS A FAVOR Y CONTRA DE TODOS
                    var puntosfavorpartido = [];
                    var puntoscontrapartido = [];
                    
                    for (let index = 0; index < playersPorTorneo.playerstats.length; index++) {
                      
                        if (playersPorTorneo.playerstats[index].asistenciaAlltime > 0.4){

                        puntosfavorpartido.push(playersPorTorneo.playerstats[index].PA);
                        puntoscontrapartido.push(playersPorTorneo.playerstats[index].PAC);
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
                for (let index = 0; index < playersPorTorneo.playerstats.length; index++) {
                    //OFF Y DEF POWER
                    if (playersPorTorneo.playerstats[index].asistenciaAlltime < 0.4) {
                          playersPorTorneo.playerstats[index].offpower = -1
                          playersPorTorneo.playerstats[index].defpower = -1
                    } else {
                          playersPorTorneo.playerstats[index].offpower = ((playersPorTorneo.playerstats[index].PA-minPF)/rangePF)*10
                          playersPorTorneo.playerstats[index].defpower = -((playersPorTorneo.playerstats[index].PAC-maxPC)/rangePC)*10
                    }


                } 
                var playersarray=[]

          for (let index = 0; index < playersPorTorneo.playerstats.length; index++) {

                playersarray.push({
                                      jugadorId: playersPorTorneo.playerstats[index].jugadorId, 
                                      nombre: playersPorTorneo.playerstats[index].nombre,
                                      apellido: playersPorTorneo.playerstats[index].apellido,
                                      foto: playersPorTorneo.playerstats[index].foto,
                                      bestmove: playersPorTorneo.playerstats[index].bestmove,
                                      ganados: playersPorTorneo.playerstats[index].ganados,
                                      perdidos: playersPorTorneo.playerstats[index].perdidos,
                                      empatados: playersPorTorneo.playerstats[index].empatados,
                                      partidosTotales: playersPorTorneo.playerstats[index].partidosTotales,
                                      eficiencia: playersPorTorneo.playerstats[index].eficiencia,
                                      asistencia: playersPorTorneo.playerstats[index].asistencia,
                                      eficienciaAlltime: playersPorTorneo.playerstats[index].eficienciaAlltime,
                                      asistenciaAlltime: playersPorTorneo.playerstats[index].asistenciaAlltime,
                                      offpower: playersPorTorneo.playerstats[index].offpower,
                                      defpower: playersPorTorneo.playerstats[index].defpower,
                                      momentum: playersPorTorneo.playerstats[index].momentum,
                                      totalpartidosmomentum: playersPorTorneo.playerstats[index].totalpartidosmomentum
                                  })                      
          }

          var contenidoTabla = "";
          for (let index = 0; index < playersarray.length; index++) {
            
                var element = playersarray[index]
                
                if (typeof element.offpower !== 'number')
                    {var offpowerCorr = -1} else { var offpowerCorr = Math.round(element.offpower* 10) / 10;}; 
                if (typeof element.defpower !== 'number')
                    {var defpowerCorr = -1} else { var defpowerCorr = Math.round(element.defpower* 10) / 10;}; 
                if (element.momentum == null || element.totalpartidosmomentum <4){
                  element.momentum = "-"
                }
                    
            var lineaTabla = 
              '<tr><td scope="row"><a href="jugador.html?id=' + element.jugadorId +'">' + element.nombre + " " +element.apellido + '</a></th><td>'+ element.ganados +'</td><td>'
              + element.perdidos +'</td><td>'+ element.empatados +'</td><td>' + element.partidosTotales + '</td><td>' + addZeroes(Math.round(element.eficiencia*100 * 10) / 10) + '%</td><td>' 
              + addZeroes(offpowerCorr) + '</td><td>' + addZeroes(defpowerCorr) + '</td><td>' + element.momentum + '</td><td>' + addZeroes(Math.round(element.asistencia*100 * 10) / 10) + '%</td></tr>'
              
              contenidoTabla = contenidoTabla + lineaTabla
          }
          
           $(nombredom).html(contenidoTabla)
              var myTH = document.getElementsByTagName("th")[4];
              sorttable.innerSortFunction.apply(myTH, []);
              sorttable.innerSortFunction.apply(myTH, []);
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

function cargarawards() {
    //AWARDS

    $.getJSON(servidor + "/awardsporanio?anio="+ 2019, //HARDCODEADO!!!
    function(award) {
      console.log(award)
        var arrayofawards = award.awards;

            var htmltotal = ''
            /*
            <div id="palermoawardscontainerindex">
                <div class="awarditemindex"><h3>Mayor Progresión 2019</h3>
                    <img src="img/iconos/index/awards/captain.png" alt="">
                    <h4>Emiliano Giusto</h4>
                </div>

            </div>
            */
            for (let index = 0; index < arrayofawards.length; index++) {
                const award = arrayofawards[index];

                var awardhtml = '<div class="awarditemindex"><h3>' + award.nombre + " " + award.año + '</h3>'
                              + '<img src="'+ award.symbol + '" alt="">'
                              + '<h4>' + award.playernombre + " " + award.playerapellido + '</h4></div></div>'
                
                htmltotal = htmltotal + awardhtml;
            }

            $('#palermoawardscontainerindex').html(htmltotal);

    })
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
