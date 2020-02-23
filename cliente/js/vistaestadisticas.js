    // Function to fetch Github info of a user.
    const fetchduosInfo = async (url) => {
        let response = await fetch(url);
        // only proceed once promise is resolved
        let data = await response.json();
        // only proceed once second promise is resolved
        return data;
        
    }
    // Iterates all users and returns their Github info.
    const fetchUserInfo = async (duos) => {
        const requests = duos.map((duoInd) => {
        const url = servidor + '/duos?jugador1='+ duoInd.id1 +'&jugador2='+ duoInd.id2
        return fetchduosInfo(url) // Async function that fetches the user info.
        .then((a) => {
            return a // Returns the user info.
            })
        })
        return Promise.all(requests) // Waiting for all the requests to get resolved.
    }


$(document).ready(iniciarStats());


function generarduos(arrayPlayerId) {
        var duos = []
    cmb = Combinatorics.combination(arrayPlayerId, 2);
    while(a = cmb.next()) {
        duos.push({id1: a[0], id2: a[1]})
    }
    return duos;
}

    function iniciarStats() {
        $('[data-toggle="tooltip"]').tooltip();
        $.getJSON(servidor + "/players",
            function(data) {
                var arrayPlayerId = []
                for (let index = 0; index < data.player.length; index++) {
                    var id = data.player[index].id;
                        arrayPlayerId.push(id)
                }
                var duos = generarduos(arrayPlayerId)
                fetchUserInfo(duos)
                .then(a => {
                    contruirTablaDuos(a)
                    var myTH = document.getElementsByTagName("th")[1];
                        sorttable.innerSortFunction.apply(myTH, []);
                        sorttable.innerSortFunction.apply(myTH, []);
                    })
            })
    }


function contruirTablaDuos(duosList) {
    var contenidoTabla = "";

    for (let index = 0; index < duosList.length; index++) {
        const duoItem = duosList[index][0];
        if (duoItem.totalpartidos > 0) {
            var lineaTabla = 
                '<tr><td scope="row">' + duoItem.jugador1nombre + duoItem.jugador1apellido + " - " + duoItem.jugador2nombre  + duoItem.jugador2apellido 
                + '</td><td>'+ duoItem.partidosganados +'</td><td>'
                + duoItem.partidosperdidos +'</td><td>' + duoItem.totalpartidos + '</td><td>' + duoItem.puntosfavor + '</td><td>' 
                + duoItem.puntoscontra+ '</td><td>' 
                + addZeroes(Math.round((duoItem.puntosfavor/ duoItem.totalpartidos)* 10) / 10) + '</td><td>' 
                +  addZeroes(Math.round((duoItem.partidosganados/duoItem.totalpartidos)*100 * 10) / 10) + '%</td></tr>'
                
                contenidoTabla = contenidoTabla + lineaTabla
        }
    }
    $(".loader").addClass("displaynone")
    $("#tablaDuos > tbody").html(contenidoTabla)
}



