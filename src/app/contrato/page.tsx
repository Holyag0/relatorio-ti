"use client";

import { useRef, useState } from "react";
import styles from "./contrato.module.css";

export default function Contrato() {
  const contratoRef = useRef(null);
  const [painelAberto, setPainelAberto] = useState(true);

  // Função para gerar PDF
  const gerarPDF = async () => {
    if (!contratoRef.current || typeof window === 'undefined') return;
    
    try {
      document.body.classList.add("exportando-pdf");
      
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      
      const canvas = await html2canvas(contratoRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = 210;
      const pageHeight = 295;
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
      
      pdf.save("contrato-prestacao-servicos.pdf");
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
            <h3>📋 Contrato de Prestação de Serviços</h3>
            <p>Edite os campos diretamente no documento. Todos os campos são editáveis.</p>
            <div className={styles.dicas}>
              <strong>💡 Dicas:</strong>
              <ul>
                <li>Clique em qualquer texto para editar</li>
                <li>Use Tab para navegar entre campos</li>
                <li>O PDF será gerado com o conteúdo atual</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Documento do Contrato */}
      <div className={styles.documento} ref={contratoRef}>
        <div className={styles.cabecalho}>
          <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
        </div>

        <div className={styles.partes}>
          <div className={styles.parte}>
            <h2>CONTRATANTE</h2>
            <div className={styles.camposGrid}>
              <div className={styles.campo}>
                <label>Nome/Razão Social:</label>
                <span contentEditable suppressContentEditableWarning>SIMPLESMENTE ESCOLA DE IDIOMAS</span>
              </div>
              <div className={styles.campo}>
                <label>CNPJ:</label>
                <span contentEditable suppressContentEditableWarning>56.019.230/0001-57</span>
              </div>
            </div>
          </div>

          <div className={styles.parte}>
            <h2>CONTRATADO</h2>
            <div className={styles.camposGrid}>
              <div className={styles.campo}>
                <label>CPF:</label>
                <span contentEditable suppressContentEditableWarning>063.660.193-55</span>
              </div>
              <div className={styles.campo}>
                <label>Razão Social:</label>
                <span contentEditable suppressContentEditableWarning>Hiago dos Santos Barbosa</span>
              </div>
              <div className={styles.campo}>
                <label>CNPJ:</label>
                <span contentEditable suppressContentEditableWarning>58.715.447/0001-27</span>
              </div>
              <div className={styles.campo}>
                <label>Endereço:</label>
                <span contentEditable suppressContentEditableWarning>Francisco Mendes Oliveira, Foraleza-CE, N-933, 60351-250</span>
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
              <li>• Desenvolvimento e manutenção de sistemas web;</li>
              <li>• Análise de requisitos e especificações técnicas;</li>
              <li>• Implementação de funcionalidades conforme demandas da CONTRATANTE;</li>
              <li>• Suporte técnico aos sistemas desenvolvidos;</li>
              <li>• Documentação técnica dos projetos.</li>
            </ul>
          </div>

          <div className={styles.clausula}>
            <h3>CLÁUSULA 2ª – DA VIGÊNCIA</h3>
            <p contentEditable suppressContentEditableWarning>
              Este contrato terá vigência de <span contentEditable suppressContentEditableWarning>X</span> (<span contentEditable suppressContentEditableWarning>X</span>) meses, com início em <span contentEditable suppressContentEditableWarning>00/00/0000</span> e término em <span contentEditable suppressContentEditableWarning>00/00/0000</span>, podendo ser renovado mediante acordo entre as partes.
            </p>
          </div>

          <div className={styles.clausula}>
            <h3>CLÁUSULA 3ª – DA CARGA HORÁRIA</h3>
            <p contentEditable suppressContentEditableWarning>
              O CONTRATADO prestará os serviços em regime de <span contentEditable suppressContentEditableWarning>X</span> (<span contentEditable suppressContentEditableWarning>X</span>) horas diárias, de segunda a sexta-feira, totalizando <span contentEditable suppressContentEditableWarning>X</span> (<span contentEditable suppressContentEditableWarning>X</span>) horas semanais e <span contentEditable suppressContentEditableWarning>X</span> (<span contentEditable suppressContentEditableWarning>X</span>) horas mensais.
            </p>
            <p contentEditable suppressContentEditableWarning>
              <strong>Parágrafo Único:</strong> O horário de trabalho será definido de comum acordo entre as partes, respeitando as necessidades operacionais da CONTRATANTE.
            </p>
          </div>

          <div className={styles.clausula}>
            <h3>CLÁUSULA 4ª – DA REMUNERAÇÃO</h3>
            <p contentEditable suppressContentEditableWarning>
              Pelos serviços prestados, a CONTRATANTE pagará ao CONTRATADO o valor mensal de R$ <span contentEditable suppressContentEditableWarning>0.000,00</span> (<span contentEditable suppressContentEditableWarning>X mil reais</span>).
            </p>
            <ol contentEditable suppressContentEditableWarning>
              <li>• O pagamento será efetuado até o dia 12 (doze) do mês subsequente à prestação dos serviços;</li>
              <li>• O valor será pago mediante apresentação de nota fiscal de serviços emitida pelo CONTRATADO;</li>
              <li>• Sobre o valor pago incidirão os tributos previstos na legislação vigente.</li>
            </ol>
          </div>

          <div className={styles.clausula}>
            <h3>CLÁUSULA 5ª – OBRIGAÇÕES DO CONTRATADO</h3>
            <p contentEditable suppressContentEditableWarning>São obrigações do CONTRATADO:</p>
            <ol contentEditable suppressContentEditableWarning>
              <li>• Executar os serviços com qualidade, pontualidade e dentro dos prazos estabelecidos;</li>
              <li>• Manter sigilo absoluto sobre informações confidenciais da CONTRATANTE;</li>
              <li>• Utilizar equipamentos e ferramentas adequadas para a execução dos serviços;</li>
              <li>• Comunicar imediatamente qualquer irregularidade ou impedimento;</li>
              <li>• Emitir nota fiscal de serviços mensalmente;</li>
              <li>• Cumprir a carga horária estabelecida.</li>
            </ol>
          </div>

          <div className={styles.clausula}>
            <h3>CLÁUSULA 6ª – OBRIGAÇÕES DA CONTRATANTE</h3>
            <p contentEditable suppressContentEditableWarning>São obrigações da CONTRATANTE:</p>
            <ol contentEditable suppressContentEditableWarning>
              <li>• Fornecer todas as informações necessárias para a execução dos serviços;</li>
              <li>• Efetuar o pagamento na forma e prazo estabelecidos;</li>
              <li>• Disponibilizar acesso aos sistemas e ferramentas necessários;</li>
              <li>• Fornecer ambiente adequado para o trabalho, quando presencial;</li>
              <li>• Comunicar alterações nas especificações dos projetos.</li>
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
              <li>• Por mútuo acordo entre as partes;</li>
              <li>• Por qualquer das partes, mediante aviso prévio de 30 (trinta) dias;</li>
              <li>• Por justa causa, independentemente de aviso prévio;</li>
              <li>• Por descumprimento de qualquer cláusula contratual.</li>
            </ol>
          </div>

          <div className={styles.clausula}>
            <h3>CLÁUSULA 10ª – DISPOSIÇÕES GERAIS</h3>
            <ol contentEditable suppressContentEditableWarning>
              <li>• Este contrato não gera vínculo empregatício entre as partes;</li>
              <li>• Alterações contratuais devem ser formalizadas por escrito;</li>
              <li>• O CONTRATADO é responsável pelos tributos incidentes sobre sua atividade empresarial.</li>
            </ol>
          </div>

          <div className={styles.clausula}>
            <h3>CLÁUSULA 11ª – DO FORO</h3>
            <p contentEditable suppressContentEditableWarning>
              Para dirimir questões oriundas deste contrato, fica eleito o foro da Comarca de Fortaleza/CE, com renúncia expressa a qualquer outro.
            </p>
          </div>
        </div>

        <div className={styles.assinaturas}>
          <p className={styles.localData}>
            Fortaleza/CE, <span contentEditable suppressContentEditableWarning>X</span> de <span contentEditable suppressContentEditableWarning>julho</span> de <span contentEditable suppressContentEditableWarning>2025</span>.
          </p>

          <div className={styles.assinatura}>
            <div className={styles.contratanteAssinatura}>
              <h4>CONTRATANTE:</h4>
              <p contentEditable suppressContentEditableWarning>SIMPLESMENTE ESCOLA DE IDIOMAS</p>
              <p><strong>CNPJ:</strong> <span contentEditable suppressContentEditableWarning>56.019.230/0001-57</span></p>
              <p><strong>Representante Legal:</strong> <span contentEditable suppressContentEditableWarning>___________________________</span></p>
            </div>

            <div className={styles.contratadoAssinatura}>
              <h4>CONTRATADO:</h4>
              <p><strong>NOME:</strong> <span contentEditable suppressContentEditableWarning>Hiago dos Santos Barbosa</span></p>
              <p><strong>CPF:</strong> <span contentEditable suppressContentEditableWarning>063.660.193-55</span></p>
              <p><strong>EMPRESA – CNPJ:</strong> <span contentEditable suppressContentEditableWarning>58.715.447/0001-27</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 