"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PropostaPreview } from "./proposta-preview"

const itemSchema = z.object({
  quantidade: z.string().min(1, "Quantidade é obrigatória"),
  descricao: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  valorUnitario: z.string().min(1, "Valor unitário é obrigatório"),
})

const formSchema = z.object({
  // Campos editáveis identificados nas imagens
  logoCliente: z.string().optional(),
  servicosExecutar: z.string().min(10, "Descrição dos serviços deve ter pelo menos 10 caracteres"),
  numeroProposta: z.string().min(1, "Número da proposta é obrigatório"),
  dataProposta: z.date({
    required_error: "Data da proposta é obrigatória",
  }),
  nomeCliente: z.string().min(2, "Nome do cliente deve ter pelo menos 2 caracteres"),
  localPrestacao: z.string().min(5, "Local da prestação é obrigatório"),
  objetivoCliente: z.string().min(10, "Objetivo com o cliente deve ser especificado"),
  servicosEspecializados: z.string().min(10, "Serviços especializados devem ser especificados"),
  dadosTecnicos: z.string().optional(),
  normasTecnicas: z.string().optional(),
  escopoFornecimento: z.string().min(20, "Escopo de fornecimento deve ser detalhado"),
  prazoExecucao: z.string().min(5, "Prazo de execução é obrigatório"),
  validadeDias: z.string().default("30"),
})

export function FormularioProposta() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logoCliente: "",
      servicosExecutar: "",
      numeroProposta: "",
      dataProposta: new Date(),
      nomeCliente: "",
      localPrestacao: "",
      objetivoCliente: "",
      servicosEspecializados: "",
      dadosTecnicos: "",
      normasTecnicas: "",
      escopoFornecimento: "",
      prazoExecucao: "",
      validadeDias: "30",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  })

  const watchedItens = form.watch("itens")
  const watchedDataProposta = form.watch("dataProposta")
  const watchedValidadeDias = form.watch("validadeDias")

  // Calcular valor total
  const calcularValorTotal = () => {
    return watchedItens.reduce((total, item) => {
      const quantidade = Number.parseFloat(item.quantidade) || 0
      const valorUnitario = Number.parseFloat(item.valorUnitario.replace(/[^\d,]/g, "").replace(",", ".")) || 0
      return total + quantidade * valorUnitario
    }, 0)
  }

  const valorTotal = calcularValorTotal()

  // Converter número para extenso (simplificado)
  const numeroParaExtenso = (valor: number) => {
    if (valor === 0) return "zero reais"
    // Implementação simplificada - em produção usar biblioteca específica
    return `${valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} por extenso`
  }

  // Calcular data de validade
  const dataValidade =
    watchedDataProposta && watchedValidadeDias
      ? addDays(watchedDataProposta, Number.parseInt(watchedValidadeDias) || 30)
      : null

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simular processamento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const propostaCompleta = {
      ...values,
      valorTotal,
      valorTotalExtenso: numeroParaExtenso(valorTotal),
      dataValidade,
      dadosEmpresa: {
        nome: "RTB Soluções Ltda",
        endereco: "Endereço da empresa",
        cnpj: "XX.XXX.XXX/XXXX-XX",
        inscricaoEstadual: "XXXXXXXXX",
      },
      dadosBancarios: {
        banco: "Itaú",
        agencia: "XXXX",
        conta: "XXXXX-X",
        cnpj: "XX.XXX.XXX/XXXX-XX",
      },
    }

    console.log("Proposta gerada:", propostaCompleta)
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted || showPreview) {
    const propostaData = {
      ...form.getValues(),
      valorTotal,
      dataValidade,
    }

    if (showPreview) {
      return <PropostaPreview data={propostaData} onEdit={() => setShowPreview(false)} />
    }

    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Proposta Gerada com Sucesso!</h2>
            <p className="text-muted-foreground text-lg">
              Sua proposta comercial foi processada e está pronta para envio.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Button onClick={() => setShowPreview(true)}>Visualizar Proposta</Button>
              <Button
                variant="outline"
                onClick={() => {
                  form.reset()
                  setSubmitted(false)
                }}
              >
                Nova Proposta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Formulário de Proposta Comercial</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Identificação da Proposta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Identificação da Proposta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="numeroProposta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da Proposta</FormLabel>
                        <FormControl>
                          <Input placeholder="2023-PC-1687-001-01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataProposta"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data da Proposta</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="versao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Versão</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dados do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nomeCliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da empresa cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="localPrestacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local da Prestação do Serviço</FormLabel>
                        <FormControl>
                          <Input placeholder="UHE XXXXX SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="solicitante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Solicitante</FormLabel>
                        <FormControl>
                          <Input placeholder="ET XXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nomeResponsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Responsável</FormLabel>
                        <FormControl>
                          <Input placeholder="Prezado Sr. XXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Escopo dos Serviços */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Escopo dos Serviços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="descricaoServicos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do(s) Serviço(s)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva detalhadamente os serviços a serem prestados..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="localExecucao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local de Execução</FormLabel>
                      <FormControl>
                        <Input placeholder="Local onde os serviços serão executados" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="textoExplicativo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto Explicativo (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A proposta baseia-se em..." className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Itens da Proposta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4. Itens da Proposta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <FormField
                      control={form.control}
                      name={`itens.${index}.quantidade`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input placeholder="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`itens.${index}.descricao`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Descrição do Fornecimento</FormLabel>
                          <FormControl>
                            <Input placeholder="Descrição detalhada do item" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`itens.${index}.valorUnitario`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Valor Unitário (R$)</FormLabel>
                            <FormControl>
                              <Input placeholder="0,00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {fields.length > 1 && (
                        <div className="flex items-end">
                          <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ quantidade: "", descricao: "", valorUnitario: "" })}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>

                {/* Resumo Financeiro */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Resumo Financeiro</h3>
                  <p className="text-lg">
                    <strong>
                      Valor Global: {valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </strong>
                  </p>
                  <p className="text-sm text-muted-foreground">Por extenso: {numeroParaExtenso(valorTotal)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Condições de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">5. Condições de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="condicoesPagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condições de Pagamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione as condições de pagamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="padrao">25% na assinatura + 75% conforme cronograma</SelectItem>
                          <SelectItem value="entrada-entrega">50% de entrada + 50% na entrega</SelectItem>
                          <SelectItem value="parcelado">Parcelado em 3x sem juros</SelectItem>
                          <SelectItem value="personalizado">Condições personalizadas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("condicoesPagamento") === "personalizado" && (
                  <FormField
                    control={form.control}
                    name="condicoesPersonalizadas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condições Personalizadas</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva as condições de pagamento personalizadas..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Validade da Proposta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">6. Validade da Proposta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="validadeDias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validade (dias)</FormLabel>
                        <FormControl>
                          <Input placeholder="30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Data de Validade</label>
                    <div className="p-2 bg-muted rounded text-sm">
                      {dataValidade
                        ? format(dataValidade, "dd/MM/yyyy", { locale: ptBR })
                        : "Selecione a data da proposta"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">7. Observações Complementares</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informações adicionais, termos especiais, etc..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Salvar Rascunho
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
                Visualizar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando Proposta...
                  </>
                ) : (
                  "Gerar Proposta"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
