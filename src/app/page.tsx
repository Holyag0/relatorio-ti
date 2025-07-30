"use client";
import { useRef, useState } from "react";
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
  const [mostrarStatus, setMostrarStatus] = useState(true);
  const [mostrarPrazo, setMostrarPrazo] = useState(true);
  const [mostrarPrioridade, setMostrarPrioridade] = useState(true);
  const [layoutPadrao, setLayoutPadrao] = useState(false);

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
              </div>
            </div>
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
              <img 
                src={layoutPadrao ? "/logo-padrao.png" : "/logo.png"} 
                alt="Logo CABEMCE" 
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
          {/* <section className={styles.section}>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Resumo Executivo</h2>
            <p style={{ color: "#666", lineHeight: 1.8, fontSize: "1.1em" }} contentEditable suppressContentEditableWarning>
              Durante o período analisado, o departamento de T.I executou com sucesso 85% das atividades planejadas, 
              mantendo o foco na modernização da infraestrutura, segurança da informação e suporte aos usuários. 
              Os principais destaques incluem a implementação do novo sistema de backup, atualização da rede corporativa 
              e treinamento da equipe em novas tecnologias.
            </p>
          </section> */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Atividades Realizadas</h2>
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
                        style={{ minWidth: 120, fontWeight: 600, borderRadius: 20, padding: "6px 15px" }}
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
          {/* <section className={styles.section}>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Próximos Passos</h2>
            <div style={{ background: "#f8f9fa", padding: 25, borderRadius: 15, borderLeft: "5px solid #667eea" }}>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {proximosPassos.map((p, i) => (
                  <li key={i} style={{ marginBottom: 15, paddingLeft: 25, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: 5, color: "#667eea", fontWeight: "bold" }}>▸</span>
                    <span contentEditable suppressContentEditableWarning>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section> */}
        </div>
        {/* <div className={styles.preFooter}>
          <p contentEditable suppressContentEditableWarning>
            Este relatório apresenta um resumo das principais atividades realizadas pelo Departamento de T.I no período especificado.
            Para informações detalhadas ou esclarecimentos, entre em contato com a coordenação do departamento.
          </p>
        </div> */}
        <footer className={styles.footer}>
          <div className={styles.signature}>
            <div className={styles.signatureBlock}>
              <div className={styles.signatureLine}></div>
              <div className={styles.signatureLabel} contentEditable suppressContentEditableWarning>João Silva<br/>Coordenador de T.I</div>
            </div>
            {/* <div className={styles.signatureBlock}>
              <div className={styles.signatureLine}></div>
              <div className={styles.signatureLabel} contentEditable suppressContentEditableWarning>Maria Santos<br/>Gerente de Operações</div>
            </div> */}
            <div className={styles.signatureBlock}>
              <div className={styles.signatureLine}></div>
              <div className={styles.signatureLabel} contentEditable suppressContentEditableWarning>Carlos Oliveira<br/>Diretor Executivo</div>
            </div>
          </div>
          <div>
          <svg></svg>
          </div>
      </footer>
      </div>
    </div>
  );
}
