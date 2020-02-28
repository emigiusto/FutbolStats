$(document).ready(iniciarEdiciones());

function iniciarEdiciones() {
    llenarTablaEdiciones();
    $('[data-toggle="tooltip"]').tooltip();
}


function llenarTablaEdiciones() {

    /*
                        <h1 class="tituloPrincipal">Posiciones 2do Semestre 2019</h1>
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <table class="table table-striped table-hover torneos">
                                    <thead>
                                    <tr>
                                        <th>Alias</th>
                                        <th data-toggle="tooltip" title="Partidos Ganados" class="sorttable_numeric">PG</th>
                                        <th data-toggle="tooltip" title="Partidos Perdidos" class="sorttable_numeric">PP</th>
                                        <th data-toggle="tooltip" title="Partidos Empatados" class="sorttable_numeric">PE</th>
                                        <th data-toggle="tooltip" title="Partidos Jugados" class="sorttable_numeric">PJ</th>
                                        <th data-toggle="tooltip" title="Puntos" class="sorttable_numeric">P</th>
                                        <th data-toggle="tooltip" title="Puntos por partido promedio" class="sorttable_numeric">PPP</th>
                                        <th data-toggle="tooltip" title="Goles totales Individuales" class="sorttable_numeric">GI</th>
                                        <th data-toggle="tooltip" title="Goles Individuales promedio por partido" class="sorttable_numeric">GIP</th>
                                        <th data-toggle="tooltip" title="Porcentaje de victorias de esta temporada" class="sorttable_numeric">%PG</th>
                                        <th data-toggle="tooltip" title="Asistencia de esta temporada">A</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Valor 1</td>
                                        <td>Valor 2</td>
                                        <td>Valor 3</td>
                                        <td>Valor 4</td>
                                        <td>8</td>
                                        <td>Valor 3</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
    */
$.getJSON(servidor + "/torneos/'"+ tipotorneo + "'",
    function(resultado) {

        var htmlCompleto = ""

        //Ciclo de Torneos
        for (let index = 0; index < resultado.torneos.length; index++) {
                var nuevoTorneo = ''
                $.getJSON(servidor + "/posiciones/" + resultado.torneos[index].id,
                    function(playersPorTorneo) {
                        console.log()
                        var principioTorneo = '<h1 class="tituloPrincipal">' + resultado.torneos[index].nombre + '</h1><div class="panel panel-default">'
                                            + '<div class="panel-body"><table class="table table-striped table-hover sortable torneos"><thead><tr>'
                                            + '<th>Alias</th><th data-toggle="tooltip" title="Partidos Jugados" class="sorttable_numeric">PJ</th><th data-toggle="tooltip" title="Partidos Ganados" class="sorttable_numeric">PG</th><th data-toggle="tooltip" title="Partidos Empatados" class="sorttable_numeric">PE</th><th data-toggle="tooltip" title="Partidos Perdidos" class="sorttable_numeric">PP</th><th data-toggle="tooltip" title="Puntos" class="sorttable_numeric">P</th><th data-toggle="tooltip" title="Puntos por partido" class="sorttable_numeric">PRO</th><th data-toggle="tooltip" title="Goles totales Individuales" class="sorttable_numeric">G</th><th data-toggle="tooltip" title="Goles Individuales por partido" class="sorttable_numeric">G/P</th><th data-toggle="tooltip" title="Porcentaje de victorias de esta temporada" class="sorttable_numeric">%PG</th><th data-toggle="tooltip" title="Asistencia de esta temporada">A</th>'
                                            + '</thead><tbody>'
                        var contenidoMedio = ''
                        
                            for (let i = 0; i < playersPorTorneo.length; i++) {
                                if (playersPorTorneo[i].asistenciatorneo > 0.40) {
                                contenidoMedio = contenidoMedio + '<tr>'
                                                + '<td>' + playersPorTorneo[i].alias +'</td>'
                                                + '<td>' + playersPorTorneo[i].totales +'</td>'
                                                + '<td>' + playersPorTorneo[i].ganados +'</td>'
                                                + '<td>' + playersPorTorneo[i].empatados +'</td>'
                                                + '<td>' + playersPorTorneo[i].perdidos +'</td>'
                                                + '<td>' + playersPorTorneo[i].puntos +'</td>'
                                                + '<td>' + Math.round(playersPorTorneo[i].puntosporpartido* 100) / 100+'</td>'
                                                + '<td>' + playersPorTorneo[i].golesjugadortorneo +'</td>'
                                                + '<td>' + Math.round(playersPorTorneo[i].golesjugadorporpartido* 100) / 100 +'</td>'
                                                + '<td>' + addZeroes(Math.round(playersPorTorneo[i].eficienciaganados*100 * 10) / 10) +'%</td>'
                                                + '<td>' + addZeroes(Math.round(playersPorTorneo[i].asistenciatorneo*100 * 10) / 10) +'%</td>'
                                                + '</tr>'
                                }
                            }

                        var finalTorneo = '</tbody></table></div></div>'

                        nuevoTorneo = principioTorneo + contenidoMedio + finalTorneo
                        
                        htmlCompleto = htmlCompleto + nuevoTorneo
                        console.log(htmlCompleto)
                        $('#contenedorTablasTorneos').html(htmlCompleto)
                    })
                
        }
            
     }
)}
            
           