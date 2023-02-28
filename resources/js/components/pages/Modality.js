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
import { ProductService } from '../service/ProductService';
import ModalityService from "../service/ModalityService";

const modality = () => {
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
    let emptymodality = {
        id: null,
        descripcion: '',
        estado: 'A',

    };



     // reportes

     const getPdf = async () => {
        const response =  await ModalityService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data ], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    const [checkboxValue, setCheckboxValue] = useState([]);

 

    const [isChecked, setIsChecked] = useState(false);
    const [estado, setEstado] = useState(null);
    const [products, setProducts] = useState(null);//borrar
    const [modalitys, setModalitys] = useState(null);///lista de los modalitys
    const [titlemodality,setTitlemodality]=useState('');


    
    const [modalityDialog, setModalityDialog] = useState(false);//cabecera del modal
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteModalityDialog, setDeleteModalityDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [modality, setModality] = useState(emptymodality);//estado de los  campos del modalitys
    const [selectedProducts, setSelectedProducts] = useState(null);//BORRAR
    const [SelectedModalitys, setSelectedModalitys] = useState(null);// AUN NO SE
    const [submitted, setSubmitted] = useState(false);
    const [flagmodality, setFlagmodality] = useState(false);
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
        async function fetchDatamodality() {
            const res = await ModalityService.list();
                setModalitys(res.data)
            } 
            fetchDatamodality();  
    }, [flagmodality]);
    // -----------------------------------

   


    const crear = async (data) => {
       
        const res = await ModalityService.create(data);
    
    }

    const update = async (id,data)=> {
       
        const res = await ModalityService.update(id,data);
    
    }
    const eliminar = async (id)=> {
       
        const res = await ModalityService.eliminar(id);
    
    }
  
    
   
    const openNew = () => {
        setModality(emptymodality);
        setEstado(false);
        setSubmitted(false);
        setModalityDialog(true);
        var estate_modality='A';
        setCheckboxValue([estate_modality]);
        setTitlemodality('NUEVA MODALIDAD');
    }


    const hideDialog = () => {
        setEstado(false);
        setSubmitted(false);
        setModalityDialog(false);
    }

    const hideDeleteModalityDialog = () => {
        setDeleteModalityDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const savemodality = () => {
        setSubmitted(true);
        
         if (modality.descripcion.trim()) {
            let _modalitys = [...modalitys];
            let _modality = { ...modality };
            if (modality.id) {
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'modalidad modificada', life: 3000 });
                update(modality.id,_modality);
            }
            else {
                _modality.id = "";
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'modalidad Creada', life: 3000 });
                crear(_modality);
            }
            setCheckboxValue([]);
            setModalitys(_modalitys);
            setModalityDialog(false);
            setModality(emptymodality);
            setFlagmodality(_modality);

        }
    }
   
    const editmodality = (modality) => {
 
        setModality({ ...modality });
        setModalityDialog(true);
        let _modality = { ...modality};
        var estate_modality=_modality["estado"];
     
        setCheckboxValue([estate_modality]);
        setTitlemodality('EDITAR MODALIDAD')
     
        
    }


    

    const confirmDeletemodality = (modality) => {
        setModality(modality);
        setDeleteModalityDialog(true);

    }
    const deleteSelectedProducts = () => {
        let _modalitys = products.filter(val => !selectedProducts.includes(val));
        setModalitys(_modalitys);
        setDeleteModalityDialog(false);
        setSelectedModalitys(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }
    const deletemodality = () => {
        eliminar(modality.id);
        let _modalitys = modalitys.filter(val => val.id !== modality.id);
        setModalitys(_modalitys);
        setDeleteModalityDialog(false);
        setModality(emptymodality);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'modalidad Elimiminado', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < modalitys.length; i++) {
            if (modalitys[i].id === id) {
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
        
        let _modality = { ...modality};
        
        _modality[`${name}`] = val;
       
        setModality(_modality);
    }

    const onCheckboxChange = (e) => {
        setCheckboxValue([]);
        let selectedValue = [...checkboxValue];
        if (e.checked)
            selectedValue.push(e.value);
        else
            selectedValue.splice(selectedValue.indexOf(e.value), 1);
       
        setCheckboxValue(selectedValue);
        var state_modality='I';
        if (e.checked){
            state_modality='A';
        }
       
        
        let _modality = { ...modality };
        _modality["estado"] =state_modality ;
        setModality(_modality);
      
    };

    // const onCheckboxChange = (e) => {
    //     let _modality = [...modalitys];
    //     if (e.checked)
    //              _modality.push(e.modality);
    //     else
    //              _modality.splice(_modality.indexOf(estado), 1);
    //         setModality(_modality);
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
                    <Button label="NUEVA MODALIDAD" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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
    const estadoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">status_description</span>
                {rowData.status_description}
            </>
        );
    }
    const modalityBodyTemplate = (rowData) => {
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editmodality(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeletemodality(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTRAR MODALIDAD</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search"   onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span> 
        </div>
    );

  
    const modalityDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={savemodality} />
        </>
    );
    const deleteModalityDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteModalityDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deletemodality} />
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

                    <DataTable ref={dt} value={modalitys} selection={SelectedModalitys} onSelectionChange={(e) => setSelectedModalitys(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} modalidades"
                        // Modificado para que se pueda filtrar 
                        globalFilter={globalFilter} emptyMessage="No existe modalidades." header={header} responsiveLayout="scroll">
                        
                        <Column field="descripcion" header="MODALIDAD" sortable body={modalityBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="status_description" header="ESTADO" sortable body={estadoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}>
                        </Column>
                       
                        <Column body={actionBodyTemplate}></Column>
                        
                           
                    </DataTable>
                    
                    <Dialog visible={modalityDialog} style={{ width: '450px' }} header={titlemodality} modal className="p-fluid" footer={modalityDialogFooter} onHide={hideDialog}>
                        
                        <div className="field">
                            <label htmlFor="descripcion">MODALIDAD</label>
                            <InputText id="descripcion" value={modality.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !modality.descripcion })} />
                            {submitted && !modality.descripcion && <small className="p-invalid">modalidad es requerido.</small>}
                        </div>
                        <label htmlFor="estado">ESTADO</label>
                        <div className="col-12 md:col-4">
                            <div className="field-checkbox">
                            <Checkbox  inputId="checkOption1" name="estado" value='A' checked={checkboxValue.indexOf('A') !== -1} onChange={onCheckboxChange} />  
                           </div>
                            {submitted && !modality.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                    </Dialog>

                    

                    <Dialog visible={deleteModalityDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteModalityDialogFooter} onHide={hideDeleteModalityDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {modality && <span>Estás seguro de que quieres eliminar la modalidad <b>{modality.descripcion}</b>?</span>}
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

export default React.memo(modality, comparisonFn);