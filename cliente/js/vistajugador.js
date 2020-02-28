$(document).ready(iniciarJugador());


function iniciarJugador() {

    $('[data-toggle="tooltip"]').tooltip();
        //Recorro los params y obtengo el id de jugador (el unico)
            var url_string = window.location.href;
            var url = new URL(url_string)
            var idPlayer = url.searchParams.get("id");
            console.log("id es " + idPlayer)
    $.getJSON(servidor + "/players",
        function(allplayers) {
            for (let index = 0; index < allplayers.length; index++) {
                const jugador = allplayers[index];
                
                if (jugador.jugador_id == idPlayer) {
                    
                    //Cambio nombre jugador
                    $('#tituloFacultad').html(jugador.nombre + " " + jugador.apellido);
                    $('#subtituloAlias').html(jugador.alias);
                    //Cambio foto
                    $('#fotoPres > img').attr("src",jugador.foto);
                    //Cambio titulo de pagina
                    $('title').html(jugador.nombre + " " + jugador.apellido);

          //SUMO PUNTOS A FAVOR Y CONTRA DE TODOS LOS QUE TENGAN >= 0.4 DE asistenciaalltime
          var puntosfavorpartido = [];
          var puntoscontrapartido = [];
          
          for (let index = 0; index < allplayers.length; index++) {
            
              if (allplayers[index].asistenciaalltime >= 0.4){
                puntosfavorpartido.push(allplayers[index].PA);
                puntoscontrapartido.push(allplayers[index].PAC);
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
        for (let index = 0; index < allplayers.length; index++) {
            //OFF Y DEF POWER
            if (allplayers[index].asistenciaalltime < 0.4) {
                allplayers[index].offpower = -1
                allplayers[index].defpower = -1
            } else {
                allplayers[index].offpower = ((allplayers[index].PA-minPF)/rangePF)*10
                allplayers[index].defpower = -((allplayers[index].PAC-maxPC)/rangePC)*10
            }
        }
    
        for (let index = 0; index < allplayers.length; index++) {
        var element = allplayers[index]
        if (typeof element.offpower !== 'number')
            {var offpowerCorr = -1} else { var offpowerCorr = Math.round(element.offpower* 10) / 10;}; 
        if (typeof element.defpower !== 'number')
            {var defpowerCorr = -1} else { var defpowerCorr = Math.round(element.defpower* 10) / 10;}; 
        }

                    $('#eficienciaAlltime > p').html(addZeroes(Math.round(jugador.puntosporpartido*1000) / 1000)); 
                    $('#asistenciaAlltime > p').html(addZeroes(Math.round(jugador.asistenciaalltime*10000) / 100)+ "%"); 
                    $('#containerPGAlltime > p').html(jugador.ganados);
                    $('#containerPPAlltime > p').html(jugador.perdidos);
                    $('#containerPJAlltime > p').html(jugador.totales);
                    $('#containerPEAlltime > p').html(jugador.empatados);
                    
                    //OFF Y DEF POWER
                        if (jugador.offpower === "No Calculado") {
                            $('#containerOP > p').html("-")
                            $('#containerDP > p').html("-")
                        } else {
                            $('#containerOP > p').html(addZeroes(Math.round(jugador.offpower* 10) / 10));
                            $('#containerDP > p').html(addZeroes(Math.round(jugador.defpower* 10) / 10));
                        }
                    
                    //$('#momentum > p').html(jugador.momentum || "-");
                        //$('#PGult6 > p').html(jugador.ganadosmomentum || 0);
                        //$('#PPult6 > p').html(jugador.perdidosmomentum|| 0);
                        //$('#PJult6 > p').html(jugador.totalmomentum|| 0);
                    $('#alturajug > p').html(addZeroes(Math.round(jugador.altura* 100) / 100) + " m");

                    if (jugador.posicion !== null) {
                        $('#posicion > p').html(jugador.posicion);
                    } else {$('#posicion > p').html('-');}


                    if (jugador.frase !== null) {
                        $('#frase > p').html(divisorfrases(jugador.frase));
                    }else {$('#frase > p').html('-');}
                    
                    if (jugador.fechanacimiento!==null) {
                        //FormateandoFecha
                        var d = new Date(jugador.fechanacimiento);
                        let fechanac_format = (d.getDate()+1)+ "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
                        $('#fechanacim > p').html(fechanac_format);
                    } else {$('#fechanacim > p').html('-');}
                        
                    if (jugador.lugarnacimiento !== null) {
                        $('#lugarnacim > p').html(jugador.lugarnacimiento);
                    } else {$('#lugarnacim > p').html('-');}

                    if (jugador.mejorjugada !== null) {
                        $('#mejorjugada > p').html(jugador.mejorjugada);
                    } else {$('#mejorjugada > p').html('-');}
                }
            }
        })
        // RACHA
        $.getJSON(servidor + "/racha/" + idPlayer,
        function(players) {
            var racha = players.racha
                    if (racha>0 && racha<4) {
                        img = '<img class="rachaicon" src="../img/iconos/index/racha/up-arrow.png" alt="">'
                    } else if (racha>=4){
                        img = '<img class="rachaicon" src="../img/iconos/index/racha/fire.png" alt="">'
                    }
                    else if (racha === 0){
                        img = '<img class="rachaicon" src="../img/iconos/index/racha/right-arrow.png" alt="">'
                    }
                    else if (racha < 0 && racha > -3){
                        img = '<img class="rachaicon" src="../img/iconos/index/racha/diagonal-arrow.png" alt="">'
                    }
                    else if (racha <= -3){
                        img = '<img class="rachaicon" src="../img/iconos/index/racha/down-arrow.png" alt="">'
                    }
              racha = '<p id="valorrachaact">'+racha+'</p>'
            $("div#rachaactual > p").html(racha + img)
        })

        //ULTIMOS 20
        $.getJSON(servidor + "/ultimos20/" + idPlayer,
        function(ultimospartidos) {
            var tablacompleta = '';
            for (let index = 0; index < ultimospartidos.ultimos20.length; index++) {
                const partido = ultimospartidos.ultimos20[index];
                            //FormateandoFecha
                            var d = new Date(partido.fecha);
                            let formatted_date = (d.getDate()+1) + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
                var nuevalinea = '<tr>'
                        + '<td>' + formatted_date +'</td>'
                        + '<td>' + partido.resultado +'</td>'
                        + '<td>' + partido.golesConvertidos +'</td>'
                        + '<td>' + partido.golesRecibidos +'</td>'
                        + '<td>' + partido.golesindividuales +'</td>'
                        + '</tr>';

                tablacompleta = tablacompleta + nuevalinea
            }
            $('div#ult20table>table>tbody').html(tablacompleta)
            });

        //Datos este torneo
        $.getJSON(servidor + "/posiciones/"+ torneoactual,
        function(jugadorstats) {
            for (let index = 0; index < jugadorstats.length; index++) {
                const jugadorPosicion = jugadorstats[index];
                if (jugadorPosicion.id == idPlayer) {
                    console.log(jugadorPosicion)
                    var puntostorneo = jugadorPosicion.ganados * 3 + jugadorPosicion.empatados
                    var partidostotales = jugadorPosicion.ganados+ jugadorPosicion.perdidos+ jugadorPosicion.empatados
                    $('#jugadosestetorneo > p').html(partidostotales);
                    $('#asistenciaestetorneo > p').html((Math.round(jugadorPosicion.asistenciatorneo*1000) / 10) + '%');
                    $('#ganadosestetorneo > p').html(jugadorPosicion.ganados);
                    $('#empatadosestetorneo > p').html(jugadorPosicion.empatados);
                    $('#perdidosestetorneo > p').html(jugadorPosicion.perdidos);
                    $('#golesestetorneo > p').html(jugadorPosicion.golesjugadortorneo)
                    if (jugadorPosicion.ganados+ jugadorPosicion.perdidos+ jugadorPosicion.empatados > 0) {
                        $('#estadoestetorneo > p').html("Activo");
                        } else {
                            $('#estadoestetorneo > p').html("No Activo");
                    }
                    
                    $('#promedioestetorneo > p').html(Math.round(puntostorneo/partidostotales*10) / 10);
                    $('#porcentajeganados > p').html((Math.round(jugadorPosicion.ganados/partidostotales*1000) / 10) + '%');
                    $('#puntosestetorneo > p').html(puntostorneo);
                }
            }
        })

        /*
            //MEJOR Y PEOR RACHA
            $.getJSON(servidor + "/mejorypeorracha?jugador="+ idPlayer,
            function(jugador) {
                var rachasJugador = jugador.mejorypeorracha[0]
                                var mr = new Date(rachasJugador.mejorrachafecha);
                                var pr = new Date(rachasJugador.peorrachafecha);
                                let MRformatted_date = mr.getDate() + "-" + (mr.getMonth() + 1) + "-" + mr.getFullYear()
                                let PRformatted_date = pr.getDate() + "-" + (pr.getMonth() + 1) + "-" + pr.getFullYear()
                
                $('#mejorracha > p').html("+" + rachasJugador.mejorracharacha)
                $('#mejorrachafecha').html(MRformatted_date)
                $('#peorracha > p').html(rachasJugador.peorracharacha)
                $('#peorrachafecha').html(PRformatted_date);

            })
        */
}


function divisorfrases(fraseinicial) {
    var arrayfrases = fraseinicial.split(";");
    var cadena = '" '+ arrayfrases[0] + ' "'
    for (let index = 1; index < arrayfrases.length; index++) {
        const element =  '"' + arrayfrases[index] + ' "'
        cadena = cadena + '<br>'+'<br>' +String(element)
    }
    return cadena
  }




