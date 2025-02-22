# mars_mmtls
# Whatsapp Call:  **+66 627011785**
Whatsapp: **+66 627011785**

telegram: **@gxccc618**

```mermaid
sequenceDiagram
     participant C as Client
    participant T as WeChat
    participant W as WebSocketServer
 
    C->>T:  TCP Connection
    T-->>C: Connection Successful
    C->>W:  WebSocket Connection
    W-->>C: Connection Successful
    C->>W: Send Handshake Request Packet
    W-->>C: Send Handshake  Response Packet
    C->>T: Send ClientHello
    T-->>C: ServerHello
    C->>W: Send Handshake Request Packet
    W-->>C: Notify Handshake Completion
```