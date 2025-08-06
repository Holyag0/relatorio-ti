"use client";
import { useRef, useState, useEffect } from "react";
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
  const [itens, setItens] = useState<Item[]>([
    { id: 1, codigo: "001", descricao: "Serviço de Desenvolvimento", quantidade: "1", valor: "5000,00" },
    { id: 2, codigo: "002", descricao: "Licença de Software", quantidade: "2", valor: "1500,00" },
  ]);
  const [painelAberto, setPainelAberto] = useState(true);
  const [layoutPadrao, setLayoutPadrao] = useState(true);
  const [mostrarCodigo, setMostrarCodigo] = useState(true);
  const [mostrarQuantidade, setMostrarQuantidade] = useState(true);
  const [mostrarValor, setMostrarValor] = useState(true);
  const [mostrarObservacoes, setMostrarObservacoes] = useState(true);
  const [mostrarAssinaturas, setMostrarAssinaturas] = useState(true);
  const [totalEditavel, setTotalEditavel] = useState("");

  // Funções para gerenciar itens
  const adicionarItem = () => {
    const novoId = Math.max(...itens.map(item => item.id), 0) + 1;
    setItens([...itens, { 
      id: novoId, 
      codigo: "", 
      descricao: "Novo Item", 
      quantidade: "1", 
      valor: "0,00" 
    }]);
  };

  const removerItem = (id: number) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const atualizarItem = (id: number, campo: keyof Item, valor: string) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      // Remove espaços e converte vírgula para ponto
      const valorStr = item.valor.replace(/\s/g, '').replace(',', '.');
      
      // Converte para número
      const valor = parseFloat(valorStr) || 0;
      
      return total + valor;
    }, 0);
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Atualiza o total calculado automaticamente
  const totalCalculado = calcularTotal();
  
  // Atualiza o total editável quando o cálculo muda
  useEffect(() => {
    setTotalEditavel(formatarValor(totalCalculado));
  }, [totalCalculado]);

  // Função para formatar valor quando editado
  const formatarValorEditado = (valor: string) => {
    // Remove tudo que não é número ou vírgula
    const apenasNumeros = valor.replace(/[^\d,]/g, '');
    
    // Se não tem vírgula, adiciona duas casas decimais
    if (!apenasNumeros.includes(',')) {
      const numero = parseFloat(apenasNumeros) || 0;
      return formatarValor(numero);
    }
    
    // Se tem vírgula, mantém o formato
    return apenasNumeros;
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
      {/* Painel esquerdo - Controles */}
      <div style={{ position: "fixed", top: 20, left: 20, zIndex: 1000, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <button
          onClick={() => setPainelAberto((v) => !v)}
          className={styles.expandirBtn + (painelAberto ? ' ' + styles.expandido : '')}
        >
          {painelAberto ? "Recolher Gerenciador" : "Expandir Gerenciador"}
        </button>
        
        {painelAberto && (
          <div className={styles.painelGerenciar}>
            <strong className={styles.painelTitulo}>Gerenciar Orçamento</strong>
            
            <div className={styles.painelControles}>
              <div className={styles.painelSecao}>
                <strong className={styles.painelSubtitulo}>Layout do Orçamento</strong>
                <label className={styles.painelCheckbox}>
                  <input
                    type="checkbox"
                    checked={layoutPadrao}
                    onChange={(e) => setLayoutPadrao(e.target.checked)}
                  />
                  <span>Usar Layout Padrão (Preto e Branco)</span>
                </label>
              </div>
              
              <div className={styles.painelSecao}>
                <strong className={styles.painelSubtitulo}>Informações da Tabela</strong>
                <label className={styles.painelCheckbox}>
                  <input
                    type="checkbox"
                    checked={mostrarCodigo}
                    onChange={(e) => setMostrarCodigo(e.target.checked)}
                  />
                  <span>Mostrar Coluna Código</span>
                </label>
                <label className={styles.painelCheckbox}>
                  <input
                    type="checkbox"
                    checked={mostrarQuantidade}
                    onChange={(e) => setMostrarQuantidade(e.target.checked)}
                  />
                  <span>Mostrar Coluna Quantidade</span>
                </label>
                <label className={styles.painelCheckbox}>
                  <input
                    type="checkbox"
                    checked={mostrarValor}
                    onChange={(e) => setMostrarValor(e.target.checked)}
                  />
                  <span>Mostrar Coluna Valor</span>
                </label>
              </div>
              
              <div className={styles.painelSecao}>
                <strong className={styles.painelSubtitulo}>Seções do Documento</strong>
                <label className={styles.painelCheckbox}>
                  <input
                    type="checkbox"
                    checked={mostrarObservacoes}
                    onChange={(e) => setMostrarObservacoes(e.target.checked)}
                  />
                  <span>Mostrar Observações</span>
                </label>
                <label className={styles.painelCheckbox}>
                  <input
                    type="checkbox"
                    checked={mostrarAssinaturas}
                    onChange={(e) => setMostrarAssinaturas(e.target.checked)}
                  />
                  <span>Mostrar Assinaturas</span>
                </label>
              </div>
            </div>

            <div className={styles.painelAtividades}>
              <div className={styles.painelSecao}>
                <strong className={styles.painelSubtitulo}>Itens do Orçamento</strong>
                <div className={styles.totalInfo}>
                  Total: R$ {totalEditavel}
                </div>
              </div>
              
              {itens.map((item, index) => (
                <div key={item.id} className={styles.painelLinha}>
                  <span className={styles.painelTituloAtividade}>
                    {item.descricao || `Item ${index + 1}`}
                  </span>
                  <div className={styles.painelControlesItem}>
                    <input
                      type="text"
                      value={item.codigo}
                      onChange={(e) => atualizarItem(item.id, 'codigo', e.target.value)}
                      placeholder="Código"
                      className={styles.painelInput}
                    />
                    <input
                      type="text"
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(item.id, 'quantidade', e.target.value)}
                      placeholder="Qtd"
                      className={styles.painelInput}
                    />
                    <input
                      type="text"
                      value={item.valor}
                      onChange={(e) => atualizarItem(item.id, 'valor', e.target.value)}
                      placeholder="Valor"
                      className={styles.painelInput}
                    />
                  </div>
                  <button
                    onClick={() => removerItem(item.id)}
                    className={styles.painelRemoverBtn}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={adicionarItem}
              className={styles.painelAdicionarBtn}
            >
              Adicionar Item
            </button>
          </div>
        )}
      </div>

      {/* Painel direito - Gerar PDF e navegação */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}>
        <button onClick={gerarPDF} className={styles.gerarPdfBtn}>
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
      
      <div className={`${styles.container} ${layoutPadrao ? styles.layoutPadrao : ''}`} ref={orcamentoRef}>
        <header className={`${styles.header} ${layoutPadrao ? styles.headerPadrao : ''}`}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1 contentEditable suppressContentEditableWarning>ORÇAMENTO DE MATERIAL</h1>
              <h2 contentEditable suppressContentEditableWarning>Caixa Beneficente dos Militares do Ceará</h2>
            </div>
          </div>
        </header>
        
        <div className={styles.content}>
          <div className={styles.reportInfo}>
            <div className={styles.infoBlock}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Empresa:</span>
                <span className={styles.infoValue} contentEditable suppressContentEditableWarning>Caixa Beneficente dos Militares do Ceará</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Data:</span>
                <span className={styles.infoValue} contentEditable suppressContentEditableWarning>30 de Julho, 2025</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Responsável:</span>
                <span className={styles.infoValue} contentEditable suppressContentEditableWarning>João Silva - Coordenador T.I</span>
              </div>
            </div>
          </div>
          
          <section className={styles.section}>
            <div className={styles.tabelaContainer}>
              <h2 className={styles.sectionTitle}>Itens do Orçamento</h2>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    {mostrarCodigo && <th>Código</th>}
                    <th>Descrição</th>
                    {mostrarQuantidade && <th>Qtd</th>}
                    {mostrarValor && <th>Valor (R$)</th>}
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item) => (
                    <tr key={item.id}>
                      {mostrarCodigo && (
                        <td>
                          <span 
                            contentEditable 
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const valorEditado = e.currentTarget.textContent || '';
                              atualizarItem(item.id, 'codigo', valorEditado);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                e.currentTarget.blur();
                              }
                            }}
                          >
                            {item.codigo}
                          </span>
                        </td>
                      )}
                      <td>
                        <span 
                          contentEditable 
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const valorEditado = e.currentTarget.textContent || '';
                            atualizarItem(item.id, 'descricao', valorEditado);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              e.currentTarget.blur();
                            }
                          }}
                        >
                          {item.descricao}
                        </span>
                      </td>
                      {mostrarQuantidade && (
                        <td>
                          <span 
                            contentEditable 
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const valorEditado = e.currentTarget.textContent || '';
                              atualizarItem(item.id, 'quantidade', valorEditado);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                e.currentTarget.blur();
                              }
                            }}
                          >
                            {item.quantidade}
                          </span>
                        </td>
                      )}
                      {mostrarValor && (
                        <td>
                          <span 
                            contentEditable 
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const valorEditado = e.currentTarget.textContent || '';
                              atualizarItem(item.id, 'valor', valorEditado);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                e.currentTarget.blur();
                              }
                            }}
                          >
                            {item.valor}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={styles.linhaTotal}>
                    <td colSpan={mostrarCodigo ? (mostrarQuantidade && mostrarValor ? 3 : 2) : (mostrarQuantidade && mostrarValor ? 2 : 1)}>
                      <strong>Total:</strong>
                    </td>
                    {mostrarValor && (
                                              <td>
                          <strong>
                            R$ <span 
                              contentEditable 
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                const valorEditado = e.currentTarget.textContent || '';
                                const valorFormatado = formatarValorEditado(valorEditado);
                                setTotalEditavel(valorFormatado);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  e.currentTarget.blur();
                                }
                              }}
                            >
                              {totalEditavel}
                            </span>
                          </strong>
                        </td>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
          
          {mostrarObservacoes && (
            <section className={styles.section}>
              <div className={styles.observacoes}>
                <h3>Observações:</h3>
                <p contentEditable suppressContentEditableWarning>
                  Este orçamento tem validade de 30 dias a partir da data de emissão. Os valores estão sujeitos a alteração conforme disponibilidade dos materiais.
                </p>
              </div>
            </section>
          )}
        </div>
        
        {mostrarAssinaturas && (
          <footer className={styles.footer}>
            <div className={styles.signature}>
              <div className={styles.signatureBlock}>
                <div className={styles.signatureLine}></div>
                <div className={styles.signatureLabel} contentEditable suppressContentEditableWarning>Solicitante</div>
              </div>
              <div className={styles.signatureBlock}>
                <div className={styles.signatureLine}></div>
                <div className={styles.signatureLabel} contentEditable suppressContentEditableWarning>Aprovação</div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
} 