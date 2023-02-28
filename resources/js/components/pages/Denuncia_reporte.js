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
import Maps from '../components/Maps';
import AutoCompleteMap from '../components/AutocompleteMap';


const Denuncia_reporte = () => {

    const typeComplaints = [
        { description: 'SELECCIONAR', id: '' },
        { description: 'DENUNCIA', id: '1' },
        { description: 'OCURRENCIA', id: '2' },

    ];
    let empty_complaint = {
        id_modalidad: '',
        id_tipoDenuncia: '',
        id_seccion: '',
        id_libro: '',
        fecha_inicio: '',
        fecha_fin: '',
        dni:'',
    };
    const [flagComplaint, setFlagComplaint] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [complaintDialog, setComplaintDialog] = useState(null);
    const [titleDenuncia, setTitleDenuncia] = useState('');
    const [modality, setModality] = useState(null);
    const [listModalities, setListModalities] = useState(null);
    const [typeComplaint, setTypeComplaint] = useState(null);
    const [section, setSection] = useState(null);
    const [listSeccion, setListSeccion] = useState(null);
    const [libro, setLibro] = useState(null);
    const [listLibrosSeccion, setListLibrosSeccion] = useState(null);
    const [listLibros, setListLibros] = useState(null);
    const [complaint, setComplaint] = useState(empty_complaint);

    const toast = useRef(null);
    const dt = useRef(null);


    //seccion
    useEffect(() => {
        async function fetchDataSection() {
            const res = await SeccionService.seccion_active();
          
            setListSeccion(res.data)
        }

        fetchDataSection();
    }, []);

    //denuncias
    useEffect(() => {
        async function fetchDataComplaint() {
            let filters=complaint;
            const res = await DenunciaService.complaint_list_report(filters);
            setComplaints(res.data)
        }
        fetchDataComplaint();
    }, [flagComplaint]);

    useEffect(() => {
        async function fetchDataLibros() {
            const res = await LibroService.book_active();
            setListLibros(res.data)
        }

        fetchDataLibros();
    }, []);
    //ubigeo 
    useEffect(() => {
        async function fetchDataModality() {
            const res = await ModalityService.modality_active();
            setListModalities(res.data)
        }

        fetchDataModality();
    }, []);
    const onInputSelectModality = (val, name) => {
        setModality(val);
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val.id;
        setComplaint(_complaint);
        setFlagComplaint(_complaint);
    }
    const onInputSelecTypeComplaint = (val, name) => {
        setTypeComplaint(val);
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val.id;
        setComplaint(_complaint);
        setFlagComplaint(_complaint);
    }
    const onInputChangeDate = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val;

        setComplaint(_complaint);
        setFlagComplaint(_complaint);
    }
    const onInputChangeDni = (e, name) => {

        const val = (e.target && e.target.value) || '';

        let _complaint = { ...complaint };

        _complaint[`${name}`] = val;

        setComplaint(_complaint);
      
    }
    const onInputSelectLibro = (val, name) => {
        setLibro(val)
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val.id;
        setComplaint(_complaint);
        setFlagComplaint(_complaint);

    }
    const onInputSelectSection = (val, name) => {

        setSection(val);
        let arrayFilterlibro = listLibros.filter(e => e.idseccion == val.id);
        setListLibrosSeccion(arrayFilterlibro);
        let _complaint = { ...complaint };
        _complaint[`${name}`] = val.id;
        setComplaint(_complaint);
        setFlagComplaint(_complaint);
    }
    const getPdf = async () => {
        let filters=complaint;
        const response = await DenunciaService.complaint_Reporte_pdf_new(filters);
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        window.open(url, "_blank");
    }
    const report_detail_pdf = async (id) => {
        const response = await DenunciaService.complaint_detail_report_pdf(id);
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        window.open(url, "_blank");
    }
    const handleKeyUpDni = (e) => {
        if (e.key === 'Enter') {
            if(complaint.dni.length==8){
                setFlagComplaint(complaint);
            }else{
                toast.current.show({ severity: 'warn', summary: '', detail:'Documento debe tener 8 dígitos', life: 3000 });
            }
            
        }
    }
    const leftToolbarTemplate = () => {
        return (
            <div className="col-12">
                <div className="card">
                   
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                        <label htmlFor="idModalidad">MODALIDAD</label>
                        <Dropdown value={modality} onChange={(e) => onInputSelectModality(e.value, 'id_modalidad')}
                            optionLabel="descripcion" autoFocus options={listModalities}
                            placeholder="SELECCIONAR" required
                        />
                        </div>
                        <div className="field col-12 md:col-3">
                        <label htmlFor="tipoDenuncia">TIPO DENUNCIA</label>
                        <Dropdown value={typeComplaint} onChange={(e) => onInputSelecTypeComplaint(e.value, 'id_tipoDenuncia')}
                            options={typeComplaints} optionLabel="description" placeholder="SELECCIONAR" />

                        </div>
                        <div className="field col-12 md:col-3">
                        <label htmlFor="idSeccion">SECCIÓN</label>
                                <Dropdown value={section} onChange={(e) => onInputSelectSection(e.value, 'id_seccion')}
                                    optionLabel="descripcion" autoFocus options={listSeccion}
                                    placeholder="SELECCIONAR" required />
                        </div>
                        <div className="field col-12 md:col-3">
                        <label htmlFor="idModalidad">LIBRO</label>
                        <Dropdown value={libro} onChange={(e) => onInputSelectLibro(e.value, 'id_libro')}
                                    optionLabel="descripcion" autoFocus options={listLibrosSeccion}
                                    placeholder="SELECCIONAR" />
                        </div>
                        <div className="field col-12 md:col-3">
                        <label htmlFor="fechaHecho">FECHA INICIO</label>
                        <InputText type="date" id="fechaHecho"
                            onChange={(e) => onInputChangeDate(e, 'fecha_inicio')} />
                        </div>
                        <div className="field col-12 md:col-3">
                        <label htmlFor="fechaHecho">FECHA FIN</label>
                        <InputText type="date" id="fechaHecho"
                            onChange={(e) => onInputChangeDate(e, 'fecha_fin')} />
                        </div>
                        <div className="field col-12 md:col-4">
                        <label htmlFor="dni">DNI DENUNCIANTE</label>
                        <InputText type="text" id="dni" maxLength="8"  onKeyUp={handleKeyUpDni} onChange={(e) => onInputChangeDni(e, 'dni')} />
                        </div>
                        <div className="field col-12 md:col-2">
                        <label htmlFor="idModalidad">&nbsp;</label>
                        <Button label="EXPORTAR" icon="pi pi-upload" className="p-button-help" onClick={getPdf} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
            </React.Fragment>
        )
    }
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">

        </div>
    );

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
    const hideComplaintDialog = () => {
        setComplaintDialog(false);
    }
    const printComplit = (rowData) => {
        report_detail_pdf(rowData.id)
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-file-pdf" className="p-button-rounded p-button-success mr-2" onClick={() => printComplit(rowData)} />
            </div>
        );
    }
    const complaintDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideComplaintDialog} />
        </>
    );
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={complaints}

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








                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Denuncia_reporte, comparisonFn);
