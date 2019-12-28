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
                                        <th>Nombre</th>
                                        <th>PG</th>
                                        <th>PP</th>
                                        <th>PJ</th>
                                        <th>Efectividad Season</th>
                                        <th>Asistencia Season</th>
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
$.getJSON(servidor + "/torneos",
    function(resultado) {

        var htmlCompleto = ""

        //Ciclo de Torneos
        for (let index = 1; index < resultado.torneos.length; index++) {

            var nuevoTorneo = ''
            $.getJSON(servidor + "/posiciones?torneoId=" + resultado.torneos[index].id,
                function(playersPorTorneo) {
    
                    var principioTorneo = '<h1 class="tituloPrincipal">' + resultado.torneos[index].nombre + '</h1><div class="panel panel-default">'
                                        + '<div class="panel-body"><table class="table table-striped table-hover sortable torneos"><thead><tr>'
                                        + '<th>Nombre</th><th>PG</th><th>PP</th><th>PJ</th><th class="sorttable_numeric">Efectividad Season</th><th>Asistencia Season</th>'
                                        + '</thead><tbody>'
                    var contenidoMedio = ''
                    
                        for (let i = 0; i < playersPorTorneo.playerstats.length; i++) {
                            contenidoMedio = contenidoMedio + '<tr>'
                                            + '<td>' + playersPorTorneo.playerstats[i].nombre + " " +playersPorTorneo.playerstats[i].apellido +'</td>'
                                            + '<td>' + playersPorTorneo.playerstats[i].ganados +'</td>'
                                            + '<td>' + playersPorTorneo.playerstats[i].perdidos +'</td>'
                                            + '<td>' + playersPorTorneo.playerstats[i].partidosTotales +'</td>'
                                            + '<td>' + Math.round(playersPorTorneo.playerstats[i].eficiencia*100 * 10) / 10 +'%</td>'
                                            + '<td>' + Math.round(playersPorTorneo.playerstats[i].asistencia*100 * 10) / 10 +'%</td>'
                                            + '</tr>'
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
            
           