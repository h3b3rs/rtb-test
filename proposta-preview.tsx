"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

interface ItemPreco {
  quantidade: string
  descricao: string
  valorTotal: string
}

interface PropostaData {
  logoCliente?: string
  logoClienteUrl?: string
  servicosExecutar: string
  numeroProposta: string
  dataProposta: Date
  nomeCliente: string
  localPrestacao: string
  objetivoCliente: string
  servicosEspecializados: string
  dadosTecnicos?: string
  normasTecnicas?: string
  escopoFornecimento: string
  prazoExecucao: string
  validadeDias: string
  dataValidade: Date | null
  textoComplementarPrecos?: string
  itensPrecos: ItemPreco[]
  valorTotalGeral: number
  percentualAssinatura: string
  percentualEventograma: string
  solicitante?: string
  cidade?: string
  revisao?: string
  confidencial?: string
  elaboradoPor?: string
}

interface PropostaPreviewProps {
  data: PropostaData
  onEdit: () => void
}

// Função para gerar PDF usando a funcionalidade nativa do navegador
const handleDownloadPDF = (data: PropostaData) => {
  // Esconder botões de ação
  const actionButtons = document.querySelector(".print\\:hidden")
  if (actionButtons) {
    ;(actionButtons as HTMLElement).style.display = "none"
  }

  // Configurar título do documento
  const originalTitle = document.title
  document.title = `Proposta_${data.numeroProposta}_${data.nomeCliente}`

  // Adicionar estilos específicos para impressão com cores
  const printStyles = document.createElement("style")
  printStyles.textContent = `
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      @page {
        margin: 0 !important;
        size: A4 !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Correções específicas para o PDF */
      .top-\\[68\\%\\] {
        top: 55% !important;
      }
      
      .bottom-16 {
        bottom: 14rem !important;
      }
      
      .h-16 {
        height: 3.5rem !important;
      }

      .left-\\[58\\%\\] {
        left: 50% !important;
      }

      .right-16 {
        right: 2rem !important;
      }
    }
  `
  document.head.appendChild(printStyles)

  // Aguardar um momento para os estilos serem aplicados
  setTimeout(() => {
    window.print()

    // Limpar após impressão
    setTimeout(() => {
      document.title = originalTitle
      document.head.removeChild(printStyles)
      if (actionButtons) {
        ;(actionButtons as HTMLElement).style.display = "flex"
      }
    }, 1000)
  }, 500)
}

const handlePrint = () => {
  window.print()
}

