"use client";
import { useRef, useState, useEffect } from "react";
import styles from "./contrato.module.css";

export default function Contrato() {
  const contratoRef = useRef<HTMLDivElement>(null);
  const [invisibleSpaces, setInvisibleSpaces] = useState(0);

  // Carregar configuração salva ao inicializar
  useEffect(() => {
    const saved = localStorage.getItem('contratoSpacing');
    if (saved) {
      setInvisibleSpaces(parseInt(saved));
    }
  }, []);

  const addInvisibleSpace = () => {
    setInvisibleSpaces(prev => prev + 1);
  };

  const removeInvisibleSpace = () => {
    setInvisibleSpaces(prev => Math.max(0, prev - 1));
  };

  const resetInvisibleSpaces = () => {
    setInvisibleSpaces(0);
  };

  const saveSpacingConfig = () => {
    localStorage.setItem('contratoSpacing', invisibleSpaces.toString());
    alert('Configuração de espaçamento salva!');
  };

  const loadSpacingConfig = () => {
    const saved = localStorage.getItem('contratoSpacing');
    if (saved) {
      setInvisibleSpaces(parseInt(saved));
      alert('Configuração de espaçamento carregada!');
    } else {
      alert('Nenhuma configuração salva encontrada.');
    }
  };

  const gerarPDF = async () => {
    if (!contratoRef.current) return;
    
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      document.body.classList.add("exportando-pdf");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capturar seções do documento
      const sections = [];
      const clausulas = contratoRef.current.querySelectorAll(`.${styles.clausula}`);
      const cabecalho = contratoRef.current.querySelector(`.${styles.cabecalho}`);
      const partes = contratoRef.current.querySelector(`.${styles.partes}`);
      const assinaturas = contratoRef.current.querySelector(`.${styles.assinaturas}`);
      const dataLocal = contratoRef.current.querySelector(`.${styles.dataLocal}`);
      
      // Seção 1: Cabeçalho + Partes + Primeiras 3 cláusulas (1, 2, 3)
      if (cabecalho && partes && clausulas.length >= 3) {
        const section1 = document.createElement('div');
        section1.appendChild(cabecalho.cloneNode(true));
        section1.appendChild(partes.cloneNode(true));
        
        // Criar grupo para as primeiras 3 cláusulas
        const clausulaGroup1 = document.createElement('div');
        clausulaGroup1.className = styles.clausulaGroup;
        clausulaGroup1.appendChild(clausulas[0].cloneNode(true)); // Cláusula 1
        clausulaGroup1.appendChild(clausulas[1].cloneNode(true)); // Cláusula 2
        clausulaGroup1.appendChild(clausulas[2].cloneNode(true)); // Cláusula 3
        section1.appendChild(clausulaGroup1);
        
        section1.style.background = 'white';
        section1.style.padding = '40px';
        section1.style.width = '800px';
        section1.style.position = 'absolute';
        section1.style.left = '-9999px';
        document.body.appendChild(section1);
        
        const canvas = await html2canvas(section1, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: 800,
          height: section1.scrollHeight,
          scrollX: 0,
          scrollY: 0
        });
        
        sections.push(canvas.toDataURL("image/png", 1.0));
        document.body.removeChild(section1);
      }
      
      // Seção 2: Cláusulas 4, 5, 6, 7, 8
      if (clausulas.length >= 8) {
        const section2 = document.createElement('div');
        
        // Criar grupo para cláusulas 4, 5, 6, 7, 8
        const clausulaGroup2 = document.createElement('div');
        clausulaGroup2.className = `${styles.clausulaGroup} ${styles.fiveClauses}`;
        clausulaGroup2.appendChild(clausulas[3].cloneNode(true)); // Cláusula 4
        clausulaGroup2.appendChild(clausulas[4].cloneNode(true)); // Cláusula 5
        clausulaGroup2.appendChild(clausulas[5].cloneNode(true)); // Cláusula 6
        clausulaGroup2.appendChild(clausulas[6].cloneNode(true)); // Cláusula 7
        clausulaGroup2.appendChild(clausulas[7].cloneNode(true)); // Cláusula 8
        section2.appendChild(clausulaGroup2);
        
        section2.style.background = 'white';
        section2.style.padding = '40px';
        section2.style.width = '800px';
        section2.style.position = 'absolute';
        section2.style.left = '-9999px';
        document.body.appendChild(section2);
        
        const canvas = await html2canvas(section2, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: 800,
          height: section2.scrollHeight,
          scrollX: 0,
          scrollY: 0
        });
        
        sections.push(canvas.toDataURL("image/png", 1.0));
        document.body.removeChild(section2);
      }
      
      // Seção 3: Cláusulas 9, 10, 11 + Assinaturas + Data/Local
      if (clausulas.length >= 11 && assinaturas && dataLocal) {
        const section3 = document.createElement('div');
        
        // Criar grupo para cláusulas 9, 10, 11
        const clausulaGroup3 = document.createElement('div');
        clausulaGroup3.className = `${styles.clausulaGroup} ${styles.threeClausesWithFooter}`;
        clausulaGroup3.appendChild(clausulas[8].cloneNode(true)); // Cláusula 9
        clausulaGroup3.appendChild(clausulas[9].cloneNode(true)); // Cláusula 10
        clausulaGroup3.appendChild(clausulas[10].cloneNode(true)); // Cláusula 11
        section3.appendChild(clausulaGroup3);
        
        // Adicionar espaços invisíveis antes das assinaturas
        if (invisibleSpaces > 0) {
          const invisibleSpaceDiv = document.createElement('div');
          invisibleSpaceDiv.className = styles.invisibleSpace;
          invisibleSpaceDiv.style.height = `${invisibleSpaces * 20}px`;
          section3.appendChild(invisibleSpaceDiv);
        }
        
        // Adicionar assinaturas e data/local
        section3.appendChild(assinaturas.cloneNode(true));
        section3.appendChild(dataLocal.cloneNode(true));
        
        section3.style.background = 'white';
        section3.style.padding = '40px';
        section3.style.width = '800px';
        section3.style.position = 'absolute';
        section3.style.left = '-9999px';
        document.body.appendChild(section3);
        
        const canvas = await html2canvas(section3, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: 800,
          height: section3.scrollHeight,
          scrollX: 0,
          scrollY: 0
        });
        
        sections.push(canvas.toDataURL("image/png", 1.0));
        document.body.removeChild(section3);
      }
      
      // Criar PDF com múltiplas páginas
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
        compress: true
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const contentWidth = pageWidth - (margin * 2);
      
      // Adicionar cada seção como uma página separada
      for (let i = 0; i < sections.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const imgProps = pdf.getImageProperties(sections[i]);
        const contentHeight = (imgProps.height * contentWidth) / imgProps.width;
        
        // Se a seção for muito alta, dividir em múltiplas páginas
        if (contentHeight <= pageHeight - (margin * 2)) {
          pdf.addImage(sections[i], "PNG", margin, margin, contentWidth, contentHeight);
        } else {
          // Dividir seção em múltiplas páginas
          let position = 0;
          let remainingHeight = contentHeight;
          
          while (remainingHeight > 0) {
            pdf.addImage(
              sections[i],
              "PNG",
              margin,
              margin - position,
              contentWidth,
              contentHeight
            );
            
            remainingHeight -= (pageHeight - (margin * 2));
            position += (pageHeight - (margin * 2));
            
            if (remainingHeight > 0) {
              pdf.addPage();
            }
          }
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
        {/* Controles de espaçamento invisível */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          minWidth: '280px'
        }}>
          <h3 style={{ color: '#4a90e2', margin: '0 0 12px 0', fontSize: '16px' }}>
            Controle de Espaçamento
          </h3>
          <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}>
            Ajuste a posição do rodapé na página 3
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#333' }}>Espaços invisíveis: {invisibleSpaces}</span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button onClick={addInvisibleSpace} style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              + Espaço
            </button>
            <button onClick={removeInvisibleSpace} style={{
              background: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              - Espaço
            </button>
          </div>
          
          <button onClick={resetInvisibleSpaces} style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '600',
            width: '100%',
            marginBottom: '8px'
          }}>
            Resetar
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={saveSpacingConfig} style={{
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              flex: 1
            }}>
              Salvar
            </button>
            <button onClick={loadSpacingConfig} style={{
              background: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              flex: 1
            }}>
              Carregar
            </button>
          </div>
        </div>

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
            <h3>CLÁUSULA 1ª – DO OBJETO</h3>
            <p contentEditable suppressContentEditableWarning>
              O presente contrato tem por objeto a prestação de serviços de desenvolvimento de sistemas pelo CONTRATADO à CONTRATANTE, incluindo:
            </p>
            <ul contentEditable suppressContentEditableWarning>
              <li>Desenvolvimento e manutenção de sistemas web;</li>
              <li>Análise de requisitos e especificações técnicas;</li>
              <li>Implementação de funcionalidades conforme demandas da CONTRATANTE;</li>
              <li>Suporte técnico aos sistemas desenvolvidos;</li>
              <li>Documentação técnica dos projetos.</li>
            </ul>
          </div>
          
          <div className={styles.clausula}>
            <h3>CLÁUSULA 2ª – DA VIGÊNCIA</h3>
            <p contentEditable suppressContentEditableWarning>
              Este contrato terá vigência de <span contentEditable suppressContentEditableWarning>12 (doze)</span> meses, com início em <span contentEditable suppressContentEditableWarning>01/01/2025</span> e término em <span contentEditable suppressContentEditableWarning>31/12/2025</span>, podendo ser renovado mediante acordo entre as partes.
            </p>
          </div>
          
          <div className={styles.clausula}>
            <h3>CLÁUSULA 3ª – DA CARGA HORÁRIA</h3>
            <p contentEditable suppressContentEditableWarning>
              O CONTRATADO prestará os serviços em regime de <span contentEditable suppressContentEditableWarning>8 (oito)</span> horas diárias, de segunda a sexta-feira, totalizando <span contentEditable suppressContentEditableWarning>40 (quarenta)</span> horas semanais e <span contentEditable suppressContentEditableWarning>160 (cento e sessenta)</span> horas mensais.
            </p>
            <p contentEditable suppressContentEditableWarning>
              Parágrafo Único: O horário de trabalho será definido de comum acordo entre as partes, respeitando as necessidades operacionais da CONTRATANTE.
            </p>
          </div>
          
          <div className={styles.clausula}>
            <h3>CLÁUSULA 4ª – DA REMUNERAÇÃO</h3>
            <p contentEditable suppressContentEditableWarning>
              Pelos serviços prestados, a CONTRATANTE pagará ao CONTRATADO o valor mensal de <span contentEditable suppressContentEditableWarning>R$ 3.580,00 (Três mil, quinhentos e oitenta reais)</span>.
            </p>
            <ol contentEditable suppressContentEditableWarning>
              <li>O pagamento será efetuado até o dia 12 (doze) do mês subsequente à prestação dos serviços;</li>
              <li>O valor será pago mediante apresentação de nota fiscal de serviços emitida pelo CONTRATADO;</li>
              <li>Sobre o valor pago incidirão os tributos previstos na legislação vigente.</li>
            </ol>
          </div>
          
          <div className={styles.clausula}>
            <h3>CLÁUSULA 5ª – OBRIGAÇÕES DO CONTRATADO</h3>
            <p contentEditable suppressContentEditableWarning>São obrigações do CONTRATADO:</p>
            <ol contentEditable suppressContentEditableWarning>
              <li>Executar os serviços com qualidade, pontualidade e dentro dos prazos estabelecidos;</li>
              <li>Manter sigilo absoluto sobre informações confidenciais da CONTRATANTE;</li>
              <li>Utilizar equipamentos e ferramentas adequadas para a execução dos serviços;</li>
              <li>Comunicar imediatamente qualquer irregularidade ou impedimento;</li>
              <li>Emitir nota fiscal de serviços mensalmente;</li>
              <li>Cumprir a carga horária estabelecida.</li>
            </ol>
          </div>
          
          <div className={styles.clausula}>
            <h3>CLÁUSULA 6ª – OBRIGAÇÕES DA CONTRATANTE</h3>
            <p contentEditable suppressContentEditableWarning>São obrigações da CONTRATANTE:</p>
            <ol contentEditable suppressContentEditableWarning>
              <li>Fornecer todas as informações necessárias para a execução dos serviços;</li>
              <li>Efetuar o pagamento na forma e prazo estabelecidos;</li>
              <li>Disponibilizar acesso aos sistemas e ferramentas necessários;</li>
              <li>Fornecer ambiente adequado para o trabalho, quando presencial;</li>
              <li>Comunicar alterações nas especificações dos projetos.</li>
            </ol>
          </div>
          
          <div className={styles.clausula}>
            <h3>CLÁUSULA 7ª – CONFIDENCIALIDADE</h3>
            <p contentEditable suppressContentEditableWarning>
              O CONTRATADO compromete-se a manter absoluto sigilo sobre dados, informações, processos, clientes e demais aspectos relacionados às atividades da CONTRATANTE, mesmo após o término deste contrato.
            </p>
          </div>
          
          <div className={styles.clausula}>
            <h3>CLÁUSULA 8ª – PROPRIEDADE INTELECTUAL</h3>
            <p contentEditable suppressContentEditableWarning>
              Todos os sistemas, códigos, documentações e demais materiais desenvolvidos pelo CONTRATADO no âmbito deste contrato serão de propriedade exclusiva da CONTRATANTE.
            </p>
          </div>
          
          <div className={styles.clausula}>
            <h3>CLÁUSULA 9ª – RESCISÃO</h3>
            <p contentEditable suppressContentEditableWarning>Este contrato poderá ser rescindido:</p>
            <ol contentEditable suppressContentEditableWarning>
              <li>Por mútuo acordo entre as partes;</li>
              <li>Por qualquer das partes, mediante aviso prévio de 30 (trinta) dias;</li>
              <li>Por justa causa, independentemente de aviso prévio;</li>
              <li>Por descumprimento de qualquer cláusula contratual.</li>
            </ol>
          </div>
          
          <div className={styles.clausula}>
            <h3>CLÁUSULA 10ª – DISPOSIÇÕES GERAIS</h3>
            <ol contentEditable suppressContentEditableWarning>
              <li>Este contrato não gera vínculo empregatício entre as partes;</li>
              <li>Alterações contratuais devem ser formalizadas por escrito;</li>
              <li>O CONTRATADO é responsável pelos tributos incidentes sobre sua atividade empresarial.</li>
            </ol>
          </div>
          
          <div className={styles.clausula}>
            <h3>CLÁUSULA 11ª – DO FORO</h3>
            <p contentEditable suppressContentEditableWarning>
              Para dirimir questões oriundas deste contrato, fica eleito o foro da Comarca de Fortaleza/CE, com renúncia expressa a qualquer outro.
            </p>
          </div>
        </div>
        
        {/* Indicador visual de espaços invisíveis */}
        {invisibleSpaces > 0 && (
          <div style={{
            height: `${invisibleSpaces * 20}px`,
            background: 'rgba(74, 144, 226, 0.1)',
            border: '2px dashed rgba(74, 144, 226, 0.3)',
            borderRadius: '4px',
            margin: '20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4a90e2',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {invisibleSpaces} espaço(s) invisível(is) - {invisibleSpaces * 20}px
          </div>
        )}
        
        <div className={styles.assinaturas}>
          <div className={styles.assinatura}>
            <div className={styles.linha}></div>
            <p contentEditable suppressContentEditableWarning>CONTRATANTE:</p>
            <p contentEditable suppressContentEditableWarning>SIMPLESMENTE ESCOLA DE IDIOMAS</p>
            <p contentEditable suppressContentEditableWarning>CNPJ: 56.019.230/0001-57</p>
            <p contentEditable suppressContentEditableWarning>Representante Legal: ___________________________</p>
          </div>
          <div className={styles.assinatura}>
            <div className={styles.linha}></div>
            <p contentEditable suppressContentEditableWarning>CONTRATADO:</p>
            <p contentEditable suppressContentEditableWarning>NOME: ___________________________</p>
            <p contentEditable suppressContentEditableWarning>CPF: ___________________________</p>
            <p contentEditable suppressContentEditableWarning>EMPRESA – CNPJ: ___________________________</p>
          </div>
        </div>
        
        <div className={styles.dataLocal}>
          <p contentEditable suppressContentEditableWarning>Fortaleza/CE, <span contentEditable suppressContentEditableWarning>15</span> de julho de 2025.</p>
        </div>
      </div>
    </div>
  );
} 