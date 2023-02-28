import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import { Toolbar } from 'primereact/toolbar';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import PersonaService from "../service/PersonaService";
import { Dropdown } from 'primereact/dropdown';

const Persona = () => {

    let emptyPersona = {
        id: null,
        dni: '',
        nombre: '',
        ap_paterno: '',
        ap_materno: '',
        nacimiento: '',
        edad: '',
        sexo: '',
        celular: '',
        estado_civil: '',
    };
    const GENDERS = [
        { description: 'Seleccionar', id: '' },
        { description: 'MASCULINO', id: 'M' },
        { description: 'FEMENINO', id: 'F' },
    ];
    const MARITAL_STATUS = [
        { description: 'Seleccionar', id: '' },
        { description: 'SOLTERO/A', id: '1' },
        { description: 'CASADO/A', id: '2' },
        { description: 'SEPARADO/A', id: '3' },
        { description: 'DIVORSIADO/A', id: '4' },
        { description: 'VIUDO/A', id: '5' },
    ];




    // reportes
    const getPdf = async () => {
        const response = await PersonaService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    // fin reportes

    const [products, setProducts] = useState(null);//borrar
    const [personaDialog, setPersonaDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deletePersonaDialog, setDeletePersonaDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);


    const [persona, setPersona] = useState(emptyPersona);

    const [gender, setGender] = useState(null);

    const [maritalStatus, setMaritalStatus] = useState(null);

    const [flagPerson, setFlagPerson] = useState(false);
    const [personas, setPersonas] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);//BORRAR
    const [selectedPersonas, setSelectedPersonas] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [titlePersona, setTitlePersona] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    

    function fetchDataDniPerson(dni) {
        const url = "https://dniruc.apisperu.com/api/v1/dni/"+dni+"?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJleXNhbmdhbWE3QGdtYWlsLmNvbSJ9.hfobQC8FM5IyKKSaa7usUXV0aY1Y8YthAhdN8LoMlMM";
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data.nombres){
                    let _persona = { ...persona };
                    _persona[`nombre`] = data.nombres;
                    _persona[`ap_paterno`] = data.apellidoPaterno;
                    _persona[`ap_materno`] = data.apellidoMaterno;
                    setPersona(_persona);
                }else{
                    toast.current.show({ severity: 'warn', summary: '', detail:'No se encontró persona', life: 3000 });  
                }
            })
            .catch(() => {
                toast.current.show({ severity: 'warn', summary: '', detail:'No se encontró persona', life: 3000 });

            })
    }
    useEffect(() => {
        async function fetchDataPersona() {
            const res = await PersonaService.list();
            setPersonas(res.data);
        }
        fetchDataPersona();
    }, [flagPerson]);

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
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Persona Creada', life: 3000 });
            setPersonas(_personas);
            setPersonaDialog(false);
            setPersona(emptyPersona);
            setFlagPerson(_persona);
        }


        return res;
    }

    const update = async (id, _persona, _personas) => {
        const res = await PersonaService.update(id, _persona);
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
            const index = findIndexById(id);
            _personas[index] = _persona;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Persona Modificado', life: 3000 });
            setPersonas(_personas);
            setPersonaDialog(false);
            setPersona(emptyPersona);
            setFlagPerson(_persona);
        }

    }
    const eliminar = async (id) => {

        const res = await PersonaService.eliminar(id);

    }
    const openNew = () => {
        setPersona(emptyPersona);
        setGender(false);
        setMaritalStatus(false);
        setSubmitted(false);
        setPersonaDialog(true);
        setTitlePersona('NUEVA PERSONA');
    }

    const hideDialog = () => {
        setSubmitted(false);
        setPersonaDialog(false);
    }

    const hideDeletePersonaDialog = () => {
        setDeletePersonaDialog(false);
    }

    const savePersona = () => {
        setSubmitted(true);
        if (persona.nombre.trim()) {
            let _personas = [...personas];
            let _persona = { ...persona };
            if (persona.id) {
                update(persona.id, _persona, _personas);
            }
            else {
                crear(_persona, _personas);
            }

        }
    }

    const editPersona = (persona) => {

        let arrayFilterGender = GENDERS.filter(e => e.id == persona.sexo);
        let arrayFilterMarital = MARITAL_STATUS.filter(e => e.id == persona.estado_civil);
        setGender(arrayFilterGender[0]);
        setMaritalStatus(arrayFilterMarital[0]);
        setPersona({ ...persona });
        setPersonaDialog(true);
        setTitlePersona('EDITAR PERSONA');

    }




    const confirmDeletePersona = (persona) => {
        setPersona(persona);
        setDeletePersonaDialog(true);
    }

    const deletePersona = () => {
        eliminar(persona.id);
        let _personas = personas.filter(val => val.id !== persona.id);
        setPersonas(_personas);
        setDeletePersonaDialog(false);
        setPersona(emptyPersona);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Persona Eliminado', life: 3000 });

    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < personas.length; i++) {
            if (personas[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }


    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _persona = { ...persona };
        _persona[`${name}`] = val;

        setPersona(_persona);
    }
    const onInputSelectGender = (val, name) => {
        setGender(val);
        let _person = { ...persona };
        _person[`${name}`] = val.id;
        setPersona(_person);
    }


    const onInputSelectMaritalStatus = (val, name) => {
        setMaritalStatus(val)
        let _person = { ...persona };
        _person[`${name}`] = val.id;
        setPersona(_person);
    }
    const handleKeyUpDni = (e) => {
        if (e.key === 'Enter') {
            if(persona.dni.length==8){
                fetchDataDniPerson(persona.dni) 
            }else{
                toast.current.show({ severity: 'warn', summary: '', detail:'Documento debe tener 8 dígitos', life: 3000 });
            }
            
        }
    }
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


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="NUEVA PERSONA" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" /> */}
                <Button label="EXPORTAR" icon="pi pi-upload" className="p-button-help" onClick={getPdf} />
            </React.Fragment>
        )
    }

    const dniBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">DNI</span>
                {rowData.dni}
            </>
        );
    }

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombres</span>
                {rowData.nombre}
            </>
        );
    }

    const ap_paternoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellido Paterno</span>
                {rowData.ap_paterno}
            </>
        );
    }

    const ap_maternoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellido Materno</span>
                {rowData.ap_materno}
            </>
        );
    }

    const edadBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Edad</span>
                {rowData.edad}
            </>
        );
    }

    const sexoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Sexo</span>
                {rowData.sexo}
            </>
        );
    }

    const celularBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telef. Celular </span>
                {rowData.celular}
            </>
        );
    }

    const estado_civilBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Estado civil </span>
                {rowData.estado_civil}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPersona(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeletePersona(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTRAR PERSONAS</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );


    const personaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={savePersona} />
        </>
    );
    const deletePersonaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePersonaDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deletePersona} />
        </>
    );


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={personas} selection={selectedPersonas} onSelectionChange={(e) => setSelectedPersonas(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} personas"
                        globalFilter={globalFilter} emptyMessage="No existen personas" header={header} responsiveLayout="scroll">

                        <Column field="dni" header="DNI" sortable body={dniBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="nombre" header="NOMBRES" sortable body={nombreBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="ap_paterno" header="AP. PATERNO" sortable body={ap_paternoBodyTemplate} headerStyle={{ width: '20%', minWidth: '10rem' }}></Column>

                        <Column field="ap_materno" header="AP. MATERNO" sortable body={ap_maternoBodyTemplate} headerStyle={{ width: '20%', minWidth: '10rem' }}></Column>

                        <Column field="edad" header="EDAD" sortable body={edadBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

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
                                options={GENDERS} optionLabel="description" placeholder="Seleccionar" />
                            {submitted && !persona.sexo &&
                                <small className="p-invalid">Sexo es requerido.</small>}

                        </div>
                        <div className="field">
                            <label htmlFor="celular">CELULAR</label>
                            <InputText id="celular" maxLength="9" value={persona.celular} onChange={(e) => onInputChange(e, 'celular')} required className={classNames({ 'p-invalid': submitted && !persona.celular })} />
                            {submitted && !persona.celular && <small className="p-invalid">celular es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="estado_civil">ESTADO CIVIL</label>
                            <Dropdown value={maritalStatus} onChange={(e) => onInputSelectMaritalStatus(e.value, 'estado_civil')}
                                options={MARITAL_STATUS} optionLabel="description" placeholder="Seleccionar" />
                            {submitted && !persona.estado_civil &&
                                <small className="p-invalid">Estado Civil es requerido.</small>}
                        </div>
                    </Dialog>
                    <Dialog visible={deletePersonaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePersonaDialogFooter} onHide={hideDeletePersonaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {persona && <span>Estás seguro de que quieres eliminar el usuario <b>{persona.nombre}</b>?</span>}
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

export default React.memo(Persona, comparisonFn);
