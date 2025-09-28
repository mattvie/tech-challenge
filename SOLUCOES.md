# Soluções implementadas por Mateus Farias (mvmf@cin.ufpe.br)

## Resumo das Melhorias no docker-compose.yml

- Segurança
	- Remoção de Credenciais do Código (hardcoded)
	- Senhas do banco de dados e o segredo do JWT foram movidos para um arquivo .env separado, que não deve ser enviado para o repositório público.
	- O arquivo .yml agora lê essas informações de forma segura através de variáveis de ambiente, prevenindo a exposição de dados sensíveis.

- Confiabilidade
	- Adição de Políticas de Reinício Automático (restart):
	- Todos os serviços (postgres, backend, frontend) foram configurados com restart: unless-stopped para que se recuperem e reiniciem automaticamente em caso de falha ou crash.

- Implementação de Verificação de Saúde (healthcheck):
	- O serviço do banco de dados postgres agora possui um healthcheck que verifica se ele está realmente pronto para aceitar conexões, em vez de apenas "ligado".

- Garantia da Ordem Correta de Inicialização (depends_on):
	- O serviço backend agora utiliza condition: service_healthy para aguardar que o banco de dados esteja comprovadamente saudável antes de iniciar, eliminando erros de conexão na inicialização.

- Correções e Boas Práticas
	- Remoção da Versão Obsoleta:
		- A linha version: '3.8', que é obsoleta, foi removida para eliminar WARNINGs

## Resumo das Melhorias em Testes no Backend

- As asserções (expect) quebradas no arquivo auth.test.js foram corrigidas para refletir o comportamento correto da aplicação.
- A correção dos testes validou que a lógica de hash de senhas no modelo User.ts já estava implementada corretamente usando hooks do Sequelize.

## Resumo das Melhorias em Build de Frontend

- Erros de Sintaxe
	- Alguns arquivos .ts usavam sintaxe JSX, então foram renomeados para .tsx (useAuth.tsx, ui/index/tsx)

- Problemas de dependências
	- Instalados pacotes que faltavam no package.json (@tailwindcss/forms, typograhy...)
	- Para evitar conflitos entre as duas estilizações tailwind e styled-system, escolhi por padrão colocar tudo em tailwind

- Correção do Servidor de Aplicação
    - Resolvido o problema de erro `404 Not Found` ao identificar que o volume no docker-compose.yml estava sobrescrevendo a pasta build gerada na imagem. 
    - A configuração de volumes foi ajustada para permitir que os arquivos construídos fossem servidos corretamente.
	
## Resumo das Melhorias em Testes no Frontend

- Corrigida configuração do Jest para que ele pudesse processar o axios
- Corrigido teste quebrado, tornando a busca pelo elemento no frontend mais específica e evitando ambiguidades

## Resumo das Melhorias em Performance de Queries

- Identificação do Problema Crítico (N+1 Queries):
    - postController.ts após buscar a lista inicial de posts, o código executava um loop que fazia múltiplas consultas ao banco para cada post (para buscar comentários e likes).
    - Para uma página com 10 posts, isso resultava em aproximadamente 30 queries, o que era extremamente ineficiente.

- Implementação de Eager Loading:
    - A solução foi refatorar a consulta principal Post.findAndCountAll para utilizar o eager loading do Sequelize.
    - As associações Comment e Like foram adicionadas à cláusula include, instruindo o Sequelize a buscar todos os dados relacionados em uma única (e otimizada) query.

- Eliminação do Processamento Ineficiente:
    - O loop Promise.all foi completamente removido. A contagem de comentários e likes agora é feita em memória no servidor, processando os dados já retornados pela consulta única.

- Tipagem de Modelos:
    - Por questão de boas práticas foi feita uma mudança no arquivo models/Post.ts, declarando explicitamente as associações e seus tipos (User, Comment, Like), o que permitiu ao TypeScript entender a estrutura completa do modelo.

- Análise da Performance:
    - O número de consultas para carregar a página de posts foi drasticamente reduzido, resolvendo o problema de performance mais crítico do backend.
    - Antes da otimização
        - A aplicação executava `Post.findAndCountAll` uma vez para buscar a lista de posts da página atual. Para cada post, eram executadas as seguintes operações (N queries):
            - Contagem de comentários (N+1 queries)
            - Contagem de likes (N+2 queries)
            - Verificação de like do usuário (N+3 queries)
        - Se fossem 10 posts, isso implicaria em `1 (query inicial) + 10*3 = 31 consultas`
    - Depois da otimização
        - A aplicação agora realiza 2 consultas para a mesma página, independente do número de posts.
        - Uma contagem total (paginação), e uma outra busca para obter os dados necessários.

