import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';

import PersonaService from "../service/PersonaService";
import ArmaService from "../service/ArmaService";
import EspecieService from "../service/EspecieService";
import VehiculoService from "../service/VehiculoService";
import SeccionService from "../service/SeccionService";
import UbigeoService from "../service/UbigeoService";
import LibroService from "../service/LibroService";
import ModalityService from "../service/ModalityService";
import DenunciaService from "../service/DenunciaService";
import { Dropdown } from 'primereact/dropdown';
import MapDraggable from '../components/MapDraggable';
import AutoCompleteMap from '../components/AutocompleteMap';


const Denuncia = () => {
    let list_modalities;
    let emptyPerfil = {
        idperfil: null,
        descripcion: '',
        estado: 'A',
    };
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
        longitudHecho: '',
        descripcion: '',
        number: '',
        denunciantes: '',
        denunciados: '',
        agraviados: '',
        armas: '',
        especies: '',
        vehiculos: '',

    };

    let emptyPersona = {
        idpersona: null,
        dni: '',
        nombre: '',
        ap_paterno: '',
        ap_materno: '',
        nacimiento: '',
        edad: '',
        sexo: '',
        celular: '',
        estado_civil: '',
        situacion: '',
    };

    let emptyArma = {
        idarma: null,
        marca: '',
        modelo: '',
        calibre: '',
        serie: '',
        estado: 'A',
    };

    let emptyEspecie = {
        idespecie: null,
        especie: '',
        serie: '',
        documento: '',
        codigoDoc: '',
        situacion: '',
        estado: 'A',
    };

    let emptyVehiculo = {
        idvehiculo: null,
        clase: '',
        marca: '',
        modelo: '',
        placa: '',
        situacion: '',
        estado: 'A',
    };


    const typeComplaints = [
        { description: 'SELECCIONAR', id: '' },
        { description: 'DENUNCIA', id: '1' },
        { description: 'OCURRENCIA', id: '2' },

    ];
    const formalitys = [
        { description: 'VERBAL', id: '1' },
        { description: 'ESCRITA', id: '2' },

    ];
    const GENDERS = [
        { description: 'SELECCIONAR', id: '' },
        { description: 'MASCULINO', id: 'M' },
        { description: 'FEMENINO', id: 'F' },
    ];
    const MARITAL_STATUS = [
        { description: 'SELECCIONAR', id: '' },
        { description: 'SOLTERO/A', id: '1' },
        { description: 'CASADO/A', id: '2' },
        { description: 'SEPARADO/A', id: '3' },
        { description: 'DIVORCIADO/A', id: '4' },
        { description: 'VIUDO/A', id: '5' },
    ];
    const TYPE_DOCUMENT = [
        { description: 'SELECCIONAR', id: '' },
        { description: 'BOLETA', id: 'B' },
        { description: 'FACTURA', id: 'F' },
    ];
    const SITUATION = [
        { description: 'SELECCIONAR', id: '' },
        { description: 'ROBADO', id: 'R' },
        { description: 'ENCONTRADO', id: 'E' },
    ];


    const [selectedDenunciante, setselectedDenunciante] = useState(null);
    // agraviado
    const [selectedAgraviado, setselectedAgraviado] = useState(null);


    const [selectedAutoValue, setSelectedAutoValue] = useState(null);


    const [deleteDenuncianteDialog, setDeleteDenuncianteDialog] = useState(false);
    const [deleteComplaintDialog, setDeleteComplaintDialog] = useState(false);
    const [deleteDenunciadoDialog, setDeleteDenunciadoDialog] = useState(false);
    const [deleteAgraviadoDialog, setDeleteAgraviadoDialog] = useState(false);
    const [deleteArmaDialog, setDeleteArmaDialog] = useState(false);
    const [deleteEspecieDialog, setDeleteEspecieDialog] = useState(false);
    const [deleteVehiculoDialog, setDeleteVehiculoDialog] = useState(false);

    const [perfil, setPerfil] = useState(emptyPerfil);//estado de los  campos del perfil
    const [selectedPerfils, setSelectedPerfils] = useState(null);// AUN NO SE
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [checkboxValue, setCheckboxValue] = useState([]);


    const toast = useRef(null);
    const dt = useRef(null);
    // Denunciado
    const [selectedDenunciado, setselectedDenunciado] = useState(null);


    const [autoFilteredPerson, setAutoFilteredPerson] = useState([]);
    const [autoPersonValue, setAutoPersonValue] = useState(null);
    const [complaint, setComplaint] = useState(empty_complaint);

    const [listModalities, setListModalities] = useState(null);

    //modalidad
    const [modality, setModality] = useState(null);
    //tipo denuncia
    const [typeComplaint, setTypeComplaint] = useState(null);
    //formalidad
    const [formality, setFormality] = useState(null);
    // libro
    const [libro, setLibro] = useState(null);
    const [listLibros, setListLibros] = useState(null);
    const [listLibrosSeccion, setListLibrosSeccion] = useState(null);
    // section
    const [section, setSection] = useState(null);
    const [listSeccion, setListSeccion] = useState(null);
    //Denuncia modal
    const [complaintDialog, setComplaintDialog] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [flagComplaint, setFlagComplaint] = useState(null);
    // Vehiculo
    const [selectedVehiculo, setselectedVehiculo] = useState(null);
    const [autoFilteredVehiculo, setAutoFilteredVehiculo] = useState([]);
    const [autoVehiculoValue, setAutoVehiculoValue] = useState(null);
    // Especie
    const [selectedEspecie, setselectedEspecie] = useState(null);
    const [autoFilteredEspecie, setAutoFilteredEspecie] = useState([]);
    const [autoEspecieValue, setAutoEspecieValue] = useState(null);
    const [typeDocument, setTypeDocument] = useState(false);
    const [situation, setSituation] = useState(false);
    // Arma
    const [selectedArma, setselectedArma] = useState(null);
    const [autoFilteredArma, setAutoFilteredArma] = useState([]);
    const [autoArmaValue, setAutoArmaValue] = useState(null);
    const [titleDenuncia, setTitleDenuncia] = useState('');
    //Denunciante
    const [detailDenunciante, setDetailDenunciante] = useState(null);
    const [denunciantes, setDenunciantes] = useState([]);
    const [denunciante, setDenunciante] = useState([]);

    // Denunciado
    const [detailDenuncido, setDetailDenunciado] = useState(null);
    const [denunciados, setDenunciados] = useState([]);
    const [denunciado, setDenunciado] = useState([]);

    // Agraviado
    const [detailAgraviado, setDetailAgraviado] = useState(null);
    const [agraviados, setAgraviados] = useState([]);
    const [agraviado, setAgraviado] = useState([]);

    // Armas tabla
    const [detailArma, setDetailArma] = useState(null);
    const [armas, setArmas] = useState([]);
    const [arma, setArma] = useState(emptyArma);
    const [armaDialog, setArmaDialog] = useState(false);
    const [titleArma, setTitleArma] = useState('');

    // Especies tabla
    const [detailEspecie, setDetailEspecie] = useState(null);
    const [especies, setEspecies] = useState([]);
    const [especie, setEspecie] = useState(emptyEspecie);
    const [especieDialog, setEspecieDialog] = useState(false);
    const [titleEspecie, setTitleEspecie] = useState('');

    // Vehiculo tabla
    const [detailVehiculo, setDetailVehiculo] = useState(null);
    const [vehiculos, setVehiculos] = useState([]);
    const [vehiculo, setVehiculo] = useState(emptyArma);
    const [vehiculoDialog, setVehiculoDialog] = useState(false);
    const [titleVehiculo, setTitleVehiculo] = useState('');
    // Persona
    const [persona, setPersona] = useState(emptyPersona);
    const [personas, setPersonas] = useState(null);
    const [flagPersona, setFlagPersona] = useState(null);


    const [listUbigeo, setListUbigeo] = useState(null);
    const [listDepartamentos, setListDepartamentos] = useState(null);
    const [departamento, setDepartamento] = useState(null);

    const [distrito, setDistrito] = useState(null);

    const [listDistrito, setListDistrito] = useState(null);

    const [provincia, setProvincia] = useState(null);

    const [listProvincia, setListProvincia] = useState(null);


    const [personaDialog, setPersonaDialog] = useState(false);
    const [titlePersona, setTitlePersona] = useState('');
    const [gender, setGender] = useState(null);
    const [maritalStatus, setMaritalStatus] = useState(null);
    // MAP
    const [mapDialog, setMapDialog] = useState(false);
    const [titleMap, setTitleMap] = useState('');
    const [typePersonSelect, setTypePersonSelect] = useState(null);
    //modalidad
    useEffect(() => {
        async function fetchDataModality() {
            const res = await ModalityService.modality_active();
            setListModalities(res.data)
        }

        fetchDataModality();
    }, []);

    function fetchDataDniPerson(dni) {
        const url = "https://dniruc.apisperu.com/api/v1/dni/" + dni + "?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJleXNhbmdhbWE3QGdtYWlsLmNvbSJ9.hfobQC8FM5IyKKSaa7usUXV0aY1Y8YthAhdN8LoMlMM";
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.nombres) {
                    let _persona = { ...persona };
                    _persona[`nombre`] = data.nombres;
                    _persona[`ap_paterno`] = data.apellidoPaterno;
                    _persona[`ap_materno`] = data.apellidoMaterno;
                    setPersona(_persona);
                } else {
                    toast.current.show({ severity: 'warn', summary: '', detail: 'No se encontró persona', life: 3000 });
                }
            })
            .catch(() => {
                toast.current.show({ severity: 'warn', summary: '', detail: 'No se encontró persona', life: 3000 });

            })
    }
    const handleKeyUpDni = (e) => {
        if (e.key === 'Enter') {
            if (persona.dni.length == 8) {
                fetchDataDniPerson(persona.dni)
            } else {
                toast.current.show({ severity: 'warn', summary: '', detail: 'Documento debe tener 8 dígitos', life: 3000 });
            }

        }
    }
    async function fetchDataDetailComplaint(id) {
        const res = await DenunciaService.denuncia_detail(id);
        setArmas(res.data_arma);
        setDenunciados(res.data_denunciado);
        setDenunciantes(res.data_denunciante);
        setAgraviados(res.data_agraviado);
        setEspecies(res.data_especie);
        setVehiculos(res.data_vehiculo);
    }
    //denuncias
    useEffect(() => {
        async function fetchDataComplaint() {
            const res = await DenunciaService.list();
            setComplaints(res.data)
        }
        fetchDataComplaint();
    }, [flagComplaint]);
    //ubigeo 
    useEffect(() => {
        async function fetchDataUbigeo() {
            const res = await UbigeoService.list_departamento();
            // let arrayFilterDepartamento = res.filter(e => e.idseccion == val.id);
            setListDepartamentos(res.data);

        }
        fetchDataUbigeo();
    }, []);

    useEffect(() => {
        async function fetchDataProvincia() {
            let department = null;
            if (departamento != null) {
                department = departamento.dpto;
            }
            const res = await UbigeoService.list_provincia(department);
            setListProvincia(res.data);
        }
        fetchDataProvincia();
    }, [departamento]);
    useEffect(() => {
        async function fetchDataUbigeo() {
            const res = await UbigeoService.list_ubigeo();

            setListUbigeo(res.data);

        }
        fetchDataUbigeo();
    }, []);
    // Persona
    useEffect(() => {
        async function fetchDataPersona() {
            const res = await PersonaService.list();
            setPersonas(res.data)
        }

        fetchDataPersona();
    }, []);
    //
    const onInputSelectTypeDocumentEspecie = (val, name) => {
        setTypeDocument(val);
        let _especie = { ...especie };
        _especie[`${name}`] = val.id;
        setEspecie(_especie);
    }
    const onInputSelectSituationEspecie = (val, name) => {
        setSituation(val);
        let _especie = { ...especie };
        _especie[`${name}`] = val.id;
        setEspecie(_especie);
    }
    const onInputSelectSituationVehiculo = (val, name) => {

        setSituation(val);

        let _vehiculo = { ...vehiculo };

        _vehiculo[`${name}`] = val.id;

        setVehiculo(_vehiculo);
    }

    // Persona

    const crear = async (_persona, _personas) => {
        const res = await PersonaService.create(_persona);
        if (res.status == 422) {
            if (res.data) {
                let errors = res.data;
                for (let key in errors) {
                    toast.current.show({ severity: 'warn', summary: '', detail: errors[key], life: 3000 });
                }
            } else {
                toast.current.show({ severity: 'warn', summary: '', detail: res.message, life: 3000 });
            }

        } else {
            _persona.id = "";
            _personas.push(_persona);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Usuario Creado', life: 3000 });
            setFlagPersona(_persona);
            // setPersonas(_personas);
            setPersonaDialog(false);
            setPersona(emptyPersona);
            const data_denunciante = {
                dni: _persona.dni,
                full_name: _persona.nombre + ' ' + _persona.ap_materno + ' ' + _persona.ap_materno,
            };
            _persona = {
                ...data_denunciante
            };
            add_table_detail(denunciantes, _persona, setDenunciantes, setselectedDenunciante)
        }


        return res;
    }
    const crearDenunciado = async (_persona, _personas) => {
        const res = await PersonaService.create(_persona);
        if (res.status == 422) {
            if (res.data) {
                let errors = res.data;
                for (let key in errors) {
                    toast.current.show({ severity: 'warn', summary: '', detail: errors[key], life: 3000 });
                }
            } else {
                toast.current.show({ severity: 'warn', summary: '', detail: res.message, life: 3000 });
            }

        } else {
            _persona.id = "";
            _personas.push(_persona);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Usuario Creado', life: 3000 });

            // setPersonas(_personas);
            setPersonaDialog(false);
            setPersona(emptyPersona);
            setFlagPersona(_persona);
            const data_denunciante = {
                dni: _persona.dni,
                full_name: _persona.nombre + ' ' + _persona.ap_materno + ' ' + _persona.ap_materno,
            };
            _persona = {
                ...data_denunciante
            };
            add_table_detail(denunciados, _persona, setDenunciados, setselectedDenunciado)
        }


        return res;
    }
    const crearAgraviado = async (_persona, _personas) => {
        const res = await PersonaService.create(_persona);
        if (res.status == 422) {
            if (res.data) {
                let errors = res.data;
                for (let key in errors) {
                    toast.current.show({ severity: 'warn', summary: '', detail: errors[key], life: 3000 });
                }
            } else {
                toast.current.show({ severity: 'warn', summary: '', detail: res.message, life: 3000 });
            }

        } else {
            _persona.id = "";
            _personas.push(_persona);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Usuario Creado', life: 3000 });

            // setPersonas(_personas);
            setFlagPersona(_persona);
            setPersonaDialog(false);
            setPersona(emptyPersona);
            const data_denunciante = {
                dni: _persona.dni,
                full_name: _persona.nombre + ' ' + _persona.ap_materno + ' ' + _persona.ap_materno,
            };
            _persona = {
                ...data_denunciante
            };
            add_table_detail(agraviados, _persona, setAgraviados, setselectedAgraviado)
        }


        return res;
    }
    const update = async (id, data) => {

        const res = await PersonaService.update(id, data);

    }
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _persona = { ...persona };
        _persona[`${name}`] = val;

        setPersona(_persona);
    }
    const onInputChangeComplaint = (e, name) => {
        const val = (e.target && e.target.value) || '';
        if (val == null) {
            val = '';
        }
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val;

        setComplaint(_complaint);
    }
    const onInputChangeDate = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val;

        setComplaint(_complaint);
    }
    const onInputChangeHour = (e, name) => {

        const val = (e.target && e.target.value) || '';
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val;

        setComplaint(_complaint);
    }
    const onInputSelectDepartamento = (val) => {
        setDepartamento(val);


        // setListProvincia(arrayFilterProvincia)

    }
    const onInputSelectProvincia = (val) => {
        setProvincia(val);
        let arrayFilterDistrito = listUbigeo.filter(e => e.prov == val.prov);
        setListDistrito(arrayFilterDistrito);
    }
    const onInputSelectDistrito = (val, name) => {
        setDistrito(val);
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val.ubigeo1;

        setComplaint(_complaint);
    }

    const onInputChangeAutoComplete = (address) => {
        let _complaint = { ...complaint };
        _complaint['direccionHecho'] = address;

        if (address == '') {
            _complaint['latitudHecho'] = '';
            _complaint['longitudHecho'] = '';
        }
        setComplaint(_complaint);
    }

    const onInputChangeMap = (latitud, longitud) => {
        let _complaint = { ...complaint };
        _complaint['latitudHecho'] = latitud;
        _complaint['longitudHecho'] = longitud;
        setComplaint(_complaint);
    }


    const onInputSelectMaritalStatus = (val, name) => {
        setMaritalStatus(val)
        let _person = { ...persona };
        _person[`${name}`] = val.id;
        setPersona(_person);
    }
    const onInputSelectGender = (val, name) => {
        setGender(val);
        let _person = { ...persona };
        _person[`${name}`] = val.id;
        setPersona(_person);
    }
    // Armas

    const crearArma = async (data) => {

        const res = await ArmaService.create(data);

    }

    const updateArma = async (id, data) => {

        const res = await ArmaService.update(id, data);

    }

    // Especies

    const crearEspecie = async (data) => {

        const res = await EspecieService.create(data);

    }
    const updateEspecie = async (id, data) => {

        const res = await EspecieService.update(id, data);

    }

    // Vehiculos
    const crearVehiculo = async (data) => {

        const res = await VehiculoService.create(data);

    }
    const updateVehiculo = async (id, data) => {

        const res = await VehiculoService.update(id, data);

    }


    //seccion
    useEffect(() => {
        async function fetchDataSection() {
            const res = await SeccionService.seccion_active();
            setListSeccion(res.data)
        }

        fetchDataSection();
    }, []);
    // libro
    useEffect(() => {
        async function fetchDataLibros() {
            const res = await LibroService.book_active();
            setListLibros(res.data)

        }

        fetchDataLibros();
    }, []);

    // Vehiculo
    useEffect(() => {
        async function fetchDataVehiculo() {
            const result = await VehiculoService.getVehiculoSearch();
            setAutoVehiculoValue(result.data);
        }

        fetchDataVehiculo();
    }, []);

    // Especie
    useEffect(() => {
        async function fetchDataEspecie() {
            const result = await EspecieService.getEspecieSearch();
            setAutoEspecieValue(result.data);
        }

        fetchDataEspecie();
    }, []);
    // Arma
    useEffect(() => {
        async function fetchDataArma() {
            const result = await ArmaService.getArmaSearch();
            setAutoArmaValue(result.data);
        }

        fetchDataArma();
    }, [arma]);

    // Persona
    useEffect(() => {
        async function fetchDataPersonas() {
            const result = await PersonaService.getPersonaSearch();
            setAutoPersonValue(result.data);
        }

        fetchDataPersonas();
    }, [flagPersona]);

    const onInputDniChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let regex = new RegExp("^[0-9]+$");
        // let regex = new RegExp("^[a-zA-Z ]+$");
        if (regex.test(val) || val == '') {
            let _persona = { ...persona };
            _persona[`${name}`] = val;

            setPersona(_persona);
        }

    }
    const onInputAgeChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let regex = new RegExp("^[0-9]+$");
        // let regex = new RegExp("^[a-zA-Z ]+$");
        if (regex.test(val) || val == '') {
            let _persona = { ...persona };
            _persona[`${name}`] = val;

            setPersona(_persona);
        }

    }


    const searchPerson = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredPerson([...autoPersonValue]);
            } else {
                setAutoFilteredPerson(autoPersonValue.filter((person) => {
                    return person.full_name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchArma = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredArma([...autoArmaValue]);
            } else {
                setAutoFilteredArma(autoArmaValue.filter((person) => {
                    return person.full_name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    // const savePersona = () => {
    //     setSubmitted(true);
    //     if (persona.nombre.trim()) {
    //         let _personas = [...personas];
    //         let _persona = {...persona};
    //         if (persona.idpersona) {
    //             const index = findIndexById(persona.idpersona);
    //             _personas[index] = _persona;
    //             toast.current.show({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Usuario Modificado',
    //                 life: 3000
    //             });
    //             update(persona.idpersona, _persona);

    //         } else {
    //             _persona.idpersona = "";
    //             _personas.push(_persona);
    //             toast.current.show({severity: 'success', summary: 'Successful', detail: 'Usuario Creado', life: 3000});
    //             crear(_persona);
    //         }
    //         setPersonas(_personas);
    //         setPersonaDialog(false);
    //         setPersona(emptyPersona);
    //     }
    // }
    const savePersona = () => {
        setSubmitted(true);
        if (persona.nombre.trim()) {
            let _personas = [...personas];
            let _persona = { ...persona };
            if (persona.id) {
                update(persona.id, _persona, _personas);
            }
            else {
                if (typePersonSelect == 'A') {
                    crear(_persona, _personas);
                }
                else if (typePersonSelect == 'B') {

                    crearDenunciado(_persona, _personas);
                } else if (typePersonSelect == 'C') {
                    crearAgraviado(_persona, _personas);
                }


            }

        }
    }
    const updateDenuncia = async (id, _complaint, _complaints) => {
        const res = await DenunciaService.update(id, _complaint);
        if (res.status == 422) {
            if (res.data) {
                let errors = res.data;
                for (let key in errors) {
                    toast.current.show({ severity: 'warn', summary: '', detail: errors[key], life: 3000 });
                }
            } else {
                toast.current.show({ severity: 'warn', summary: '', detail: res.message, life: 3000 });
            }
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Denuncia Modificada', life: 3000 });
            setComplaint(empty_complaint);
            setFlagComplaint(_complaint);
            setComplaintDialog(false);

        }

    }
    const crearDenuncia = async (_complaint, _complaints) => {
        const res = await DenunciaService.create(_complaint);
        if (res.status == 422) {
            if (res.data) {
                let errors = res.data;
                for (let key in errors) {
                    toast.current.show({ severity: 'warn', summary: '', detail: errors[key], life: 3000 });
                }
            } else {
                toast.current.show({ severity: 'warn', summary: '', detail: res.message, life: 3000 });
            }

        } else {
            _complaint.id = "";
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Denuncia Creada', life: 3000 });
            setComplaint(empty_complaint);
            setFlagComplaint(_complaint);
            setComplaintDialog(false);


        }


        return res;
    }
    const saveComplaint = () => {
        setSubmitted(true);
        let _complaints = [...complaints];
        let _complaint = { ...complaint };
        _complaint['denunciantes'] = denunciantes;
        _complaint['denunciados'] = denunciados;
        _complaint['agraviados'] = agraviados;

        _complaint['armas'] = armas;
        _complaint['especies'] = especies;
        _complaint['vehiculos'] = vehiculos;

        if (_complaint.id) {
            updateDenuncia(_complaint.id, _complaint, _complaints);
        } else {
            crearDenuncia(_complaint, _complaints);
        }


    }


    // const saveArma = () => {
    //     setSubmitted(true);

    //     if (arma.marca.trim()) {
    //         let _armas = [...armas];

    //         let _arma = { ...arma };
    //         if (arma.idarma) {


    //         } else {
    //             _arma.idarma = "";
    //             toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Arma Creado', life: 3000 });
    //             crearArma(_arma);
    //             const data_weapon = {
    //                 serie: _arma.serie,
    //                 full_name: _arma.serie + '-' + _arma.marca + '-' + _arma.modelo + '-' + _arma.calibre,
    //             };
    //             _arma = {
    //                 ...data_weapon
    //             };
    //             add_table_detail(_armas, _arma, setArmas, setselectedArma)
    //         }
    //         // setArmas(_armas);
    //         setArmaDialog(false);
    //         setArma(emptyArma);

    //     }
    // }
    const crear_arma = async (_arma, _armas) => {
        const res = await ArmaService.create(_arma);
        if (res.status == 422) {
            if (res.data) {
                let errors = res.data;
                for (let key in errors) {
                    toast.current.show({ severity: 'warn', summary: '', detail: errors[key], life: 3000 });
                }
            } else {
                toast.current.show({ severity: 'warn', summary: '', detail: res.message, life: 3000 });
            }

        } else {
            _arma.id = "";
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Arma Creada', life: 3000 });
            setCheckboxValue([]);
            const data_weapon = {
                serie: _arma.serie,
                full_name: _arma.serie + '-' + _arma.marca + '-' + _arma.modelo + '-' + _arma.calibre,
            };
            _arma = {
                ...data_weapon
            };
            add_table_detail(_armas, _arma, setArmas, setselectedArma);
            setArmaDialog(false);
            setArma(emptyArma);


        }


        return res;
    }

    const saveArma = () => {
        setSubmitted(true);

        if (arma.marca.trim()) {
            let _armas = [...armas];

            let _arma = { ...arma };
            if (arma.id) {
                update(arma.id, _arma, _armas);
            }
            else {
                crear_arma(_arma, _armas);

            }

        }
    }
    // const saveEspecie = () => {
    //     setSubmitted(true);

    //     if (especie.especie.trim()) {
    //         let _especies = [...especies];
    //         let _especie = { ...especie };
    //         if (especie.idespecie) {

    //             // const index = findIndexById(especie.idespecie);
    //             // _especies[index] = _especie;
    //             toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Especie modificado', life: 3000 });

    //             updateEspecie(especie.idespecie, _especie);
    //         } else {
    //             _especie.idespecie = "";
    //             // _especies.push(_especie);
    //             toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Perfil Creado', life: 3000 });
    //             crearEspecie(_especie);
    //         }
    //         setEspecies(_especies);
    //         setEspecieDialog(false);
    //         setEspecie(emptyEspecie);
    //     }
    // }
    const crear_especie = async (_especie, _especies) => {
        const res = await EspecieService.create(_especie);
        if (res.status == 422) {
            if (res.data) {
                let errors = res.data;
                for (let key in errors) {
                    toast.current.show({ severity: 'warn', summary: '', detail: errors[key], life: 3000 });
                }
            } else {
                toast.current.show({ severity: 'warn', summary: '', detail: res.message, life: 3000 });
            }

        } else {
            _especie.id = "";
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Especie Creada', life: 3000 });
            setCheckboxValue([]);
            const data_especie = {
                serie: _especie.serie,
                full_name: _especie.serie + '-' + _especie.especie,
            };
            _especie = {
                ...data_especie
            };
            add_table_detail(_especies, _especie, setEspecies, setselectedEspecie);
            setEspecies(_especies);
            setEspecieDialog(false);
            setEspecie(emptyEspecie);


        }


        return res;
    }
    const saveEspecie = () => {
        setSubmitted(true);
        let _especies = [...especies];
        let _especie = { ...especie };
        if (especie.id) {
            update(especie.id, _especie, _especies);
        }
        else {
            crear_especie(_especie, _especies);
        }
    }

    // const saveVehiculo = () => {
    //     setSubmitted(true);

    //     if (vehiculo.clase.trim()) {
    //         let _vehiculos = [...vehiculos];
    //         let _vehiculo = { ...vehiculo };
    //         if (vehiculo.idvehiculo) {

    //             toast.current.show({
    //                 severity: 'success',
    //                 summary: 'Exitoso',
    //                 detail: 'Vehiculo modificado',
    //                 life: 3000
    //             });

    //             updateVehiculo(vehiculo.idvehiculo, _vehiculo);
    //         } else {
    //             _vehiculo.idvehiculo = "";
    //             // _vehiculos.push(_vehiculo);
    //             toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Vehiculo Creado', life: 3000 });
    //             crearVehiculo(_vehiculo);
    //         }
    //         setVehiculos(_vehiculos);
    //         setVehiculoDialog(false);
    //         setVehiculo(emptyVehiculo);
    //     }
    // }
    const crear_vehiculo = async (_vehiculo, _vehiculos) => {
        const res = await VehiculoService.create(_vehiculo);
        if (res.status == 422) {
            if (res.data) {
                let errors = res.data;
                for (let key in errors) {
                    toast.current.show({ severity: 'warn', summary: '', detail: errors[key], life: 3000 });
                }
            } else {
                toast.current.show({ severity: 'warn', summary: '', detail: res.message, life: 3000 });
            }
        } else {
            _vehiculo.id = "";
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Vehiculo Creado', life: 3000 });

            setCheckboxValue([]);
            const data_vehiculo = {
                placa: _vehiculo.placa,
                full_name: _vehiculo.placa + ' ' + _vehiculo.clase + ' ' + _vehiculo.marca + ' ' + _vehiculo.modelo,
            };
            _vehiculo = {
                ...data_vehiculo
            };
            add_table_detail(_vehiculos, _vehiculo, setVehiculos, setselectedVehiculo);
            setVehiculos(_vehiculos);
            setVehiculoDialog(false);
            setVehiculo(emptyVehiculo);

        }


        return res;
    }
    const saveVehiculo = () => {
        setSubmitted(true);
        if (vehiculo.clase.trim()) {
            let _vehiculos = [...vehiculos];
            let _vehiculo = { ...vehiculo };
            if (vehiculo.id) {

                update(vehiculo.id, _vehiculo);
            }
            else {
                _vehiculo.id = "";
                crear_vehiculo(_vehiculo, _vehiculos);
            }

        }
    }

    const searchEspecie = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredEspecie([...autoEspecieValue]);
            } else {
                setAutoFilteredEspecie(autoEspecieValue.filter((person) => {
                    return person.full_name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const searchVehiculo = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredVehiculo([...autoVehiculoValue]);
            } else {
                setAutoFilteredVehiculo(autoVehiculoValue.filter((person) => {
                    return person.full_name.toLowerCase().startsWith(event.query.toLowerCase());
                }));
            }
        }, 250);
    };

    const hideDialog = () => {
        setMapDialog(false);
        setSubmitted(false);
        setPersonaDialog(false);
        setArmaDialog(false);
        setEspecieDialog(false);
        setVehiculoDialog(false);
    }

    const hideDeleteDenuncianteDialog = () => {
        setDeleteDenuncianteDialog(false);
    }

    const hideDeleteDenunciadoDialog = () => {
        setDeleteDenunciadoDialog(false);
    }
    const hideDeleteComplaintDialog = () => {
        setDeleteComplaintDialog(false);
    }
    const hideDeleteAgraviadoDialog = () => {
        setDeleteAgraviadoDialog(false);
    }
    const hideDeleteArmaDialog = () => {
        setDeleteArmaDialog(false);
    }
    const hideDeleteEspecieDialog = () => {
        setDeleteEspecieDialog(false);
    }
    const hideDeleteVehiculoDialog = () => {
        setDeleteVehiculoDialog(false);
    }

    const onInputSelectModality = (val, name) => {
        setModality(val);
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val.id;
        setComplaint(_complaint);
    }
    const onInputSelecTypeComplaint = (val, name) => {
        setTypeComplaint(val);
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val.id;
        setComplaint(_complaint);
    }
    const onInputSelectSection = (val, name) => {
        setSection(val);
        let arrayFilterlibro = listLibros.filter(e => e.idseccion == val.id);
        setListLibrosSeccion(arrayFilterlibro);
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val.id;
        setComplaint(_complaint);
    }
    const onInputSelectLibro = (val, name) => {
        setLibro(val)
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val.id;
        setComplaint(_complaint);

    }
    const onInputSelectFormality = (val, name) => {
        setFormality(val);
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val.id;
        setComplaint(_complaint);
    }
    // Denunciante
    const onDenuncianteChange = (e) => {
        setselectedDenunciante(e.value)
    };
    // Denunciado
    const onDenunciadoChange = (e) => {
        setselectedDenunciado(e.value)
    };
    // Agraviado
    const onAgraviadoChange = (e) => {
        setselectedAgraviado(e.value)
    };
    // Arma
    const onArmaChange = (e) => {
        setselectedArma(e.value)
    };
    // Especie
    const onEspecieChange = (e) => {
        setselectedEspecie(e.value)
    };
    // Vehiculo
    const onVehiculoChange = (e) => {
        setselectedVehiculo(e.value)
    };

    // Denuncia modal
    const openNew = () => {
        setComplaint(empty_complaint);
        setComplaintDialog(true);
        setTitleDenuncia('NUEVA DENUNCIA');
        setModality(false);
        setTypeComplaint(false);
        setSection(false);
        setLibro(false);
        setFormality(false);
        setDepartamento(false);
        setProvincia(false);
        setDistrito(false);
        setArmas([]);
        setPersonas([]);
        setDenunciantes([]);
        setAgraviados([]);
        setDenunciados([]);
        setVehiculos([]);
        setEspecies([]);
        setSubmitted(false);
        setselectedDenunciante(false);
        setselectedDenunciado(false);
        setselectedAgraviado(false);
        setselectedArma(false);
        setselectedEspecie(false);
        setselectedVehiculo(false);
    }

    // Modal Nueva Persona
    const openNewPerson = () => {
        let denunciante_select = 'A';
        setTypePersonSelect(denunciante_select);
        setPersona(emptyPersona);
        setSubmitted(false);
        setPersonaDialog(true);
        setTitlePersona('NUEVA PERSONA');
    }
    const openNewPersonDenunciado = () => {
        let denunciando_select = 'B';
        setTypePersonSelect(denunciando_select);
        setPersona(emptyPersona);
        setSubmitted(false);
        setPersonaDialog(true);
        setTitlePersona('NUEVA PERSONA');
    }
    const openNewPersonAgraviado = () => {
        let agraviado_select = 'C';
        setTypePersonSelect(agraviado_select);
        setPersona(emptyPersona);
        setSubmitted(false);
        setPersonaDialog(true);
        setTitlePersona('NUEVA PERSONA');
    }
    // Modal
    const openMap = () => {
        let _complaint = { ...complaint };

        if (_complaint['latitudHecho'] != '') {

            _complaint['latitudDefault'] = _complaint['latitudHecho'];
            _complaint['longituDefault'] = _complaint['longitudHecho'];
            setComplaint(_complaint);
        }
        setMapDialog(true);
        setTitleMap('Mapa');
    }


    // Nuevo Arma
    const openNewArma = () => {
        setArma(emptyArma);
        setSubmitted(false);
        setArmaDialog(true);
        var estate_arma = 'A';
        setCheckboxValue([estate_arma]);
        setTitleArma('NUEVA ARMA');
    }

    // Nueva Especie

    const openNewEspecie = () => {
        setEspecie(emptyEspecie);
        setSubmitted(false);
        setEspecieDialog(true);
        var estate_especie = 'A';
        setCheckboxValue([estate_especie]);
        setTypeDocument(false);
        setSituation(false);
        setTitleEspecie('NUEVA ESPECIE');
    }
    const openNewVehiculo = () => {
        setVehiculo(emptyVehiculo);
        setSubmitted(false);
        setVehiculoDialog(true);
        setSituation(false);
        var estate_vehiculo = 'A';
        setCheckboxValue([estate_vehiculo]);
        setTitleVehiculo('NUEVO VEHÍCULO');
    }

    const hideComplaintDialog = () => {
        setComplaintDialog(false);
    }
    const complaintDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideComplaintDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveComplaint} />
        </>
    );

    const personaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={savePersona} />
        </>
    );
    const mapDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={savePersona} />
        </>
    );
    const armaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveArma} />
        </>
    );
    const especieDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveEspecie} />
        </>
    );
    const vehiculoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveVehiculo} />
        </>
    );


    const confirmDeleteDenunciante = (denunciante) => {

        setDenunciante(denunciante);
        setDeleteDenuncianteDialog(true);

    }
    const confirmDeleteDenunciado = (denunciado) => {

        setDenunciado(denunciado);
        setDeleteDenunciadoDialog(true);

    }
    const confirmDeleteAgraviado = (agraviado) => {

        setAgraviado(agraviado);
        setDeleteAgraviadoDialog(true);

    }
    const getPdf = async () => {
        const response = await DenunciaService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        window.open(url, "_blank");
    }
    const confirmDeleteArma = (arma) => {

        setArma(arma);
        setDeleteArmaDialog(true);

    }
    const delete_complaint = async (id) => {

        const res = await DenunciaService.eliminar(id);

    }
    const confirmDeleteEspecie = (especie) => {

        setEspecie(especie);
        setDeleteEspecieDialog(true);

    }
    const confirmDeleteVehiculo = (vehiculo) => {

        setVehiculo(vehiculo);
        setDeleteVehiculoDialog(true);

    }
    const confirmDeleteComplaint = (complaint) => {
        setComplaint(complaint);
        setDeleteComplaintDialog(true);

    }
    const editComplit = (complaint) => {

        let arrayFilterModality = listModalities.filter(e => e.id == complaint.idModalidad);
        let arrayFilterTypeComplaint = typeComplaints.filter(e => e.id == complaint.tipoDenuncia);
        let arrayFilterSeccion = listSeccion.filter(e => e.id == complaint.idSeccion);
        let arrayFilterlibro = listLibros.filter(e => e.id == complaint.idLibro);
        let arrayFilterFomality = formalitys.filter(e => e.id == complaint.formalidad);
        let arrayFilterDeparment = listDepartamentos.filter(e => e.dpto == complaint.dpto);
        let arrayFilterDistrito = listUbigeo.filter(e => e.ubigeo1 == complaint.lugarHecho);
        onInputSelectSection(arrayFilterSeccion[0], 'idSeccion')
        setModality(arrayFilterModality[0]);
        setTypeComplaint(arrayFilterTypeComplaint[0]);
        setLibro(arrayFilterlibro[0]);
        setFormality(arrayFilterFomality[0]);
        onInputSelectDepartamento(arrayFilterDeparment[0]);
        onInputSelectProvincia({ 'prov': complaint.prov });
        setDistrito(arrayFilterDistrito[0]);

        if (complaint['number'] == null) {
            complaint['number'] = '';
        }

        fetchDataDetailComplaint(complaint.id);

        setComplaint({ ...complaint });
        setComplaintDialog(true);
        setTitleDenuncia('EDITAR DENUNCIA');

        // setArma({ ...arma });
        // setArmaDialog(true);
        // let _arma = { ...arma};
        // var estate_arma=_arma["estado"];

        // setCheckboxValue([estate_arma]);
        // setTitleArma('Editar Arma')
    }


    const deleteDenunciante = () => {
        let _denunciantes = denunciantes.filter(val => val.dni !== denunciante.dni);
        setDenunciantes(_denunciantes);
        setDeleteDenuncianteDialog(false);
        setDenunciante([]);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Denunciante Elimiminado', life: 3000 });
    }
    const deleteComplaint = () => {
        delete_complaint(complaint.id);
        let _complaints = complaints.filter(val => val.id !== complaint.id);
        setComplaints(_complaints);
        setDeleteComplaintDialog(false);
        setComplaint(empty_complaint);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Denuncia Elimiminada', life: 3000 });

    }

    const deleteDenunciado = () => {
        let _denunciados = denunciados.filter(val => val.dni !== denunciado.dni);
        setDenunciados(_denunciados);
        setDeleteDenunciadoDialog(false);
        setDenunciado([]);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Denunciado Elimiminado', life: 3000 });
    }
    const deleteAgraviado = () => {
        let _agraviados = agraviados.filter(val => val.dni !== agraviado.dni);
        setAgraviados(_agraviados);
        setDeleteAgraviadoDialog(false);
        setAgraviado([]);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Agraviado Elimiminado', life: 3000 });
    }

    const deleteArma = () => {
        let _armas = armas.filter(val => val.serie !== arma.serie);
        setArmas(_armas);
        setDeleteArmaDialog(false);
        setArma([]);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Arma Elimiminado', life: 3000 });
    }
    const deleteEspecie = () => {
        let _especies = especies.filter(val => val.serie !== especie.serie);
        setEspecies(_especies);
        setDeleteEspecieDialog(false);
        setEspecie([]);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Especie Elimiminado', life: 3000 });
    }
    const deleteVehiculo = () => {
        let _vehiculos = vehiculos.filter(val => val.placa !== vehiculo.placa);
        setVehiculos(_vehiculos);
        setDeleteVehiculoDialog(false);
        setVehiculo([]);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Vehiculo Elimiminado', life: 3000 });
    }
    const exportCSV = () => {
        dt.current.exportCSV();
    }

    // Persona Input
    const onInputChangePerson = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _persona = { ...persona };
        _persona[`${name}`] = val;

        setPersona(_persona);
    }

    // Arma Input
    const onInputChangeArma = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _arma = { ...arma };
        _arma[`${name}`] = val;

        setArma(_arma);
    }

    // Especie Input

    const onInputChangeEspecie = (e, name) => {
        const val = (e.target && e.target.value) || '';

        let _especie = { ...especie };

        _especie[`${name}`] = val;

        setEspecie(_especie);
    }
    // Vehiculo Input
    const onInputChangeVehiculo = (e, name) => {
        const val = (e.target && e.target.value) || '';

        let _vehiculo = { ...vehiculo };

        _vehiculo[`${name}`] = val;

        setVehiculo(_vehiculo);
    }
    // Estadoo
    const onCheckboxChange = (e) => {
        setCheckboxValue([]);
        let selectedValue = [...checkboxValue];
        if (e.checked)
            selectedValue.push(e.value);
        else
            selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
        var state_arma = 'I';
        if (e.checked) {
            state_arma = 'A';
        }


        let _arma = { ...arma };
        _arma["estado"] = state_arma;
        setArma(_arma);

    };

    // Estadoo Especie
    const onCheckboxChangeEspecie = (e) => {
        setCheckboxValue([]);
        let selectedValue = [...checkboxValue];
        if (e.checked)
            selectedValue.push(e.value);
        else
            selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
        var state_especie = 'I';

        if (e.checked) {

            state_especie = 'A';
        }


        let _especie = { ...especie };
        _especie["estado"] = state_especie;
        setEspecie(_especie);

    };
    const onCheckboxChangeVehiculo = (e) => {
        setCheckboxValue([]);
        let selectedValue = [...checkboxValue];
        if (e.checked)
            selectedValue.push(e.value);
        else
            selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
        var state_vehiculo = 'I';

        if (e.checked) {

            state_vehiculo = 'A';
        }


        let _vehiculo = { ...vehiculo };
        _vehiculo["estado"] = state_vehiculo;
        setVehiculo(_vehiculo);

    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="NUEVA DENUNCIA" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="EXPORTAR" icon="pi pi-upload" className="p-button-help" onClick={getPdf} />
            </React.Fragment>
        )
    }


    const validarCampoUnico = (id, obj, key) => {

        let flag = false;
        Object.entries(obj).forEach(([item, value]) => {
            let id_obj = value[key]
            if (id_obj === id) {
                flag = true
            }
        });

        return flag
    }


    const handleKeyUpDenunciante = (e) => {
        if (e.key === 'Enter') {
            if (selectedDenunciante != null && selectedDenunciante.dni) {
                let key = 'dni';
                let campo_unico = validarCampoUnico(selectedDenunciante.dni, denunciantes, key)
                if (campo_unico == true) {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'informa',
                        detail: 'Ya se agregó la persona',
                        life: 3000
                    });
                } else {
                    let _denunciantes = [...denunciantes];
                    let _selectedDenunciante = { ...selectedDenunciante };
                    _denunciantes.push(_selectedDenunciante);
                    setDenunciantes(_denunciantes);
                    setselectedDenunciante(null);
                }
            } else {
                toast.current.show({ severity: 'warn', summary: 'informa', detail: 'Escoger una persona', life: 3000 });
            }

        }
    };

    // Denunciado
    const handleKeyUpdenounced = (e) => {
        if (e.key === 'Enter') {
            if (selectedDenunciado != null && selectedDenunciado.dni) {
                let key = 'dni';
                let campo_unico = validarCampoUnico(selectedDenunciado.dni, denunciados, key)
                if (campo_unico == true) {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'informa',
                        detail: 'Ya se agregó la persona',
                        life: 3000
                    });
                } else {
                    let _denunciados = [...denunciados];
                    let _selectedDenunciado = { ...selectedDenunciado };
                    _denunciados.push(_selectedDenunciado);
                    setDenunciados(_denunciados);
                    setselectedDenunciado(null);
                }
            } else {
                toast.current.show({ severity: 'warn', summary: 'informa', detail: 'Escoger una persona', life: 3000 });
            }
        }
    };

    //   Agraviado

    const handleKeyUpAgraviado = (e) => {
        if (e.key === 'Enter') {
            if (selectedAgraviado != null && selectedAgraviado.dni) {
                let key = 'dni';
                let campo_unico = validarCampoUnico(selectedAgraviado.dni, agraviados, key)
                if (campo_unico == true) {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'informa',
                        detail: 'Ya se agregó la persona',
                        life: 3000
                    });
                } else {
                    let _agraviados = [...agraviados];
                    let _selectedAgraviado = { ...selectedAgraviado };
                    _agraviados.push(_selectedAgraviado);
                    setAgraviados(_agraviados);
                    setselectedAgraviado(null);
                }
            } else {
                toast.current.show({ severity: 'warn', summary: 'informa', detail: 'Escoger una persona', life: 3000 });
            }

        }
    };

    //   Armas
    const handleKeyUpArma = (e) => {

        if (e.key === 'Enter') {
            if (selectedArma != null && selectedArma.serie) {
                let key = 'serie';
                let campo_unico = validarCampoUnico(selectedArma.serie, armas, key)
                if (campo_unico === true) {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'informa',
                        detail: 'Ya se agregó un arma con esta serie',
                        life: 3000
                    });
                } else {

                    let _armas = [...armas];
                    let _selectedArma = { ...selectedArma };
                    add_table_detail(_armas, _selectedArma, setArmas, setselectedArma)
                }
            } else {
                toast.current.show({ severity: 'warn', summary: 'informa', detail: 'Escoger arma', life: 3000 });
            }

        }
    };

    const add_table_detail = (array, selected, set_array, set_selected) => {
        let _array = array;
        _array.push(selected);
        set_array(_array);
        set_selected(null);
    };

    //   Especie
    const handleKeyUpEspecie = (e) => {
        if (e.key === 'Enter') {
            if (selectedEspecie != null && selectedEspecie.serie) {
                let key = 'serie';
                let campo_unico = validarCampoUnico(selectedEspecie.serie, especies, key)
                if (campo_unico === true) {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'informa',
                        detail: 'Ya se agregó la especie',
                        life: 3000
                    });
                } else {
                    let _especies = [...especies];
                    let _selectedEspecie = { ...selectedEspecie };
                    _especies.push(_selectedEspecie);
                    setEspecies(_especies);
                    setselectedEspecie(null);
                }
            } else {
                toast.current.show({ severity: 'warn', summary: 'informa', detail: 'Escoger una especie', life: 3000 });
            }

        }
    };

    //   Vehiculo

    const handleKeyUpVehiculo = (e) => {
        if (e.key === 'Enter') {
            if (selectedVehiculo != null && selectedVehiculo.placa) {
                let key = 'placa';
                let campo_unico = validarCampoUnico(selectedVehiculo.placa, vehiculos, key)
                if (campo_unico === true) {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'informa',
                        detail: 'Ya se agregó el vehículo',
                        life: 3000
                    });
                } else {
                    let _vehiculos = [...vehiculos];
                    let _selectedVehiculo = { ...selectedVehiculo };
                    _vehiculos.push(_selectedVehiculo);
                    setVehiculos(_vehiculos);
                    setselectedVehiculo(null);
                }
            } else {
                toast.current.show({ severity: 'warn', summary: 'informa', detail: 'Escoger un vehículo', life: 3000 });
            }

        }
    };
    // AutoCompleteMap
    const onAutoCompleteMap = (address, coordinates) => {
        let _complaint = { ...complaint };
        _complaint['latitudHecho'] = coordinates.lat;
        _complaint['longitudHecho'] = coordinates.lng;
        _complaint['direccionHecho'] = address;
        setComplaint(_complaint);

    }
    const modalityBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.modality_description}
            </>
        );
    }
    const typeComplaintBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.type_complaint_description}
            </>
        );
    }
    const seccionBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.seccion_description}
            </>
        );
    }
    const bookBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.book_description}
            </>
        );
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editComplit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"
                    onClick={() => confirmDeleteComplaint(rowData)} />
            </div>
        );
    }
    const actionBodyDenunciante = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"
                    onClick={() => confirmDeleteDenunciante(rowData)} />
            </div>
        );
    }
    const actionBodyDenunciado = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"
                    onClick={() => confirmDeleteDenunciado(rowData)} />
            </div>
        );
    }
    const actionBodyAgraviado = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"
                    onClick={() => confirmDeleteAgraviado(rowData)} />
            </div>
        );
    }
    const actionBodyArma = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"
                    onClick={() => confirmDeleteArma(rowData)} />
            </div>
        );
    }
    const actionBodyEspecie = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"
                    onClick={() => confirmDeleteEspecie(rowData)} />
            </div>
        );
    }
    const actionBodyVehiculo = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"
                    onClick={() => confirmDeleteVehiculo(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTAR DENUNCIAS</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );


    const deleteDenuncianteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDenuncianteDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteDenunciante} />
        </>
    );
    const deleteComplaintDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteComplaintDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteComplaint} />
        </>
    );
    const deleteDenunciadoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDenunciadoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteDenunciado} />
        </>
    );
    const deleteAgraviadoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAgraviadoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteAgraviado} />
        </>
    );
    const deleteArmaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteArmaDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteArma} />
        </>
    );
    const deleteEspecieDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEspecieDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteEspecie} />
        </>
    );
    const deleteVehiculoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteVehiculoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteVehiculo} />
        </>
    );


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={complaints} selection={selectedPerfils}
                        onSelectionChange={(e) => setSelectedPerfils(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} Denuncias"
                        globalFilter={globalFilter} emptyMessage="No existe denuncias" header={header}
                        responsiveLayout="scroll">

                        <Column field="modality_description" header="MODALIDAD" sortable body={modalityBodyTemplate}
                            headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="type_complaint_description" header="TIPO DENUNCIA" sortable body={typeComplaintBodyTemplate}
                            headerStyle={{ width: '20%', minWidth: '20rem' }}>
                        </Column>
                        <Column field="seccion_description" header="SECCIÓN" sortable body={seccionBodyTemplate}
                            headerStyle={{ width: '14%', minWidth: '10rem' }}>
                        </Column>
                        <Column field="book_description" header="LIBRO" sortable body={bookBodyTemplate}
                            headerStyle={{ width: '14%', minWidth: '10rem' }}>
                        </Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    {/* Modal denunciante */}
                    <Dialog visible={complaintDialog} style={{ width: '80%', height: '100%' }} header={titleDenuncia}
                        modal className="p-fluid" footer={complaintDialogFooter} onHide={hideComplaintDialog}>
                        <div className="formgrid grid">
                            <div className="field col-3">
                                <label htmlFor="idModalidad">MODALIDAD</label>
                                <Dropdown value={modality} onChange={(e) => onInputSelectModality(e.value, 'idModalidad')}
                                    optionLabel="descripcion" autoFocus options={listModalities}
                                    placeholder="SELECCIONAR" required
                                    className={classNames({ 'p-invalid': submitted && !complaint.idModalidad })} />
                                {submitted && !complaint.idModalidad &&
                                    <small className="p-invalid">Modalidad es requerido.</small>}
                            </div>
                            <div className="field col-3 ">
                                <label htmlFor="tipoDenuncia">TIPO DENUNCIA</label>
                                <Dropdown value={typeComplaint} onChange={(e) => onInputSelecTypeComplaint(e.value, 'tipoDenuncia')}
                                    options={typeComplaints} optionLabel="description" placeholder="SELECCIONAR" />
                                {submitted && !complaint.tipoDenuncia &&
                                    <small className="p-invalid">Tipo denuncia es requerido.</small>}
                            </div>
                            <div className="field col-3 ">
                                <label htmlFor="idSeccion">SECCIÓN</label>
                                <Dropdown value={section} onChange={(e) => onInputSelectSection(e.value, 'idSeccion')}
                                    optionLabel="descripcion" autoFocus options={listSeccion}
                                    placeholder="SELECCIONAR" required
                                    className={classNames({ 'p-invalid': submitted && !complaint.idSeccion })} />
                                {submitted && !complaint.idSeccion &&
                                    <small className="p-invalid">Sección es requerido.</small>}
                            </div>
                            <div className="field col-3 ">
                                <label htmlFor="idLibro">LIBRO</label>
                                <Dropdown value={libro} onChange={(e) => onInputSelectLibro(e.value, 'idLibro')}
                                    optionLabel="descripcion" autoFocus options={listLibrosSeccion}
                                    placeholder="SELECCIONAR" required
                                    className={classNames({ 'p-invalid': submitted && !complaint.idLibro })} />
                                {submitted && !complaint.idLibro &&
                                    <small className="p-invalid">Libro es requerido.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-3">
                                <label htmlFor="formalidad">FORMALIDAD</label>
                                <Dropdown optionLabel="description" value={formality}
                                    onChange={(e) => onInputSelectFormality(e.value, 'formalidad')}
                                    placeholder="SELECCIONAR" options={formalitys} />
                                {submitted && !complaint.formalidad &&
                                    <small className="p-invalid">Formalidad es requerido.</small>}
                            </div>

                            <div className="field col-3 ">
                                <label htmlFor="fechaHecho">FECHA ECHO</label>
                                <InputText type="date" id="fechaHecho" value={complaint.fechaHecho}
                                    onChange={(e) => onInputChangeDate(e, 'fechaHecho')} required
                                    className={classNames({ 'p-invalid': submitted && !complaint.fechaHecho })} />
                                {submitted && !complaint.fechaHecho &&
                                    <small className="p-invalid">Fecha es requerido.</small>}
                            </div>
                            <div className="field col-2 ">
                                <label htmlFor="horaHecho">HORA HECHO</label>
                                <InputText type="time" id="horaHecho" value={complaint.horaHecho}
                                    onChange={(e) => onInputChangeHour(e, 'horaHecho')} required
                                    className={classNames({ 'p-invalid': submitted && !complaint.horaHecho })} />
                                {submitted && !complaint.horaHecho &&
                                    <small className="p-invalid">Hora es requerido.</small>}
                            </div>

                            <div className="field col-4">
                                <label htmlFor="departamento">DEPARTAMENTO</label>
                                <Dropdown optionLabel="dpto" value={departamento}
                                    onChange={(e) => onInputSelectDepartamento(e.value)}
                                    placeholder="SELECCIONAR" options={listDepartamentos} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-3">
                                <label htmlFor="prov">PROVINCIA</label>
                                <Dropdown optionLabel="prov" value={provincia}
                                    onChange={(e) => onInputSelectProvincia(e.value)}
                                    placeholder="SELECCIONAR" options={listProvincia} />
                            </div>
                            <div className="field col-3">
                                <label htmlFor="distrito">DISTRITO</label>
                                <Dropdown optionLabel="distrito" value={distrito}
                                    onChange={(e) => onInputSelectDistrito(e.value, 'lugarHecho')}
                                    placeholder="SELECCIONAR" options={listDistrito} />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="descripcion">DIRECCIÓN HECHO</label>
                                <AutoCompleteMap complaint={complaint} onAutoCompleteMap={onAutoCompleteMap} onInputChangeAutoComplete={onInputChangeAutoComplete} />
                            </div>
                            <div className="field col-2 ">
                                <label htmlFor="number">N°</label>
                                <InputText id="number" onChange={(e) => onInputChangeComplaint(e, 'number')} value={complaint.number} />
                            </div>
                        </div>
                        <div className="formgrid grid">

                            <div className="field col-2 ">
                                <label htmlFor="descripcion">&nbsp;</label>
                                <Button label="mapa" onClick={openMap} icon="pi pi-search"
                                    className="p-button-info mr-2 mb-2" />
                            </div>
                            <div className="field col-2 ">
                                <label htmlFor="latitudHecho">LATITUD HECHO</label>
                                <InputText disabled id="latitudHecho" value={complaint.latitudHecho}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !complaint.latitudHecho })} />
                                {submitted && !complaint.latitudHecho &&
                                    <small className="p-invalid">Latitud es requerido.</small>}
                            </div>
                            <div className="field col-2 ">
                                <label htmlFor="longitudHecho">LONGITUD HECHO</label>
                                <InputText disabled id="longitudHecho" value={complaint.longitudHecho}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !complaint.longitudHecho })} />
                                {submitted && !complaint.longitudHecho &&
                                    <small className="p-invalid">Longitud es requerido.</small>}
                            </div>

                        </div>
                        <div className="formgrid grid">
                            <div className="field col-12">
                                <label htmlFor="address">DESCRIPCIÓN HECHO</label>
                                <InputTextarea id="address" rows="4" onChange={(e) => onInputChangeComplaint(e, 'descripcion')} value={complaint.descripcion} />
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <label htmlFor="descripcion">DENUNCIANTE</label>
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <AutoComplete onKeyUp={handleKeyUpDenunciante} placeholder="Buscar Persona por dni" id="dd"
                                            value={selectedDenunciante} onChange={onDenuncianteChange}
                                            suggestions={autoFilteredPerson} completeMethod={searchPerson}
                                            field="full_name" />
                                    </span>
                                    <Button onClick={openNewPerson} type="button" icon="pi pi-plus"
                                        className="p-button-secondary" />
                                </div>
                            </div>
                            <div className="field col-6">
                                <label htmlFor="address">DENUNCIADO</label>
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <AutoComplete onKeyUp={handleKeyUpdenounced} placeholder="Buscar Persona por dni" id="dd"
                                            value={selectedDenunciado} onChange={onDenunciadoChange}
                                            suggestions={autoFilteredPerson} completeMethod={searchPerson}
                                            field="full_name" />
                                    </span>
                                    <Button onClick={openNewPersonDenunciado} type="button" icon="pi pi-plus"
                                        className="p-button-secondary" />
                                </div>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <DataTable value={denunciantes}
                                    dataKey="idDenunciante" className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} perfiles"
                                    globalFilter={globalFilter} emptyMessage="Denunciantes vacio."
                                    responsiveLayout="scroll">
                                    <Column field="full_name" header="Denunciante"
                                        headerStyle={{ width: '80%', minWidth: '10rem' }}></Column>
                                    <Column body={actionBodyDenunciante}></Column>
                                </DataTable>
                            </div>
                            <div className="field col-6">
                                <DataTable ref={dt} value={denunciados}
                                    dataKey="idDenunciado" className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} perfiles"
                                    globalFilter={globalFilter} emptyMessage="Denunciados vacio."
                                    responsiveLayout="scroll">

                                    <Column field="full_name" header="Denunciado"
                                        headerStyle={{ width: '80%', minWidth: '10rem' }}></Column>

                                    <Column body={actionBodyDenunciado}></Column>
                                </DataTable>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <label htmlFor="agraviado">AGRAVIADO</label>
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <AutoComplete onKeyUp={handleKeyUpAgraviado} placeholder="Buscar Persona por dni" id="dd"
                                            value={selectedAgraviado} onChange={onAgraviadoChange}
                                            suggestions={autoFilteredPerson} completeMethod={searchPerson}
                                            field="full_name" />
                                    </span>
                                    <Button onClick={openNewPersonAgraviado} type="button" icon="pi pi-plus"
                                        className="p-button-secondary" />
                                </div>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <DataTable ref={dt} value={agraviados}
                                    dataKey="idAgraviado" className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} perfiles"
                                    globalFilter={globalFilter} emptyMessage="Agraviados vacio."
                                    responsiveLayout="scroll">

                                    <Column field="full_name" header="Agraviados"
                                        headerStyle={{ width: '80%', minWidth: '10rem' }}></Column>

                                    <Column body={actionBodyAgraviado}></Column>
                                </DataTable>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-4">
                                <label htmlFor="arma">ARMA</label>
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <AutoComplete onKeyUp={handleKeyUpArma} placeholder="Buscar Arma por serie" id="dd"
                                            value={selectedArma} onChange={onArmaChange}
                                            suggestions={autoFilteredArma} completeMethod={searchArma}
                                            field="full_name" />
                                    </span>
                                    <Button onClick={openNewArma} type="button" icon="pi pi-plus"
                                        className="p-button-secondary" />
                                </div>
                            </div>
                            <div className="field col-4">
                                <label htmlFor="address">ESPECIE</label>
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <AutoComplete onKeyUp={handleKeyUpEspecie} placeholder="Buscar Especie por serie" id="dd"
                                            value={selectedEspecie} onChange={onEspecieChange}
                                            suggestions={autoFilteredEspecie} completeMethod={searchEspecie}
                                            field="full_name" />
                                    </span>
                                    <Button onClick={openNewEspecie} type="button" icon="pi pi-plus"
                                        className="p-button-secondary" />
                                </div>
                            </div>
                            <div className="field col-4">
                                <label htmlFor="address">VEHICULO</label>
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <AutoComplete onKeyUp={handleKeyUpVehiculo} placeholder="Buscar Vehículo por placa" id="dd"
                                            value={selectedVehiculo} onChange={onVehiculoChange}
                                            suggestions={autoFilteredVehiculo} completeMethod={searchVehiculo}
                                            field="full_name" />
                                    </span>
                                    <Button onClick={openNewVehiculo} type="button" icon="pi pi-plus"
                                        className="p-button-secondary" />
                                </div>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-4">
                                <DataTable value={armas}
                                    dataKey="idArma" className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} perfiles"
                                    globalFilter={globalFilter} emptyMessage="Armas vacio."
                                    responsiveLayout="scroll">
                                    <Column field="full_name" header="Armas"
                                        headerStyle={{ width: '80%', minWidth: '10rem' }}></Column>
                                    <Column body={actionBodyArma}></Column>
                                </DataTable>
                            </div>
                            <div className="field col-4">
                                <DataTable ref={dt} value={especies}
                                    dataKey="idEspecie" className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} perfiles"
                                    globalFilter={globalFilter} emptyMessage="Especies vacio."
                                    responsiveLayout="scroll">

                                    <Column field="full_name" header="Especies"
                                        headerStyle={{ width: '80%', minWidth: '10rem' }}></Column>

                                    <Column body={actionBodyEspecie}></Column>
                                </DataTable>
                            </div>
                            <div className="field col-4">
                                <DataTable ref={dt} value={vehiculos}
                                    dataKey="idVehiculo" className="datatable-responsive"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} perfiles"
                                    globalFilter={globalFilter} emptyMessage="Vehiculos vacio."
                                    responsiveLayout="scroll">

                                    <Column field="full_name" header="Vehiculos"
                                        headerStyle={{ width: '80%', minWidth: '10rem' }}></Column>

                                    <Column body={actionBodyVehiculo}></Column>
                                </DataTable>
                            </div>
                        </div>
                    </Dialog>
                    {/* Modal Map */}
                    <Dialog visible={mapDialog} style={{ width: '700px' }} header={titleMap} modal className="p-fluid"
                        onHide={hideDialog}>

                        <div id="map">
                            <MapDraggable complaint={complaint} onInputChangeMap={onInputChangeMap} />
                        </div>


                        {/* <div className="field">
                            <label htmlFor="nacimiento">Fech.Nacimiento</label>

                            <div className="field">
                                <InputMask id="nacimiento" mask="dd/mm/aaaa" value={persona.nacimiento} onChange={(e) => setPersona(personas)} className="p-invalid"/>
                            </div>
                            {submitted && !persona.nacimiento && <small className="p-invalid">Usuario es requerido.</small>}
                        </div> */}

                    </Dialog>
                    {/* Persona Modal */}
                    <Dialog visible={personaDialog} style={{ width: '450px' }} header={titlePersona} modal className="p-fluid" footer={personaDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="dni">DNI</label>
                            <InputText id="dni" maxLength="8" onKeyUp={handleKeyUpDni} value={persona.dni} onChange={(e) => onInputDniChange(e, 'dni')} required className={classNames({ 'p-invalid': submitted && !persona.dni })} />
                            {submitted && !persona.dni && <small className="p-invalid">Dni es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="nombre">NOMBRE</label>
                            <InputText id="nombre" value={persona.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !persona.nombre })} />
                            {submitted && !persona.nombre && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="ap_paterno">AP. PATERNO</label>
                            <InputText id="ap_paterno" value={persona.ap_paterno} onChange={(e) => onInputChange(e, 'ap_paterno')} required className={classNames({ 'p-invalid': submitted && !persona.ap_paterno })} />
                            {submitted && !persona.ap_paterno && <small className="p-invalid">Apellido Paterno es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="ap_materno">AP. MATERNO</label>
                            <InputText id="ap_materno" value={persona.ap_materno} onChange={(e) => onInputChange(e, 'ap_materno')} required className={classNames({ 'p-invalid': submitted && !persona.ap_materno })} />
                            {submitted && !persona.ap_materno && <small className="p-invalid">Usuario es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="edad">EDAD</label>
                            <InputText id="edad" maxLength="3" value={persona.edad} onChange={(e) => onInputAgeChange(e, 'edad')} required className={classNames({ 'p-invalid': submitted && !persona.edad })} />
                            {submitted && !persona.edad && <small className="p-invalid">edad es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="sexo">SEXO</label>
                            <Dropdown value={gender} onChange={(e) => onInputSelectGender(e.value, 'sexo')}
                                options={GENDERS} optionLabel="description" placeholder="SELECCIONAR" />
                            {submitted && !persona.sexo &&
                                <small className="p-invalid">Sexo es requerido.</small>}

                        </div>
                        <div className="field">
                            <label htmlFor="celular">CELULAR</label>
                            <InputText id="celular" value={persona.celular} onChange={(e) => onInputChange(e, 'celular')} required className={classNames({ 'p-invalid': submitted && !persona.celular })} />
                            {submitted && !persona.celular && <small className="p-invalid">celular es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="estado_civil">ESTADO CIVIL</label>
                            <Dropdown value={maritalStatus} onChange={(e) => onInputSelectMaritalStatus(e.value, 'estado_civil')}
                                options={MARITAL_STATUS} optionLabel="description" placeholder="SELECCIONAR" />
                            {submitted && !persona.estado_civil &&
                                <small className="p-invalid">Estado Civil es requerido.</small>}
                        </div>
                    </Dialog>
                    {/* Modal Arma */}
                    <Dialog visible={armaDialog} style={{ width: '450px' }} header={titleArma} modal className="p-fluid"
                        footer={armaDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="marca">MARCA</label>
                            <InputText id="marca" value={arma.marca} onChange={(e) => onInputChangeArma(e, 'marca')}
                                required autoFocus
                                className={classNames({ 'p-invalid': submitted && !arma.marca })} />
                            {submitted && !arma.marca && <small className="p-invalid">Arma es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="modelo">MODELO</label>
                            <InputText id="modelo" value={arma.modelo} onChange={(e) => onInputChangeArma(e, 'modelo')}
                                required autoFocus
                                className={classNames({ 'p-invalid': submitted && !arma.modelo })} />
                            {submitted && !arma.modelo && <small className="p-invalid">Arma es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="calibre">CALIBRE</label>
                            <InputText id="calibre" value={arma.calibre}
                                onChange={(e) => onInputChangeArma(e, 'calibre')} required autoFocus
                                className={classNames({ 'p-invalid': submitted && !arma.calibre })} />
                            {submitted && !arma.calibre && <small className="p-invalid">Arma es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="serie">SERIE</label>
                            <InputText id="serie" value={arma.serie} onChange={(e) => onInputChangeArma(e, 'serie')}
                                required autoFocus
                                className={classNames({ 'p-invalid': submitted && !arma.serie })} />
                            {submitted && !arma.serie && <small className="p-invalid">Serie es requerido.</small>}
                        </div>
                        <label htmlFor="estado">ESTADO</label>
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">

                                <Checkbox inputId="checkOption1" name="estado" value='A'
                                    checked={checkboxValue.indexOf('A') !== -1} onChange={onCheckboxChange} />
                            </div>
                            {submitted && !arma.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                    </Dialog>
                    {/* Modal Arma */}
                    <Dialog visible={armaDialog} style={{ width: '450px' }} header={titleArma} modal className="p-fluid"
                        footer={armaDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="marca">MARCA</label>
                            <InputText id="marca" value={arma.marca} onChange={(e) => onInputChangeArma(e, 'marca')}
                                required autoFocus
                                className={classNames({ 'p-invalid': submitted && !arma.marca })} />
                            {submitted && !arma.marca && <small className="p-invalid">Arma es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="modelo">MODELO</label>
                            <InputText id="modelo" value={arma.modelo} onChange={(e) => onInputChangeArma(e, 'modelo')}
                                required autoFocus
                                className={classNames({ 'p-invalid': submitted && !arma.modelo })} />
                            {submitted && !arma.modelo && <small className="p-invalid">Arma es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="calibre">CALIBRE</label>
                            <InputText id="calibre" value={arma.calibre}
                                onChange={(e) => onInputChangeArma(e, 'calibre')} required autoFocus
                                className={classNames({ 'p-invalid': submitted && !arma.calibre })} />
                            {submitted && !arma.calibre && <small className="p-invalid">Arma es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="serie">SERIE</label>
                            <InputText id="serie" value={arma.serie} onChange={(e) => onInputChangeArma(e, 'serie')}
                                required autoFocus
                                className={classNames({ 'p-invalid': submitted && !arma.serie })} />
                            {submitted && !arma.serie && <small className="p-invalid">Serie es requerido.</small>}
                        </div>
                        <label htmlFor="estado">ESTADO</label>
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">

                                <Checkbox inputId="checkOption1" name="estado" value='A'
                                    checked={checkboxValue.indexOf('A') !== -1} onChange={onCheckboxChange} />
                            </div>
                            {submitted && !arma.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                    </Dialog>

                    {/* Modal especie */}

                    <Dialog visible={especieDialog} style={{ width: '450px' }} header={titleEspecie} modal
                        className="p-fluid" footer={especieDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="serie">SERIE</label>
                            <InputText id="serie" value={especie.serie} onChange={(e) => onInputChangeEspecie(e, 'serie')} required autoFocus className={classNames({ 'p-invalid': submitted && !especie.serie })} />
                            {submitted && !especie.serie && <small className="p-invalid">Serie es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="especie">ESPECIE</label>
                            <InputText id="especie" value={especie.especie}
                                onChange={(e) => onInputChangeEspecie(e, 'especie')} required autoFocus
                                className={classNames({ 'p-invalid': submitted && !especie.especie })} />
                            {submitted && !especie.especie &&
                                <small className="p-invalid">Especie es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="documento">TIPO DE DOCUMENTO</label>
                            <Dropdown value={typeDocument} onChange={(e) => onInputSelectTypeDocumentEspecie(e.value, 'documento')}
                                options={TYPE_DOCUMENT} optionLabel="description" placeholder="SELECCIONAR" />
                            {submitted && !especie.documento &&
                                <small className="p-invalid">Tipo de documento es requerido.</small>}

                        </div>
                        <div className="field">
                            <label htmlFor="codigoDoc">CÓDIGO DOCUMENTO</label>
                            <InputText id="codigoDoc" value={especie.codigoDoc}
                                onChange={(e) => onInputChangeEspecie(e, 'codigoDoc')} required autoFocus
                                className={classNames({ 'p-invalid': submitted && !especie.codigoDoc })} />
                            {submitted && !especie.codigoDoc &&
                                <small className="p-invalid">Codigo Documento es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="documento">SITUACIÓN ESPECIE</label>
                            <Dropdown value={situation} onChange={(e) => onInputSelectSituationEspecie(e.value, 'situacion')}
                                options={SITUATION} optionLabel="description" placeholder="SELECCIONAR" />
                            {submitted && !especie.situacion &&
                                <small className="p-invalid">Situación es requerido.</small>}

                        </div>

                        <div className="col-12 md:col-4">
                            <label htmlFor="especie">ESTADO</label>
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="estado" value='A'
                                    checked={checkboxValue.indexOf('A') !== -1}
                                    onChange={onCheckboxChangeEspecie} />
                            </div>
                            {submitted && !especie.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                    </Dialog>



                    {/* Vehiculo Modal */}

                    <Dialog visible={vehiculoDialog} style={{ width: '450px' }} header={titleVehiculo} modal
                        className="p-fluid" footer={vehiculoDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="clase">CLASE VEHÍCULO</label>
                            <InputText id="clase" value={vehiculo.clase}
                                onChange={(e) => onInputChangeVehiculo(e, 'clase')} required autoFocus
                                className={classNames({ 'p-invalid': submitted && !vehiculo.clase })} />
                            {submitted && !vehiculo.clase &&
                                <small className="p-invalid">vehiculo es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="marca">MARCA</label>
                            <InputText id="marca" value={vehiculo.marca}
                                onChange={(e) => onInputChangeVehiculo(e, 'marca')} required autoFocus
                                className={classNames({ 'p-invalid': submitted && !vehiculo.marca })} />
                            {submitted && !vehiculo.marca && <small className="p-invalid">marca es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="modelo">MODELO</label>
                            <InputText id="modelo" value={vehiculo.modelo}
                                onChange={(e) => onInputChangeVehiculo(e, 'modelo')} required autoFocus
                                className={classNames({ 'p-invalid': submitted && !vehiculo.modelo })} />
                            {submitted && !vehiculo.modelo && <small className="p-invalid">Modelo es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="placa">PLACA</label>
                            <InputText id="placa" value={vehiculo.placa}
                                onChange={(e) => onInputChangeVehiculo(e, 'placa')} required autoFocus
                                className={classNames({ 'p-invalid': submitted && !vehiculo.placa })} />
                            {submitted && !vehiculo.placa && <small className="p-invalid">Placa es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="documento">SITUACIÓN VEHÍCULO</label>
                            <Dropdown value={situation} onChange={(e) => onInputSelectSituationVehiculo(e.value, 'situacion')}
                                options={SITUATION} optionLabel="description" placeholder="SELECCIONAR" />
                            {submitted && !vehiculo.situacion &&
                                <small className="p-invalid">Situación es requerido.</small>}

                        </div>
                        <div className="col-12 md:col-4">
                            <label htmlFor="especie">ESTADO</label>
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="estado" value='A'
                                    checked={checkboxValue.indexOf('A') !== -1}
                                    onChange={onCheckboxChangeVehiculo} />
                            </div>
                            {submitted && !vehiculo.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                    </Dialog>


                    <Dialog visible={deleteVehiculoDialog} style={{ width: '450px' }} header="Confirmar" modal
                        footer={deleteVehiculoDialogFooter} onHide={hideDeleteVehiculoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {vehiculo &&
                                <span>¿Estás seguro de que quieres eliminar el vehiculo<b>{vehiculo.clase}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteComplaintDialog} style={{ width: '450px' }} header="Confirmar" modal
                        footer={deleteDenuncianteDialogFooter} onHide={hideDeleteDenuncianteDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>¿Estás seguro de que quieres eliminar el Denunciante?</span>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteComplaintDialog} style={{ width: '450px' }} header="Confirmar" modal
                        footer={deleteComplaintDialogFooter} onHide={hideDeleteComplaintDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>¿Estás seguro de que quieres eliminar la denuncia?</span>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteDenunciadoDialog} style={{ width: '450px' }} header="Confirmar" modal
                        footer={deleteDenunciadoDialogFooter} onHide={hideDeleteDenunciadoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>¿Estás seguro de que quieres eliminar al Denunciado?</span>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteAgraviadoDialog} style={{ width: '450px' }} header="Confirmar" modal
                        footer={deleteAgraviadoDialogFooter} onHide={hideDeleteAgraviadoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>¿Estás seguro de que quieres eliminar al Agraviado?</span>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteArmaDialog} style={{ width: '450px' }} header="Confirmar" modal
                        footer={deleteArmaDialogFooter} onHide={hideDeleteArmaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>¿Estás seguro de que quieres eliminar al Arma?</span>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteEspecieDialog} style={{ width: '450px' }} header="Confirmar" modal
                        footer={deleteEspecieDialogFooter} onHide={hideDeleteEspecieDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>¿Estás seguro de que quieres eliminar la especie?</span>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteVehiculoDialog} style={{ width: '450px' }} header="Confirmar" modal
                        footer={deleteVehiculoDialogFooter} onHide={hideDeleteVehiculoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>¿Estás seguro de que quieres eliminar el vehiculo?</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Denuncia, comparisonFn);
