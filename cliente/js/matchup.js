

$(document).ready(function() {
    //se hace el pedido al backend de todos los jugadores
    $.getJSON(servidor + "/players",
        function(jugadores) {
            //Borro los contenedores de opciones
            $(".custom-select").html('');

            var contentSelection = '<option selected>Choose...</option>'
            for (i = 0; i < jugadores.length; i++) {
                contentSelection = contentSelection + '<option value="'+ jugadores[i].jugador_id  +'">' + jugadores[i].nombre + ' ' +jugadores[i].apellido + '</option>'
                $(".custom-select").html(contentSelection)
            }
        });
        //Aplico eventos a botones
        $('#calcularMatchup').click(calcularMatchup);
});

function calcularMatchup() {
    var player1id = $("#inputGroupSelect01").children("option").filter(":selected").val()
    var player2id = $("#inputGroupSelect02").children("option").filter(":selected").val()

    $("#matchupTable > table > tbody").html('')

    $.getJSON(servidor + "/matchup?p1=" + player1id + "&p2=" + player2id,
        function(data) {
                //Si nunca jugaron el mismo partido
                if (data.matchup.length== 0) {
                        $.getJSON(servidor + "/players",
                            function(jugadores) {
                                for (let index = 0; index < jugadores.length; index++) {
                                    var idPlayer = jugadores[index].id;
                                        if (idPlayer == player1id) {
                                            $('#p1name').html(jugadores[index].nombre + " " + jugadores[index].apellido);
                                            $('#player1 >img').attr("src",jugadores[index].foto);
                                        }
                                        if (idPlayer == player2id) {
                                            $('#p2name').html(jugadores[index].nombre + " " + jugadores[index].apellido);
                                            $('#player2 > img').attr("src",jugadores[index].foto);
                                        }
                                }
                            })
                    $('#p1result').html("0");
                    $('#p2result').html("0");
                    return false;
                }

            var p1Counter = 0
            var p2Counter = 0

            //Orden es true si el player1 elegido por el user tiene un numero mas bajo que el player2 del user
            var orden;

            var player1ID = data.matchup[0].jugador_id

                if (player1ID == player1id) {
                    orden = true;
                } else{
                    orden = false;
                }

            var player1Foto = data.matchup[0].foto
            var player2Foto = data.matchup[1].foto

            var player1Nombre = data.matchup[0].nombre + " " + data.matchup[0].apellido
            var player2Nombre = data.matchup[1].nombre + " " + data.matchup[1].apellido
        
            var matchupsParaAnotar = []

            for (i = 0; i < data.matchup.length; i++) {
                resultA = data.matchup[i].resultado
                resultB = data.matchup[i+1].resultado
                //Si tuvieron distinto resultado
                if (resultA !== resultB) {
                    if (resultA == 1) {
                        p1Counter++;
                        matchupsParaAnotar.push({nombre: data.matchup[i].nombre, apellido: data.matchup[i].apellido, fecha:data.matchup[i].fecha, puntosganador: data.matchup[i].golesganador, puntosperdedor: data.matchup[i].golesperdedor})
                    }
                    if (resultB == 1) {
                        p2Counter++
                        matchupsParaAnotar.push({nombre: data.matchup[i+1].nombre, apellido: data.matchup[i+1].apellido, fecha:data.matchup[i+1].fecha, puntosganador: data.matchup[i+1].golesganador, puntosperdedor: data.matchup[i+1].golesperdedor})
                    }
                }
                //Si hay empate
                if ((resultA !== resultB)&&(resultA==2)) {
                    matchupsParaAnotar.push({nombre: "Empate", fecha:data.matchup[i].fecha, puntosganador: data.matchup[i].golesganador, puntosperdedor: data.matchup[i].golesperdedor})
                }

                i++
            }

            if (orden) {
                $('#p1result').html(p1Counter);
                $('#p2result').html(p2Counter);
                $('#p1name').html(player1Nombre);
                $('#p2name').html(player2Nombre);
                $('#player1 >img').attr("src",player1Foto);
                $('#player2 > img').attr("src",player2Foto);
            } else {
                $('#p1result').html(p2Counter);
                $('#p2result').html(p1Counter);
                $('#p1name').html(player2Nombre);
                $('#p2name').html(player1Nombre);
                $('#player1 >img').attr("src",player2Foto);
                $('#player2 > img').attr("src",player1Foto);
            }
            armarCuadroMatchup(matchupsParaAnotar);
        });
}


function armarCuadroMatchup(matchupData) {
    //matchupData es de forma: "{"nombre":"Emiliano","apellido":"Giusto","fecha":"1981-08-24T03:00:00.000Z","puntosganador":65,"puntosperdedor":50}"
    
    /*  <tr>
            <th scope="row">12/10/2019</th>
            <td>TomiA</td>
            <td>80</td>
            <td>75</td>
        </tr>
    */
   var contenidoTabla = "";

    for (let index = 0; index < matchupData.length; index++) {

        var d = new Date(matchupData[index].fecha);
        let formatted_date = d.getDate()+1 + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
        var lineaTabla = 
        '<tr><th scope="row">' + formatted_date + '</th><td>' + matchupData[index].nombre + ' ' + matchupData[index].apellido 
        + '</td><td>' + matchupData[index].puntosganador + '</td><td>' + matchupData[index].puntosperdedor + '</td></tr>';


        contenidoTabla = contenidoTabla + lineaTabla
    }

    $("#matchupTable > table > tbody").html(contenidoTabla)
}