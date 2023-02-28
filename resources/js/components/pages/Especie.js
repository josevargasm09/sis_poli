import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';

import EspecieService from "../service/EspecieService";
import { Dropdown } from 'primereact/dropdown';
const Especie = () => {
    let emptyEspecie = {
        id: null,
        serie: '',
        especie: '',
        documento: '',
        codigoDoc: '',
        situacion: '',
        estado: 'A',

    };

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
    // reportes
    const getPdf = async () => {
        const response = await EspecieService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    // fin reportes

    const [checkboxValue, setCheckboxValue] = useState([]);

    const [especies, setEspecies] = useState(null);///lista de los perfiles

    const [especieDialog, setEspecieDialog] = useState(false);//cabecera del modal

    const [deleteEspecieDialog, setDeleteEspecieDialog] = useState(false);

    const [especie, setEspecie] = useState(emptyEspecie);//estado de los  campos del perfil

    const [flagEspecie, setFlagEspecie] = useState(false);

    const [typeDocument, setTypeDocument] = useState(false);

    const [situation, setSituation] = useState(false);

    const [selectedEspecies, setSelectedEspecies] = useState(null);// AUN NO SE
    const [submitted, setSubmitted] = useState(false);
    const [titleEspecie, setTitleEspecie] = useState(''); // nuevo
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    useEffect(() => {
        async function fetchDataEspecie() {
            const res = await EspecieService.list();
            setEspecies(res.data)
        }
        fetchDataEspecie();
    }, [flagEspecie]);

    const crear = async (_especie, _especies) => {
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
            setEspecies(_especies);
            setEspecieDialog(false);
            setEspecie(emptyEspecie);
            setFlagEspecie(_especie);

        }


        return res;
    }



    const update = async (id, _especie, _especies) => {
        const res = await EspecieService.update(id, _especie);
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
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Especie Modificado', life: 3000 });
            setCheckboxValue([]);
            setEspecies(_especies);
            setEspecieDialog(false);
            setEspecie(emptyEspecie);
            setFlagEspecie(_especie);
        }

    }
    const eliminar = async (id) => {

        const res = await EspecieService.eliminar(id);

    }



    const openNew = () => {
        setEspecie(emptyEspecie);
        setSubmitted(false);
        setEspecieDialog(true);
        setTypeDocument(false);
        setSituation(false);
        var estate_especie = 'A';
        setCheckboxValue([estate_especie]);
        setTitleEspecie('NUEVA ESPECIE');
    }

    const hideDialog = () => {
        setSubmitted(false);
        setEspecieDialog(false);
    }

    const hideDeleteEspecieDialog = () => {
        setDeleteEspecieDialog(false);
    }


    // const saveEspeciew = () => {
    //     setSubmitted(true);

    //     if (especie.especie.trim()) {
    //         let _especies = [...especies];
    //         let _especie = { ...especie };
    //         if (especie.id) {
    //             toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Especie modificado', life: 3000 });
    //             update(especie.id, _especie);
    //         }
    //         else {
    //             _especie.id = "";
    //             toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Especie Creado', life: 3000 });
    //             crear(_especie);
    //         }
    //         setCheckboxValue([]);
    //         setEspecies(_especies);
    //         setEspecieDialog(false);
    //         setEspecie(emptyEspecie);
    //     }
    // }
    const saveEspecie = () => {
        setSubmitted(true);
        let _especies = [...especies];
        let _especie = { ...especie };
        if (especie.id) {
            update(especie.id, _especie, _especies);
        }
        else {
            crear(_especie, _especies);
        }
    }

    const editEspecie = (especie) => {
        let arrayFilterTypeDocument = TYPE_DOCUMENT.filter(e => e.id == especie.documento);
        let arrayFilterSituation = SITUATION.filter(e => e.id == especie.situacion);
        setTypeDocument(arrayFilterTypeDocument[0]);
        setSituation(arrayFilterSituation[0]);

        setEspecie({ ...especie });
        setEspecieDialog(true);

        let _especie = { ...especie };
        var estate_especie = _especie["estado"];

        setCheckboxValue([estate_especie]);
        setTitleEspecie('EDITAR ESPECIE');
    }




    const confirmDeleteEspecie = (especie) => {
        setEspecie(especie);
        setDeleteEspecieDialog(true);

    }

    const deleteEspecie = () => {
        eliminar(especie.id);
        let _especies = especies.filter(val => val.id !== especie.id);
        setEspecies(_especies);
        setDeleteEspecieDialog(false);
        setEspecie(emptyEspecie);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Especie Elimiminado', life: 3000 });
    }
    const onInputSelectTypeDocument = (val, name) => {
        setTypeDocument(val);
        let _especie = { ...especie };
        _especie[`${name}`] = val.id;
        setEspecie(_especie);
    }
    const onInputSelectSituation = (val, name) => {
        setSituation(val);
        let _especie = { ...especie };
        _especie[`${name}`] = val.id;
        setEspecie(_especie);
    }
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _especie = { ...especie };
        _especie[`${name}`] = val;
        setEspecie(_especie);
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
        var state_especie = 'I';
        if (e.checked) {
            state_especie = 'A';
        }
        let _especie = { ...especie };
        _especie["estado"] = state_especie;
        setEspecie(_especie);

    };

    // 

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="NUEVA ESPECIE" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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


    const especieBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tipo de Especie</span>
                {rowData.especie}
            </>
        );
    }
    const serieBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.serie}
            </>
        );
    }

    const documentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tipo documento</span>
                {rowData.document_description}
            </>
        );
    }
    const codigoDocBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Codigo documento</span>
                {rowData.codigoDoc}
            </>
        );
    }

    const situacionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Situación</span>
                {rowData.situation_description}
            </>
        );
    }
    const estadoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">status_description</span>
                {rowData.status_description}
            </>
        );
    }



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editEspecie(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteEspecie(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTRAR ESPECIES</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );


    const especieDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveEspecie} />
        </>
    );
    const deleteEspecieDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEspecieDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteEspecie} />
        </>
    );


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={especies} selection={selectedEspecies} onSelectionChange={(e) => setSelectedEspecies(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} especies"
                        globalFilter={globalFilter} emptyMessage="No existen especies" header={header} responsiveLayout="scroll">

                        <Column field="serie" header="SERIE" sortable body={serieBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="especie" header="ESPECIE" sortable body={especieBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="document_description" header="TIPO DOCUMENTO" sortable body={documentBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="codigoDoc" header="CÓDIGO DOCUMENTO" sortable body={codigoDocBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="situation_description" header="SITUACIÓN" sortable body={situacionBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="status_description" header="ESTADO" sortable body={estadoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}>
                        </Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={especieDialog} style={{ width: '450px' }} header={titleEspecie} modal className="p-fluid" footer={especieDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="serie">SERIE</label>
                            <InputText id="serie" value={especie.serie} onChange={(e) => onInputChange(e, 'serie')} required autoFocus className={classNames({ 'p-invalid': submitted && !especie.serie })} />
                            {submitted && !especie.serie && <small className="p-invalid">Serie es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="especie">ESPECIE</label>
                            <InputText id="especie" value={especie.especie} onChange={(e) => onInputChange(e, 'especie')} className={classNames({ 'p-invalid': submitted && !especie.especie })} />
                            {submitted && !especie.especie && <small className="p-invalid">Especie es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="documento">TIPO DE DOCUMENTO</label>
                            <Dropdown value={typeDocument} onChange={(e) => onInputSelectTypeDocument(e.value, 'documento')}
                                options={TYPE_DOCUMENT} optionLabel="description" placeholder="SELECCIONAR" />
                            {submitted && !especie.documento &&
                                <small className="p-invalid">Tipo de documento es requerido.</small>}

                        </div>
                        <div className="field">
                            <label htmlFor="codigoDoc">CÓDIGO DOCUMENTO</label>
                            <InputText id="codigoDoc" value={especie.codigoDoc} onChange={(e) => onInputChange(e, 'codigoDoc')} className={classNames({ 'p-invalid': submitted && !especie.codigoDoc })} />
                            {submitted && !especie.codigoDoc && <small className="p-invalid">Codigo Documento es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="documento">SITUACIÓN ESPECIE</label>
                            <Dropdown value={situation} onChange={(e) => onInputSelectSituation(e.value, 'situacion')}
                                options={SITUATION} optionLabel="description" placeholder="SELECCIONAR" />
                            {submitted && !especie.situacion &&
                                <small className="p-invalid">Situación es requerido.</small>}

                        </div>

                        <div className="col-12 md:col-4">
                            <label htmlFor="documento">ESTADO</label>
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="estado" value='A' checked={checkboxValue.indexOf('A') !== -1} onChange={onCheckboxChange} />
                            </div>
                            {submitted && !especie.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                    </Dialog>


                    <Dialog visible={deleteEspecieDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteEspecieDialogFooter} onHide={hideDeleteEspecieDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {especie && <span>¿Estás seguro de que quieres eliminar el perfil<b>{especie.especie}</b>?</span>}
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

export default React.memo(Especie, comparisonFn);