<!DOCTYPE html>
<html lang="en">
<head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reporte Personas</title>

    <style>
        h1 {
            text-align: center;
        }

        #customers {
            font-family: Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        #customers td,
        #customers th {
            border: 1px solid #ddd;
            padding: 8px;
        }

        #customers tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        #customers tr:hover {
            background-color: #ddd;
        }

        #customers th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #044f21;
            color: white;
        }

    </style>
</head>
<body>
    <h1><img class="derecha" src="assets/layout/images/dirtic.png" width="100" height="100"><br>Reporte de Personas</h1>
    <hr>
    <table id="customers">
            <tr>
                <th>item</th>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Celular</th>
                <th>Estado Civil</th>
            </tr>
            {{$item=0}}
            @foreach ($personas as $persona)
                <tr>
                    <td> {{$item+=1}}</td>
                    <td>{{$persona->dni}}</td>
                    <td>{{$persona->nombre}}</td>
                    <td>{{$persona->ap_paterno}}</td>
                    <td>{{$persona->ap_materno}}</td>
                    <td>{{$persona->edad}}</td>
                    <td>{{$persona->sexo}}</td>
                    <td>{{$persona->celular}}</td>
                    <td>{{$persona->estado_civil}}</td>
                </tr>
            @endforeach
    </table>

</body>
</html>