export function PropostaPreview({ data, onEdit }: PropostaPreviewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white">
      {/* Botões de ação */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg print:hidden">
        <h2 className="text-xl font-bold">Visualização da Proposta</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            Editar
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={() => handleDownloadPDF(data)}>
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </div>

      {/* Documento da Proposta */}
      <div className="bg-white print-area">
        {/* Capa da proposta com imagem */}
<div className="relative w-[210mm] h-[297mm] print:h-[297mm] print:w-[210mm] overflow-hidden bg-white print-area">
  <img
    src="/images/capa.png"
    alt="Capa da Proposta RTB"
    className="w-full h-full object-cover"
  />

  {/* Caixa de informações sobreposta */}
<div className="absolute bg-[#F1F1F1] bg-opacity-95 p-6 rounded-lg shadow-lg w-80 z-10 box-informacoes">
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <strong className="text-gray-800">PROPOSTA:</strong>
        <span className="font-medium">{data.numeroProposta}</span>
      </div>
      <div className="flex justify-between">
        <strong className="text-gray-800">CLIENTE:</strong>
        <span className="font-medium">{data.nomeCliente}</span>
      </div>
      <div className="flex justify-between">
        <strong className="text-gray-800">SOLICITANTE:</strong>
        <span className="font-medium">{data.solicitante || data.nomeCliente}</span>
      </div>
      <div className="flex justify-between">
        <strong className="text-gray-800">CIDADE:</strong>
        <span className="font-medium">{data.cidade || data.localPrestacao}</span>
      </div>
      <div className="flex justify-between">
        <strong className="text-gray-800">REVISÃO:</strong>
        <span className="font-medium">{data.revisao || "01"}</span>
      </div>
      <div className="flex justify-between">
        <strong className="text-gray-800">DATA EMISSÃO:</strong>
        <span className="font-medium">{format(data.dataProposta, "dd/MM/yyyy")}</span>
      </div>
      <div className="flex justify-between">
        <strong className="text-gray-800">DATA VALIDADE:</strong>
        <span className="font-medium">
          {data.dataValidade ? format(data.dataValidade, "dd/MM/yyyy") : "N/A"}
        </span>
      </div>
      <div className="flex justify-between">
        <strong className="text-gray-800">CONFIDENCIAL:</strong>
        <span className="font-medium">{data.confidencial || "Sim"}</span>
      </div>
      <div className="flex justify-between">
        <strong className="text-gray-800">ELABORADO POR:</strong>
        <span className="font-medium text-blue-900">{data.elaboradoPor || "RTB HYDRO"}</span>
      </div>
    </div>
  </div>
</div>


        {/* Segunda página com informações da proposta */}
        <div className="page-break"></div>
        <div className="relative min-h-screen bg-white p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">
                PROPOSTA
                <span className="text-red-600"> COMERCIAL</span>
              </h1>
              <p className="text-lg mt-2">{data.servicosExecutar || "SERVIÇOS ESPECIALIZADOS EM ENERGIA"}</p>
            </div>
            <img src="/images/logo-rtb-hydro-oficial.png" alt="RTB HYDRO" className="h-12 object-contain" />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Informações da Proposta:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Nº:</strong> {data.numeroProposta}
                </div>
                <div>
                  <strong>Data:</strong> {format(data.dataProposta, "dd/MM/yyyy")}
                </div>
                <div>
                  <strong>Cliente:</strong> {data.nomeCliente}
                </div>
                <div>
                  <strong>Local:</strong> {data.localPrestacao}
                </div>
                <div>
                  <strong>Validade:</strong> {data.validadeDias} dias
                  {data.dataValidade && ` (até ${format(data.dataValidade, "dd/MM/yyyy", { locale: ptBR })})`}
                </div>
                <div>
                  <strong>Versão:</strong> 01
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4MnOJ0My66nDOkULh4jno6L053b2hq.png"
                alt="Usina Hidrelétrica"
                className="w-full h-48 object-cover rounded"
                style={{ objectPosition: "center 30%" }}
              />
            </div>
          </div>

          {/* Índice */}
          <div className="mb-8">
            <div className="bg-blue-100 px-4 py-2 font-bold mb-4">ÍNDICE</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between border-b py-1">
                  <span>1-APRESENTAÇÃO</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span>2-INTRODUÇÃO</span>
                  <span>4</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span>3-OBJETIVO</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span>4-VISITA TÉCNICA</span>
                  <span>6</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span>5-DADOS TÉCNICOS DE REFERÊNCIA</span>
                  <span>7</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between border-b py-1">
                  <span>6-NORMAS TÉCNICAS E PRESCRIÇÕES</span>
                  <span>8</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span>4-DAS CONDIÇÕES DE COMERCIALIZAÇÃO E PREÇOS</span>
                  <span>7</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span>8-PRAZO DE EXECUÇÃO</span>
                  <span>8</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span>9-VALIDADE DA PROPOSTA</span>
                  <span>9</span>
                </div>
              </div>
            </div>
          </div>

          {/* Apresentação */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">1-APRESENTAÇÃO</h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>A empresa RTB destaca-se no Setor de Energia no que se refere a:</p>

              <p>
                <strong>Sistema de Transmissão e Distribuição</strong>- O Grupo realiza construção e montagem de
                subestação, linha de transmissão em regime de EPC, EPCM, montagem eletromecânica e elétrica em plantas
                industriais e estudos de viabilidade técnica e econômica estruturando o investimento de formar
                abrangente e consistente.
              </p>

              <p>
                <strong>Usina Termoelétrica</strong>- O grupo realiza implantações em regime de EPC, EPCM, EPCM Mecânico
                ou integração eletromecânica, estudos de viabilidade técnica e econômica estruturando o investimento de
                forma abrangente e consistente. Nas Termoelétricas oferece soluções de: EPC da planta completa; EPCM
                (Civil, Elétrico e Mecânico); EPCM Mecânico (Gerenciamento, Aquisição e Integração Mecânica); Fabricação
                e Integração Mecânica (Fabricações, interligações e montagens mecânica); Integração eletromecânica de
                todos equipamentos; Montagem e alinhamento de turbogerador; Fabricação e montagem de pipe racks
                Fabricação e montagem de sistema de tratamento água com fuligem; Fabricação e montagem de sistema de
                separação e processamento da palha de cana; Fabricação e montagem de transportadores; Fabricação de
                peneiras rotativas; Fabricação de Tanques; Pintura e tratamento anti-corrosivo da planta; Controle de
                performance da Usina Premissas Previstas x Realizadas; Nas Térmicas Solares oferece soluções de: EPC da
                planta completa tanto para geração de energia com espelhos parabólicos quanto fresnel; Fornecimento de
                todos os equipamentos (espelhos parabólicos, coletores, motores, geradores, tubulações, válvulas..etc);
                Interligação eletromecânica;
              </p>

              <p>
                <strong>Hidroelétrica</strong>- O grupo realiza manutenções, reparos e operações de Usinas
                Hidrelétricas. Nas Hidrelétricas oferece soluções de: Planejamento e operação de usinas (engenharia de
                operação, pré, tempo real e pós operação); Planejamento e manutenção preventiva programada (MPP) e
                corretiva de usinas hidrelétricas e termelétrica; Fabricação, usinagem e montagem de componentes e
                equipamentos de usinas hidrelétricas; Recuperação de usinas (civil, elétrica, mecânica, hidráulica,
                automação, equipamentos auxiliares, etc); Instalação de sistemas e equipamentos de geração e sistemas
                auxiliares; Instrumentação; Pintura industrial e tratamento anti-corrosão da plantas de cogeração,
                usinas hidrelétricas e linhas de transmissão (torres); Manutenção preventiva e corretiva de eclusas e
                estruturas metálicas de usinas (comportas, vertedouros, pórticos, etc).
              </p>

              <p>
                A RTB é uma empresa que fornece desenvolvimento e instalação no que se refere a geração de energia, para
                modelo estratégico de referência Tecnológica, Reguladora, Econômica e Comercial, inserindo esta energia
                matriz energética nacional.
              </p>

              <p>
                <strong>Destacando-se em:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Análise de viabilidade para exportação de Energia</li>
                <li>Estudos e melhoramento de térmicas existentes ou greenfield.</li>
                <li>Serviços de Engenharia e implantação em Energia.</li>
                <li>Instalações e montagens mecânicas;</li>
                <li>Instalações e montagens elétricas</li>
                <li>Projetos e fabricação de Trocadores de Calor.</li>
                <li>Projetos e fabricação de Comportas e válvulas dispersoras;</li>
                <li>Projetos e fabricação de esteiras transportadoras;</li>
                <li>Projetos e fabricação de equipamento de caldeiraria;</li>
                <li>Usinagem de peças em geral</li>
              </ul>
            </div>
          </div>

          {/* Introdução */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">2-INTRODUÇÃO</h2>

            <div className="text-sm leading-relaxed space-y-6">
              <div>
                <h3 className="font-bold mb-2">2.1-Controle Ambiental.</h3>
                <div className="space-y-3">
                  <p>
                    Todas as atividades executadas pela RTB serão planejadas e monitoradas preventivamente para se
                    evitar qualquer tipo de prejuízo ou degradação ao meio ambiente.
                  </p>
                  <p>
                    Para tanto, a RTB desenvolverá e atuará na implementação de ações, recomendações e procedimentos com
                    base em documentação relacionada a diretrizes básicas de meio ambiente definidas.
                  </p>
                  <p>
                    A RTB terá como procedimento, na fase de planejamento de cada atividade, a avaliação das condições
                    de segurança do trabalho das equipes e riscos ao meio ambiente e tomará ações e medidas preventivas
                    para eliminar tais situações.
                  </p>
                  <p>
                    A RTB se responsabilizará pela limpeza, remoção e destinação de todos itens e materiais descartados,
                    gerados durante e após a manutenção, provenientes de atividades pertinentes a RTB.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">2.2-Responsabilidade Social.</h3>
                <div className="space-y-3">
                  <p>
                    As empresas da RTB adotam como prática em um dos Valores de sua política de governança corporativa o
                    "Desenvolvimento de suas atividades com Responsabilidade Social e Preservação ao Meio Ambiente" e
                    assim sendo, desenvolve junto com suas Equipes, Clientes, Fornecedores e a Sociedade em que atua,
                    ações e medidas relacionadas às práticas que visem o bem-estar social, o respeito ao meio ambiente,
                    o respeito às relações trabalhistas e a não utilização de mão-de-obra infantil entre outras.
                  </p>
                  <p>
                    A RTB atua e assegura o atendimento aos requisitos quanto ao Estatuto da Criança e do Adolescente e
                    a Norma SA 8000.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">2.3-Segurança no Trabalho.</h3>
                <div className="space-y-3">
                  <p>
                    A RTB, como medida preventiva, realiza diariamente reuniões de no máximo 10 minutos (Diálogo Diário
                    de Segurança - DDS), sempre antes do início da jornada de trabalho abordando temas referentes aos
                    riscos inerentes às atividades a serem executadas ou programadas no dia em questão.
                  </p>
                  <p>
                    A RTB também se responsabilizará pelo fornecimento de equipamentos individuais e coletivos de
                    segurança de suas equipes – EPI's e EPC's.
                  </p>
                  <p>
                    Ressaltamos que as Equipes da RTB são treinadas e certificadas nas Normas - NR
                    06/10/11/12/16/18/20/24/26/33/35, com o objetivo de desenvolver as suas atividades de acordo com os
                    principais procedimentos de segurança do trabalho.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">2.4-Parcerias da RTB.</h3>
                <div className="space-y-3">
                  <p>
                    A RTB desenvolve junto ao mercado, já algum tempo e com sucesso, a prospecção e a habilitação de
                    empresas prestadoras de serviços e de fornecedores de sistemas, equipamentos e materiais de forma
                    estratégica e complementar ao seu foco de negócio – segmentos de energia, sucroalcooleiro, papel e
                    celulose, óleo/gás/químico e petroquímico.
                  </p>
                  <p>
                    Todas as nossas parcerias baseiam-se em premissas técnicas, econômico-financeiras, fiscal, além de
                    estarem comprometidas com as políticas de qualidade e de responsabilidade socioambiental.
                  </p>
                  <p>
                    Fornecimentos de serviços executados por empresas parceiras que vierem a ser contratadas para
                    atividades especificas e/ou complementares, dentro do escopo dos serviços propostos, não isentará a
                    RTB da responsabilidade pela qualidade, pelos prazos e pela segurança patrimonial do local dos
                    serviços.
                  </p>
                  <p>
                    A RTB apresentará a(s) empresa(s) parceira(s) aos Gestores da Obra para conhecimento, na ocasião da
                    identificação dos serviços que serão executados pela(s) mesma(s), em complementaridade às nossas
                    atividades.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">2.5-Qualidade.</h3>
                <div className="space-y-3">
                  <p>
                    Todo conteúdo de fornecimento da RTB e de sua(s) parceira(s) será executado dentro do previsto pelas
                    mais modernas técnicas de manutenção e montagem sendo aplicada tudo que nesta Proposta Técnica se
                    determina a respeito, além do que, a aceitação por inspeção não isentará a RTB da responsabilidade
                    "a posterior", no tocante à qualidade dos materiais e serviços executados.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">2.6-Certificações.</h3>
                <div className="space-y-3">
                  <p>
                    A RTB é certificada por um reconhecido órgão credenciado de acordo com a norma ISO 9001, e estão
                    integradas a um Sistema de Gestão Global.
                  </p>

                  {/* Imagem dos Certificados */}
                  <div className="my-6">
                    <img
                      src="/images/certificados-rtb.png"
                      alt="Certificados RTB - ISO 9001 e Certificação de Qualidade"
                      className="w-full max-w-2xl mx-auto border border-gray-200 rounded-lg shadow-sm"
                    />
                    <p className="text-center text-xs text-gray-600 mt-2">
                      Certificado ISO 9001 e Certificação de Qualidade da RTB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">DADOS DO CLIENTE</h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="mb-2">
                  <strong>Cliente:</strong> {data.nomeCliente}
                </div>
                <div className="mb-2">
                  <strong>Local:</strong> {data.localPrestacao}
                </div>
                <div className="mb-2">
                  <strong>Solicitante:</strong> {data.nomeCliente}
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <strong>Responsável:</strong> {data.nomeCliente}
                </div>
                <div className="mb-2">
                  <strong>Local de Execução:</strong> {data.localPrestacao}
                </div>
              </div>
            </div>
          </div>

          {/* Escopo dos Serviços */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">3-OBJETIVO</h2>
            <div className="bg-yellow-100 p-4 mb-4">
              <p className="text-sm">
                <span className="bg-yellow-300 px-1">
                  A presente Proposta Comercial tem o objetivo de {data.objetivoCliente}
                </span>
              </p>
            </div>
            <div className="text-sm leading-relaxed">
              <p>{data.servicosEspecializados}</p>
              {data.dadosTecnicos && <p className="mt-4">{data.dadosTecnicos}</p>}
            </div>
          </div>

          {/* Condições de Comercialização e Preços */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">4-DAS CONDIÇÕES DE COMERCIALIZAÇÃO E PREÇOS</h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                Na apresentação do nosso Preço, para a disponibilização de equipe especializada para a execução dos
                serviços em conformidade com a Proposta Técnica RTB Nº <strong>{data.numeroProposta}</strong>
              </p>

              {/* Texto complementar se preenchido */}
              {data.textoComplementarPrecos && (
                <div className="bg-yellow-100 p-3 rounded">
                  <p>{data.textoComplementarPrecos}</p>
                </div>
              )}

              {/* Tabela de Preços */}
              <div className="overflow-x-auto mt-6">
                <table className="w-full border-collapse border border-gray-400 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-2 text-center font-bold">ITEM</th>
                      <th className="border border-gray-400 p-2 text-center font-bold">QUANT</th>
                      <th className="border border-gray-400 p-2 text-center font-bold">DESCRIÇÃO FORNECIMENTO</th>
                      <th className="border border-gray-400 p-2 text-center font-bold">VALOR TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.itensPrecos.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                        <td className="border border-gray-400 p-2 text-center">{item.quantidade}</td>
                        <td className="border border-gray-400 p-2 bg-yellow-100">{item.descricao}</td>
                        <td className="border border-gray-400 p-2 text-center bg-yellow-100">
                          R${" "}
                          {Number.parseFloat(
                            item.valorTotal.replace(/[^\d,]/g, "").replace(",", ".") || "0",
                          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={3} className="border border-gray-400 p-2 text-center">
                        TOTAL
                      </td>
                      <td className="border border-gray-400 p-2 text-center bg-yellow-100">
                        R$ {data.valorTotalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Texto adicional abaixo da tabela */}
              <div className="mt-6 text-sm space-y-3">
                <p className="font-semibold">
                  Valor Global para Fornecimento de Equipe, Consumíveis e Ferramental: R${" "}
                  {data.valorTotalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-justify">
                  Qualquer alteração das condições descritas nesta proposta, bem como qualquer alteração da legislação
                  fiscal/trabalhista/previdenciária vigente na data de apresentação desta proposta, que por modificação
                  das alíquotas e/ou criação de outros impostos, taxas ou encargos, ou mesmo limitação de isenção ou de
                  direito de crédito de impostos, venha onerar os preços ora ofertados permitirá, após sua constatação,
                  a devida correção dos mesmos preços em qualquer época.
                </p>
              </div>
            </div>
          </div>

          {/* Condições de Pagamento */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">5-CONDIÇÕES DE PAGAMENTO</h2>
            <div className="text-sm space-y-3">
              <div className="bg-yellow-100 p-3 rounded">
                <p>
                  <strong>a)</strong> {data.percentualAssinatura}% do valor total do contrato (serviços) na assinatura
                  do contrato.
                </p>
                <p className="mt-1 text-xs">NF - 30DLL - OEM</p>
                <p className="mt-2 font-medium">
                  Valor:{" "}
                  {((data.valorTotalGeral * Number.parseFloat(data.percentualAssinatura || "0")) / 100).toLocaleString(
                    "pt-BR",
                    { style: "currency", currency: "BRL" },
                  )}
                </p>
              </div>

              <div className="bg-yellow-100 p-3 rounded">
                <p>
                  <strong>b)</strong> {data.percentualEventograma}% do valor do contrato conforme cronograma.
                </p>
                <p className="mt-1 text-xs">NF - 30DLL - OEM</p>
                <p className="mt-2 font-medium">
                  Valor:{" "}
                  {((data.valorTotalGeral * Number.parseFloat(data.percentualEventograma || "0")) / 100).toLocaleString(
                    "pt-BR",
                    { style: "currency", currency: "BRL" },
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Dados para Faturamento */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">6-DADOS PARA FATURAMENTO</h2>
            <div className="text-sm space-y-4">
              <div>
                <p className="font-bold">RTB SOLUÇÕES LTDA</p>
                <p>Rua José Malaquias Paes Nº 120 – Centro</p>
                <p>Monte Mor - SP - CEP: 13.190-005</p>
                <p>Fone: (19) 3371-6206</p>
                <p>CNPJ: 37.944.939/0001-14</p>
                <p>Insc. Estadual: 465.394.112</p>
              </div>

              <div className="mt-4">
                <p className="font-bold mb-2">Dados Bancários</p>
                <p>RTB SOLUÇÕES</p>
                <p>CNPJ: 37.944.939/0001-14</p>
                <p>Banco: Itaú S/A</p>
                <p>Agência: 6474</p>
                <p>Conta Corrente: 26717-3</p>
              </div>
            </div>

            {/* Representantes Legais */}
          </div>

          {/* Representantes Legais */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">7-REPRESENTANTES LEGAIS</h2>
            <div className="text-sm space-y-4">
              <p className="text-justify">
                Os representantes legais de nossa Empresa, RTB, com poderes específicos para tratar de todos os assuntos
                referentes a esta COTAÇÃO junto a essa Companhia, inclusive para assinar o CONTRATO em caso de
                adjudicação, são:
              </p>

              <div className="mt-4">
                <p className="font-bold mb-2">Assinatura do Contrato:</p>
                <div className="space-y-3">
                  <div>
                    <p>Nome: Sérgio Pereira de Souza</p>
                    <p>Função: Diretor Superintendente</p>
                    <p>CPF: 125.351.868/88</p>
                  </div>
                  <div>
                    <p>Nome: Camila Cristina Escobar</p>
                    <p>Função: Gerente Administrativa</p>
                    <p>CPF: 338.044.818-41</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disposições Finais */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">8-DISPOSIÇÕES FINAL</h2>
            <div className="text-sm space-y-3">
              <p className="text-justify">
                Esta Proposta e os respectivos documentos referenciados, e entregues a{" "}
                <span className="bg-yellow-200 px-1 font-semibold">{data.nomeCliente}</span> constituem o acordo
                completo no relativo objeto desta proposta, e substituem quaisquer comunicações prévias, verbais ou
                escrita realizadas anteriormente.
              </p>
              <p className="text-justify">
                Quaisquer alterações no referido escopo, deverão ser previamente acordadas entre as partes.
              </p>
            </div>
          </div>

          {/* Validade da Proposta */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-600">9-VALIDADE DA PROPOSTA</h2>
            <div className="text-sm space-y-3">
              <p>
                Esta Proposta Técnica é válida em todo seus termos e condições por{" "}
                <span className="bg-yellow-200 px-1 font-semibold">{data.validadeDias} dias</span> a partir da data de
                sua apresentação.
              </p>
              {data.dataValidade && (
                <p className="mt-2">
                  <strong>Data de validade:</strong> {format(data.dataValidade, "dd/MM/yyyy", { locale: ptBR })}
                </p>
              )}
            </div>
          </div>

          {/* Assinatura Final */}
          <div className="mt-12">
            <div className="text-center">
              <p className="mb-8">Atenciosamente,</p>
              <div className="mb-4">
                <div className="w-64 border-b border-gray-400 mx-auto mb-2"></div>
                <p className="font-bold">Sérgio de Souza</p>
              </div>
              <div className="text-sm text-gray-600 mt-8">
                <p>Observação:</p>
                <p>Para qualquer dúvida e/ou esclarecimentos,</p>
                <p>favor contatar:</p>
                <p>CEO: Sérgio Souza</p>
                <p>Celular: (19) 99999-9999</p>
                <p>sergiosouza@rtbhydro.com.br</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para impressão/PDF */}
      <style jsx global>
        {`
@media print {
  /* Reset completo para impressão */
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: white !important;
  }
  
  /* Esconder tudo exceto a área de impressão */
  body * {
    visibility: hidden;
  }
  
  .print-area, .print-area * {
    visibility: visible;
  }
  
  /* Configuração da página A4 */
  @page {
    size: 210mm 297mm !important;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .print-area {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 210mm !important;
    height: 297mm !important;
    margin: 0 !important;
    padding: 0 !important;
    font-family: Arial, sans-serif !important;
    overflow: hidden !important;
    background: white !important;
  }
  
  .print\\:hidden {
    display: none !important;
  }
  
  .page-break {
    page-break-before: always !important;
  }
  
  /* CAPA - Ocupar toda a folha A4 */
  .h-screen {
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    max-width: 210mm !important;
    margin: 0 !important;
    padding: 0 !important;
    position: relative !important;
  }
  
  /* POSICIONAMENTOS ABSOLUTOS FIXOS */
  .absolute {
    position: absolute !important;
  }
  
  .relative {
    position: relative !important;
  }
  
  /* Triângulos superiores esquerdos */
  .top-10 {
    top: 2.5rem !important;
  }
  
  .left-10 {
    left: 2.5rem !important;
  }
  
  /* Logo RTB superior direito - CORRIGIDO TAMANHO */
  .top-8 {
    top: 2rem !important;
  }
  
  .right-8 {
    right: 2rem !important;
  }
  
  /* Ajuste do tamanho do logo */
  .h-16 {
    height: 3.5rem !important;
  }
  
  /* Imagem da usina centralizada */
  .top-\\[25\\%\\] {
    top: 25% !important;
  }

  /* Ajuste do enquadramento da imagem da usina */
  .object-center {
    object-position: center 65% !important;
  }
  
  .h-80 {
    height: 20rem !important;
  }
  
  /* Triângulos direitos - CORRIGIDO POSICIONAMENTO */
  .top-\\[60\\%\\] {
    top: 47% !important;
  }
  
  .right-8 {
    right: 1rem !important;
  }
  
  /* Título principal - CORRIGIDO POSICIONAMENTO */
  .bottom-16 {
    bottom: 12rem !important;
  }
  
  .left-\\[58\\%\\] {
    left: 50% !important;
  }
  
  .right-4 {
    right: 1rem !important;
  }
  
  .text-6xl {
    font-size: 3.5rem !important;
    line-height: 0.85 !important;
  }
  
  .font-black {
    font-weight: 900 !important;
  }
  
  .leading-tight {
    line-height: 0.85 !important;
  }
  
  /* Caixa de informações */
  .bottom-20 {
    bottom: 5rem !important;
  }
  
  .left-8 {
    left: 2rem !important;
  }
  
  .w-80 {
    width: 22rem !important;
  }
  
  /* Rodapé centralizado */
  .bottom-4 {
    bottom: 1rem !important;
  }

  .justify-center {
    justify-content: center !important;
  }

  .items-center {
    align-items: center !important;
  }

  .text-center {
    text-align: center !important;
  }
  
  /* CORES FORÇADAS */
  .text-blue-900 {
    color: #1e3a8a !important;
  }
  
  .text-red-600 {
    color: #dc2626 !important;
  }
  
  .text-blue-600 {
    color: #2563eb !important;
  }
  
  .text-gray-800 {
    color: #1f2937 !important;
  }
  
  .text-gray-700 {
    color: #374151 !important;
  }
  
  .bg-blue-900 {
    background-color: #1e3a8a !important;
  }
  
  .bg-gray-100 {
    background-color: #f3f4f6 !important;
  }
  
  .bg-gray-50 {
    background-color: #f9fafb !important;
  }
  
  .bg-blue-600 {
    background-color: #2563eb !important;
  }
  
  .bg-yellow-100 {
    background-color: #fef3c7 !important;
  }
  
  .bg-yellow-200 {
    background-color: #fde68a !important;
  }
  
  .bg-yellow-300 {
    background-color: #fcd34d !important;
  }
  
  /* TAMANHOS DE TEXTO */
  .text-sm {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }
  
  .text-xs {
    font-size: 0.75rem !important;
    line-height: 1rem !important;
  }
  
  /* ESPAÇAMENTOS */
  .space-y-3 > * + * {
    margin-top: 0.75rem !important;
  }
  
  .space-y-4 > * + * {
    margin-top: 1rem !important;
  }
  
  /* GARANTIR VISIBILIDADE DE ELEMENTOS */
  h1, h2, h3, h4, h5, h6, p, span, div, td, th, strong {
    color: inherit !important;
    font-weight: inherit !important;
  }
  
  /* FORÇAR LARGURAS */
  .w-full {
    width: 100% !important;
  }
  
  /* OVERFLOW */
  .overflow-hidden {
    overflow: hidden !important;
  }
  
  .overflow-x-auto {
    overflow-x: visible !important;
  }
  
  /* TABELAS */
  table {
    border-collapse: collapse !important;
    width: 100% !important;
  }
  
  td, th {
    border: 1px solid #9ca3af !important;
    padding: 0.5rem !important;
  }
  
  /* IMAGENS */
  img {
    max-width: 100% !important;
    height: auto !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  /* SOMBRAS E BORDAS */
  .shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  }
  
  .rounded-lg {
    border-radius: 0.5rem !important;
  }
  
  .rounded {
    border-radius: 0.25rem !important;
  }
  
  /* OPACIDADE */
  .opacity-80 {
    opacity: 0.8 !important;
  }
  
  .bg-opacity-95 {
    background-color: rgba(243, 244, 246, 0.95) !important;
  }

  .h-72 {
    height: 18rem !important;
  }
}

/* Estilos gerais para garantir cores em qualquer situação */
.print-area {
  -webkit-print-color-adjust: exact !important;
  color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.print-area * {
  -webkit-print-color-adjust: exact !important;
  color-adjust: exact !important;
  print-color-adjust: exact !important;
}
  /* Correção de posicionamento para manter a caixa igual à visualização */
.box-informacoes {
  bottom: 4.8rem !important; /* ajuste exato de alinhamento */
  left: 2rem !important;
  position: absolute !important;
}

`}
      </style>
    </div>
  )
}
