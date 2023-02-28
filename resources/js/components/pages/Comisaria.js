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
import ComisariaService from "../service/ComisariaService";

// import { axios, baseUrl } from '../service/PdfService'; 

const Comisaria = () => {
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
    let emptyComisaria = {
        id: null,
        nom_comisaria: '',
        direccion:'',
        estado: 'A',
        email:'',
        phone:''

    };



     // reportes

     const getPdf = async () => {
        const response =  await ComisariaService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data ], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    const [checkboxValue, setCheckboxValue] = useState([]);

 

    const [isChecked, setIsChecked] = useState(false);
    const [estado, setEstado] = useState(null);
    const [products, setProducts] = useState(null);//borrar
    const [comisarias, setComisarias] = useState(null);///lista de los comisarias
    const [titleComisaria,setTitleComisaria]=useState('');


    
    const [comisariaDialog, setComisariaDialog] = useState(false);//cabecera del modal
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteComisariaDialog, setDeleteComisariaDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [comisaria, setComisaria] = useState(emptyComisaria);//estado de los  campos del comisarias
    const [selectedProducts, setSelectedProducts] = useState(null);//BORRAR
    const [SelectedComisarias, setSelectedComisarias] = useState(null);// AUN NO SE
    const [submitted, setSubmitted] = useState(false);
    const [flagComisaria, setFlagComisaria] = useState(false);
    // Filtro
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null); 

     
   

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setProducts(data));
    }, []);

    // estadoo
    useEffect(() => {
        async function fetchDataComisaria() {
            const res = await ComisariaService.list();
            console.log(res.data);
                setComisarias(res.data)
            } 
            fetchDataComisaria();  
    }, [flagComisaria]);
    // -----------------------------------

   


    // const crear = async (data) => {
       
    //     const res = await ComisariaService.create(data);
    
    // }

    // const update = async (id,data)=> {
       
    //     const res = await ComisariaService.update(id,data);
    
    // }
    const eliminar = async (id)=> {
       
        const res = await ComisariaService.eliminar(id);
    
    }
  
    
   
    const openNew = () => {
        setComisaria(emptyComisaria);
        setEstado(false);
        setSubmitted(false);
        setComisariaDialog(true);
        var estate_comisaria='A';
        setCheckboxValue([estate_comisaria]);
        setTitleComisaria('NUEVA COMISARÍA');
    }


    const hideDialog = () => {
        setEstado(false);
        setSubmitted(false);
        setComisariaDialog(false);
    }

    const hideDeleteComisariaDialog = () => {
        setDeleteComisariaDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }
    const update = async (id, _comisaria, _comisarias) => {
        const res = await ComisariaService.update(id, _comisaria);
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

            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Comisaría Modificado', life: 3000 });
            setCheckboxValue([]);
            setComisarias(_comisarias);
            setComisariaDialog(false);
            setComisaria(emptyComisaria);
            setFlagComisaria(_comisaria);
        }

    }
    const crear = async (_comisaria, _comisarias) => {
        const res = await ComisariaService.create(_comisaria);
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
            _comisaria.id = "";
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Comisaría Creada', life: 3000 });
            setCheckboxValue([]);
            setComisarias(_comisarias);
            setComisariaDialog(false);
            setComisaria(emptyComisaria);
            setFlagComisaria(_comisaria);

        }


        return res;
    }

    const saveComisaria = () => {
        setSubmitted(true);
         if (comisaria.nom_comisaria.trim()) {
            let _comisarias = [...comisarias];
            let _comisaria = { ...comisaria };
            if (comisaria.id) {
                update(comisaria.id, _comisaria, _comisarias);
            }
            else {
                crear(_comisaria, _comisarias);
            }
            

        }
    }
   
    const editComisaria = (comisaria) => {
 
        setComisaria({ ...comisaria });
        setComisariaDialog(true);
        let _comisaria = { ...comisaria};
        var estate_comisaria=_comisaria["estado"];
     
        setCheckboxValue([estate_comisaria]);
        setTitleComisaria('EDITAR COMISARÍA')
     
        
    }


    

    const confirmDeleteComisaria = (comisaria) => {
        setComisaria(comisaria);
        setDeleteComisariaDialog(true);

    }
    const deleteSelectedProducts = () => {
        let _comisarias = products.filter(val => !selectedProducts.includes(val));
        setComisarias(_comisarias);
        setDeleteComisariaDialog(false);
        setSelectedComisarias(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }
    const deleteComisaria = () => {
        eliminar(comisaria.id);
        let _comisarias = comisarias.filter(val => val.id !== comisaria.id);
        setComisarias(_comisarias);
        setDeleteComisariaDialog(false);
        setComisaria(emptyComisaria);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Comisaria Elimiminado', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < comisarias.length; i++) {
            if (comisarias[i].id === id) {
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
        
        let _comisaria = { ...comisaria};
        
        _comisaria[`${name}`] = val;
       
        setComisaria(_comisaria);
    }

    const onCheckboxChange = (e) => {
        setCheckboxValue([]);
        let selectedValue = [...checkboxValue];
        if (e.checked)
            selectedValue.push(e.value);
        else
            selectedValue.splice(selectedValue.indexOf(e.value), 1);
       
        setCheckboxValue(selectedValue);
        var state_comisaria='I';
        if (e.checked){
            state_comisaria='A';
        }
       
        
        let _comisaria = { ...comisaria };
        _comisaria["estado"] =state_comisaria ;
        setComisaria(_comisaria);
      
    };

    // const onCheckboxChange = (e) => {
    //     let _comisaria = [...comisarias];
    //     if (e.checked)
    //              _comisaria.push(e.comisaria);
    //     else
    //              _comisaria.splice(_comisaria.indexOf(estado), 1);
    //         setComisaria(_comisaria);
    // };

    // const handleOnChange = () => {
    //     setIsChecked(estado);
    //   };
    

    // const onCheckboxChange = (e) => {
    //     let selectedValue = [...checkboxValue];
    //     if (e.checked)
    //         selectedValue.push(e.value);
    //     else
    //         selectedValue.splice(selectedValue.indexOf(e.value), 1);

    //     setCheckboxValue(selectedValue);
    // };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="NUEVA COMISARÍA" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="EXPORTAR" icon="pi pi-upload" className="p-button-help"onClick={getPdf} />
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
    const estadoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">status_description</span>
                {rowData.status_description}
            </>
        );
    }
    const nom_comisariaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">nom_comisaria</span>
                {rowData.nom_comisaria}
            </>
        );
    }
    


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editComisaria(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteComisaria(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTRAR COMISARÍAS</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search"   onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span> 
        </div>
    );

  
    const comisariaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveComisaria} />
        </>
    );
    const deleteComisariaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteComisariaDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteComisaria} />
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

                    <DataTable ref={dt} value={comisarias} selection={SelectedComisarias} onSelectionChange={(e) => setSelectedComisarias(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} comisarias"
                        // Modificado para que se pueda filtrar 
                        globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        
                        <Column field="nom_comisaria" header="COMISARÍA" sortable body={nom_comisariaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="status_description" header="ESTADO" sortable body={estadoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}>
                        </Column>
                       
                        <Column body={actionBodyTemplate}></Column>
                        
                           
                    </DataTable>
                    
                    <Dialog visible={comisariaDialog} style={{ width: '450px' }} header={titleComisaria} modal className="p-fluid" footer={comisariaDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="nom_comisaria">COMISARÍA</label>
                            <InputText id="nom_comisaria" value={comisaria.nom_comisaria} onChange={(e) => onInputChange(e, 'nom_comisaria')} required autoFocus className={classNames({ 'p-invalid': submitted && !comisaria.nom_comisaria })} />
                            {submitted && !comisaria.nom_comisaria && <small className="p-invalid">Comisaria es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="direccion">DIRECCIÓN</label>
                            <InputText id="direccion" value={comisaria.direccion} onChange={(e) => onInputChange(e, 'direccion')} required  className={classNames({ 'p-invalid': submitted && !comisaria.direccion })} />
                            {submitted && !comisaria.direccion && <small className="p-invalid">Dirección es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="telefono">TELÉFONO</label>
                            <InputText id="telefono" value={comisaria.phone} onChange={(e) => onInputChange(e, 'phone')} required  className={classNames({ 'p-invalid': submitted && !comisaria.phone })} />
                            {submitted && !comisaria.phone && <small className="p-invalid">Teléfono es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="correo">CORREO</label>
                            <InputText id="correo" value={comisaria.email} onChange={(e) => onInputChange(e, 'email')} required  className={classNames({ 'p-invalid': submitted && !comisaria.email })} />
                            {submitted && !comisaria.email && <small className="p-invalid">Correo es requerido.</small>}
                        </div>
                        <label htmlFor="estado">ESTADO</label>
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">
                            <Checkbox  inputId="checkOption1" name="estado" value='A' checked={checkboxValue.indexOf('A') !== -1} onChange={onCheckboxChange} />  
                           </div>
                            {submitted && !comisaria.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                        
                       
                      
                        
                    </Dialog>

                    

                    <Dialog visible={deleteComisariaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteComisariaDialogFooter} onHide={hideDeleteComisariaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {comisaria && <span>Estás seguro de que quieres eliminar el comisarias<b>{comisaria.nom_comisaria}</b>?</span>}
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

export default React.memo(Comisaria, comparisonFn);