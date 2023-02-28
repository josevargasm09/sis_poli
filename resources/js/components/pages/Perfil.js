import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Checkbox } from 'primereact/checkbox'; 
import { PickList } from 'primereact/picklist';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import PerfilService from "../service/PerfilService";
import ModuleService from "../service/ModuleService";

const Perfil = () => { 
    let emptyPerfil = {
        idperfil: null,
        descripcion: '',
        estado: 'A',
    };
    

     // reportes
     const getPdf = async () => {
        const response =  await PerfilService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data ], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    // fin reportes

    const [picklistSourceValue, setPicklistSourceValue] = useState([]);
    const [listModuleTemporal, setListModuleTemporal] = useState([]);
    const [picklistTargetValue, setPicklistTargetValue] = useState([]);
    const [perfils, setPerfils] = useState(null);///lista de los perfiles
    const [perfilDialog, setPerfilDialog] = useState(false);//cabecera del modal
    const [deletePerfilDialog, setDeletePerfilDialog] = useState(false);
    const [perfil, setPerfil] = useState(emptyPerfil);//estado de los  campos del perfil
    const [selectedPerfils, setSelectedPerfils] = useState(null);// AUN NO SE
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [listModules, setlistModules] = useState(null);
    const [checkboxValue, setCheckboxValue] = useState([]);
    const toast = useRef(null);
    const [titlePerfil,setTitlePerfil]=useState('');
    const [flagPerfil, setFlagPerfil] = useState(false);
    const dt = useRef(null);

    
    
    useEffect(() => {
        async function fetchDataPerfil() {
            const res = await PerfilService.list();
                setPerfils(res.data);
                
            } 
            fetchDataPerfil();  
    }, [flagPerfil]);

    useEffect(() => {
        async function fetchDataModules() {
            const res = await ModuleService.getModule();
            setPicklistSourceValue(res.data);
            setListModuleTemporal(res.data);
            } 
            fetchDataModules();  
    }, []);

    
    const crear = async (data) => {
       
        const res = await PerfilService.create(data);
    
    }

    const update = async (id,data)=> {
       
        const res = await PerfilService.update(id,data);
    
    }
    const eliminar = async (id)=> {
       
        const res = await PerfilService.eliminar(id);
    
    }
  
    
   
    const openNew = () => {
        setPerfil(emptyPerfil);
        var estate_perfil='A';
        setCheckboxValue([estate_perfil]);
        setPicklistSourceValue(listModuleTemporal);
        setPicklistTargetValue([]);
        setSubmitted(false);
        setPerfilDialog(true);
        setTitlePerfil('NUEVO PERFIL');
    }

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilDialog(false);
    }

    const hideDeletePerfilDialog = () => {
        setDeletePerfilDialog(false);
    }

 

    const savePerfil = () => {
        setSubmitted(true);
        
         if (perfil.descripcion.trim()) {
            let _perfils = [...perfils];
            let _perfil = { ...perfil };
            if (perfil.idperfil) {
                
                const index = findIndexById(perfil.idperfil);
                _perfils[index] = _perfil;
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Perfil modificado', life: 3000 });
                _perfil.modules=picklistTargetValue;
                update(perfil.idperfil,_perfil);
            }
            else {
              
                _perfil.idperfil = "";
                _perfils.push(_perfil);
                _perfil.modules=picklistTargetValue;
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Perfil Creado', life: 3000 });
                
                let data=crear(_perfil);
                
            }
           
            setPerfils(_perfils);
            setPerfilDialog(false);
            setPerfil(emptyPerfil);
            setFlagPerfil(_perfil);
        }
    }
   
    const editPerfil = (perfil) => {
        setPerfil({ ...perfil });
        let _perfil = { ...perfil};
        var estate_perfil=_perfil["estado"];
        setCheckboxValue([estate_perfil]);
        let idperfil=perfil.idperfil;
        setPicklistSourceValue(listModuleTemporal);
        PerfilService.getPermisosPerfil(idperfil).then(function(result) {
            let modules_unselect=listModuleTemporal.filter(function(modulo) {
                
                let identificador_modulo='A';
                result.data.map(function(modulo_select){
                    if(modulo.idmodulo==modulo_select.idmodulo){
                        identificador_modulo='B';
                    }
                });
                if(identificador_modulo=='A'){
                    return modulo
                }
            });
            let modules_select=listModuleTemporal.filter(function(modulo) {
                let identificador_modulo='A';
                result.data.map(function(modulo_select){
                    if(modulo.idmodulo==modulo_select.idmodulo){
                        identificador_modulo='B';
                    }
                });
                if(identificador_modulo=='B'){
                    return modulo
                }
           
             });
            
            setPicklistSourceValue(modules_unselect);
            setPicklistTargetValue(modules_select);
            setPerfilDialog(true);
            setTitlePerfil('EDITAR PERFIL')
          })
      
    }


    

    const confirmDeletePerfil = (perfil) => {
        setPerfil(perfil);
        setDeletePerfilDialog(true);

    }
    
    const deletePerfil = () => {
        eliminar(perfil.idperfil);
        let _perfils = perfils.filter(val => val.idperfil !== perfil.idperfil);
        setPerfils(_perfils);
        setDeletePerfilDialog(false);
        setPerfil(emptyPerfil);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Perfil Elimiminado', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < perfils.length; i++) {
            if (perfils[i].idperfil === id) {
                index = i;
                break;
            }
        }

        return index;
    }
    const exportCSV = () => {
        dt.current.exportCSV();
    }
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
      
        let _perfil = { ...perfil};
        
        _perfil[`${name}`] = val;
       
        setPerfil(_perfil);
    }
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="NUEVO PERFIL" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const codigoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">idperfil</span>
                {rowData.idperfil}
            </>
        );
    }
    const onCheckboxChange = (e) => {
        setCheckboxValue([]);
        let selectedValue = [...checkboxValue];
        if (e.checked)
            selectedValue.push(e.value);
        else
            selectedValue.splice(selectedValue.indexOf(e.value), 1);
        setCheckboxValue(selectedValue);
        let state_perfil='I';
        if (e.checked){
            state_perfil='A';
        }
        let _perfil = { ...perfil };
        _perfil["estado"] =state_perfil ;
        setPerfil(_perfil);
      
    };
    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">descripcion</span>
                {rowData.descripcion}
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPerfil(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeletePerfil(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTRAR PERFIL</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

  
    const perfilDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={savePerfil} />
        </>
    );
    const deletePerfilDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePerfilDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deletePerfil} />
        </>
    );
 

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={perfils} selection={selectedPerfils} onSelectionChange={(e) => setSelectedPerfils(e.value)}
                        dataKey="idperfil" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} perfiles"
                        globalFilter={globalFilter} emptyMessage="No existen perfiles" header={header} responsiveLayout="scroll">
                        
                     
                        <Column field="descripcion" header="PERFIL" sortable body={descripcionBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="status_description" header="ESTADO" sortable body={estadoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}>
                        </Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={perfilDialog} style={{ width: '650px' }} header={titlePerfil} modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>
                    <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="descripcion">PERFIL</label>
                                <InputText id="descripcion" value={perfil.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !perfil.descripcion })} />
                                {submitted && !perfil.descripcion && <small className="p-invalid">Perfil es requerido.</small>}
                            </div>
                            
                            <div className="field col">
                                <label htmlFor="estado">ESTADO</label>
                                <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="estado" value='A' checked={checkboxValue.indexOf('A') !== -1} onChange={onCheckboxChange} />   
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <h5>MODULOS</h5>
                            <PickList source={picklistSourceValue} target={picklistTargetValue} sourceHeader="Lista de módulos" targetHeader="Permisos de perfil" itemTemplate={(item) => <div>{item.descripcion}</div>}
                                onChange={(e) => { setPicklistSourceValue(e.source); setPicklistTargetValue(e.target) }} sourceStyle={{ height: '200px' }} targetStyle={{ height: '200px' }}></PickList>
                        </div>
                    </Dialog>

                   

                    <Dialog visible={deletePerfilDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilDialogFooter} onHide={hideDeletePerfilDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && <span>Estás seguro de que quieres eliminar el perfil <b>{perfil.descripcion}</b>?</span>}
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

export default React.memo(Perfil, comparisonFn);