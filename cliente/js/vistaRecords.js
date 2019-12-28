$(document).ready(iniciarRecords());

function iniciarRecords() {
    llenarTablaAllTime();
    $('[data-toggle="tooltip"]').tooltip();
}


function llenarTablaAllTime() {
    /*
    <tr>
        <td>Nombre 1</td>
        <td>PG 2</td>
        <td>PP 3</td>
        <td>PJ 4</td>
        <td>Efectividad</td>
        <td>Asistencia 3</td>
    </tr>
    */

     $.getJSON(servidor + "/players",
    function(data) {
      //Borro los contenedores de opciones
      $(".alltime tbody").html('');

      var contentSelection = "";
      for (let index = 0; index < data.player.length; index++) {
          var jugador = data.player[index];
          var newLine = "<tr>"
                        + "<td>"+ jugador.nombre + " " + jugador.apellido +"</td>"
                        + "<td>"+ jugador.ganadosalltime + "</td>"
                        + "<td>"+ jugador.perdidosalltime + "</td>"
                        + "<td>"+ jugador.partidosjugadosTotal + "</td>"
                        + "<td>"+ addZeroes(Math.round(jugador.eficiencia*100 * 10) / 10) + "%</td>"
                        + "<td>"+ addZeroes(Math.round(jugador.asistencia*100 * 10) / 10) + "%</td>"
                        + "</tr>";

        contentSelection = contentSelection + newLine
      }

    $(".alltime > tbody").html(contentSelection);

    var myTH = document.getElementsByTagName("th")[1];
              sorttable.innerSortFunction.apply(myTH, []);
              sorttable.innerSortFunction.apply(myTH, []);
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