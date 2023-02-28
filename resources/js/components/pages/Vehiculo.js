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
import VehiculoService from "../service/VehiculoService";
import { Dropdown } from 'primereact/dropdown';
const Vehiculo = () => {
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
    let emptyVehiculo = {
        id: null,
        clase: '',
        marca: '',
        modelo: '',
        placa: '',
        situacion: '',
        estado: 'A',
    };
    const SITUATION = [
        { description: 'SELECCIONAR', id: '' },
        { description: 'ROBADO', id: 'R' },
        { description: 'ENCONTRADO', id: 'E' },
    ];

    // reportes
    const getPdf = async () => {
        const response = await VehiculoService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    // fin reportes

    const [checkboxValue, setCheckboxValue] = useState([]);

    const [products, setProducts] = useState(null);//borrar
    const [vehiculos, setVehiculos] = useState(null);///lista de los perfiles

    const [vehiculoDialog, setVehiculoDialog] = useState(false);//cabecera del modal
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteVehiculoDialog, setDeleteVehiculoDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [vehiculo, setVehiculo] = useState(emptyVehiculo);//estado de los  campos del perfil
    const [selectedProducts, setSelectedProducts] = useState(null);//BORRAR
    const [selectedVehiculos, setSelectedVehiculos] = useState(null);// AUN NO SE

    const [titleVehiculo, setTitleVehiculo] = useState(''); // nuevo
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [situation, setSituation] = useState(false);

    const [flagVehiculo, setFlagVehiculo] = useState(false);

    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setProducts(data));
    }, []);

    useEffect(() => {
        async function fetchDataVehiculo() {
            const res = await VehiculoService.list();
            setVehiculos(res.data)
        }
        fetchDataVehiculo();
    }, [flagVehiculo]);

    const crear = async (_vehiculo, _vehiculos) => {
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
            setVehiculos(_vehiculos);
            setVehiculoDialog(false);
            setVehiculo(emptyVehiculo);
            setFlagVehiculo(_vehiculo);

        }


        return res;
    }


    const update = async (id, _vehiculo, _vehiculos) => {
        const res = await VehiculoService.update(id, _vehiculo);
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
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Vehiculo Modificado', life: 3000 });

            setCheckboxValue([]);
            setVehiculos(_vehiculos);
            setVehiculoDialog(false);
            setVehiculo(emptyVehiculo);
            setFlagVehiculo(_vehiculo);
        }

    }
    const eliminar = async (id) => {

        const res = await VehiculoService.eliminar(id);

    }


    const openNew = () => {
        setVehiculo(emptyVehiculo);
        setSubmitted(false);
        setVehiculoDialog(true);
        setSituation(false);
        var estate_vehiculo = 'A';
        setCheckboxValue([estate_vehiculo]);
        setTitleVehiculo('NUEVO VEHÍCULO');
    }

    const hideDialog = () => {
        setSubmitted(false);
        setVehiculoDialog(false);
    }

    const hideDeleteVehiculoDialog = () => {
        setDeleteVehiculoDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
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
                // _vehiculos.push(_vehiculo);
                crear(_vehiculo, _vehiculos);
            }

        }
    }


    const editVehiculo = (vehiculo) => {
        let arrayFilterSituation = SITUATION.filter(e => e.id == vehiculo.situacion);
        setSituation(arrayFilterSituation[0]);

        setVehiculo({ ...vehiculo });
        setVehiculoDialog(true);

        let _vehiculo = { ...vehiculo };
        var estate_vehiculo = _vehiculo["estado"];

        setCheckboxValue([estate_vehiculo]);
        setTitleVehiculo('EDITAR VEHÍCULO')
    }




    const confirmDeleteVehiculo = (vehiculo) => {
        setVehiculo(vehiculo);
        setDeleteVehiculoDialog(true);

    }


    const deleteSelectedProducts = () => {
        let _vehiculos = products.filter(val => !selectedProducts.includes(val));
        setVehiculos(_vehiculos);
        setDeleteVehiculoDialog(false);
        setSelectedVehiculos(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    const deleteVehiculo = () => {
        eliminar(vehiculo.id);
        let _vehiculos = vehiculos.filter(val => val.id !== vehiculo.id);
        setVehiculos(_vehiculos);
        setDeleteVehiculoDialog(false);
        setVehiculo(emptyVehiculo);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'vehiculo Elimiminado', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < vehiculos.length; i++) {
            if (vehiculos[i].id === id) {
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

        let _vehiculo = { ...vehiculo };

        _vehiculo[`${name}`] = val;

        setVehiculo(_vehiculo);


    }
    const onInputSelectSituation = (val, name) => {
        setSituation(val);

        let _vehiculo = { ...vehiculo };

        _vehiculo[`${name}`] = val.id;

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
        var state_vehiculo = 'I';
        if (e.checked) {
            state_vehiculo = 'A';
        }


        let _vehiculo = { ...vehiculo };
        _vehiculo["estado"] = state_vehiculo;
        setVehiculo(_vehiculo);

    };

    // 

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="NUEVO VEHÍCULO" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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



    const claseBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">clase</span>
                {rowData.clase}
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
    const placaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Placa</span>
                {rowData.placa}
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



    // ----------------------------------------------------------------



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editVehiculo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteVehiculo(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTRAR VEHÍCULO</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );


    const vehiculoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveVehiculo} />
        </>
    );

    const deleteVehiculoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteVehiculoDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteVehiculo} />
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

                    <DataTable ref={dt} value={vehiculos} selection={selectedVehiculos} onSelectionChange={(e) => setSelectedVehiculos(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} vehículos"
                        globalFilter={globalFilter} emptyMessage="No existen vehículos" header={header} responsiveLayout="scroll">

                        <Column field="clase" header="CLASE VEHÍCULO" sortable body={claseBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="marca" header="MARCA" sortable body={marcaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="modelo" header="MODELO" sortable body={modeloBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="placa" header="PLACA" sortable body={placaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="situation_description" header="SITUACIÓN" sortable body={situacionBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="status_description" header="ESTADO" sortable body={estadoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}>
                        </Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={vehiculoDialog} style={{ width: '450px' }} header={titleVehiculo} modal className="p-fluid" footer={vehiculoDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="clase">CLASE VEHÍCULO</label>
                            <InputText id="clase" value={vehiculo.clase} onChange={(e) => onInputChange(e, 'clase')} required autoFocus className={classNames({ 'p-invalid': submitted && !vehiculo.clase })} />
                            {submitted && !vehiculo.clase && <small className="p-invalid">vehiculo es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="marca">MARCA</label>
                            <InputText id="marca" value={vehiculo.marca} onChange={(e) => onInputChange(e, 'marca')} className={classNames({ 'p-invalid': submitted && !vehiculo.marca })} />
                            {submitted && !vehiculo.marca && <small className="p-invalid">marca es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="modelo">MODELO</label>
                            <InputText id="modelo" value={vehiculo.modelo} onChange={(e) => onInputChange(e, 'modelo')} className={classNames({ 'p-invalid': submitted && !vehiculo.modelo })} />
                            {submitted && !vehiculo.modelo && <small className="p-invalid">Modelo es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="placa">PLACA</label>
                            <InputText id="placa" value={vehiculo.placa} onChange={(e) => onInputChange(e, 'placa')} className={classNames({ 'p-invalid': submitted && !vehiculo.placa })} />
                            {submitted && !vehiculo.placa && <small className="p-invalid">Placa es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="documento">SITUACIÓN VEHÍCULO</label>
                            <Dropdown value={situation} onChange={(e) => onInputSelectSituation(e.value, 'situacion')}
                                options={SITUATION} optionLabel="description" placeholder="Seleccionar" />
                            {submitted && !vehiculo.situacion &&
                                <small className="p-invalid">Situación es requerido.</small>}

                        </div>
                        <div className="col-12 md:col-4">
                            <label htmlFor="clase">ESTADO</label>
                            <div className="field-checkbox">
                                <Checkbox inputId="checkOption1" name="estado" value='A' checked={checkboxValue.indexOf('A') !== -1} onChange={onCheckboxChange} />
                            </div>
                            {submitted && !vehiculo.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                    </Dialog>



                    <Dialog visible={deleteVehiculoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteVehiculoDialogFooter} onHide={hideDeleteVehiculoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {vehiculo && <span>¿Estás seguro de que quieres eliminar el vehiculo<b>{vehiculo.clase}</b>?</span>}
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

export default React.memo(Vehiculo, comparisonFn);