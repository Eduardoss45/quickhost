# Revisar

- [] Revisar alt nas imagens do frontend

# Informações

## **AuthController (`/auth`) — Autenticação e sessão**

1. **POST `/auth/register`**
      Registra um novo usuário e cria os cookies de autenticação (`accessToken` e `refreshToken`).
2. **POST `/auth/login`**
      Realiza login do usuário existente e cria os cookies de autenticação (`accessToken` e `refreshToken`).
3. **POST `/auth/logout`**
      Realiza logout do usuário, invalidando o refresh token e limpando os cookies de autenticação.
4. **POST `/auth/refresh`**
      Atualiza os tokens de acesso e refresh para manter a sessão do usuário ativa.
5. **POST `/auth/forgot-password`**
      Inicia o fluxo de recuperação de senha, enviando instruções para o e-mail do usuário.
6. **POST `/auth/reset-password`**
      Reseta a senha do usuário após o fluxo de recuperação ser iniciado.

## **UserController (`/user`) — Gerenciamento de perfil**

1. **PATCH `/user/update`**
      Atualiza os dados do perfil do usuário logado, incluindo foto de perfil opcional.
2. **GET `/user`**
      Retorna os dados completos do perfil do usuário logado.
3. **DELETE `/user/profile-picture`**
      Remove a foto de perfil do usuário logado.
4. **GET `/user/:userId`**
      Retorna o perfil público de qualquer usuário, utilizando apenas informações públicas.

## **ChatController (`/chat`) — Operações REST de chat**

1. **POST `/chat/send-message`**
      Envia uma nova mensagem em uma sala de chat existente, vinculando a mensagem ao usuário logado.
2. **POST `/chat/room`**
      Retorna uma sala de chat existente entre dois usuários ou cria uma nova se ainda não existir.
3. **GET `/chat/room/:roomId/messages`**
      Retorna todas as mensagens de uma sala de chat específica, permitindo acompanhar o histórico da conversa.
4. **GET `/chat/rooms`**
      Retorna todas as salas de chat do usuário logado, incluindo os participantes de cada sala.

## **ChatEventsController — Eventos de mensagens do microserviço**

1. **`chat.message.created`**
      Evento emitido quando uma nova mensagem é criada no microserviço de chat.
      \* A função do controlador é repassar a mensagem para a sala correspondente via WebSocket (`emitToRoom`) e enviar notificações para os destinatários offline ou não presentes na sala (`emitToUser`).

## **ChatGateway (`/chat`) — WebSocket Gateway**

1. **Conexão e desconexão**
      * `handleConnection`: registra o socket do usuário conectado.
      * `handleDisconnect`: remove o socket do usuário quando desconectado.
2. **Gerenciamento de salas**
      \* `handleJoin`: adiciona o socket do usuário a uma sala específica (`chatRoomId`).
3. **Envio de mensagens via WebSocket**
      \* `handleSend`: recebe mensagens enviadas pelo cliente e repassa para o microserviço via `chatClient.send`.
4. **Notificações e broadcast**
      * `emitToRoom`: envia a mensagem para todos na sala e notifica os participantes que não estão na sala no momento, incluindo:
        * `roomId` da sala
        * prévia da mensagem (`preview`)
        * nome do remetente (`senderName`)
        * foto do perfil do remetente (`senderProfilePicture`)
        * conteúdo completo da mensagem (`message`)
        * timestamp de entrega (`deliveredAt`)
      * `emitToUser`: envia notificações diretas para um usuário específico, independente de sala.
5. **Integração com Auth Service**
      \* Para montar notificações, o gateway consulta o `AUTH_CLIENT` para obter os dados públicos do usuário remetente (`username`, `social_name` e `profile_picture_url`).
