# Troubleshooting - Chat IA não funciona em produção

## Problema
O chat com IA funciona localmente, mas não funciona em produção (Vercel + Railway).

## Checklist de Verificação

### 1. ✅ Verificar URL do Backend na Vercel

**No painel da Vercel:**
1. Vá em **Settings** → **Environment Variables**
2. Verifique se existe a variável `NEXT_PUBLIC_BACKEND_URL`
3. **IMPORTANTE**: A URL deve começar com `https://`
   - ✅ Correto: `https://enzoaraujoportfolio-production.up.railway.app`
   - ❌ Errado: `enzoaraujoportfolio-production.up.railway.app` (sem https://)

**Como corrigir:**
- Edite a variável e adicione `https://` no início
- Salve e faça um novo deploy

### 2. ✅ Verificar CORS no Railway

**No painel do Railway:**
1. Vá em **Variables** (variáveis de ambiente)
2. Verifique se existe a variável `ALLOW_ORIGINS`
3. Configure com o domínio do seu site:
   ```
   https://enzoaraujo.site,https://*.vercel.app
   ```
   Ou para permitir todos (menos seguro, mas funciona):
   ```
   *
   ```

**Como adicionar:**
- Clique em **+ New Variable**
- Nome: `ALLOW_ORIGINS`
- Valor: `https://enzoaraujo.site,https://*.vercel.app`
- Salve e o Railway fará redeploy automaticamente

### 3. ✅ Verificar se o Backend está Online

**No Railway:**
1. Vá na página do serviço
2. Verifique se está **"Active"** (verde)
3. Clique em **Deploy Logs** para ver se há erros
4. Teste a URL diretamente no navegador:
   ```
   https://enzoaraujoportfolio-production.up.railway.app/health
   ```
   Deve retornar: `{"status":"ok"}`

### 4. ✅ Verificar Logs da Vercel

**No painel da Vercel:**
1. Vá em **Deployments**
2. Clique no último deploy
3. Vá em **Functions** → **View Function Logs**
4. Procure por erros relacionados a:
   - `BACKEND_URL not configured`
   - `Failed to create thread`
   - `Stream failed`

### 5. ✅ Testar Manualmente

**Teste 1 - Health Check:**
```bash
curl https://enzoaraujoportfolio-production.up.railway.app/health
```

**Teste 2 - Criar Thread:**
```bash
curl -X POST https://enzoaraujoportfolio-production.up.railway.app/threads \
  -H "Content-Type: application/json"
```

**Teste 3 - Do Frontend:**
Abra o console do navegador (F12) e verifique:
- Erros de CORS
- Erros de rede
- Mensagens de erro da API

## Soluções Comuns

### Problema: "Backend URL not configured"
**Solução:** Configure `NEXT_PUBLIC_BACKEND_URL` na Vercel com `https://` no início

### Problema: Erro de CORS
**Solução:** Configure `ALLOW_ORIGINS` no Railway com o domínio do seu site

### Problema: "Failed to create thread"
**Solução:** 
1. Verifique se o backend está online
2. Verifique os logs do Railway
3. Verifique se `GROQ_API_KEY` está configurada no Railway

### Problema: Timeout ou conexão recusada
**Solução:**
1. Verifique se a URL do Railway está correta
2. Verifique se o backend está rodando (health check)
3. Verifique se não há firewall bloqueando

## Verificação Rápida

Execute estes comandos para testar:

```bash
# 1. Testar backend
curl https://enzoaraujoportfolio-production.up.railway.app/health

# 2. Testar criação de thread
curl -X POST https://enzoaraujoportfolio-production.up.railway.app/threads \
  -H "Content-Type: application/json"

# 3. Verificar variáveis (no navegador, console)
# Abra o site e no console digite:
console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
```

## Próximos Passos

1. ✅ Verificar URL na Vercel (com https://)
2. ✅ Configurar CORS no Railway
3. ✅ Verificar logs de erro
4. ✅ Testar manualmente
5. ✅ Fazer novo deploy se necessário

Se ainda não funcionar após seguir todos os passos, verifique os logs detalhados no console do navegador e nos logs da Vercel/Railway.
