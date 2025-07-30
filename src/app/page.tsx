"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./relatorio.module.css";

const atividadesIniciais = [
  {
    titulo: "Implementação do Sistema de Backup",
    status: "concluido",
    descricao: "Instalação e configuração do novo sistema de backup automatizado para garantir a segurança dos dados corporativos com redundância em nuvem.",
    prazo: "15/03/2025",
    prioridade: "Alta",
  },
  {
    titulo: "Atualização da Rede Corporativa",
    status: "em-andamento",
    descricao: "Upgrade da infraestrutura de rede para fibra óptica, aumentando a velocidade de conexão e melhorando a estabilidade da rede interna.",
    prazo: "30/07/2025",
    prioridade: "Alta",
  },
  {
    titulo: "Migração para Windows 11",
    status: "concluido",
    descricao: "Atualização de todos os computadores corporativos para Windows 11, incluindo testes de compatibilidade e treinamento dos usuários.",
    prazo: "10/03/2025",
    prioridade: "Média",
  },
  {
    titulo: "Implementação do Office 365",
    status: "pendente",
    descricao: "Migração completa para a suíte Office 365, incluindo configuração de contas, treinamento e migração de dados do sistema legado.",
    prazo: "15/08/2025",
    prioridade: "Média",
  },
  {
    titulo: "Auditoria de Segurança",
    status: "concluido",
    descricao: "Realização de auditoria completa de segurança da informação, incluindo testes de penetração e avaliação de vulnerabilidades.",
    prazo: "20/02/2025",
    prioridade: "Alta",
  },
  {
    titulo: "Treinamento da Equipe",
    status: "em-andamento",
    descricao: "Programa de capacitação da equipe de T.I em novas tecnologias cloud, cibersegurança e metodologias ágeis de desenvolvimento.",
    prazo: "31/12/2025",
    prioridade: "Média",
  },
];

