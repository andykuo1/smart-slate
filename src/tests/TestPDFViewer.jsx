import {
  Document,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

export default function TestPDFViewer() {
  return (
    <fieldset className="relative my-4 h-full w-[80%] border">
      <legend className="absolute -top-4 left-2 rounded border bg-white px-2 text-xl">
        TestPDFViewer
      </legend>
      <PDFViewer className="h-full w-full">
        <PDFDocument />
      </PDFViewer>
    </fieldset>
  );
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

function PDFDocument() {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}
