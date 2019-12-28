var con = require('../dba/conexionbd');


function traerjugadores(req, res) {
    var sql = "select * from player"
    
            con.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }


        res.send(JSON.stringify(resultado));
    });
}

function traerPlayers(req, res) {
    var sql = "select player.id, player.nombre, player.apellido, jugadorresultado.resultado, player.foto, player.bestmove, player.fechainicio, "
            + "SUM(case when jugadorresultado.resultado = 0 then partidos.puntosperdedor else partidos.puntosganador end) as 'puntosfavor', "
            + "SUM(case when jugadorresultado.resultado = 1 then partidos.puntosperdedor else partidos.puntosganador end) as 'puntoscontra', "
            + "(COUNT(jugadorresultado.resultado)+player.pg2018sincontar+player.pp2018sincontar) as 'partidosjugadosTotal', "
            + "((SUM(case when jugadorresultado.resultado = 0 then partidos.puntosperdedor else partidos.puntosganador end))/(COUNT(jugadorresultado.resultado))) as 'puntosfavorporpartido', "
            + "((SUM(case when jugadorresultado.resultado = 1 then partidos.puntosperdedor else partidos.puntosganador end))/(COUNT(jugadorresultado.resultado))) as 'puntoscontraporpartido', "
            + "(TW.ganadosalltime+player.pg2018sincontar) as 'ganadosalltime', (TL.perdidosalltime+player.pp2018sincontar) as 'perdidosalltime', "
            + "(((TW.ganadosalltime+player.pg2018sincontar)+(TL.perdidosalltime+player.pp2018sincontar))/(partidostotalestodos.total+18)) as 'asistencia',  "
            + "(TW.ganadosalltime+player.pg2018sincontar)/((TW.ganadosalltime+player.pg2018sincontar) +(TL.perdidosalltime+player.pp2018sincontar)) as 'eficiencia', "
            + "tablemomentum.momentum, tablemomentum.totalganadosmomentum as 'ganadosmomentum', tablemomentum.totalperdidosmomentum as 'perdidosmomentum', "
            + "tablemomentum.totalpartidosmomentum as 'totalmomentum', player.altura, player.fechanacimiento, player.lugarnacimiento, player.posicion "
            
            + "from player join jugadorresultado on player.id = jugadorresultado.jugador_id "
            + "join partidos on jugadorresultado.partido_id = partidos.id "
                //Momentum
                + "left outer join (select jugadorresultado.jugador_id, count(jugadorresultado.resultado) as 'totalpartidosmomentum',"
                + "SUM(CASE WHEN jugadorresultado.resultado=1 THEN 1 ELSE 0 END) as 'totalganadosmomentum',"
                + "SUM(CASE WHEN jugadorresultado.resultado=0 THEN 1 ELSE 0 END) as 'totalperdidosmomentum',"
                + "SUM(CASE WHEN jugadorresultado.resultado=1 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) as 'puntosfavor',"
                + "SUM(CASE WHEN jugadorresultado.resultado=0 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) as 'puntoscontra',"
                + "(SUM(CASE WHEN jugadorresultado.resultado=1 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END) - SUM(CASE WHEN jugadorresultado.resultado=0 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END)) as 'diferencia',"
                + "((SUM(CASE WHEN jugadorresultado.resultado=1 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END))-(SUM(CASE WHEN jugadorresultado.resultado=0 THEN tPartidos.puntosganador ELSE tPartidos.puntosperdedor END)))*2 "
                + "+((SUM(CASE WHEN jugadorresultado.resultado=1 THEN 1 ELSE 0 END)-SUM(CASE WHEN jugadorresultado.resultado=0 THEN 1 ELSE 0 END))*10) as 'momentum' "
                + "from player "
                + "left outer join jugadorresultado on player.id = jugadorresultado.jugador_id "
                + "join (select * from partidos order by id desc limit 6) as tPartidos on tPartidos.id = jugadorresultado.partido_id "
                + "group by player.id) as tablemomentum on tablemomentum.jugador_id = player.id "

            + "join (select count(id) as 'total' from partidos) as partidostotalestodos "
            + "join (select player.id, jugadorresultado.resultado, count(jugadorresultado.resultado) as 'ganadosAlltime' from player join jugadorresultado on player.id = jugadorresultado.jugador_id "
            + "where jugadorresultado.resultado = 1 group by player.id, jugadorresultado.resultado) as TW on player.id = TW.id "
            + "join (select player.id, jugadorresultado.resultado, count(jugadorresultado.resultado) as 'perdidosAlltime' from player join jugadorresultado on player.id = jugadorresultado.jugador_id "
            + "where jugadorresultado.resultado = 0 group by player.id, jugadorresultado.resultado) as TL on player.id = TL.id "
            + "group by player.id;"
    con.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
            //recorro el resultado y obtengo puntos por partido a favor y en contra promedio
            var puntosfavorpartido = [];
            var puntoscontrapartido = [];

                for (let index = 0; index < resultado.length; index++) {
                    if (resultado[index].asistencia > 0.4){
                    puntosfavorpartido.push(resultado[index].puntosfavorporpartido);
                    puntoscontrapartido.push(resultado[index].puntoscontraporpartido);
                    }
                }
                   
                    //Calculo minimos y maximos para Of y Def Power
                    var minPF = Math.min.apply(null, puntosfavorpartido);
                    var maxPF = Math.max.apply(null, puntosfavorpartido);
                    var rangePF = maxPF - minPF
                    
                    var minPC = Math.min.apply(null, puntoscontrapartido);
                    var maxPC = Math.max.apply(null, puntoscontrapartido);
                    var rangePC = maxPC - minPC

                    //aplico a resultado los offpower y defpower + momentum
                for (let index = 0; index < resultado.length; index++) {
                    //Corrijo off y def power
                    if (resultado[index].asistencia < 0.4) {
                        resultado[index].offpower = "No Calculado"
                        resultado[index].defpower = "No Calculado"
                    } else {
                    resultado[index].offpower = ((resultado[index].puntosfavorporpartido-minPF)/rangePF)*10
                    resultado[index].defpower = -((resultado[index].puntoscontraporpartido-maxPC)/rangePC)*10
                    }
                    //Corrijo momentum
                    if (resultado[index].totalmomentum<4) {
                        resultado[index].momentum = "-";
                    }
                }

        let response = {
            'player': resultado
        };

        res.send(JSON.stringify(response));
    });
}



function competencia(req, res) {
//TRAER DOS ALEATORIAS??
    var idCompetencia = req.params.id;

    var sql = "select * from competencias where id = " + idCompetencia;
    
            con.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }


        res.send(JSON.stringify(resultado));
    });
}

module.exports = {
    traerjugadores: traerjugadores,
    traerPlayers: traerPlayers
};