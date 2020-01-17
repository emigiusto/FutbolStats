SELECT 
    jugador.id,
    jugador.nombre,
    jugador.apellido,
    jugador.alias,
    jugador.foto,
    jugador.fechainicio,
    tablatorneo.ganados,
    tablatorneo.perdidos,
    tablatorneo.empatados,
    tablatorneo.totales,
    (tablatorneo.ganados * 3 + tablatorneo.empatados) as 'puntos',
    tablatorneo.golesjugador as 'golesjugadortorneo',
    (tablatorneo.ganados/tablatorneo.totales) as 'eficienciaganados',
    (tablatorneo.totales/totalpartidostorneo.totalpartidos) as 'asistencia',
    tablaalltime.golesfavorequipo,
    tablaalltime.golescontraequipo,
    tablaalltime.golesjugador as 'golesjugadoralltime'
from jugador
join jugadortorneo on jugador.id = jugadortorneo.jugador_id
left outer join 
	(SELECT 	jugadorresultado.jugador_id, 
			SUM(jugadorresultado.golesjugador) as golesjugador,
			SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados,
			SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos,
			SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados,
			SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo,
			SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo,
			SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales
				from jugadorresultado
				join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id
				join partidos on jugadorresultado.partido_id = partidos.id
				where partidotorneo.torneo_id = 3
				group by jugadorresultado.jugador_id) as tablatorneo on tablatorneo.jugador_id = jugador.id
                
right outer join 
	(SELECT jugadorresultado.jugador_id, 
			SUM(jugadorresultado.golesjugador) as golesjugador,
			SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados,
			SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos,
			SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados,
			SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo,
			SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo,
			SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales
				from jugadorresultado
				join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id
				join partidos on jugadorresultado.partido_id = partidos.id
				group by jugadorresultado.jugador_id) as tablaalltime on tablaalltime.jugador_id = jugador.id
                
left outer join
	(SELECT count(*) as totalpartidos 
    from partidotorneo where torneo_id = 3) as totalpartidostorneo on 1=1
where jugadortorneo.torneo_id = 3;





SELECT 	jugadorresultado.jugador_id, 
		SUM(jugadorresultado.golesjugador) as golesjugador,
		SUM(if(jugadorresultado.resultado = 1, 1, 0)) AS ganados,
		SUM(if(jugadorresultado.resultado = 0, 1, 0)) AS perdidos,
		SUM(if(jugadorresultado.resultado = 2, 1, 0)) AS empatados,
		SUM(if(jugadorresultado.resultado = 1, partidos.golesganador,if(jugadorresultado.resultado = 0, partidos.golesperdedor,partidos.golesganador))) as golesfavorequipo,
        SUM(if(jugadorresultado.resultado = 0, partidos.golesganador,if(jugadorresultado.resultado = 1, partidos.golesperdedor,partidos.golesganador))) as golescontraequipo,
        SUM(if(jugadorresultado.resultado = 1, 1, 0)) + SUM(if(jugadorresultado.resultado = 0, 1, 0)) + SUM(if(jugadorresultado.resultado = 2, 1, 0)) as totales
			from jugadorresultado
			join partidotorneo on jugadorresultado.partido_id = partidotorneo.partido_id
            join partidos on jugadorresultado.partido_id = partidos.id
			where partidotorneo.torneo_id = 3
			group by jugadorresultado.jugador_id