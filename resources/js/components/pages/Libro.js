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
import LibroService from "../service/LibroService";
import SeccionService from "../service/SeccionService";
import { Dropdown } from 'primereact/dropdown';

const Libro = () => {

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

    let emptyLibro = {
        id: null,
        descripcion: '',
        idseccion: null,
        estado: 'A',
    };




    // reportes
    const getPdf = async () => {
        const response = await LibroService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    // fin reportes

    const [checkboxValue, setCheckboxValue] = useState([]);

    const [products, setProducts] = useState(null);//borrar
    const [libros, setLibros] = useState(null);///lista de los perfiles

    const [libroDialog, setLibroDialog] = useState(false);//cabecera del modal
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteLibroDialog, setDeleteLibroDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [libro, setLibro] = useState(emptyLibro);//estado de los  campos del perfil
    const [selectedProducts, setSelectedProducts] = useState(null);//BORRAR
    const [selectedLibros, setSelectedLibros] = useState(null);// AUN NO SE

    const [titleLibro, setTitleLibro] = useState(''); // nuevo
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [listSeccion, setListSeccion] = useState(null);
    const [flagLibro, setFlagLibro] = useState(null);
    const [seccion, setSeccion] = useState(null);
    
    
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setProducts(data));
    }, []);

    useEffect(() => {
        async function fetchDataLibro() {
            const res = await LibroService.list();
            setLibros(res.data)
        }
        fetchDataLibro();
    }, [flagLibro]);

    useEffect(() => {
        async function fetchDataSeccion() {
            const res = await SeccionService.seccion_active();
            setListSeccion(res.data)
        }
        fetchDataSeccion();
    }, []);


  
    const crear = async (_libro, _libros) => {
        const res = await LibroService.create(_libro);
      
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
            _libro.id = "";
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Libro creado', life: 3000 });
            setCheckboxValue([]);
            setLibros(_libros);
            setLibroDialog(false);
            setLibro(emptyLibro);
            setFlagLibro(_libro);
        }


        return res;
    }

    
    const update = async (id, _libro, _libros) => {
        const res = await LibroService.update(id, _libro);
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
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Libro Modificado', life: 3000 });
            setCheckboxValue([]);
            setLibros(_libros);
            setLibroDialog(false);
            setLibro(emptyLibro);
            setFlagLibro(_libro);
        }

    }
    const eliminar = async (id) => {
        const res = await LibroService.eliminar(id);
    }

    const openNew = () => {
        setLibro(emptyLibro);
        setSeccion(false);
        setSubmitted(false);
        setLibroDialog(true);
        var estate_libro = 'A';
        setCheckboxValue([estate_libro]);
        setTitleLibro('NUEVO LIBRO');
    }

    const hideDialog = () => {
        setSubmitted(false);
        setLibroDialog(false);
    }

    const hideDeleteLibroDialog = () => {
        setDeleteLibroDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveLibro = () => {
        setSubmitted(true);

        if (libro.descripcion.trim()) {
            let _libros = [...libros];
            let _libro = { ...libro };
            if (libro.id) {
                update(libro.id, _libro,_libros);
            }
            else {
           
                crear(_libro,_libros);
            }

        }
    }


    const editLibro = (libro) => {
        let arrayFilter = listSeccion.filter(e => e.id == libro.idseccion);
        setSeccion(arrayFilter[0]);
        setLibro({ ...libro });
        setLibroDialog(true);
        let _libro = { ...libro };
        var estate_libro = _libro["estado"];
        setCheckboxValue([estate_libro]);
        setTitleLibro('EDITAR LIBRO')

    }




    const confirmDeleteLibro = (libro) => {
        setLibro(libro);
        setDeleteLibroDialog(true);

    }


    const deleteSelectedProducts = () => {
        let _libros = products.filter(val => !selectedProducts.includes(val));
        setLibros(_libros);
        setDeleteLibroDialog(false);
        setSelectedLibros(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    const deleteLibro = () => {
        eliminar(libro.id);
        let _libros = libros.filter(val => val.id !== libro.id);
        setLibros(_libros);
        setDeleteLibroDialog(false);
        setLibro(emptyLibro);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'libro Elimiminado', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < libros.length; i++) {
            if (libros[i].id === id) {
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

        let _libro = { ...libro };

        _libro[`${name}`] = val;

        setLibro(_libro);


    }
    const onInputSelect = (val, name) => {
        setSeccion(val);
        let _libro = { ...libro };

        _libro[`${name}`] = val.id;

        setLibro(_libro);
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
        var state_libro = 'I';
        console.log(selectedValue);
        if (e.checked) {
            state_libro = 'A';
        }


        let _libro = { ...libro };
        _libro["estado"] = state_libro;
        setLibro(_libro);

    };

    // 

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="NUEVO LIBRO" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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
                <span className="p-column-title">Libro</span>
                {rowData.descripcion}
            </>
        );
    }
    const seccionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Seccion</span>
                {rowData.seccion}
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editLibro(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteLibro(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTRAR LIBRO</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );


    const libroDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveLibro} />
        </>
    );

    const deleteLibroDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteLibroDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteLibro} />
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

                    <DataTable ref={dt} value={libros} selection={selectedLibros} onSelectionChange={(e) => setSelectedLibros(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} libros"
                        globalFilter={globalFilter} emptyMessage="No existen libros." header={header} responsiveLayout="scroll">


                        <Column field="descripcion" header="LIBRO" sortable body={descripcionBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="seccion" header="SECCIÓN" sortable body={seccionBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="status_description" header="ESTADO" sortable body={estadoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}>
                        </Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={libroDialog} style={{ width: '450px' }} header={titleLibro} modal className="p-fluid" footer={libroDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="descripcion">LIBRO</label>
                            <InputText id="descripcion" value={libro.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !libro.descripcion })} />
                            {submitted && !libro.descripcion && <small className="p-invalid">descripcion es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">SECCIÓN</label>
                            <Dropdown value={seccion} onChange={(e) => onInputSelect(e.value, 'idseccion')} 
                            optionLabel="descripcion" options={listSeccion} placeholder="SELECCIONAR" required className={classNames({ 'p-invalid': submitted && !libro.idseccion })} />
                            {submitted && !libro.idseccion && <small className="p-invalid">Seccion es requerido.</small>}
                        </div>


                        <div className="col-12 md:col-4">
                        <label htmlFor="name">ESTADO</label>
                            <div className="field-checkbox">

                                <Checkbox inputId="checkOption1" name="estado" value='A' checked={checkboxValue.indexOf('A') !== -1} onChange={onCheckboxChange} />
                            </div>
                            {submitted && !libro.estado && <small className="p-invalid">Estado es requerido.</small>}
                        </div>
                    </Dialog>



                    <Dialog visible={deleteLibroDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteLibroDialogFooter} onHide={hideDeleteLibroDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {libro && <span>Estás seguro de que quieres eliminar el libro<b>{libro.descripcion}</b>?</span>}
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

export default React.memo(Libro, comparisonFn);