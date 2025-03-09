import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../css/paymentSuccessPage.css";

const PaymentSuccessPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const location = useLocation();
    const navigate = useNavigate();

    const orderDetails = location.state?.orderDetails || null;
    const totalWithGST = location.state?.totalWithGST || 0;

    useEffect(() => {
        if (!orderDetails) {
            console.warn("No order details found. Redirecting...");
            navigate("/");
        }
    }, [orderDetails, navigate]);

    if (!orderDetails) {  
        return <p>Loading order details...</p>; 
    }

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.text("Invoice", 105, 15, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.text(`Order ID: ${orderDetails.orderId || "N/A"}`, 15, 30);
        doc.text(`Total Paid: ₹${totalWithGST.toFixed(2)}`, 15, 40);
        doc.text(`Email Sent To: ${orderDetails.purchases[0]?.email || "Not Available"}`, 15, 50);

        const tableColumn = ["Product Name", "Quantity"];
        const tableRows = [];

        orderDetails.purchases.forEach((purchase) => {
            purchase.products.forEach((product) => {
                tableRows.push([product.productname, product.quantity]);
            });
        });

        doc.autoTable({
            startY: 60,
            head: [tableColumn],
            body: tableRows,
            theme: "grid",
        });

        doc.save(`Invoice_${orderDetails.orderId || "Order"}.pdf`);
    };

    return (
        <div className="payment-success-container">
            <h1>🎉 Payment Successful!</h1>
            <p>Your order has been placed successfully.</p>

            <div className="order-summary">
                <h2>Order Summary</h2>
                <p><strong>Order ID:</strong> {orderDetails.orderId || "N/A"}</p>
                <p><strong>Total Paid:</strong> ₹{totalWithGST.toFixed(2)}</p>
                <p><strong>Email Sent To:</strong> {orderDetails.purchases[0]?.email || "Not Available"}</p>

                <h3>Products Ordered:</h3>
                <ul>
                    {orderDetails.purchases.map((purchase, index) => (
                        <li key={index}>
                            {purchase.products.map((product, i) => (
                                <p key={i}>
                                    {product.productname} x {product.quantity}
                                </p>
                            ))}
                        </li>
                    ))}
                </ul>

                <button onClick={generatePDF}>📄 Download Invoice</button>
                <button onClick={() => navigate("/")}>🏠 Back to Home</button>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