## Resumo das Melhorias de Validação e Segurança no Backend

- Implementação de Validação em Endpoints Críticos
    - Rotas que modificam dados, como PUT /api/auth/profile e PUT /api/comments/:id, não possuíam nenhuma validação
        - Dados maliciosos/inesperados podiam ser enviados, quebrando a aplicação
    - Foram adicionados schemas de validação (com a lib Joi) para as rotas PUT auth e PUT comments.
    - A aplicação está protegida contra grande quantidade de ataques de dados

- Fortalecimento de Regras de Validação
    - Schemas já existentes em validation.ts foram melhorados
        - O username não era validado na camada de API
        - Senha com requisito de tamanho pequeno
    - Força a criação de senhas mais seguras e imediatamente rejeita usernames inválidos na API

- Prevenção e Segurança
    - A lógica de login no authController.ts retornava erros diferentes dependendo se o email existia ou se a senha estava incorreta. Esta falha podia ser usada para descobrir quais emails estão cadastrados no sistema
    - Agora a resposta de erro é a mesma, independente da causa

- Otimização e Performance
    - A rota GET /api/auth/profile carregava o usuário e todos os seus posts, sem limite
    - A consulta no getProfile em authController.ts foi otimizada para usar limit: 5 e order, incluindo apenas os 5 posts mais recentes do usuário e retornando somente os campos essenciais, resultando em uma resposta mais rápida

## Resumo das Melhorias de UX/CSS no Frontend

- Unificação do Sistema de Estilização
    - O sistema de estilos foi padronizado para usar exclusivamente Tailwind CSS, eliminando o uso de styled-components.
    - Componentes de formulário, Header, Footer e o Layout principal foram completamente refatorados para usar classes do Tailwind, garantindo um design moderno, coeso e responsivo.

- Implementação Completa da Interface
    - Todas as páginas que eram placeholders (Registro, Criar Post, Detalhes de Post) foram implementadas com interfaces funcionais e estilizadas
    - A página inicial agora exibe os posts em um grid responsivo, utilizando um componente de Card reutilizável.

## Resumo da Implementação de Funcionalidades no Frontend

- CRUD Completo para Posts
    - Foi implementada a funcionalidade completa de Criar, Ler, Atualizar e Deletar posts.
    - Botões de Edição e Deleção agora aparecem na página de detalhes do post apenas para o autor, garantindo o controle de permissão.

- Likes
    - Implementado um sistema de "curtir" e "descurtir" posts. A UI é atualizada de forma otimista para uma melhor experiência do usuário, e a contagem de likes persiste ao recarregar a página.

- Comentários
    - A página de detalhes do post agora inclui uma seção de comentários, onde usuários logados podem adicionar novos comentários e ver os já existentes em tempo real.

- Suporte a Markdown
    - O conteúdo dos posts agora é renderizado como Markdown, permitindo a formatação de texto com títulos, negrito, listas, links, etc. O plugin @tailwindcss/typography foi usado para garantir que o conteúdo formatado seja exibido de forma limpa e legível.

## Resumo da Correção de Bugs e Configuração de Ambiente

- Configuração de Desenvolvimento do Docker
    - O ambiente Docker foi ajustado para que o backend e o frontend rodem em modo de desenvolvimento, garantindo o hot-reloading (atualização automática do código) em ambos os serviços, o que agilizou drasticamente o desenvolvimento.

- Correção de Upload de Imagens (Amazon S3)
    - Foi resolvido um erro crítico de AccessControlListNotSupported ao remover o envio de ACLs via código e, em vez disso, configurar uma Política de Bucket no S3 para garantir o acesso público às imagens.
    - Foi corrigido um bug que causava a sobrescrita de imagens no S3, garantindo que cada upload tenha um nome de arquivo único.

- Resolução de Bugs de API e Frontend
    - Corrigido o bug que exibia NaN na contagem de likes, garantindo a correta conversão de tipos de dados entre o backend e o frontend.
    - Resolvidos múltiplos erros de TypeScript e de configuração que impediam a compilação e o funcionamento correto da aplicação.