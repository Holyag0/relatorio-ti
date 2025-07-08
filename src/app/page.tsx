"use client";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./relatorio.module.css";

const atividades = [
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

const metricas = [
  { numero: "92%", label: "Uptime dos Sistemas" },
  { numero: "15", label: "Projetos Concluídos" },
  { numero: "2.5h", label: "Tempo Médio de Resposta" },
  { numero: "100%", label: "Compliance de Segurança" },
];

const proximosPassos = [
  "Finalizar a implementação do Office 365 até agosto de 2025",
  "Concluir a atualização da rede corporativa no prazo estabelecido",
  "Implementar sistema de monitoramento avançado de infraestrutura",
  "Desenvolver plano de continuidade de negócios para 2026",
];

export default function RelatorioTI() {
  const relatorioRef = useRef<HTMLDivElement>(null);

  const gerarPDF = async () => {
    if (!relatorioRef.current) return;
    const canvas = await html2canvas(relatorioRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("relatorio-ti.pdf");
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh", padding: 20 }}>
      <div className={styles.container} ref={relatorioRef}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logo} contentEditable suppressContentEditableWarning>🔧</div>
            <h1 contentEditable suppressContentEditableWarning>Relatório de Atividades</h1>
            <p className={styles.subtitle} contentEditable suppressContentEditableWarning>Departamento de Tecnologia da Informação</p>
          </div>
        </header>
        <div className={styles.content}>
          <div className={styles.reportInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Período</div>
              <div className={styles.infoValue} contentEditable suppressContentEditableWarning>Janeiro - Março 2025</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Responsável</div>
              <div className={styles.infoValue} contentEditable suppressContentEditableWarning>João Silva - Coordenador T.I</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Data do Relatório</div>
              <div className={styles.infoValue} contentEditable suppressContentEditableWarning>07 de Julho, 2025</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Departamento</div>
              <div className={styles.infoValue} contentEditable suppressContentEditableWarning>Tecnologia da Informação</div>
            </div>
          </div>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Resumo Executivo</h2>
            <p style={{ color: "#666", lineHeight: 1.8, fontSize: "1.1em" }} contentEditable suppressContentEditableWarning>
              Durante o período analisado, o departamento de T.I executou com sucesso 85% das atividades planejadas, 
              mantendo o foco na modernização da infraestrutura, segurança da informação e suporte aos usuários. 
              Os principais destaques incluem a implementação do novo sistema de backup, atualização da rede corporativa 
              e treinamento da equipe em novas tecnologias.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Atividades Realizadas</h2>
            <div className={styles.activityGrid}>
              {atividades.map((a, i) => (
                <div className={styles.activityCard} key={i}>
                  <div className={styles.activityHeader}>
                    <h3 className={styles.activityTitle} contentEditable suppressContentEditableWarning>{a.titulo}</h3>
                    <span className={
                      a.status === "concluido"
                        ? `${styles.status} ${styles.statusConcluido}`
                        : a.status === "em-andamento"
                        ? `${styles.status} ${styles.statusEmAndamento}`
                        : `${styles.status} ${styles.statusPendente}`
                    } contentEditable suppressContentEditableWarning>{a.status === "concluido" ? "Concluído" : a.status === "em-andamento" ? "Em Andamento" : "Pendente"}</span>
                  </div>
                  <p className={styles.activityDescription} contentEditable suppressContentEditableWarning>{a.descricao}</p>
                  <div className={styles.activityMeta}>
                    <span contentEditable suppressContentEditableWarning>Prazo: {a.prazo}</span>
                    <span contentEditable suppressContentEditableWarning>Prioridade: {a.prioridade}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Indicadores de Performance</h2>
            <div className={styles.metrics}>
              {metricas.map((m, i) => (
                <div className={styles.metricCard} key={i}>
                  <div className={styles.metricNumber} contentEditable suppressContentEditableWarning>{m.numero}</div>
                  <div className={styles.metricLabel} contentEditable suppressContentEditableWarning>{m.label}</div>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.section}>
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
          </section>
        </div>
        <footer className={styles.footer}>
          <p style={{ color: "#666", marginBottom: 20 }} contentEditable suppressContentEditableWarning>
            Este relatório apresenta um resumo das principais atividades realizadas pelo Departamento de T.I no período especificado.
            Para informações detalhadas ou esclarecimentos, entre em contato com a coordenação do departamento.
          </p>
          <div className={styles.signature}>
            <div className={styles.signatureBlock}>
              <div className={styles.signatureLine}></div>
              <div className={styles.signatureLabel} contentEditable suppressContentEditableWarning>João Silva<br/>Coordenador de T.I</div>
            </div>
            <div className={styles.signatureBlock}>
              <div className={styles.signatureLine}></div>
              <div className={styles.signatureLabel} contentEditable suppressContentEditableWarning>Maria Santos<br/>Gerente de Operações</div>
            </div>
            <div className={styles.signatureBlock}>
              <div className={styles.signatureLine}></div>
              <div className={styles.signatureLabel} contentEditable suppressContentEditableWarning>Carlos Oliveira<br/>Diretor Executivo</div>
            </div>
          </div>
        </footer>
      </div>
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}>
        <button onClick={gerarPDF} style={{ background: "#667eea", color: "white", border: 0, borderRadius: 8, padding: "12px 24px", fontWeight: 600, fontSize: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", cursor: "pointer" }}>
          Gerar PDF
        </button>
      </div>
    </div>
  );
}
