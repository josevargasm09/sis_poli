<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Reporte Denuncia</title>
  <link rel="stylesheet" href="style.css" media="all" />
  <style>
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
    }

    a {
      color: #5D6975;
      text-decoration: underline;
    }

    body {
      position: relative;
      width: 19cm;
      height: 29.7cm;
      margin: 0 auto;
      color: #001028;
      background: #FFFFFF;
      font-family: Arial, sans-serif;
      font-size: 12px;
      font-family: Arial;
    }

    header {
      padding: 5px 30px 0 10px;
      margin-bottom: 10px;
    }

    #logo {
      text-align: center;
      padding-top: 5px;
      margin-bottom: 5px;
    }

    #logo img {
      width: 90px;
    }

    h1 {
      border-top: 1px solid #5D6975;
      border-bottom: 1px solid #5D6975;
      color: #306e20;
      font-size: 2.4em;
      line-height: 1.4em;
      font-weight: normal;
      text-align: center;
      margin: 0 0 10px 0;
      background: url(dimension.png);
    }

    h5 {
      color: #e30808;
      font-size: 1.5em;
      font-weight: normal;
      text-align: center;
      margin: 0 0 10px 0;
    }

    #project {
      float: left;
    }

    #project span {
      color: #5D6975;
      text-align: right;
      width: 52px;
      margin-right: 10px;
      display: inline-block;
      font-size: 0.8em;
    }

    #company {
      float: right;
      text-align: right;
    }

    #project div,
    #company div {
      white-space: nowrap;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 20px;
    }

    table tr:nth-child(4n-1) td {
      background: #F5F5F5;
    }

    table th,
    table td {
      text-align: right;
    }

    table th {
      padding: 5px 5px 2px 0px;
      color: #5D6975;
      border-bottom: 1px solid #C1CED9;
      white-space: nowrap;
      font-weight: normal;
    }

    table .service {
      text-align: left;
    }

    table td {
      /* idstancias entre si */
      padding: 10px;
      text-align: left;
    }

    table td ul {
      padding-left: 0.5px;
    }

    table td.service {
      vertical-align: top;

    }

    table td.grand {
      border-top: 1px solid #5D6975;
      ;
    }

    #notices .notice {
      color: #5D6975;
      font-size: 1.2em;
    }
  </style>
</head>

<body>
  <header class="clearfix">
    <div id="logo">
      <img src="assets/layout/images/dirtic.png">
    </div>
    <h1>Reporte Denuncia</h1>
    <h5>Esto no es una copia certificada</h5>
    <div id="company" class="clearfix">
      <div>{{$comisaria[0]['nom_comisaria']}}</div>
      <div>{{$comisaria[0]['direccion']}}</div>
      <div>{{$comisaria[0]['phone']}}</div>
      <div>{{$comisaria[0]['email']}}</div>
    </div>
    <div id="project">
      <div><span>NUMERO DENUNCIA</span>{{$complaint[0]['correlativo']}}</div>
      <div><span>SECCION</span>{{$complaint[0]['seccion_description']}}</div>
      <div><span>LIBRO</span>{{$complaint[0]['book_description']}}</div>
      <div><span>TIPO</span>{{$complaint[0]['type_complaint_description']}}</div>
      <div><span>FORMALIDAD</span>{{$complaint[0]['formality_description']}}</div>
      <div><span>FECHA IMPRESIÓN</span> {{$actual_date}}</div>
    </div>
  </header>
  <main>
    <table>
      {{-- Cabecera --}}
      <thead>
        <tr>
          <th class="service">Denunciante</th>
        </tr>
      </thead>
      {{-- Cuerpo --}}
      <tbody>
        <tr>
          <td>
            @if(!empty($data_denunciante))
            @foreach ($data_denunciante as $denunciante)
            <li class="service">{{$denunciante['full_name']}}</li>
            @endforeach
            @else
            <li>No indica</li>
            @endif
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th class="service">Denunciado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="service">
            @if(!empty($data_denunciado))
            @foreach ($data_denunciado as $denunciado)
            <li class="service">{{$denunciado['full_name']}}</li>
            @endforeach
            @else
            <li>No indica</li>
            @endif
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th class="service">Agraviado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="service">
            @if(!empty($data_agraviado))
            @foreach ($data_agraviado as $agraviado)
            <li class="service">{{$agraviado['full_name']}}</li>
            @endforeach
            @else
            <li>No indica</li>
            @endif
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th class="service">Arma</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="service">
            @if(!empty($data_arma))
            @foreach ($data_arma as $arma)
            <li class="service">{{$arma['full_name']}}</li>
            @endforeach
            @else
            <li>No indica</li>
            @endif
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th class="service">Especie</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="service">
            @if(!empty($data_especie))
            @foreach ($data_especie as $especie)
            <li class="service">{{$especie['full_name']}}</li>
            @endforeach
            @else
            <li>No indica</li>
            @endif
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th class="service">Vehiculo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="service">
            @if(!empty($data_vehiculo))
            @foreach ($data_vehiculo as $vehiculo)
            <li class="service">{{$vehiculo['full_name']}}</li>
            @endforeach
            @else
            <li>No indica</li>
            @endif
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th class="service">Descripcion del Hecho</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="service">
            <span>{{$complaint[0]['descripcion']}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div id="notices">
      <div>NOTIFICACION:</div>
      <div class="notice">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
    </div>
  </main>
</body>

</html>