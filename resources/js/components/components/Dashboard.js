import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../service/ProductService';
import DenunciaService from "../service/DenunciaService";




const polarData = {
    datasets: [{
        data: [
            11,
            16,
            7,
            3,
            14
        ],
        backgroundColor: [
            "#FF6384",
            "#4BC0C0",
            "#FFCE56",
            "#E7E9ED",
            "#36A2EB"
        ],
        label: 'My dataset'
    }],
    labels: [
        "Red",
        "Green",
        "Yellow",
        "Grey",
        "Blue"
    ]
};



const doughnutData = {
    labels: ['A', 'B', 'C'],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }
    ]
};

const radarData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ]
};


const Dashboard = (props) => {
    const [products, setProducts] = useState(null);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null)
    const [barOptions, setBarOptions] = useState(null)
    const [pieOptions, setPieOptions] = useState(null)
    const [dataHeader, setDataHeader] = useState(null)
    const [totalComplaint, setTotalComplaint] = useState(0)
    const [totalComplaintDay, setTotalComplaintDay] = useState(0)
    const [totalComplaintArma, setTotalComplaintArma] = useState(0)
    const [totalComplaintDayArma, setTotalComplaintDayArma] = useState(0)
    const [totalComplaintEspecie, setTotalComplaintEspecie] = useState(0)
    const [totalComplaintDayEspecie, setTotalComplaintDayEspecie] = useState(0)
    const [totalComplaintVehiculo, setTotalComplaintVehiculo] = useState(0)
    const [totalComplaintDayVehiculo, setTotalComplaintDayVehiculo] = useState(0)
    const [dataForMonths, setDataForMonths] = useState([])
    const [dateForMonths, setDateForMonths] = useState([])
    const [dataForYear, setDataForYear] = useState([])
    const [dateForYear, setDateForYear] = useState([])
    const [colorModality, setcolorModality] = useState([])
    const [dataModality, setDataModality] = useState([])
    const [nameModality, setNameModality] = useState([])

    const [polarOptions, setPolarOptions] = useState(null)
    const [radarOptions, setRadarOptions] = useState(null)

    const lineData = {
        labels: dateForMonths,
        datasets: [
            {
                label: 'Denuncias',
                data: dataForMonths,
                fill: false,
                backgroundColor: '#00bb7e',
                borderColor: '#00bb7e',
                tension: .4
            }
        ]
    };
    const barData = {
        labels: dateForYear,
        datasets: [

            {
                label: 'Denuncias',
                backgroundColor: '#00bb7e',
                data: dataForYear
            }
        ]
    };
    const pieData = {

        labels: nameModality,
        datasets: [
            {
                data: dataModality,
                backgroundColor: colorModality,
                hoverBackgroundColor: colorModality,
            }
        ]
    };
    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };

        const barOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };

        const pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            }
        };

        const polarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        const radarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions)
        setBarOptions(barOptions)
        setPieOptions(pieOptions)
        setPolarOptions(polarOptions)
        setRadarOptions(radarOptions)

    }

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };

        const barOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };

        const pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            }
        };

        const polarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        const radarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions)
        setBarOptions(barOptions)
        setPieOptions(pieOptions)
        setPolarOptions(polarOptions)
        setRadarOptions(radarOptions)
    }

    useEffect(() => {
        if (props.colorMode === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [props.colorMode]);


    useEffect(() => {
        const productService = new ProductService();
        productService.getProductsSmall().then(data => setProducts(data));
    }, []);

    useEffect(() => {
        async function fetchData() {
            const res = await DenunciaService.data_dashboard();
            
            setDataForMonths(res.total_complaint_data_months);
            setDateForMonths(res.total_complaint_months_months);

            setTotalComplaint(res.total_complaint);
            setTotalComplaintDay(res.total_complaint_day);

            setTotalComplaintArma(res.total_complaint_arma);
            setTotalComplaintDayArma(res.total_complaint_day_arma);

            setTotalComplaintEspecie(res.total_complaint_especie);
            setTotalComplaintDayEspecie(res.total_complaint_day_especie);

            setTotalComplaintVehiculo(res.total_complaint_vehiculo);
            setTotalComplaintDayVehiculo(res.total_complaint_day_vehiculo);

            setDataForYear(res.array_data_for_year);
            setDateForYear(res.array_year);

            setcolorModality(res.array_color_modality);
            setDataModality(res.array_data_modality);
            setNameModality(res.array_name_modality);

        }
        fetchData();
    }, []);

    useEffect(() => {
        if (props.colorMode === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [props.colorMode]);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (

        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total denuncias</span>
                            <div className="text-900 font-medium text-xl">{totalComplaint}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file-o text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{totalComplaintDay} nuevas </span>
                    <span className="text-500">Denuncias</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total vehículos</span>
                            <div className="text-900 font-medium text-xl">{totalComplaintVehiculo}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-car text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{totalComplaintDayVehiculo} nuevos </span>
                    <span className="text-500">Vehiculos</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total especies</span>
                            <div className="text-900 font-medium text-xl">{totalComplaintEspecie}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-tablet text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{totalComplaintDayEspecie} nuevas </span>
                    <span className="text-500">Especies</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Armas</span>
                            <div className="text-900 font-medium text-xl">{totalComplaintArma}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shield text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{totalComplaintDayArma} nuevas </span>
                    <span className="text-500">Armas</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 ">
                <div className="card">
                    <h5>Denuncias por meses</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>

               

            </div>
            <div className="col-12 lg:col-6">
                <div className="card">
                    <h5>Denuncias por año</h5>
                    <Chart type="bar" data={barData} options={barOptions} />
                </div>
            </div>
            <div className="col-12 lg:col-12 ">
                

                <div className="card flex flex-column align-items-center">
                    <h5>Denuncias por modalidad</h5>
                    <Chart type="pie" data={pieData} options={pieOptions} style={{ width: '25%' }} />
                </div>

            </div>

        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Dashboard, comparisonFn);
