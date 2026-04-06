import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReceipt = (booking) => {
    const doc = new jsPDF();
    const primaryColor = [79, 70, 229]; // Indigo

    // Header ... (same as before)
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DINESH BARTAN BHANDAR', 15, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Quality Bartan Rent par uplabdh hain', 15, 32);
    doc.text('Date: ' + new Date().toLocaleDateString(), 160, 25);

    // Business Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('INVOICE / RECEIPT', 15, 55);
    doc.setLineWidth(0.5);
    doc.line(15, 57, 60, 57);

    // Customer & Booking Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS:', 15, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${booking.user?.name || 'Manual Booking'}`, 15, 78);
    doc.text(`Mobile: ${booking.user?.mobile || 'N/A'}`, 15, 84);
    doc.text(`Village: ${booking.village || 'N/A'}, Post: ${booking.post || 'N/A'}`, 15, 90);
    doc.text(`Thana: ${booking.thana || 'N/A'}, Dist: ${booking.district || 'N/A'}`, 15, 96);

    doc.setFont('helvetica', 'bold');
    doc.text('BOOKING DETAILS:', 120, 70);
    doc.setFont('helvetica', 'normal');
    const orderId = booking._id ? booking._id.slice(-6).toUpperCase() : 'N/A';
    doc.text(`Order ID: #${orderId}`, 120, 78);
    doc.text(`Start Date: ${new Date(booking.startDate).toLocaleDateString()}`, 120, 84);
    doc.text(`End Date: ${new Date(booking.endDate).toLocaleDateString()}`, 120, 90);

    // Table
    const tableData = booking.items.map(item => [
        item.name || (item.utensil?.name) || 'Unknown Item',
        item.quantity,
        `Rs. ${item.pricePerDay}`,
        `Rs. ${item.pricePerDay * item.quantity}`
    ]);

    autoTable(doc, {
        startY: 105,
        head: [['Item Name', 'Qty', 'Price / Day', 'Subtotal']],
        body: tableData,
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 255] },
        margin: { left: 15, right: 15 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Totals
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: Rs. ${booking.totalPrice}`, 140, finalY + 10);
    doc.text(`Advance Paid: Rs. ${booking.advance || 0}`, 140, finalY + 16);
    doc.setFillColor(240, 240, 240);
    doc.rect(135, finalY + 20, 60, 10, 'F');
    doc.text(`Balance Due: Rs. ${booking.totalPrice - (booking.advance || 0)}`, 140, finalY + 26);

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`, 15, finalY + 10);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('** Terms: Bartan saaf wapas karein. Damage hone par extra charge lagega.', 15, finalY + 30);
    doc.text('Thank you for choosing Dinesh Bartan Bhandar!', 70, 285);

    doc.save(`Receipt_${booking._id.slice(-6)}.pdf`);
};
