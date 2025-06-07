"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2, Plus, Trash2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PropostaPreview } from "./proposta-preview"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Schema para itens da tabela de preços
const itemPrecoSchema = z.object({
  quantidade: z.string().min(1, "Quantidade é obrigatória"),
  descricao: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  valorTotal: z.string().min(1, "Valor total é obrigatório"),
})

// Schema apenas com campos editáveis (destacados em amarelo nas imagens)
const formSchema = z.object({
  logoCliente: z.string().optional(),
  logoClienteUrl: z.string().optional(),
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
  // Novos campos para a tabela de preços
  textoComplementarPrecos: z.string().optional(),
  itensPrecos: z.array(itemPrecoSchema).min(1, "Pelo menos um item é obrigatório"),
  // Novos campos para condições de pagamento
  percentualAssinatura: z.string().default("25"),
  percentualEventograma: z.string().default("75"),
  solicitante: z.string().optional(),
  cidade: z.string().optional(),
  revisao: z.string().default("01"),
  confidencial: z.string().default("Sim"),
  elaboradoPor: z.string().default("RTB HYDRO"),
})

export function FormularioPropostaSimplificado() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logoCliente: "",
      logoClienteUrl: "",
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
      textoComplementarPrecos: "",
      itensPrecos: [{ quantidade: "01", descricao: "", valorTotal: "" }],
      percentualAssinatura: "25",
      percentualEventograma: "75",
      solicitante: "",
      cidade: "",
      revisao: "01",
      confidencial: "Sim",
      elaboradoPor: "RTB HYDRO",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itensPrecos",
  })

  const watchedDataProposta = form.watch("dataProposta")
  const watchedValidadeDias = form.watch("validadeDias")
  const watchedItensPrecos = form.watch("itensPrecos")

  // Função para lidar com o upload de logo
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione um arquivo de imagem válido.")
        return
      }

      // Criar URL para preview
      const fileUrl = URL.createObjectURL(file)
      setLogoPreview(fileUrl)

      // Atualizar o formulário
      form.setValue("logoClienteUrl", fileUrl)
      form.setValue("logoCliente", file.name)
    }
  }

  // Calcular valor total dos itens
  const calcularValorTotalItens = () => {
    return watchedItensPrecos.reduce((total, item) => {
      const valor = Number.parseFloat(item.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")) || 0
      return total + valor
    }, 0)
  }

  // Calcular data de validade
  const dataValidade =
    watchedDataProposta && watchedValidadeDias
      ? addDays(watchedDataProposta, Number.parseInt(watchedValidadeDias) || 30)
      : null

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Proposta gerada:", { ...values, dataValidade, valorTotalGeral: calcularValorTotalItens() })
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted || showPreview) {
    const propostaData = {
      ...form.getValues(),
      dataValidade,
      valorTotalGeral: calcularValorTotalItens(),
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
                  setLogoPreview(null)
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
        <CardTitle className="text-2xl">Formulário de Proposta RTB Hydro</CardTitle>
        <p className="text-muted-foreground">Preencha apenas os campos destacados em amarelo no template</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Identificação da Proposta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identificação da Proposta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="numeroProposta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da Proposta</FormLabel>
                        <FormControl>
                          <Input placeholder="2023-PT-1687-001-01" {...field} />
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="revisao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revisão</FormLabel>
                        <FormControl>
                          <Input placeholder="01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confidencial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confidencial</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sim">Sim</SelectItem>
                            <SelectItem value="Não">Não</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="elaboradoPor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Elaborado Por</FormLabel>
                        <FormControl>
                          <Input placeholder="RTB HYDRO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Campos do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="logoCliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo do Cliente (Opcional)</FormLabel>
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center gap-3">
                            <FormControl>
                              <Input placeholder="Nome ou descrição do logo do cliente" {...field} className="flex-1" />
                            </FormControl>
                            <div className="relative">
                              <Input
                                type="file"
                                id="logo-upload"
                                className="absolute inset-0 opacity-0 w-full cursor-pointer"
                                accept="image/*"
                                onChange={handleLogoUpload}
                              />
                              <Button type="button" variant="outline" className="w-[120px]">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                            </div>
                          </div>
                          {logoPreview && (
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground mb-1">Preview:</p>
                              <div className="relative w-40 h-20 border rounded overflow-hidden">
                                <img
                                  src={logoPreview || "/placeholder.svg"}
                                  alt="Logo preview"
                                  className="object-contain w-full h-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                        <FormLabel>Local da Prestação</FormLabel>
                        <FormControl>
                          <Input placeholder="UHE XXXXX SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="solicitante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solicitante</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do solicitante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Serviços */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Serviços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="servicosExecutar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serviços a ser Executado</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva os serviços que serão executados..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="objetivoCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo da Proposta</FormLabel>
                      <FormControl>
                        <Input placeholder="A presente proposta tem por objetivo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="servicosEspecializados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serviços Especializados</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva os serviços especializados..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Dados Técnicos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="dadosTecnicos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dados Técnicos de Referência (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Dados técnicos específicos do projeto..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="normasTecnicas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Normas Técnicas e Prescrições (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Normas técnicas aplicáveis..." className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Escopo e Prazo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Escopo e Execução</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="escopoFornecimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escopo de Fornecimento</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detalhe o escopo completo do fornecimento..."
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
                  name="prazoExecucao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo de Execução</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 30 dias após aprovação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Condições de Comercialização e Preços */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Condições de Comercialização e Preços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="textoComplementarPrecos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto Complementar (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informações adicionais sobre preços e condições..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h4 className="font-semibold">Itens da Proposta</h4>
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`itensPrecos.${index}.quantidade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade</FormLabel>
                            <FormControl>
                              <Input placeholder="01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`itensPrecos.${index}.descricao`}
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
                          name={`itensPrecos.${index}.valorTotal`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Valor Total (R$)</FormLabel>
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
                    onClick={() => append({ quantidade: "01", descricao: "", valorTotal: "" })}
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
                        Valor Total Geral:{" "}
                        {calcularValorTotalItens().toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Condições de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Condições de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="percentualAssinatura"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentual na Assinatura (%)</FormLabel>
                        <FormControl>
                          <Input placeholder="25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="percentualEventograma"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentual Conforme Cronograma (%)</FormLabel>
                        <FormControl>
                          <Input placeholder="75" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Preview dos valores calculados */}
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Valores Calculados</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Na Assinatura ({form.watch("percentualAssinatura")}%):</strong>{" "}
                      {(
                        (calcularValorTotalItens() * Number.parseFloat(form.watch("percentualAssinatura") || "0")) /
                        100
                      ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                    <p>
                      <strong>Conforme Cronograma ({form.watch("percentualEventograma")}%):</strong>{" "}
                      {(
                        (calcularValorTotalItens() * Number.parseFloat(form.watch("percentualEventograma") || "0")) /
                        100
                      ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validade */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Validade da Proposta</CardTitle>
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
