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
import ArmaService from "../service/ArmaService";

const Arma = () => {
    
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
    let emptyArma = {
        id: null,
        marca: '',
        modelo:'',
        calibre:'',
        serie:'',
        estado: 'A',
    };

    
    // reportes
    const getPdf = async () => {
        const response =  await ArmaService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data ], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    // fin reportes

    const [checkboxValue, setCheckboxValue] = useState([]);

    const [products, setProducts] = useState(null);//borra
    const [armas, setArmas] = useState(null);
    
    const [armaDialog, setArmaDialog] = useState(false);//cabecera del modal
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteArmaDialog, setDeleteArmaDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [arma, setArma] = useState(emptyArma);//estado de los  campos del perfil
    const [selectedProducts, setSelectedProducts] = useState(null);//BORRAR
    const [selectedArmas, setSelectedArmas] = useState(null);// AUN NO SE

    const [titleArma,setTitleArma]=useState(''); // nuevo
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [flagWeapon, setFlagWeapon] = useState(false);

    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setProducts(data));
    }, []);
    useEffect(() => {
        async function fetchDataArma() { 
            const res = await ArmaService.list();
                setArmas(res.data)
            } 
            fetchDataArma();  
    },[flagWeapon]);
    
    const crear = async (_arma, _armas) => {
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
            setArmas(_armas);
            setArmaDialog(false);
            setArma(emptyArma);
            setFlagWeapon(_arma);
        }


        return res;
    }


   
    const update = async (id, _arma, _armas) => {
        const res = await ArmaService.update(id, _arma);
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
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Arma Modificada', life: 3000 });
            
            setCheckboxValue([]);
            setArmas(_armas);
            setArmaDialog(false);
            setArma(emptyArma);
            setFlagWeapon(_arma);
        }

    }


    const eliminar = async (id)=> {
       
        const res = await ArmaService.eliminar(id);
    
    }
  
    
   
    const openNew = () => {
        setArma(emptyArma);
        setSubmitted(false);
        setArmaDialog(true);
        var estate_arma='A';
        setCheckboxValue([estate_arma]);
        setTitleArma('NUEVA ARMA');
    }

    const hideDialog = () => {
        setSubmitted(false);
        setArmaDialog(false);
    }

    const hideDeleteArmaDialog = () => {
        setDeleteArmaDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveArma = () => {
        setSubmitted(true);
        
         if (arma.marca.trim()) {
            let _armas = [...armas];
            
            let _arma = { ...arma };
            if (arma.id) {
                update(arma.id,_arma,_armas);
            }
            else {
                crear(_arma,_armas);
            }
        
        }
    }
   
    const editArma = (arma) => {

        
        setArma({ ...arma });
        setArmaDialog(true);
        let _arma = { ...arma};
        var estate_arma=_arma["estado"];

        setCheckboxValue([estate_arma]);
        setTitleArma('EDITAR ARMA')
    }


    

    const confirmDeleteArma = (arma) => {
        setArma(arma);
        setDeleteArmaDialog(true);

    }
    const deleteSelectedProducts = () => {
        let _armas = products.filter(val => !selectedProducts.includes(val));
        setArmas(_armas);
        setDeleteArmaDialog(false);
        setSelectedArmas(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }
    const deleteArma = () => {
        eliminar(arma.id);
        let _armas = armas.filter(val => val.id !== arma.id);
        setArmas(_armas);
        setDeleteArmaDialog(false);
        setArma(emptyArma);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Arma Elimiminado', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < armas.length; i++) {
            if (armas[i].id === id) {
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
      
        let _arma = { ...arma};
        
        _arma[`${name}`] = val;
       
        setArma(_arma);
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
            var state_arma='I';
            
            if (e.checked){
                
                state_arma='A';
            }
           
            
            let _arma = { ...arma };
            _arma["estado"] = state_arma ;
            setArma(_arma);
          
        };

        // 

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="NUEVA ARMA" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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
                <span className="p-column-title">id</span>
                {rowData.id}
            </>
        );
    }
    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">marca</span>
                {rowData.marca}
            </>
        );
    }


// ----------------------------------------------------------------

const codeBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Code</span>
            {rowData.code}
        </>
    );
}

const marcaBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Marca</span>
            {rowData.marca}
        </>
    );
}
const modeloBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Modelo</span>
            {rowData.modelo}
        </>
    );
}
const calibreBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Calibre</span>
            {rowData.calibre}
        </>
    );
}
const serieBodyTemplate = (rowData) => {
    return (
        <>
            <span className="p-column-title">Serie</span>
            {rowData.serie}
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editArma(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteArma(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTRAR ARMAS</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

  
    const armaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveArma} />
        </>
    );
    const deleteArmaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteArmaDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteArma} />
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

                    <DataTable ref={dt} value={armas} selection={selectedArmas} onSelectionChange={(e) => setSelectedArmas(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} armas"
                        globalFilter={globalFilter} emptyMessage="No existen vehículos" header={header} responsiveLayout="scroll">
                        
                     
                        <Column field="marca" header="MARCA" sortable body={marcaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                       
                        <Column field="modelo" header="MODELO" sortable body={modeloBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="calibre" header="CALIBRE" sortable body={calibreBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="serie" header="SERIE" sortable body={serieBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="status_description" header="ESTADO" sortable body={estadoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}>
                        </Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={armaDialog} style={{ width: '450px' }} header={titleArma} modal className="p-fluid" footer={armaDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="marca">MARCA</label>
                            <InputText id="marca" value={arma.marca} onChange={(e) => onInputChange(e, 'marca')} required autoFocus className={classNames({ 'p-invalid': submitted && !arma.marca })} />
                            {submitted && !arma.marca && <small className="p-invalid">Arma es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="modelo">MODELO</label>
                            <InputText id="modelo" value={arma.modelo} onChange={(e) => onInputChange(e, 'modelo')} required  className={classNames({ 'p-invalid': submitted && !arma.modelo })} />
                            {submitted && !arma.modelo && <small className="p-invalid">Arma es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="calibre">CALIBRE</label>
                            <InputText id="calibre" value={arma.calibre} onChange={(e) => onInputChange(e, 'calibre')} required  className={classNames({ 'p-invalid': submitted && !arma.calibre })} />
                            {submitted && !arma.calibre && <small className="p-invalid">Arma es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="serie">SERIE</label>
                            <InputText id="serie" value={arma.serie} onChange={(e) => onInputChange(e, 'serie')} required  className={classNames({ 'p-invalid': submitted && !arma.serie })} />
                            {submitted && !arma.serie && <small className="p-invalid">Serie es requerido.</small>}
                        </div>
                        <label htmlFor="estado">ESTADO</label>
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">
                           
                            <Checkbox inputId="checkOption1" name="estado" value='A' checked={checkboxValue.indexOf('A') !== -1} onChange={onCheckboxChange} />  
                           </div>
                            {submitted && !arma.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                    </Dialog>

                   

                    <Dialog visible={deleteArmaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteArmaDialogFooter} onHide={hideDeleteArmaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {arma && <span>Estás seguro de que quieres eliminar el arma<b>{arma.marca}</b>?</span>}
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

export default React.memo(Arma, comparisonFn);