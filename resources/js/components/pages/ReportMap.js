import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import Maps from '../components/Maps';
import { Button } from 'primereact/button';
import ModalityService from "../service/ModalityService";
import DenunciaService from "../service/DenunciaService";
export const ReportMap = () => {
    let empty_complaint = {
        id: null,
        idModalidad: '',
        tipoDenuncia: '',
        formalidad: '',
        fechaHecho: '',
        horaHecho: '',
        lugarHecho: '',
        direccionHecho: '',
        latitudDefault: -6.4830738240872705,
        longituDefault: -76.37364869037867,
        latitudHecho: '',
        seccion_description: '',
        type_complaint_description: '',
        book_description: '',
        longitudHecho: '',
        descripcion: '',
        number: '',
        denunciantes: '',
        denunciados: '',
        agraviados: '',
        formality_description: '',
        armas: '',
        especies: '',
        vehiculos: '',

    };
    const [modalitys, setModalitys] = useState([]);
    const [complaint, setComplaint] = useState(empty_complaint);
    const [whistleblowers, setWhistleblowers] = useState([]);
    const [whistleblower, setWhistleblower] = useState(false);
    const [denounceds, setDenounceds] = useState([]);
    const [denounced, setDenounced] = useState(false);
    const [aggrieveds, setAggrieveds] = useState([]);
    const [aggrieved, setAggrieved] = useState(false);
    const [complaints, setComplaints] = useState([]);

    const [weapons, setWeapons] = useState([]);
    const [weapon, setWeapon] = useState(false);
    const [species, setSpecies] = useState([]);
    const [specie, setSpecie] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [vehicle, setVehicle] = useState(false);

    useEffect(() => {
        async function fetchDatamodality() {
            const res = await ModalityService.list();
            setModalitys(res.data)
        }
        fetchDatamodality();
    }, []);

    useEffect(() => {
        async function fetchDataComplaintDetail() {
            const res = await DenunciaService.complaint_detail_total();
            setWhistleblowers(res.data_denunciante);
            setDenounceds(res.data_denunciado);
            setAggrieveds(res.data_agraviado);
            setWeapons(res.data_arma);
            setSpecies(res.data_especie);
            setVehicles(res.data_vehiculo);

        }
        fetchDataComplaintDetail();
    }, []);



    useEffect(() => {
        async function fetchDataComplaint() {
            const res = await DenunciaService.list();
            setComplaints(res.data)
        }
        fetchDataComplaint();
    }, []);

    const data_complaint = (id) => {
        let arrayFilterComplaint = complaints.filter(e => e.id == id);

        let arrayFilterWhistleblower = whistleblowers.filter(e => e.idDenuncia == id);


        let arrayFilterDenounced = denounceds.filter(e => e.idDenuncia == id);

        let arrayFilterAggrieved = aggrieveds.filter(e => e.idDenuncia == id);


        let arrayFilterWeapon = weapons.filter(e => e.idDenuncia == id);


        let arrayFilterSpecie = species.filter(e => e.idDenuncia == id);

        let arrayFilterVehicle = vehicles.filter(e => e.idDenuncia == id);

        setWhistleblower(arrayFilterWhistleblower);
        setDenounced(arrayFilterDenounced);
        setAggrieved(arrayFilterAggrieved);

        setWeapon(arrayFilterWeapon);
        setSpecie(arrayFilterSpecie);
        setVehicle(arrayFilterVehicle);

        setComplaint(arrayFilterComplaint[0]);

    }
    return (
        <div className="grid p-fluid">
            <div className="col-12 md:col-8">
                <div className="card">
                    <div> <b>*Leyenda</b></div>
                    <br></br>
                    <div className="grid formgrid">
                        <div className='leyenda_container'>
                            {modalitys.map(modality => (
                                < div key={modality.id}>
                                    <div className='leyenda_row'>
                                        <div className="leyenda_map" style={{ backgroundColor: modality.color_report }}></div>
                                    </div>
                                    <div className='leyenda_row'>
                                        {modality.descripcion}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <br></br>
                    <div className="grid formgrid">
                        <div id="map" style={{ width: '100%' }}>
                            <Maps data_complaint={data_complaint} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-4">
                <div className="card">
                    <div style={{ alignItems: 'center', justifyContent: 'center',display:'flex',boxShadow: "0px 0px 5px 1px black" }}>
                        <div >DESCRIPCIÓN DENUNCIA</div>
                    </div>
                    <br></br>
                    <div id="project">
                        <div><strong>N° Denuncia:&nbsp;</strong>{complaint.correlativo}</div>
                        <div><strong>Modalidad:&nbsp;</strong>{complaint.modality_description}</div>
                        <div><strong>Sección :&nbsp;</strong>{complaint.seccion_description}</div>
                        <div><strong>Libro:&nbsp;</strong>{complaint.book_description}</div>
                        <div><strong>Tipo:&nbsp;</strong>{complaint.type_complaint_description}</div>
                        <div><strong>Formalidad:&nbsp;</strong>{complaint.formality_description}</div>
                        <div><strong>Fecha:&nbsp;</strong>{complaint.fechaHecho}</div>
                        <div><strong>Hora:&nbsp;</strong>{complaint.horaHecho}</div>
                        <div><strong>Dirección:&nbsp;</strong>{complaint.direccionHecho}</div>
                    </div>
                    <br></br>
                    <table>
                        <thead>
                            <tr>
                                <th style={{
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'left',

                                }}>Denunciante</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {whistleblower ? (
                                        whistleblower.map(item => (
                                            <li key={item.dni}>{item.full_name}</li>
                                        ))
                                    ) : (
                                        <li>No indica</li>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th style={{
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'left',

                                }} >Denunciado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td >
                                    {denounced ? (
                                        denounced.map(item => (
                                            <li key={item.dni}>{item.full_name}</li>
                                        ))
                                    ) : (
                                        <li>No indica</li>
                                    )}

                                </td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th style={{
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'left',

                                }} >Agraviado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td >
                                    {aggrieved ? (
                                        aggrieved.map(item => (
                                            <li key={item.dni}>{item.full_name}</li>
                                        ))
                                    ) : (
                                        <li>No indica</li>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th style={{
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'left',

                                }}>Arma</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td >
                                    {weapon ? (
                                        weapon.map(item => (
                                            <li key={item.serie}>{item.full_name}</li>
                                        ))
                                    ) : (
                                        <li>No indica</li>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th style={{
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'left',

                                }} >Especie</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td >
                                    {specie ? (
                                        specie.map(item => (
                                            <li key={item.serie}>{item.full_name}</li>
                                        ))
                                    ) : (
                                        <li>No indica</li>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th style={{
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'left',

                                }} >Vehiculo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td >
                                    {vehicle ? (
                                        vehicle.map(item => (
                                            <li key={item.placa}>{item.full_name}</li>
                                        ))
                                    ) : (
                                        <li>No indica</li>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                        <thead>
                            <tr>
                                <th style={{
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'left',

                                }}>Descripcion del Hecho</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td >
                                    <span>{complaint.descripcion}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div >
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ReportMap, comparisonFn);