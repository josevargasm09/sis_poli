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
import { Checkbox } from 'primereact/checkbox'; 
import { InputText } from 'primereact/inputtext';
import { ProductService } from '../service/ProductService';
import SeccionService from "../service/SeccionService";

const Seccion = () => {
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
    let emptySeccion = {
        id: null,
        descripcion:'',
        idseccion: null,
        estado: 'A',
    };

     // reportes
     const getPdf = async () => {
        const response =  await SeccionService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data ], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    // fin reportes

    const [checkboxValue, setCheckboxValue] = useState([]);

    const [products, setProducts] = useState(null);//borrar
    const [seccions, setSeccions] = useState(null);///lista de los perfiles
    
    const [seccionDialog, setSeccionDialog] = useState(false);//cabecera del modal
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteSeccionDialog, setDeleteSeccionDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [seccion, setSeccion] = useState(emptySeccion);//estado de los  campos del perfil
    const [selectedProducts, setSelectedProducts] = useState(null);//BORRAR
    const [selectedSeccions, setSelectedSeccions] = useState(null);// AUN NO SE
    const [flagSeccion, setFlagSeccion] = useState(false);
    const [titleSeccion, setTitleSeccion]=useState(''); // nuevo
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setProducts(data));
    }, []);

    useEffect(() => {
        async function fetchDataSeccion() {
            const res = await SeccionService.list();
                setSeccions(res.data)
            } 
            fetchDataSeccion();  
    }, [seccion]);
    const crear = async (data) => {
       
        const res = await SeccionService.create(data);
    
    }

    const update = async (id,data)=> {
       
        const res = await SeccionService.update(id,data);
    
    }
    const eliminar = async (id)=> {
       
        const res = await SeccionService.eliminar(id);
    
    }
    
   
    const openNew = () => {
        setSeccion(emptySeccion);
        setSubmitted(false);
        setSeccionDialog(true);
        var estate_seccion='A';
        setCheckboxValue([estate_seccion]);
        setTitleSeccion('NUEVA SECCIÓN');
    }

    const hideDialog = () => {
        setSubmitted(false);
        setSeccionDialog(false);
    }

    const hideDeleteSeccionDialog = () => {
        setDeleteSeccionDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveSeccion = () => {
        setSubmitted(true);

        if (seccion.descripcion.trim()) {
            let _seccions = [...seccions];
            let _seccion = { ...seccion };
            if (seccion.id) { 
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Seccion modificado', life: 3000 });
                update(seccion.id,_seccion);
            }
            else {
                 _seccion.id = "";
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Seccion Creado', life: 3000 });
                crear(_seccion);
            }
            setCheckboxValue([]);
            setSeccions(_seccions);
            setSeccionDialog(false);
            setSeccion(emptySeccion);
            setFlagSeccion(_seccion);
        }
    }
   

    const editSeccion = (seccion) =>  {
         setSeccion({ ...seccion });
        setSeccionDialog(true);
        let _seccion = { ...seccion};
        var estate_seccion=_seccion["estado"];

        setCheckboxValue([estate_seccion]);
        setTitleSeccion('EDITAR SECCIÓN')
    }


    

    const confirmDeleteSeccion = (seccion) => {
        setSeccion(seccion);
        setDeleteSeccionDialog(true);

    }


    const deleteSelectedProducts = () => {
        let _seccions = products.filter(val => !selectedProducts.includes(val));
        setSeccions(_seccions);
        setDeleteSeccionDialog(false);
        setSelectedSeccions(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

 const deleteSeccion = () => {
        eliminar(seccion.id);
        let _seccions = seccions.filter(val => val.id !== seccion.id);
        setSeccions(_seccions);
        setDeleteSeccionDialog(false);
        setSeccion(emptySeccion);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'seccion Elimiminado', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < seccions.length; i++) {
            if (seccions[i].id === id) {
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
      
        let _seccion = { ...seccion};
        
        _seccion[`${name}`] = val;
       
        setSeccion(_seccion);

       
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
            var state_seccion='I';
            if (e.checked){
                state_seccion='A';
            }
           
            
            let _seccion = { ...seccion};
            _seccion["estado"] = state_seccion ;
            setSeccion(_seccion);
          
        };

        // 

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="NUEVA SECCIÓN" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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



// ----------------------------------------------------------------



const descripcionBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Seccion</span>
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



// ----------------------------------------------------------------



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editSeccion(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteSeccion(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTRAR SECCIONES</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

  
    const seccionDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveSeccion} />
        </>
    );

    const deleteSeccionDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSeccionDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSeccion} />
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

                    <DataTable ref={dt} value={seccions} selection={selectedSeccions} onSelectionChange={(e) => setSelectedSeccions(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} secciones"
                        globalFilter={globalFilter} emptyMessage="No existen secciones" header={header} responsiveLayout="scroll">
                        
                     
                        <Column field="descripcion" header="SECCIÓN" sortable body={descripcionBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                       
                        

                        <Column field="status_description" header="ESTADO" sortable body={estadoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}>
                        </Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={seccionDialog} style={{ width: '450px' }} header={titleSeccion} modal className="p-fluid" footer={seccionDialogFooter} onHide={hideDialog}>
                        
                    <div className="field">
                            <label htmlFor="descripcion">SECCIÓN</label>
                            <InputText id="descripcion" value={seccion.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !seccion.descripcion })} />
                            {submitted && !seccion.descripcion && <small className="p-invalid">descripcion es requerido.</small>}
                        </div>


                        <div className="col-12 md:col-4">
                        <label htmlFor="descripcion">ESTADO</label>
                            <div className="field-checkbox">
                           
                            <Checkbox inputId="checkOptionSeccion1" name="estado" value='A' checked={checkboxValue.indexOf('A') !== -1} onChange={onCheckboxChange} />  
                           </div>
                           {submitted && !seccion.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                    </Dialog>

                   

                    <Dialog visible={deleteSeccionDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteSeccionDialogFooter} onHide={hideDeleteSeccionDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {seccion && <span>Estás seguro de que quieres eliminar el seccion<b>{seccion.descripcion}</b>?</span>}
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

export default React.memo(Seccion, comparisonFn);