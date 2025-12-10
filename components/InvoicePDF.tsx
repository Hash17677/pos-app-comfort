import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 80,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 15,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  regNumber: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'right',
    marginTop: 10,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 9,
    color: '#6b7280',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'bold',
  },
  customerBox: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
  table: {
    marginTop: 10,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    padding: 6,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    padding: 6,
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottom: '1 solid #e5e7eb',
    padding: 6,
  },
  col1: {
    width: '8%',
  },
  col2: {
    width: '42%',
  },
  col3: {
    width: '15%',
    textAlign: 'right',
  },
  col4: {
    width: '17%',
    textAlign: 'right',
  },
  col5: {
    width: '18%',
    textAlign: 'right',
  },
  summaryBox: {
    marginTop: 12,
    marginLeft: 'auto',
    width: '50%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    borderBottom: '1 solid #e5e7eb',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#374151',
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
    backgroundColor: '#dbeafe',
    marginTop: 3,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#000000',
    fontSize: 8,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  }
});

interface InvoicePDFProps {
  invoice: {
    invoiceNo: number;
    customerName: string | null;
    customerMobile: string | null;
    invoiceAmount: number;
    discountAmount: number;
    netAmount: number;
    status: 'Active' | 'Cancelled';
    createdAt: Date;
    items: Array<{
      id: string;
      itemname: string;
      qty: number;
      amount: number;
    }>;
  };
}

export default function InvoicePDF({ invoice }: InvoicePDFProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Use absolute URL for logo in PDF
  const logoUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/logo.jpg`
    : '/logo.jpg';

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={logoUrl} />
          <View style={styles.headerContent}>
            <Text style={styles.companyName}>COMFORT ZONE HOLDINGS (PVT) LTD</Text>
            <Text style={styles.regNumber}>Reg. No: PV00227984</Text>
            <Text style={styles.contactInfo}>Cool Line: 0777-686-252</Text>
            <Text style={styles.contactInfo}>E-mail: comfortzonehold@gmail.com</Text>
            <Text style={styles.contactInfo}>Address: No. 267/D/40, Pahala Bomiriya, Kaduwela</Text>
          </View>
        </View>

        {/* Invoice Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ width: '50%' }}>
              <Text style={styles.label}>Invoice Number</Text>
              <Text style={styles.value}>INV-{String(invoice.invoiceNo).padStart(6, '0')}</Text>
            </View>
            <View style={{ width: '50%', alignItems: 'flex-end' }}>
              <Text style={styles.label}>Invoice Date</Text>
              <Text style={styles.value}>{formatDate(invoice.createdAt)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ width: '50%' }}>
              <Text style={styles.label}>Printed Date</Text>
              <Text style={styles.value}>{currentDate}</Text>
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerBox}>
          <Text style={styles.label}>Bill To</Text>
          <Text style={[styles.value, { marginTop: 4, fontSize: 12 }]}>
            {invoice.customerName || 'N/A'}
          </Text>
          {invoice.customerMobile && (
            <Text style={[styles.contactInfo, { marginTop: 4 }]}>
              Mobile: {invoice.customerMobile}
            </Text>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>Item Description</Text>
            <Text style={styles.col3}>Qty</Text>
            <Text style={styles.col4}>Unit Price</Text>
            <Text style={styles.col5}>Total</Text>
          </View>
          {invoice.items.map((item, index) => (
            <View
              key={item.id}
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
            >
              <Text style={styles.col1}>{index + 1}</Text>
              <Text style={styles.col2}>{item.itemname}</Text>
              <Text style={styles.col3}>{item.qty}</Text>
              <Text style={styles.col4}>{formatCurrency(item.amount)}</Text>
              <Text style={styles.col5}>{formatCurrency(item.qty * item.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(invoice.invoiceAmount)}</Text>
          </View>
          {invoice.discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: '#dc2626' }]}>
                - {formatCurrency(invoice.discountAmount)}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Net Amount</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.netAmount)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for choosing Comfort Zone Holdings!</Text>
          <Text style={{ marginTop: 4 }}>
            For any queries, please contact us at 0777-686-252 or comfortzonehold@gmail.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}
