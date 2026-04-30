import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  // Shop Header
  doc.setFontSize(22);
  doc.setTextColor(26, 26, 26);
  doc.text('SAURABH PROVISION & STATIONERY', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Premium Grocery & Stationery Shop', 105, 26, { align: 'center' });
  doc.text('Malegaon, Maharashtra | +91 97666 89821', 105, 31, { align: 'center' });

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 38, 190, 38);

  // Order Info
  doc.setFontSize(12);
  doc.setTextColor(26, 26, 26);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, 50);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Order ID: #${order._id.substring(order._id.length - 8).toUpperCase()}`, 20, 58);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 63);
  doc.text(`Payment: ${order.paymentMethod}`, 20, 68);

  // Customer Info
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 120, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(order.customerName || 'Valued Customer', 120, 58);
  doc.text(`Phone: ${order.customerPhone || 'N/A'}`, 120, 63);
  doc.text(`Type: ${order.orderType || 'Pickup'}`, 120, 68);

  // Table
  const tableColumn = ["Product", "Qty", "Price", "Total"];
  const tableRows = [];

  order.items.forEach(item => {
    const itemData = [
      item.name,
      item.quantity,
      `INR ${item.price.toFixed(2)}`,
      `INR ${(item.quantity * item.price).toFixed(2)}`
    ];
    tableRows.push(itemData);
  });

  doc.autoTable({
    startY: 80,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [26, 26, 26], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 20, right: 20 },
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`GRAND TOTAL: INR ${order.totalAmount.toFixed(2)}`, 190, finalY, { align: 'right' });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for shopping with us!', 105, finalY + 25, { align: 'center' });
  doc.text('Visit again for fresh stock & premium quality.', 105, finalY + 30, { align: 'center' });

  return doc;
};
