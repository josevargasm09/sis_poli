import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProductService } from '../service/ProductService';
import UsuarioService from "../service/UsuarioService";
import PerfilService from "../service/PerfilService";
import ComisariaService from "../service/ComisariaService";
const Usuario = () => {
   

    let emptyUsuario = {
        id: null,
        name: '',
        dni: '',
        apellido: '',
        usuarioCip: '',
        email: '',
        password: '',
        celular: '',
        idperfil:'',
        comisaria:'',
        
    };

   
    // reportes
    const getPdf = async () => {
        const response = await UsuarioService.getPdf(globalFilter);
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        window.open(url, "_blank");
    }

    // fin reportes

    const listboxValues = [
        { name: 'SELECCIONAR', code: '' },
        { name: 'ADMINISTRADOR', code: '1' },
        { name: 'ASIMILADO', code: '2' },
        { name: 'EFECTIVO', code: '3' },
        { name: 'EDITOR', code: '4' },
        { name: 'POSTULANTE', code: '5' }
    ];
    let listperfiles;
    const [flagUser, setFlagUser] = useState('');

    const [usuario, setUsuario] = useState(emptyUsuario);
    const [usuarios, setUsuarios] = useState(null);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [selectedUsuarios, setSelectedUsuarios] = useState(null);
    const [listboxValue, setListboxValue] = useState(null);
    const [perfil, setPerfil] = useState(null);
    const [listperfils, setListperfils] = useState(null);
    const [listComisarias, setListComisarias] = useState(null);
    const [comisaria, setComisaria] = useState(null);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);


    const [products, setProducts] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [titleUsuario, setTitleUsuario] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setProducts(data));
    }, []);

    useEffect(() => {
        async function fetchDataUsuario() {
            const res = await UsuarioService.list();
            setUsuarios(res.data)
        }
        fetchDataUsuario();
    }, [flagUser]);

    useEffect(() => {
        async function fetchDataPerfil() {
            const res = await PerfilService.list();
            setListperfils(res.data)
        }
        fetchDataPerfil();
    }, [perfil]);

    useEffect(() => {
        async function fetchDataComisaria() {
            const res = await ComisariaService.list();
            setListComisarias(res.data)
        }
        fetchDataComisaria();
    }, []);


    
    const update = async (id, _usuario, _usuarios) => {
        const res = await UsuarioService.update(id, _usuario);
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
            const index = findIndexById(id);
            _usuarios[index] = _usuario;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Usuario Modificado', life: 3000 });
            setUsuarios(_usuarios);
            setUsuarioDialog(false);
            setUsuario(emptyUsuario);
            setFlagUser(_usuario);
        }

    }

    const eliminar = async (id) => {

        const res = await UsuarioService.eliminar(id);

    }
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
  
    const openNew = () => {

        setUsuario(emptyUsuario);
        setComisaria(false);
        setPerfil(false);
        setSubmitted(false);
        setUsuarioDialog(true);
        setTitleUsuario('NUEVO USUARIO');

    }

   
    const hideDialog = () => {
        setPerfil(false);
        setSubmitted(false);
        setUsuarioDialog(false);
    }

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    }

    
    const onInputDniChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let regex = new RegExp("^[0-9]+$");
        // let regex = new RegExp("^[a-zA-Z ]+$");
        if (regex.test(val) || val == '') {
            let _usuario = { ...usuario };
            _usuario[`${name}`] = val;

            setUsuario(_usuario);
        }

    }
    const crear = async (_usuario, _usuarios) => {
        const res = await UsuarioService.create(_usuario);
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
            _usuario.id = "";
            _usuarios.push(_usuario);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Usuario Creado', life: 3000 });
            setUsuarios(_usuarios);
            setUsuarioDialog(false);
            setUsuario(emptyUsuario);
            setFlagUser(_usuario);
        }


        return res;
    }
    const saveUsuario = () => {
        setSubmitted(true);
        let _usuarios = [...usuarios];
        let _usuario = { ...usuario };
        if (usuario.id) {
            update(usuario.id, _usuario, _usuarios);
        }else {
            crear(_usuario, _usuarios);
        }


    }
    



    const editUsuario = (usuario) => {
        let arrayFilter = listperfils.filter(e => e.idperfil == usuario.idperfil);
        let arrayFilterComisaria = listComisarias.filter(e => e.id == usuario.comisaria);
        setPerfil(arrayFilter[0]);
        setComisaria(arrayFilterComisaria[0]);
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
        setTitleUsuario('EDITAR USUARIO');
    }

    const confirmDeleteUsuario = (usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    }

    const deleteUsuario = () => {
        eliminar(usuario.id);
        let _usuarios = usuarios.filter(val => val.id !== usuario.id);
        setUsuarios(_usuarios);
        setDeleteUsuarioDialog(false);
        setUsuario(emptyUsuario);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Usuario Eliminado', life: 3000 });

    }


    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    

    

    

   

    

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _usuario = { ...usuario };
        _usuario[`${name}`] = val;

        setUsuario(_usuario);
    }
    const onInputSelect = (val, name) => {
        setPerfil(val);
        let _usuario = { ...usuario };
        _usuario[`${name}`] = val.idperfil;
        setUsuario(_usuario);

    }
    const onInputSelectComisaria = (val, name) => {
        setComisaria(val);
        let _usuario = { ...usuario };
        _usuario[`${name}`] = val.id;
        setUsuario(_usuario);

    }

    
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="NUEVO USUARIO" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
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

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.name}
            </>
        );
    }
    const apellidoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellido</span>
                {rowData.apellido}
            </>
        );
    }
    const dniBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Dni</span>
                {rowData.dni}
            </>
        );
    }
    const usuarioCipBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Usuario CIP</span>
                {rowData.usuarioCip}
            </>
        );
    }

    const celularBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Celular</span>
                {rowData.celular}
            </>
        );
    }

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Correo</span>
                {rowData.email}
            </>
        );
    }

  

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    }

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    }

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readonly cancel={false} />
            </>
        );
    }

  

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteUsuario(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">ADMINISTRAR USUARIO</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveUsuario} />
        </>
    );
    const deleteUsuarioDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsuarioDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteUsuario} />
        </>
    );
    

    return (

        <div className="grid crud-demo">

            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={usuarios} selection={selectedUsuarios} onSelectionChange={(e) => setSelectedUsuarios(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando  {first} a {last} de {totalRecords} usuarios"
                        globalFilter={globalFilter} emptyMessage="No existen usuarios" header={header} responsiveLayout="scroll">

                        { /* checkbox  */}
                        

                        <Column field="name" header="NOMBRE" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="apellido" header="APELLIDO" sortable body={apellidoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="dni" header="DNI" sortable body={dniBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="usuarioCip" header="USUARIO CIP" sortable body={usuarioCipBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="email" header="CORREO" sortable body={emailBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column field="celular" header="CELULAR" sortable body={celularBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>

                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={usuarioDialog} style={{ width: '450px' }} header={titleUsuario} modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">PERFIL</label>
                            <Dropdown value={perfil} onChange={(e) => onInputSelect(e.value, 'idperfil')} optionLabel="descripcion" autoFocus options={listperfils} placeholder="SELECCIONAR" required className={classNames({ 'p-invalid': submitted && !usuario.idperfil })} />
                            {submitted && !usuario.idperfil && <small className="p-invalid">Perfil es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">COMISARÍA</label>
                            <Dropdown value={comisaria} onChange={(e) => onInputSelectComisaria(e.value, 'comisaria')} optionLabel="nom_comisaria" autoFocus options={listComisarias} placeholder="SELECCIONAR" required className={classNames({ 'p-invalid': submitted && !usuario.comisaria })} />
                            {submitted && !usuario.comisaria && <small className="p-invalid">Comisaría es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">NOMBRES</label>
                            <InputText id="name" value={usuario.name} onChange={(e) => onInputChange(e, 'name')} required className={classNames({ 'p-invalid': submitted && !usuario.name })} />
                            {submitted && !usuario.name && <small className="p-invalid">Nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="apellido">APELLIDOS</label>
                            <InputText id="apellido" value={usuario.apellido} onChange={(e) => onInputChange(e, 'apellido')} required className={classNames({ 'p-invalid': submitted && !usuario.apellido })} />
                            {submitted && !usuario.apellido && <small className="p-invalid">Apellidos es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="dni">DNI</label>
                            <InputText id="dni" maxLength="8" value={usuario.dni} onChange={(e) => onInputDniChange(e, 'dni')} required className={classNames({ 'p-invalid': submitted && !usuario.dni })} />
                            {submitted && !usuario.dni && <small className="p-invalid">Dni es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="usuarioCip">USUARIO CIP</label>
                            <InputText id="usuarioCip" maxLength="7" value={usuario.usuarioCip} onChange={(e) => onInputChange(e, 'usuarioCip')} required className={classNames({ 'p-invalid': submitted && !usuario.usuarioCip })} />
                            {submitted && !usuario.usuarioCip && <small className="p-invalid">Usuario es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="password">CONTRASEÑA</label>
                            <Password id="password" value={usuario.password} onChange={(e) => onInputChange(e, 'password')} required className={classNames({ 'p-invalid': submitted && !usuario.password })} />
                            {submitted && !usuario.password && <small className="p-invalid">Usuario es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">CORREO</label>
                            <InputText id="email" value={usuario.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !usuario.email })} />
                            {submitted && !usuario.email && <small className="p-invalid">Correo es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="celular">CELULAR</label>
                            <InputText id="celular" maxLength="9" value={usuario.celular} onChange={(e) => onInputChange(e, 'celular')} required className={classNames({ 'p-invalid': submitted && !usuario.name })} />
                            {submitted && !usuario.celular && <small className="p-invalid">Celular es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Estás seguro de que quieres eliminar el usuario <b>{usuario.name}</b>?</span>}
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

export default React.memo(Usuario, comparisonFn);
