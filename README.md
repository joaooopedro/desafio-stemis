# Construtor de Funis de Campanhas

Um aplicativo web moderno e intuitivo para criar, visualizar e analisar funis de campanhas de tráfego pago.

## Características

### Construtor Visual Interativo
- Crie etapas do funil através de interface intuitiva
- Conecte etapas com transições suaves
- Arraste e posicione os elementos livremente
- Visualize o fluxo completo em tempo real

### Análise de Desempenho
- Métricas em tempo real para cada etapa
- Relatórios detalhados de conversão
- Visualização de dados de visitantes e taxa de rejeição
- Análise comparativa entre etapas

### Interface Profissional
- Design moderno com tema dark para melhor legibilidade
- Layout responsivo e intuitivo
- Ícones claros e navegação direta

### Persistência de Dados
- Seus funis são salvos automaticamente no navegador
- Exporte seus projetos em formato JSON
- Sincronização em tempo real

## Stack Tecnológico

- **React 19** - Framework UI moderno
- **React Flow 11** - Editor visual de fluxos
- **TypeScript** - Tipagem estática e segura
- **Tailwind CSS v4** - Estilização utilitária
- **Zustand** - Gerenciamento de estado
- **Lucide Icons** - Ícones profissionais
- **Vite** - Build tool moderno

## Getting Started

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5174`

### Build para Produção

```bash
npm run build
```

## Uso

1. **Adicionar Etapas**: Clique nos botões da barra lateral para adicionar etapas ao funil
2. **Conectar Etapas**: Arraste a saída de um nó até a entrada de outro
3. **Editar Dados**: Clique em "Editar" em um nó para alterar as métricas
4. **Visualizar Relatório**: Clique em "Relatório" para ver análise detalhada
5. **Exportar Projeto**: Clique em "Exportar" para baixar seu funil em JSON

## Tipos de Etapas

- **Anúncio**: Campanhas pagas (Google Ads, Facebook, etc.)
- **Landing Page**: Página de destino da campanha
- **Formulário**: Coleta de informações do usuário
- **Checkout**: Processo de finalização da compra
- **Obrigado**: Página de confirmação pós-conversão
- **Customizada**: Etapas personalizadas
