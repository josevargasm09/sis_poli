import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProductService } from '../service/ProductService';
// Componente para el reporte
// import { axios, baseUrl } from '../service/PdfService'; 
import PdfService from '../service/PdfService'; 
import ReporteService from "../service/ReporteService";


const Reporte = () => {
    console.log('Entrando a reporte');
    let emptyProduct = {
        id: null,
        name: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };
    let emptyReporte = {
        idreporte: null,
        descripcion: '',
    };


    // reportes
    const getPdf = async () => {
        const response =  await PdfService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data ], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    // fin reportes

    const [products, setProducts] = useState(null);//borrar
    const [reportes, setReportes] = useState(null);///lista de los reportees
    
    const [reporteDialog, setReporteDialog] = useState(false);//cabecera del modal
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteReporteDialog, setDeleteReporteDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [reporte, setReporte] = useState(emptyReporte);//estado de los  campos del reporte
    const [selectedProducts, setSelectedProducts] = useState(null);//BORRAR
    const [selectedReportes, setSelectedReportes] = useState(null);// AUN NO SE
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    // Buscador
    const [newTaskName, setNewTaskName] = useState();
    const toast = useRef(null);
    const dt = useRef(null);
   

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setProducts(data));
    }, []);

    
    useEffect(() => {
        async function fetchDataReporte() {
            const res = await ReporteService.list();
                setReportes(res.data)
            } 
            fetchDataReporte();  
    }, [reporte]); 
    const crear = async (data) => {
       
        const res = await ReporteService.create(data);
    
    }

    const update = async (id,data)=> {
       
        const res = await ReporteService.update(id,data);
    
    }
    const eliminar = async (id)=> {
       
        const res = await ReporteService.eliminar(id);
    
    }
  
    
   
    const openNew = () => {
        setReporte(emptyReporte);
        setSubmitted(false);
        setReporteDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setReporteDialog(false);
    }

    const hideDeleteReporteDialog = () => {
        setDeleteReporteDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveReporte = () => {
        setSubmitted(true);
        
         if (reporte.descripcion.trim()) {
            let _reportes = [...reportes];
            let _reporte = { ...reporte }; 
            console.log("/////");
            console.log(reporte)
            console.log("//////")
            if (reporte.idreporte) {
                console.log("ingreso per");
                const index = findIndexById(reporte.idreporte);
                _reportes[index] = _reporte;
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Reporte modificado', life: 3000 });
                update(reporte.idreporte,_reporte);
            }
            else {
                console.log("ingreso crear");
                _reporte.idreporte = "";
                _reportes.push(_reporte);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Reporte Creado', life: 3000 });
                crear(_reporte);
            }
            setReportes(_reportes);
            setReporteDialog(false);
            setReporte(emptyReporte);
        }
    }
   
    const editReporte = (reporte) => {
       console.log(reporte);
       console.log("reporte");
        setReporte({ ...reporte });
        setReporteDialog(true);
      
    }


    

    const confirmDeleteReporte = (reporte) => {
        setReporte(reporte);
        setDeleteReporteDialog(true);

    }
    const deleteSelectedProducts = () => {
        let _reportes = products.filter(val => !selectedProducts.includes(val));
        setReportes(_reportes);
        setDeleteReporteDialog(false);
        setSelectedReportes(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }
    const deleteReporte = () => {
        eliminar(reporte.idreporte);
        let _reportes = reportes.filter(val => val.idreporte !== reporte.idreporte);
        setReportes(_reportes);
        setDeleteReporteDialog(false);
        setReporte(emptyReporte);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'reporte Elimiminado', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < reportes.length; i++) {
            if (reportes[i].idreporte === id) {
                index = i;
                break;
            }
        }

        return index;
    }


    // const exportCSV = () => {
    //     dt.current.exportCSV();
    // }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
      
        let _reporte = { ...reporte};
        
        _reporte[`${name}`] = val;
       
        setReporte(_reporte);

       
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={getPdf} />
            </React.Fragment>
        )
    }

    const codigoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">idreporte</span>
                {rowData.idreporte}
            </>
        );
    }
    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">descripcion</span>
                {rowData.descripcion}
            </>
        );
    }
    


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editReporte(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteReporte(rowData)} />
            </div>
        );
    }
                                               // Buscador
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrar Reportees</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

  
    const reporteDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveReporte} />
        </>
    );
    const deleteReporteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteReporteDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteReporte} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={reportes} selection={selectedReportes} onSelectionChange={(e) => setSelectedReportes(e.value)}
                        dataKey="idreporte" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} reportees"
                        globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                     
                        <Column field="descripcion" header="reporte" sortable body={descripcionBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={reporteDialog} style={{ width: '450px' }} header="Detalles de reporte" modal className="p-fluid" footer={reporteDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="descripcion">reporte</label>
                            <InputText id="descripcion" value={reporte.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !reporte.descripcion })} />
                            {submitted && !reporte.descripcion && <small className="p-invalid">reporte es requerido.</small>}
                        </div>
                    </Dialog>

                   

                    <Dialog visible={deleteReporteDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteReporteDialogFooter} onHide={hideDeleteReporteDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {reporte && <span>Estás seguro de que quieres eliminar el reporte<b>{reporte.descripcion}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
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

export default React.memo(Reporte, comparisonFn);