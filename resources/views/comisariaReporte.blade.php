<!DOCTYPE html>
<html lang="en">
<head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reporte comisarias</title>

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
    <h1><img class="derecha" src="assets/layout/images/dirtic.png" width="100" height="100"><br>Reporte de comisarias</h1>
    <hr>
    <table id="customers">
            <tr>
                <th>item</th>
                <th>Nombre comisaria</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Estado</th>
            </tr>
            {{$item=0}}
            @foreach ($comisarias as $comisaria)
                <tr>
                    <td> {{$item+=1}}</td>
                    <td>{{$comisaria->nom_comisaria}}</td>
                    <td>{{$comisaria->direccion}}</td>
                    <td>{{$comisaria->phone}}</td>
                    <td>{{$comisaria->email}}</td>
                    <td>{{$comisaria->status_description}}</td>
                </tr>
            @endforeach
    </table>

</body>
</html>