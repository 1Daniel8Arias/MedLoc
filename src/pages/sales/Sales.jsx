import "./Sales.css"
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";

function Sales(){
    return(
        <div className="sales">
             <Sidebar/>
            <div className="sales__main">
                <Header titulo="Punto de ventas" />
                <main className="sales__content">
                    <div className="seller">
                        <h2>Nueva Venta</h2>
                        <h3>Selecciona productos para calcular el total del cliente</h3>
                    </div>
                    <div className="ticket">
                        <div className="ticket__header">
                            <div>
                                <h2>TICKET DEL CLIENTE</h2>
                                <h2>Carrito de compra</h2>

                            </div>
                            <div>
                                <h3>0 productos</h3>
                            </div>


                        </div>



                    </div>
                </main>

            </div>
        </div>
    );
}

export default Sales;