export default function RelatorioTI() {
  const relatorioRef = useRef<HTMLDivElement>(null);
  const [atividades, setAtividades] = useState(atividadesIniciais);
  const [painelAberto, setPainelAberto] = useState(true);
  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [mostrarPrazo, setMostrarPrazo] = useState(false);
  const [mostrarPrioridade, setMostrarPrioridade] = useState(false);
  const [mostrarTituloAtividades, setMostrarTituloAtividades] = useState(false);
  const [layoutPadrao, setLayoutPadrao] = useState(true);
  const [spacersFooter, setSpacersFooter] = useState(0);
  const [modalGuiaAberto, setModalGuiaAberto] = useState(false);

  // Função para alterar status de uma atividade
  const alterarStatus = (index: number, novoStatus: string) => {
    setAtividades(atividades.map((at, idx) => idx === index ? { ...at, status: novoStatus } : at));
  };

  // Adiciona uma nova atividade vazia
  const adicionarAtividade = () => {
    setAtividades([
      ...atividades,
      {
        titulo: "Nova Atividade",
        status: "pendente",
        descricao: "Descrição da nova atividade.",
        prazo: "",
        prioridade: "Média",
      },
    ]);
  };

  // Remove uma atividade pelo índice
  const removerAtividade = (index: number) => {
    setAtividades(atividades.filter((_, i) => i !== index));
  };

  // Adiciona um spacer invisível para empurrar o footer
  const adicionarSpacer = () => {
    setSpacersFooter(spacersFooter + 1);
  };

  // Remove um spacer invisível
  const removerSpacer = () => {
    if (spacersFooter > 0) {
      setSpacersFooter(spacersFooter - 1);
    }
  };

  // Geração de PDF ajustada para tentar caber mais conteúdo
  const gerarPDF = async () => {
    if (!relatorioRef.current || typeof window === 'undefined') return;
    
    try {
      document.body.classList.add("exportando-pdf");
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      
      const canvas = await html2canvas(relatorioRef.current, { scale: 2, useCORS: true });
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
    pdf.save("relatorio-ti.pdf");
    if (typeof window !== 'undefined') {
      document.body.classList.remove("exportando-pdf");
    }
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
    <div style={{ background: "linear-gradient(135deg, #F4F6FA 0%, #E8E8E8 100%)", minHeight: "100vh", padding: 20 }}>
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}>
        <button onClick={gerarPDF} className={styles.gerarPdfBtn}>
          Gerar PDF
        </button>
        <button
          onClick={() => setPainelAberto((v) => !v)}
          className={styles.expandirBtn + (painelAberto ? ' ' + styles.expandido : '')}
        >
          {painelAberto ? "Recolher Gerenciador" : "Expandir Gerenciador"}
        </button>
        <button
          onClick={() => setModalGuiaAberto(true)}
          className={styles.guiaBtn}
        >
          Guia
        </button>
        {painelAberto && (
          <div className={styles.painelGerenciar}>
            <strong className={styles.painelTitulo}>Gerenciar Atividades</strong>
            <div className={styles.painelControles}>
              <div className={styles.painelSecao}>
                <strong className={styles.painelSubtitulo}>Layout do Relatório</strong>
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
                <strong className={styles.painelSubtitulo}>Informações das Atividades</strong>
                <label className={styles.painelCheckbox}>
                  <input
                    type="checkbox"
                    checked={mostrarStatus}
                    onChange={(e) => setMostrarStatus(e.target.checked)}
                  />
                  <span>Mostrar Status das Atividades</span>
                </label>
                <label className={styles.painelCheckbox}>
                  <input
                    type="checkbox"
                    checked={mostrarPrazo}
                    onChange={(e) => setMostrarPrazo(e.target.checked)}
                  />
                  <span>Mostrar Prazo das Atividades</span>
                </label>
                <label className={styles.painelCheckbox}>
                  <input
                    type="checkbox"
                    checked={mostrarPrioridade}
                    onChange={(e) => setMostrarPrioridade(e.target.checked)}
                  />
                  <span>Mostrar Prioridade das Atividades</span>
                </label>
                <label className={styles.painelCheckbox}>
                  <input
                    type="checkbox"
                    checked={mostrarTituloAtividades}
                    onChange={(e) => setMostrarTituloAtividades(e.target.checked)}
                  />
                  <span>Mostrar Título &quot;Atividades Realizadas&quot;</span>
                </label>
              </div>
              <div className={styles.painelSecao}>
                <strong className={styles.painelSubtitulo}>Ajustar Footer</strong>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={adicionarSpacer} className={styles.painelAdicionarBtn} style={{ fontSize: '11px', padding: '4px 8px', width: '80px' }}>
                    + Spacer
                  </button>
                  <button onClick={removerSpacer} className={styles.painelRemoverBtn} style={{ fontSize: '11px', padding: '4px 8px', width: '80px' }}>
                    - Spacer
                  </button>
                  <span style={{ fontSize: '11px', color: '#666', marginLeft: '5px' }}>
                    {spacersFooter} spacers
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.painelAtividades}>
              {atividades.map((a, i) => (
                <div key={i} className={styles.painelLinha}>
                  <span className={styles.painelTituloAtividade}>{a.titulo}</span>
                  <select
                    value={a.status}
                    onChange={e => alterarStatus(i, e.target.value)}
                    className={styles.painelSelect}
                  >
                    <option value="concluido">CONCLUÍDO</option>
                    <option value="em-andamento">EM ANDAMENTO</option>
                    <option value="pendente">PENDENTE</option>
                  </select>
                  <button
                    onClick={() => removerAtividade(i)}
                    className={styles.painelRemoverBtn}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={adicionarAtividade}
              className={styles.painelAdicionarBtn}
            >
              Adicionar Atividade
            </button>
          </div>
        )}
      </div>
      <div className={`${styles.container} ${layoutPadrao ? styles.layoutPadrao : ''}`} ref={relatorioRef}>
        <header className={`${styles.header} ${layoutPadrao ? styles.headerPadrao : ''}`}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <Image 
                src={layoutPadrao ? "/logo-padrao.png" : "/logo.png"} 
                alt="Logo CABEMCE" 
                width={200}
                height={100}
                style={{ height: 100, width: "auto", display: "block", margin: "0 auto 10px" }} 
              />
            </div>
            <div className={styles.headerText}>
              <h1 contentEditable suppressContentEditableWarning>Caixa Beneficente dos Militares do Ceará</h1>
              <h2 contentEditable suppressContentEditableWarning>Gabinete da Presidência</h2>
              <h3 contentEditable suppressContentEditableWarning>Setor de Tecnologia da Informação</h3>
              <h4 contentEditable suppressContentEditableWarning>Relatório de Atividades - T.I</h4>
            </div>
          </div>
        </header>
        <div className={styles.content}>
          <div className={styles.reportInfo}>
            <div className={styles.infoBlock}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Período:</span>
                <span className={styles.infoValue} contentEditable suppressContentEditableWarning>Janeiro - Março 2025</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Responsável:</span>
                <span className={styles.infoValue} contentEditable suppressContentEditableWarning>João Silva - Coordenador T.I</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Data do Relatório:</span>
                <span className={styles.infoValue} contentEditable suppressContentEditableWarning>07 de Julho, 2025</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Cargo:</span>
                <span className={styles.infoValue} contentEditable suppressContentEditableWarning>Coordenador de Tecnologia da Informação</span>
              </div>
            </div>
          </div>
          <section className={styles.section}>
            {mostrarTituloAtividades && (
              <h2 className={styles.atividadesTitle} contentEditable suppressContentEditableWarning>Atividades Realizadas</h2>
            )}
            <div className={styles.activityGrid}>
              {atividades.map((a, i) => (
                <div className={styles.activityCard} key={i}>
                  <div className={styles.activityHeader}>
                    <h3 className={styles.activityTitle} contentEditable suppressContentEditableWarning>{a.titulo}</h3>
                    {mostrarStatus && (
                      <span
                        className={
                          a.status === "concluido"
                            ? `${styles.status} ${styles.statusConcluido}`
                            : a.status === "em-andamento"
                            ? `${styles.status} ${styles.statusEmAndamento}`
                            : `${styles.status} ${styles.statusPendente}`
                        }
                        style={{ minWidth: 120, fontWeight: 600, borderRadius: 20, padding: '6px 15px' }}
                      >
                        {a.status === "concluido"
                          ? "CONCLUÍDO"
                          : a.status === "em-andamento"
                          ? "EM ANDAMENTO"
                          : "PENDENTE"}
                      </span>
                    )}
                  </div>
                  <p className={styles.activityDescription} contentEditable suppressContentEditableWarning>{a.descricao}</p>
                  {(mostrarPrazo || mostrarPrioridade) && (
                    <div className={styles.activityMeta}>
                      {mostrarPrazo && (
                        <span contentEditable suppressContentEditableWarning>Prazo: {a.prazo}</span>
                      )}
                      {mostrarPrioridade && (
                        <span contentEditable suppressContentEditableWarning>Prioridade: {a.prioridade}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Spacers invisíveis para empurrar o footer */}
          {Array.from({ length: spacersFooter }, (_, i) => (
            <div key={`spacer-${i}`} className={styles.activityCard} style={{ opacity: 0, pointerEvents: 'none', height: '200px' }}>
              <div className={styles.activityHeader}>
                <h3 className={styles.activityTitle}>Spacer Invisível</h3>
              </div>
              <p className={styles.activityDescription}>Este é um componente invisível para ajustar o footer</p>
            </div>
          ))}
          
          {/* Gambiarra: Spacer invisível para empurrar o footer */}
          <div 
            style={{ 
              minHeight: atividades.length < 4 ? '400px' : '200px',
              flex: 1,
              display: 'flex'
            }}
          />
        </div>
        <footer className={styles.footer}>
          <div className={styles.signature}>
            <div className={styles.signatureBlock}>
              <div className={styles.signatureLine}></div>
              <div className={styles.signatureLabel} contentEditable suppressContentEditableWarning>João Silva<br/>Coordenador de T.I</div>
            </div>
            <div className={styles.signatureBlock}>
              <div className={styles.signatureLine}></div>
              <div className={styles.signatureLabel} contentEditable suppressContentEditableWarning>Carlos Oliveira<br/>Diretor Executivo</div>
            </div>
          </div>
          <div>
          <svg
xmlns="http://www.w3.org/2000/svg"
xmlnsXlink="http://www.w3.org/1999/xlink"
width="1700px"
height="91px"

>
<image
  x="230px"
  y="-10px"
  width="-1500px"
  height="91px"
  xlinkHref="data:img/png;base64,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"
/>
</svg>
          </div>
      </footer>
      </div>

      {/* Modal do Guia */}
      {modalGuiaAberto && (
        <div className={styles.modalOverlay} onClick={() => setModalGuiaAberto(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Guia de Uso - Relatório T.I</h2>
              <button 
                className={styles.modalCloseBtn}
                onClick={() => setModalGuiaAberto(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.guiaSecao}>
                <h3>📋 Funcionalidades Principais</h3>
                <ul>
                  <li><strong>Gerar PDF:</strong> Cria um arquivo PDF do relatório atual</li>
                  <li><strong>Expandir/Recolher Gerenciador:</strong> Mostra ou oculta o painel de controle</li>
                  <li><strong>Edição Direta:</strong> Clique em qualquer texto para editá-lo</li>
                </ul>
              </div>

              <div className={styles.guiaSecao}>
                <h3>⚙️ Configurações do Layout</h3>
                <ul>
                  <li><strong>Layout Padrão:</strong> Ativa o modo preto e branco para impressão</li>
                  <li><strong>Mostrar Status:</strong> Exibe o status das atividades (Concluído, Em Andamento, Pendente)</li>
                  <li><strong>Mostrar Prazo:</strong> Exibe as datas de prazo das atividades</li>
                  <li><strong>Mostrar Prioridade:</strong> Exibe o nível de prioridade das atividades</li>
                  <li><strong>Mostrar Título:</strong> Exibe o título &quot;Atividades Realizadas&quot;</li>
                </ul>
              </div>

              <div className={styles.guiaSecao}>
                <h3>📝 Gerenciamento de Atividades</h3>
                <ul>
                  <li><strong>Alterar Status:</strong> Use o dropdown para mudar o status de cada atividade</li>
                  <li><strong>Remover Atividade:</strong> Clique em &quot;Remover&quot; para excluir uma atividade</li>
                  <li><strong>Adicionar Atividade:</strong> Clique em &quot;Adicionar Atividade&quot; para criar uma nova</li>
                </ul>
              </div>

              <div className={styles.guiaSecao}>
                <h3>📏 Ajuste do Footer</h3>
                <ul>
                  <li><strong>+ Spacer:</strong> Adiciona espaço invisível para empurrar o footer</li>
                  <li><strong>- Spacer:</strong> Remove espaço invisível</li>
                  <li><strong>Contador:</strong> Mostra quantos spacers estão ativos</li>
                </ul>
              </div>

              <div className={styles.guiaSecao}>
                <h3>💡 Dicas Importantes</h3>
                <ul>
                  <li>Edite os textos clicando diretamente neles</li>
                  <li>Use o layout padrão para melhor qualidade de impressão</li>
                  <li>Ajuste os spacers se o footer estiver muito próximo do conteúdo</li>
                  <li>Teste diferentes configurações antes de gerar o PDF final</li>
                  <li>O PDF gerado mantém todas as edições feitas no relatório</li>
                </ul>
              </div>

              <div className={styles.guiaSecao}>
                <h3>🔗 Navegação</h3>
                <ul>
                  <li><strong>Relatório:</strong> Página principal com atividades de T.I</li>
                  <li><strong>Contrato:</strong> Gera contratos de prestação de serviços</li>
                  <li><strong>Orçamento:</strong> Cria orçamentos de materiais</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 