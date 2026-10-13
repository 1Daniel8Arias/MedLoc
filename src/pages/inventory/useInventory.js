function useInventory(){
    const statistics=[

{
    id:1,
    medicamento: "Acetaminofén 500mg",
    categoria:"medicamneto",
    stockActual: 48,
    estado: "diponible",
    precioUnitario: 3200
},{
      id:2,
    medicamento: "Ibuprofeno 400mg",
    categoria:"medicamneto",
    stockActual: 4,
    estado: "diponible",
    precioUnitario: 5200
},{
      id:3,
    medicamento: "Losartán 50mg",
    categoria:"medicamneto",
    stockActual: 8,
    estado: "diponible",
    precioUnitario: 9200
},{
      id:4,
    medicamento: "Omeprazol 20mg",
    categoria:"medicamneto",
    stockActual: 16,
    estado: "diponible",
    precioUnitario: 4500
}
    ]
     return {
    statistics,
  };
}

export default useInventory;