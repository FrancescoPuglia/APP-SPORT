# 🔥 FIREBASE SETUP GUIDE - RISOLUZIONE ERRORE API KEY

## 🚨 **ERRORE ATTUALE**
```
firebase error(auth/api-key-not-valid)
```

**CAUSA:** L'app sta usando valori demo per Firebase. Serve configurazione reale!

---

## 📋 **STEP-BY-STEP SETUP**

### **1. CREA PROGETTO FIREBASE**

1. **Vai su:** https://console.firebase.google.com
2. **Clicca:** "Aggiungi progetto" / "Add project"  
3. **Nome progetto:** `extraordinary-growth-app` (o il nome che preferisci)
4. **Abilita Google Analytics:** Sì (raccomandato)
5. **Clicca:** "Crea progetto"

### **2. AGGIUNGI APP WEB**

1. **Nel dashboard Firebase, clicca:** icona `</>` (Add app)
2. **Nome app:** "Extraordinary Growth App"  
3. **Hostname:** `francescopuglia.github.io` (o il tuo dominio)
4. **Setup Firebase Hosting:** Sì (raccomandato)
5. **Clicca:** "Registra app"

### **3. COPIA CONFIGURAZIONE**

Firebase ti mostrerà un codice simile a:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC7X1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p",
  authDomain: "extraordinary-growth-app.firebaseapp.com",
  projectId: "extraordinary-growth-app",
  storageBucket: "extraordinary-growth-app.appspot.com", 
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl012",
  measurementId: "G-XXXXXXXXXX"
};
```

### **4. AGGIORNA .env.local**

**Apri:** `/APP-SPORT/extraordinary-growth-app/.env.local`  
**Sostituisci** i valori `your-xxx-here` con i tuoi valori reali:

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyC7X1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p
REACT_APP_FIREBASE_AUTH_DOMAIN=extraordinary-growth-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=extraordinary-growth-app
REACT_APP_FIREBASE_STORAGE_BUCKET=extraordinary-growth-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789jkl012
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### **5. ABILITA AUTHENTICATION**

1. **Sidebar Firebase:** "Authentication"
2. **Tab:** "Sign-in method"
3. **Abilita:** Email/Password
4. **Opzionale:** Google, Facebook, etc.
5. **Clicca:** "Salva"

### **6. CONFIGURA FIRESTORE**

1. **Sidebar Firebase:** "Firestore Database"  
2. **Clicca:** "Crea database"
3. **Modalità:** "Avvia in modalità test" (per ora)
4. **Regione:** Europe (eur3) - più vicina all'Italia
5. **Clicca:** "Fine"

### **7. CONFIGURA STORAGE**

1. **Sidebar Firebase:** "Storage"
2. **Clicca:** "Inizia"  
3. **Regole:** Modalità test (per ora)
4. **Regione:** Europe (eur3)
5. **Clicca:** "Fine"

### **8. RIAVVIA SERVER**

```bash
cd /mnt/c/Users/Franc/Desktop/APP\ SPORT/extraordinary-growth-app
npm start
```

---

## 🔐 **SECURITY RULES (OPZIONALE)**

Se vuoi attivare subito le regole di sicurezza enterprise che ho creato:

### **Firestore Rules:**
1. **Firestore Console:** "Regole" 
2. **Sostituisci tutto** con il contenuto di `firestore.rules`
3. **Pubblica**

### **Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## ✅ **VERIFICA FUNZIONAMENTO**

1. **Riavvia app:** `npm start`
2. **Apri browser:** http://localhost:3000  
3. **Controlla console:** Non dovrebbero esserci più errori Firebase
4. **Prova registrazione:** Crea nuovo account
5. **Test componenti:** Clicca "Dieta" e "Recovery"

---

## 🚨 **PROBLEMI COMUNI**

**❌ ERRORE: "API key not valid"**  
➡️ Verifica che l'API key in `.env.local` sia corretta

**❌ ERRORE: "Project not found"**  
➡️ Controlla che PROJECT_ID sia esatto

**❌ ERRORE: "Auth domain invalid"**  
➡️ Verifica che AUTH_DOMAIN finisca con `.firebaseapp.com`

**❌ ERRORE: "Network error"**  
➡️ Controlla connessione internet e firewall

---

## 🎯 **QUICK FIX TEMPORANEO**

Se vuoi testare SUBITO senza configurare Firebase:

```bash
# In .env.local aggiungi:
REACT_APP_USE_FIREBASE_EMULATORS=true
```

Questo userà emulatori locali (ma serve installare Firebase CLI).

---

## 📞 **SUPPORTO**

Se hai problemi:
1. **Controlla console browser:** F12 > Console per errori dettagliati
2. **Verifica .env.local:** Tutti i valori devono essere reali, non demo
3. **Riavvia server:** `npm start` dopo ogni modifica .env.local

**Una volta configurato Firebase correttamente, l'errore sparirà e potrai usare tutti i componenti Nutrition & Recovery! 🚀**