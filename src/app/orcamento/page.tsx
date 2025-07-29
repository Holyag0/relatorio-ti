"use client";

import { useRef, useState } from "react";
import styles from "./orcamento.module.css";

interface Item {
  id: number;
  quantidade: string;
  especificacao: string;
  valor: string;
}

export default function Orcamento() {
  const orcamentoRef = useRef(null);
  const [painelAberto, setPainelAberto] = useState(true);
  const [mostrarObservacoes, setMostrarObservacoes] = useState(true);
  const [mostrarSolicitante, setMostrarSolicitante] = useState(true);
  const [mostrarAprovacao, setMostrarAprovacao] = useState(true);
  const [itens, setItens] = useState<Item[]>([
    {
      id: 1,
      quantidade: "1",
      especificacao: "KIT MICROFONE",
      valor: "389,00"
    },
    {
      id: 2,
      quantidade: "1",
      especificacao: "MINI TECLADO SEM FIO",
      valor: "50,00"
    },
    {
      id: 3,
      quantidade: "1",
      especificacao: "HUB USB Baseus 1 metro",
      valor: "150,00"
    }
  ]);

  // Função para adicionar novo item
  const adicionarItem = () => {
    const novoItem: Item = {
      id: itens.length + 1,
      quantidade: "1",
      especificacao: "Novo Item",
      valor: "0,00"
    };
    setItens([...itens, novoItem]);
  };

  // Função para remover item
  const removerItem = (id: number) => {
    setItens(itens.filter(item => item.id !== id));
  };

  // Função para atualizar item
  const atualizarItem = (id: number, campo: keyof Item, valor: string) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  // Função para calcular total
  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      const valor = parseFloat(item.valor.replace(',', '.')) || 0;
      const quantidade = parseInt(item.quantidade) || 0;
      return total + (valor * quantidade);
    }, 0);
  };

  // Função para formatar valor em reais
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para gerar PDF
  const gerarPDF = async () => {
    if (!orcamentoRef.current || typeof window === 'undefined') return;
    
    try {
      document.body.classList.add("exportando-pdf");
      
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      
      const canvas = await html2canvas(orcamentoRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4"); // Orientação paisagem
      
      const imgWidth = 297; // Largura A4 paisagem
      const pageHeight = 210; // Altura A4 paisagem
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save("orcamento.pdf");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      if (typeof window !== 'undefined') {
        alert("Erro ao gerar PDF. Tente novamente.");
      }
    } finally {
      if (typeof window !== 'undefined') {
        document.body.classList.remove("exportando-pdf");
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Painel de Controles */}
      <div className={styles.painelControles}>
        <button onClick={gerarPDF} className={styles.gerarPdfBtn}>
          Gerar PDF
        </button>
        <button 
          onClick={() => setPainelAberto(!painelAberto)} 
          className={styles.expandirBtn}
        >
          {painelAberto ? "Recolher Controles" : "Expandir Controles"}
        </button>
        
        {painelAberto && (
          <div className={styles.painelInfo}>
            <h3>📋 Orçamento de Material</h3>
            <p>Gerencie os itens do orçamento e edite os campos diretamente no documento.</p>
            
            <div className={styles.controlesItens}>
              <button onClick={adicionarItem} className={styles.adicionarBtn}>
                ➕ Adicionar Item
              </button>
              <div className={styles.totalInfo}>
                <strong>Total: R$ {formatarValor(calcularTotal())}</strong>
              </div>
            </div>

            <div className={styles.toggles}>
              <h4>Seções do Documento:</h4>
              <label className={styles.toggleItem}>
                <input
                  type="checkbox"
                  checked={mostrarSolicitante}
                  onChange={(e) => setMostrarSolicitante(e.target.checked)}
                />
                <span>📝 Solicitante e Data</span>
              </label>
              <label className={styles.toggleItem}>
                <input
                  type="checkbox"
                  checked={mostrarObservacoes}
                  onChange={(e) => setMostrarObservacoes(e.target.checked)}
                />
                <span>📋 Observações</span>
              </label>
              <label className={styles.toggleItem}>
                <input
                  type="checkbox"
                  checked={mostrarAprovacao}
                  onChange={(e) => setMostrarAprovacao(e.target.checked)}
                />
                <span>✍️ Assinaturas</span>
              </label>
            </div>

            <div className={styles.listaItens}>
              <h4>Itens ({itens.length}):</h4>
              {itens.map((item) => (
                <div key={item.id} className={styles.itemControle}>
                  <span className={styles.itemNumero}>{item.id}</span>
                  <span className={styles.itemDescricao}>{item.especificacao}</span>
                  <span className={styles.itemValor}>R$ {item.valor}</span>
                  <button 
                    onClick={() => removerItem(item.id)}
                    className={styles.removerBtn}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.dicas}>
              <strong>💡 Dicas:</strong>
              <ul>
                <li>Clique em qualquer texto para editar</li>
                <li>Use Tab para navegar entre campos</li>
                <li>O total é calculado automaticamente</li>
                <li>Adicione ou remova itens conforme necessário</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Documento do Orçamento */}
      <div className={styles.documento} ref={orcamentoRef}>
        <div className={styles.cabecalho}>
          <h1>ORÇAMENTO DE MATERIAL</h1>
        </div>

        {mostrarSolicitante && (
          <div className={styles.informacoes}>
            <div className={styles.campo}>
              <label>Solicitante:</label>
              <span contentEditable suppressContentEditableWarning>Thiago Holanda</span>
            </div>
            <div className={styles.campo}>
              <label>Data:</label>
              <span contentEditable suppressContentEditableWarning>07 de Julho de 2025</span>
            </div>
          </div>
        )}

        <div className={styles.tabelaContainer}>
          <h2>ITENS</h2>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quant.</th>
                <th>Especificação do Material</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <span 
                      contentEditable 
                      suppressContentEditableWarning
                      onBlur={(e) => atualizarItem(item.id, 'quantidade', e.target.textContent || '1')}
                    >
                      {item.quantidade}
                    </span>
                  </td>
                  <td>
                    <span 
                      contentEditable 
                      suppressContentEditableWarning
                      onBlur={(e) => atualizarItem(item.id, 'especificacao', e.target.textContent || '')}
                    >
                      {item.especificacao}
                    </span>
                  </td>
                  <td>
                    <span 
                      contentEditable 
                      suppressContentEditableWarning
                      onBlur={(e) => atualizarItem(item.id, 'valor', e.target.textContent || '0,00')}
                    >
                      {item.valor}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className={styles.linhaTotal}>
                <td colSpan={3}><strong>TOTAL</strong></td>
                <td><strong>R$ {formatarValor(calcularTotal())}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {mostrarObservacoes && (
          <div className={styles.observacoes}>
            <h3>Observações:</h3>
            <p contentEditable suppressContentEditableWarning>
              Este orçamento apresenta os valores dos materiais solicitados para o setor de Tecnologia da Informação.
            </p>
          </div>
        )}

        {mostrarAprovacao && (
          <div className={styles.assinaturas}>
            <div className={styles.assinatura}>
              <div className={styles.linhaAssinatura}></div>
              <p><strong>Solicitante</strong></p>
            </div>
            <div className={styles.assinatura}>
              <div className={styles.linhaAssinatura}></div>
              <p><strong>Aprovação</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 