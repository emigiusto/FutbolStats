$(document).ready(iniciarJugador());


function iniciarJugador() {

    $('[data-toggle="tooltip"]').tooltip();
        //Recorro los params y obtengo el id de jugador (el unico)
            var url_string = window.location.href;
            var url = new URL(url_string)
            var idPlayer = url.searchParams.get("id");

    $.getJSON(servidor + "/players",
        function(allplayers) {
            for (let index = 0; index < allplayers.player.length; index++) {
                const jugador = allplayers.player[index];
                if (jugador.id == idPlayer) {

                    //Cambio nombre jugador
                    $('#tituloFacultad').html(jugador.nombre + " " + jugador.apellido);
                    //Cambio foto
                    $('#fotoPres > img').attr("src",jugador.foto);
                    //Cambio titulo de pagina
                    $('title').html(jugador.nombre + " " + jugador.apellido);

                    $('#eficienciaAlltime > p').html(addZeroes(Math.round(jugador.eficiencia*10000) / 100)+ "%"); 
                    $('#asistenciaAlltime > p').html(addZeroes(Math.round(jugador.asistencia*10000) / 100)+ "%"); 
                    $('#containerPGAlltime > p').html(jugador.ganadosalltime);
                    $('#containerPPAlltime > p').html(jugador.perdidosalltime);
                    $('#containerPJAlltime > p').html(jugador.partidosjugadosTotal);
                    //OFF Y DEF POWER
                        if (jugador.offpower === "No Calculado") {
                            $('#containerOP > p').html("-")
                            $('#containerDP > p').html("-")
                        } else {
                            $('#containerOP > p').html(addZeroes(Math.round(jugador.offpower* 10) / 10));
                            $('#containerDP > p').html(addZeroes(Math.round(jugador.defpower* 10) / 10));
                        }
                    

                    $('#momentum > p').html(jugador.momentum || "-");
                        $('#PGult6 > p').html(jugador.ganadosmomentum || 0);
                        $('#PPult6 > p').html(jugador.perdidosmomentum|| 0);
                        $('#PJult6 > p').html(jugador.totalmomentum|| 0);
                    $('#altura > p').html(addZeroes(Math.round(jugador.altura* 100) / 100) + " m");
                    $('#puesto > p').html(jugador.posicion);
                        //FormateandoFecha
                        var d = new Date(jugador.fechanacimiento);
                        let fechanac_format = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
                    $('#fechanac > p').html(fechanac_format);
                    $('#lugarnac > p').html(jugador.lugarnacimiento);
                    $('#jugada > p').html(jugador.bestmove);
                }
            }
        })
        // RACHA
        $.getJSON(servidor + "/rachaPlayer?jugadorId=" + idPlayer,
        function(players) {
            var racha = players.racha
                    if (racha>0 && racha<4) {
                        racha = "+" + racha
                        img = '<img class="rachaicon" src="img/iconos/index/racha/up-arrow.png" alt="">'
                    } else if (racha>=4){
                        racha = "+" + racha
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
              racha = '<p id="valorrachaact">'+racha+'</p>'
            $("div#rachaactual > p").html(racha + img)
        })

        //ULTIMOS 20
        $.getJSON(servidor + "/ultimos20?jugador=" + idPlayer,
        function(ultimospartidos) {

            var tablacompleta = '';
            for (let index = 0; index < ultimospartidos.ultimos20.length; index++) {
                const partido = ultimospartidos.ultimos20[index];
                            //FormateandoFecha
                            var d = new Date(partido.fecha);
                            let formatted_date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
                var nuevalinea = '<tr>'
                        + '<td>' + formatted_date +'</td>'
                        + '<td>' + partido.resultado +'</td>'
                        + '<td>' + partido.puntosConvertidos +'</td>'
                        + '<td>' + partido.puntosRecibidos +'</td>'
                        + '</tr>';

                tablacompleta = tablacompleta + nuevalinea
            }
            $('div#ult20table>table>tbody').html(tablacompleta)
            });

        //Logros
        $.getJSON(servidor + "/resultadostorneoplayer?jugador="+ idPlayer,
        function(jugador) {
            var arrayresultadoJugador = jugador.resultadostorneos
            if (arrayresultadoJugador.length<1) {
                $('#logrosLista').html("")
            } else {

                var htmllogros = ''
                for (let index = 0; index < 2; index++) {
                    const lineapuesto  = arrayresultadoJugador[index];
                    if (lineapuesto.puesto !== 100) {
                            var imgsrc = '';
                            var nombretorneo = lineapuesto.nombre
                            var nombrepuesto = ''
                        switch (lineapuesto.puesto) {
                            case 1:
                                    imgsrc= 'img/iconos/paginaJugador/trophy.png'
                                    nombrepuesto = 'Campeón '
                                break;
                            case 2:
                                    imgsrc= 'img/iconos/paginaJugador/second.png'
                                    nombrepuesto = 'Subcampeón '
                                break;
                            case 3:
                                    imgsrc= 'img/iconos/paginaJugador/third.png'
                                    nombrepuesto = 'Tercer Puesto '
                                break;
                            default:
                                    imgsrc= 'img/iconos/paginaJugador/award.png'
                                    nombrepuesto = 'Posición ' + lineapuesto.puesto + '° '
                                break;
                        }
                            var logrostag = ''
                                + '<li><img src="'+ imgsrc +'" alt="">'
                                + '<span>'+ nombrepuesto + nombretorneo + '</span></li>'
                        htmllogros = htmllogros + logrostag
                    }         
                }
                $('#logrosLista').html(htmllogros)
            }
        })

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

        //AWARDS
        $.getJSON(servidor + "/awardsporplayer?jugador="+ idPlayer,
        function(jugador) {
            var arrayawards = jugador.awards;

            if (arrayawards.length > 0) {
                var htmltotal = '<div id="playerawards"><h1 class="subtitle">Palermo Awards</h1><div id="containerawards">'
                for (let index = 0; index < arrayawards.length; index++) {
                    const award = arrayawards[index];

                    var awardhtml = '<div class="awarditem"><img src="' + award.symbol +'" alt="">'
                                    + '<h3>' + award.nombre + " " + award.año + '</h3></div>'
                    
                    htmltotal = htmltotal + awardhtml;
                }

                htmltotal = htmltotal + '</div></div>'
                
                $(htmltotal).insertAfter("#statsimp");
            }

        })
}





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
  