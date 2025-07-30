"use client";
import { useRef, useState } from "react";
import styles from "./orcamento.module.css";

interface Item {
  id: number;
  codigo: string;
  descricao: string;
  quantidade: string;
  valor: string;
}

export default function Orcamento() {
  const orcamentoRef = useRef<HTMLDivElement>(null);
  const [itens] = useState<Item[]>([
    { id: 1, codigo: "001", descricao: "Serviço de Desenvolvimento", quantidade: "1", valor: "5000,00" },
    { id: 2, codigo: "002", descricao: "Licença de Software", quantidade: "2", valor: "1500,00" },
  ]);

  // Funções para gerenciar itens (não utilizadas no momento, mas mantidas para futuras funcionalidades)
  // const adicionarItem = () => {
  //   const novoId = Math.max(...itens.map(item => item.id), 0) + 1;
  //   setItens([...itens, { id: novoId, codigo: "", descricao: "", quantidade: "1", valor: "0,00" }]);
  // };

  // const removerItem = (id: number) => {
  //   setItens(itens.filter(item => item.id !== id));
  // };

  // const atualizarItem = (id: number, campo: keyof Item, valor: string) => {
  //   setItens(itens.map(item => item.id === id ? { ...item, [campo]: valor } : item));
  // };

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      const valor = parseFloat(item.valor.replace(',', '.')) || 0;
      const quantidade = parseInt(item.quantidade) || 0;
      return total + (valor * quantidade);
    }, 0);
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const gerarPDF = async () => {
    if (!orcamentoRef.current) return;
    
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      document.body.classList.add("exportando-pdf");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(orcamentoRef.current, { 
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
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
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
      
      pdf.save("orcamento.pdf");
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
          onClick={() => window.open('/contrato', '_blank')}
          style={{
            background: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '14px 32px',
            fontWeight: '700',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
          }}
        >
          Contrato
        </button>
      </div>
      
      <div className={styles.documento} ref={orcamentoRef}>
        <div className={styles.cabecalho}>
          <h1 contentEditable suppressContentEditableWarning>ORÇAMENTO DE MATERIAL</h1>
        </div>
        
        <div className={styles.informacoes}>
          <div className={styles.campo}>
            <label>Empresa:</label>
            <span contentEditable suppressContentEditableWarning>Caixa Beneficente dos Militares do Ceará</span>
          </div>
          <div className={styles.campo}>
            <label>Data:</label>
            <span contentEditable suppressContentEditableWarning>30 de Julho, 2025</span>
          </div>
          <div className={styles.campo}>
            <label>Responsável:</label>
            <span contentEditable suppressContentEditableWarning>João Silva - Coordenador T.I</span>
          </div>
        </div>
        
        <div className={styles.tabelaContainer}>
          <h2>Itens</h2>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span contentEditable suppressContentEditableWarning>{item.codigo}</span>
                  </td>
                  <td>
                    <span contentEditable suppressContentEditableWarning>{item.descricao}</span>
                  </td>
                  <td>
                    <span contentEditable suppressContentEditableWarning>{item.quantidade}</span>
                  </td>
                  <td>
                    <span contentEditable suppressContentEditableWarning>{item.valor}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.linhaTotal}>
                <td colSpan={3}><strong>Total:</strong></td>
                <td><strong>R$ {formatarValor(calcularTotal())}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className={styles.observacoes}>
          <h3>Observações:</h3>
          <p contentEditable suppressContentEditableWarning>
            Este orçamento tem validade de 30 dias a partir da data de emissão. Os valores estão sujeitos a alteração conforme disponibilidade dos materiais.
          </p>
        </div>
        
        <div className={styles.assinaturas}>
          <div className={styles.assinatura}>
            <div className={styles.linha}></div>
            <p>Solicitante</p>
          </div>
          <div className={styles.assinatura}>
            <div className={styles.linha}></div>
            <p>Aprovação</p>
          </div>
        </div>
      </div>
    </div>
  );
} 