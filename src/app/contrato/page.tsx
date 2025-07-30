"use client";
import { useRef } from "react";
import styles from "./contrato.module.css";

export default function Contrato() {
  const contratoRef = useRef<HTMLDivElement>(null);

  const gerarPDF = async () => {
    if (!contratoRef.current) return;
    
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      document.body.classList.add("exportando-pdf");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(contratoRef.current, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        ignoreElements: (element) => {
          return element.classList.contains('noPrint');
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (pdfHeight < pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      } else {
        let position = 0;
        let remainingHeight = pdfHeight;
        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", 0, position ? -position : 0, pdfWidth, pdfHeight);
          remainingHeight -= pageHeight;
          position += pageHeight;
          if (remainingHeight > 0) pdf.addPage();
        }
      }
      
      pdf.save("contrato.pdf");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      if (typeof window !== 'undefined') {
        alert('Erro ao gerar PDF. Tente novamente.');
      }
    } finally {
      if (typeof window !== 'undefined') {
        document.body.classList.remove("exportando-pdf");
      }
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #F4F6FA 0%, #E8E8E8 100%)", minHeight: "100vh", padding: 20 }}>
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}>
        <button onClick={gerarPDF} style={{
          background: '#D32F2F',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '14px 32px',
          fontWeight: '700',
          fontSize: '18px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)'
        }}>
          Gerar PDF
        </button>
        <button
          onClick={() => window.open('/', '_blank')}
          style={{
            background: '#FF9800',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '14px 32px',
            fontWeight: '700',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)'
          }}
        >
          Relatório
        </button>
        <button
          onClick={() => window.open('/orcamento', '_blank')}
          style={{
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '14px 32px',
            fontWeight: '700',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
          }}
        >
          Orçamento
        </button>
      </div>
      
      <div className={styles.documento} ref={contratoRef}>
        <div className={styles.cabecalho}>
          <h1 contentEditable suppressContentEditableWarning>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
        </div>
        
        <div className={styles.partes}>
          <div className={styles.parte}>
            <h2>CONTRATANTE</h2>
            <div className={styles.camposGrid}>
              <div className={styles.campo}>
                <label>Nome/Razão Social:</label>
                <span contentEditable suppressContentEditableWarning>Caixa Beneficente dos Militares do Ceará</span>
              </div>
              <div className={styles.campo}>
                <label>CNPJ:</label>
                <span contentEditable suppressContentEditableWarning>07.526.557/0001-00</span>
              </div>
              <div className={styles.campo}>
                <label>Endereço:</label>
                <span contentEditable suppressContentEditableWarning>Rua General Sampaio, 1234 - Centro, Fortaleza/CE</span>
              </div>
              <div className={styles.campo}>
                <label>Representante:</label>
                <span contentEditable suppressContentEditableWarning>João Silva - Diretor Executivo</span>
              </div>
            </div>
          </div>
          
          <div className={styles.parte}>
            <h2>CONTRATADO</h2>
            <div className={styles.camposGrid}>
              <div className={styles.campo}>
                <label>Nome/Razão Social:</label>
                <span contentEditable suppressContentEditableWarning>Tech Solutions Ltda</span>
              </div>
              <div className={styles.campo}>
                <label>CNPJ:</label>
                <span contentEditable suppressContentEditableWarning>12.345.678/0001-90</span>
              </div>
              <div className={styles.campo}>
                <label>Endereço:</label>
                <span contentEditable suppressContentEditableWarning>Av. Santos Dumont, 5678 - Aldeota, Fortaleza/CE</span>
              </div>
              <div className={styles.campo}>
                <label>Representante:</label>
                <span contentEditable suppressContentEditableWarning>Maria Santos - Diretora Técnica</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.clausulas}>
          <div className={styles.clausula}>
            <h3>1. OBJETO</h3>
            <p contentEditable suppressContentEditableWarning>
              O presente contrato tem por objeto a prestação de serviços de desenvolvimento de software e manutenção de sistemas para a CONTRATANTE.
            </p>
          </div>
          
          <div className={styles.clausula}>
            <h3>2. PRAZO</h3>
            <p contentEditable suppressContentEditableWarning>
              O prazo para execução dos serviços será de <span contentEditable suppressContentEditableWarning>12 (doze) meses</span>, contados a partir da data de assinatura deste contrato.
            </p>
          </div>
          
          <div className={styles.clausula}>
            <h3>3. VALOR</h3>
            <p contentEditable suppressContentEditableWarning>
              O valor total dos serviços será de <span contentEditable suppressContentEditableWarning>R$ 50.000,00 (cinquenta mil reais)</span>, a ser pago em <span contentEditable suppressContentEditableWarning>12 (doze) parcelas mensais</span> de <span contentEditable suppressContentEditableWarning>R$ 4.166,67 (quatro mil, cento e sessenta e seis reais e sessenta e sete centavos)</span>.
            </p>
          </div>
        </div>
        
        <div className={styles.assinaturas}>
          <div className={styles.assinatura}>
            <div className={styles.linha}></div>
            <p>CONTRATANTE</p>
          </div>
          <div className={styles.assinatura}>
            <div className={styles.linha}></div>
            <p>CONTRATADO</p>
          </div>
        </div>
      </div>
    </div>
  );
} 