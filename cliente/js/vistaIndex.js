$(document).ready(iniciarIndex());

function iniciarIndex() {
    $('[data-toggle="tooltip"]').tooltip();
    llenarTablaPosiciones("#tablePosicionesGeoFutbol > tbody",3);
    //cargarJugadoresDeck();
}


function llenarTablaPosiciones(nombredom,torneoid) {
      $.getJSON(servidor + "/posiciones?torneoId="+ torneoid,
      function(jugadorstats) {
          
                  //SUMO PUNTOS A FAVOR Y CONTRA DE TODOS LOS QUE TENGAN >= 0.4 DE asistenciaalltime
                    var puntosfavorpartido = [];
                    var puntoscontrapartido = [];
                    
                    for (let index = 0; index < jugadorstats.length; index++) {
                      
                        if (jugadorstatss[index].asistenciaalltime >= 0.4){
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
                    if (jugadorstats.asistenciaAlltime < 0.4) {
                          jugadorstats.offpower = -1
                          jugadorstats.defpower = -1
                    } else {
                        jugadorstats[index].offpower = ((jugadorstats[index].PA-minPF)/rangePF)*10
                        jugadorstats[index].defpower = -((jugadorstats[index].PAC-maxPC)/rangePC)*10
                    }
                }
            console.log(jugadorstats)
            //var playersarray=[]

          /*for (let index = 0; index < playersPorTorneo.playerstats.length; index++) {

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
          }*/

          var contenidoTabla = "";
          for (let index = 0; index < jugadorstats.length; index++) {
            
                var element = jugadorstats[index]
                
                if (typeof element.offpower !== 'number')
                    {var offpowerCorr = -1} else { var offpowerCorr = Math.round(element.offpower* 10) / 10;}; 
                if (typeof element.defpower !== 'number')
                    {var defpowerCorr = -1} else { var defpowerCorr = Math.round(element.defpower* 10) / 10;}; 
                    
            var lineaTabla = 
              '<tr><td scope="row"><a href="jugador.html?id=' + element.jugadorId +'">' + element.nombre + " " +element.apellido 
              + '</a></th><td>'+ element.ganados +'</td><td>'
              + element.perdidos +'</td><td>'
              + element.empatados +'</td><td>' 
              + element.totales + '</td><td>' 
              + element.puntos + '</td><td>' 
              + element.puntosporpartido + '</td><td>'
              + element.golesjugadortorneo + '</td><td>'
              + addZeroes(Math.round(element.eficienciaganados*100 * 10) / 10) + '%</td><td>'
              + addZeroes(offpowerCorr) + '</td><td>' 
              + addZeroes(defpowerCorr) + '</td><td>' 
              + element.momentum + '</td><td>' 
              + addZeroes(Math.round(element.asistenciatorneo*100 * 10) / 10) + '%</td></tr>'
              
              contenidoTabla = contenidoTabla + lineaTabla
          }

          $(nombredom).html(contenidoTabla)
          /*
             <th>Nombre</th>
            <th data-toggle="tooltip" title="Partidos Ganados" class="sorttable_numeric">PG</th>
            <th data-toggle="tooltip" title="Partidos Perdidos" class="sorttable_numeric">PP</th>
            <th data-toggle="tooltip" title="Partidos Empatados" class="sorttable_numeric">PE</th>
            <th data-toggle="tooltip" title="Partidos Jugados" class="sorttable_numeric">PJ</th>
            <th data-toggle="tooltip" title="Puntos" class="sorttable_numeric">Ptos</th>
            <th data-toggle="tooltip" title="Puntos por partido promedio" class="sorttable_numeric">PtosPP</th>
            <th data-toggle="tooltip" title="Goles totales Individuales" class="sorttable_numeric">GI</th>
            <th data-toggle="tooltip" title="Efectividad de victorias de esta temporada" class="sorttable_numeric">Efect. Season</th>
            <th data-toggle="tooltip" title="Offensive Power: es un indicador de los puntos que anotaron los equipos en donde participaste all-time. El maximo es 10 y el minimo es 0. El valor -1 indica que no se encuentra contabilizado porque el jugador posee menos de 40% asistencia All-time" class="sorttable_numeric">Off. Power</th>
            <th data-toggle="tooltip" title="Defensive Power: es un indicador de los puntos que recibieron los equipos en donde participaste all-time. El maximo es 10 y el minimo es 0. El valor -1 indica que no se encuentra contabilizado porque el jugador posee menos de 40% asistencia All-time"class="sorttable_numeric">Def. Power</th>  
            <th data-toggle="tooltip" title="Asistencia de esta temporada">Asist. Season</th> */
           
          
            /*var myTH = document.getElementsByTagName("th")[4];
              sorttable.innerSortFunction.apply(myTH, []);
              sorttable.innerSortFunction.apply(myTH, []);*/
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
